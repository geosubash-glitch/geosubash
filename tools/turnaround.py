"""Turnaround loop in an old-MS-Paint style.

Takes the owner's line drawings in assets/turnaround/src/, traces each one into a single continuous path,
then morphs the line from one view to the next to make in-between frames. Every frame is drawn with
1-pixel aliased (Bresenham) lines on a small grid, so it reads like the pencil tool in MS Paint once
the page shows it at 2x with image-rendering: pixelated.

Output: assets/turnaround/turn.png, a horizontal sprite of square frames (frame count = width / height).
Run:    python3 tools/turnaround.py            (needs numpy, scipy, scikit-image, pillow)
        python3 tools/turnaround.py --preview  (also writes a GIF next to the sprite, not committed)
"""
import os, sys
import numpy as np
from PIL import Image
from scipy.optimize import linear_sum_assignment
from scipy.spatial import cKDTree
from skimage.morphology import skeletonize, remove_small_objects

SRC = "assets/turnaround/src/"
# rotation order. x, y = head centre and top of hair in source pixels; s evens out head size.
FRAMES = [
    ("profile-left.webp", 560, 160, 1.00),
    ("back-left.webp", 680, 112, 1.22),
    ("back.png", 728, 201, 1.22),
    ("back-right.png", 752, 197, 1.22),
    ("profile-right.webp", 600, 167, 1.00),
    ("three-quarter-right.webp", 590, 150, 1.00),
    ("front.webp", 555, 155, 1.00),
    ("three-quarter-left.webp", 610, 155, 1.00),
]
WORK = 480            # tracing canvas
PIX = 120             # final pixel grid per frame (shown at 2x)
SCALE = 0.33          # source px -> WORK px
TOP = 24              # where the top of the hair lands on the WORK canvas
N = 900               # points per path (pairs are matched one to one)
INBETWEEN = 5         # morph frames between two views
HOLD = 1              # extra frames each drawn view is held for
STRETCH = 14          # while morphing, a segment longer than this (WORK px) is left out
JUMP = 6              # a gap longer than this (WORK px) is a pen lift, not drawn


def load(name, x, y, s):
    im = Image.open(SRC + name).convert("L")
    k = SCALE * s
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    canvas = Image.new("L", (WORK, WORK), 255)
    canvas.paste(im, (round(WORK / 2 - x * k), round(TOP - y * k)))
    ink = np.asarray(canvas) < 150
    ink = remove_small_objects(ink, max_size=12)
    return skeletonize(ink)


def neighbours(p, pts):
    y, x = p
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if (dy or dx) and (y + dy, x + dx) in pts:
                yield (y + dy, x + dx)


def trace(skel, start=None):
    """Walk the skeleton like a pen: keep going straight where it can, hop to the nearest unvisited pixel when stuck."""
    pts = set(zip(*np.nonzero(skel)))
    ends = [p for p in pts if sum(1 for _ in neighbours(p, pts)) == 1]
    if start is None:
        start = max(ends or pts, key=lambda p: (p[0], -p[1]))     # lowest, then leftmost
    left = set(pts)
    path, pen = [start], [False]
    left.discard(start)
    cur, d = start, (0, 0)
    arr = np.array(sorted(left))
    while left:
        nb = [q for q in neighbours(cur, left)]
        if nb:
            nxt = max(nb, key=lambda q: (q[0] - cur[0]) * d[0] + (q[1] - cur[1]) * d[1])
            lift = False
        else:
            arr = np.array(list(left))
            i = cKDTree(arr).query(cur)[1]
            nxt = tuple(arr[i])
            lift = max(abs(nxt[0] - cur[0]), abs(nxt[1] - cur[1])) > JUMP
        d = (nxt[0] - cur[0], nxt[1] - cur[1])
        path.append(nxt); pen.append(lift)
        left.discard(nxt); cur = nxt
    return np.array(path, float), np.array(pen), ends


