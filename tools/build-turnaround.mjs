// Builds the header turnaround loop: assets/turnaround/src/* -> assets/turnaround/turn.webp (a horizontal sprite).
// Each drawing has its own size and framing, so every frame lists its head centre (x) and the top of the
// hair (y) in source pixels, plus a scale chosen so the chin (or, from behind, the top of the collar) lands at the
// same height in every frame. Lining up only the hair top made the loop bob, since the curls vary per drawing.
// Run: node tools/build-turnaround.mjs
import sharp from "sharp";
import { existsSync } from "node:fs";

const SRC = "assets/turnaround/src/";
// rotation order; files that don't exist yet are skipped. keep: [x0, x1] trims stray scan marks at the edges
const FRAMES = [
  { f: "profile-left.webp", x: 560, y: 160, s: 0.98 },
  { f: "back-left.webp", x: 680, y: 112, s: 1.18 },
  { f: "back.png", x: 728, y: 201, s: 1.245 },
  { f: "back-right.png", x: 752, y: 197, s: 1.23 },
  { f: "profile-right.webp", x: 600, y: 167, s: 1.04 },
  { f: "three-quarter-right.webp", x: 555, y: 144, s: 1.07, keep: [0, 1040] },
  { f: "front.webp", x: 553, y: 154, s: 0.93, keep: [0, 1040] },
  { f: "three-quarter-left.webp", x: 617, y: 153, s: 1.07, keep: [160, 1200] },
];

const OUT = 240;              // frame size in the sprite (shown at 120px, 2x for sharp screens)
const SCALE = 0.165;          // source px -> sprite px
const AX = OUT / 2, AY = 14;  // where the head-top anchor lands in each frame

const frames = FRAMES.filter((fr) => existsSync(SRC + fr.f));
const tiles = [];
for (const fr of frames) {
  const meta = await sharp(SRC + fr.f).metadata();
  const [x0, x1] = fr.keep || [0, meta.width];
  const k = SCALE * fr.s;
  const w = Math.round((x1 - x0) * k), h = Math.round(meta.height * k);
  // threshold to pure line art so the paper tone and faint scan edges drop out
  const img = await sharp(SRC + fr.f).extract({ left: x0, top: 0, width: x1 - x0, height: meta.height })
    .flatten({ background: "#fff" }).greyscale().resize(w, h).linear(1.6, -60).toBuffer();
  tiles.push({ img, left: Math.round(AX - (fr.x - x0) * k), top: Math.round(AY - fr.y * k), w, h });
}

const composites = [];
tiles.forEach((t, i) => {
  // crop each placed drawing to its own OUT x OUT cell
  composites.push({ input: t.img, left: t.left, top: t.top, i });
});
const cells = await Promise.all(composites.map(async (c) => {
  const cell = sharp({ create: { width: OUT, height: OUT, channels: 3, background: "#fff" } });
  // extract the overlapping part of the drawing
  const sx = Math.max(0, -c.left), sy = Math.max(0, -c.top);
  const t = tiles[c.i];
  const ew = Math.min(t.w - sx, OUT - Math.max(0, c.left)), eh = Math.min(t.h - sy, OUT - Math.max(0, c.top));
  const part = await sharp(c.input).extract({ left: sx, top: sy, width: ew, height: eh }).toBuffer();
  return cell.composite([{ input: part, left: Math.max(0, c.left), top: Math.max(0, c.top) }]).png().toBuffer();
}));

await sharp({ create: { width: OUT * cells.length, height: OUT, channels: 3, background: "#fff" } })
  .composite(cells.map((input, i) => ({ input, left: i * OUT, top: 0 })))
  .webp({ quality: 80 })
  .toFile("assets/turnaround/turn.webp");
console.log(`assets/turnaround/turn.webp: ${cells.length} frames of ${OUT}px (${frames.map((f) => f.f).join(", ")})`);