def smooth(p, pen, w=3):
    """Light smoothing inside each stroke only, so points never get pulled across a pen lift."""
    out = p.copy()
    k = np.ones(w) / w
    cuts = np.r_[0, np.nonzero(pen)[0], len(p)]
    for a, b in zip(cuts[:-1], cuts[1:]):
        if b - a > w:
            for c in (0, 1):
                out[a + w // 2:b - w // 2, c] = np.convolve(p[a:b, c], k, "valid")
    return out


def resample(p, pen, n=N):
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(p, axis=0).T))]
    t = np.linspace(0, seg[-1], n)
    y = np.interp(t, seg, p[:, 0]); x = np.interp(t, seg, p[:, 1])
    idx = np.clip(np.searchsorted(seg, t), 1, len(p) - 1)
    return np.c_[y, x], pen[idx]


def best_path(skel, ref):
    """Try each line end as the starting point and keep the one whose path sits closest to the previous view."""
    p, pen, ends = trace(skel)
    if ref is None or not ends:
        return resample(smooth(p, pen), pen)
    best = None
    for e in sorted(ends, key=lambda q: -q[0])[:24]:
        q, qp, _ = trace(skel, e)
        for rev in (False, True):
            # pen[i] marks the segment (i-1, i); reversing moves each mark to the other end of its segment
            rq, rp = (q[::-1], np.r_[False, qp[1:][::-1]]) if rev else (q, qp)
            a, ap = resample(smooth(rq, rp), rp)
            cost = np.mean(np.hypot(*(a - ref[0]).T))
            if best is None or cost < best[0]:
                best = (cost, a, ap)
    return best[1], best[2]


def draw(points, pen, stretch=None):
    """Bresenham at PIX resolution: 1px, no anti-aliasing."""
    img = np.full((PIX, PIX), 255, np.uint8)
    q = np.round(points * (PIX / WORK)).astype(int)
    for i in range(1, len(q)):
        if pen[i] or (stretch and np.hypot(*(points[i] - points[i - 1])) > stretch):
            continue
        (y0, x0), (y1, x1) = q[i - 1], q[i]
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx, sy = (1 if x0 < x1 else -1), (1 if y0 < y1 else -1)
        err = dx + dy
        while True:
            if 0 <= y0 < PIX and 0 <= x0 < PIX:
                img[y0, x0] = 0
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 >= dy: err += dy; x0 += sx
            if e2 <= dx: err += dx; y0 += sy
    return img


def ease(t):
    return t * t * (3 - 2 * t)


def morph(a, ap, b, bp):
    """In-betweens: pair every point of one view with a point of the next (closest overall, one to one),
    slide each pair together, and draw along whichever view the frame is nearer to."""
    cost = ((a[:, None, :] - b[None, :, :]) ** 2).sum(-1)
    _, m = linear_sum_assignment(cost)            # a[i] -> b[m[i]]
    inv = np.argsort(m)                            # b[j] -> a[inv[j]]
    out = []
    for k in range(1, INBETWEEN + 1):
        t = ease(k / (INBETWEEN + 1))
        if t < 0.5:
            out.append(draw(a + t * (b[m] - a), ap, STRETCH))
        else:
            out.append(draw(b + (1 - t) * (a[inv] - b), bp, STRETCH))
    return out


def main():
    views = []
    for name, x, y, s in FRAMES:
        if not os.path.exists(SRC + name):
            continue
        views.append(best_path(load(name, x, y, s), views[-1] if views else None))
        print("traced", name)
    frames = []
    for i, (a, ap) in enumerate(views):
        b, bp = views[(i + 1) % len(views)]
        frames += [draw(a, ap)] * (1 + HOLD)
        frames += morph(a, ap, b, bp)
    sprite = Image.fromarray(np.hstack(frames)).convert("1")
    sprite.save("assets/turnaround/turn.png", optimize=True)
    print(f"assets/turnaround/turn.png: {len(frames)} frames of {PIX}px")
    if "--preview" in sys.argv:
        big = [Image.fromarray(f).resize((PIX * 3, PIX * 3), Image.NEAREST) for f in frames]
        big[0].save("turn-preview.gif", save_all=True, append_images=big[1:], duration=83, loop=0)


if __name__ == "__main__":
    main()
