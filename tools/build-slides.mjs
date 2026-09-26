// Turns the uploaded project files into web images.
//
//   assets/projects/<folder>/face.*     ->  assets/web/<slug>/cover.webp  (16:9)
//     (any non-slide image works if nothing is named face/cover)
//   assets/projects/<folder>/slide*.*   ->  assets/web/<slug>/slide-01.webp, -02…
//   assets/projects/<folder>/<other>.*  ->  assets/web/<slug>/gallery-01.webp, -02…
//
// Covers come in all shapes, so each is fitted to 16:9: close ratios are
// centre-cropped; far-off ones (very wide or tall) are letterboxed on the
// colour of their own edges so nothing important gets cut.
//
// Slides are long scroll-through boards (up to 32k px tall), so each is
// scaled to SLIDE_W and cut into CHUNK_H-tall pieces that stack seamlessly on
// the project page and load progressively. Writes js/assets.generated.js,
// which the site reads — rerun after uploading new files:
//
//   node tools/build-slides.mjs
import sharp from "sharp";
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

// upload folder -> project slug in js/projects.js
const SOURCES = {
  "rebrush": "rebrush",
  "cmf": "creta-cmf",
  "detailing and assembly": "lapcare",
  "interactive product design": "anchor",
  "latent": "latent",
  "Tactile Audio Deck": "audio-deck",
};

// Projects whose face image isn't ready yet: crop the cover from the top of
// the slide instead. Remove a slug from here once its real face is uploaded.
const COVER_FROM_SLIDE = new Set([]);

const ROOT = new URL("..", import.meta.url).pathname;
const IN = join(ROOT, "assets/projects");
const OUT = join(ROOT, "assets/web");
const COVER_W = 2000, COVER_H = 1125, SLIDE_W = 1600, CHUNK_H = 2000, GALLERY_W = 1600;
const CROP_TOLERANCE = 0.12;   // crop if within 12% of 16:9, otherwise letterbox
// Where to anchor a crop when the subject isn't centred (default "centre").
const COVER_FOCUS = { rebrush: "left" };

// Average colour of an image's outer edge, and how much it varies. A plain
// edge (studio backdrop, black) can be letterboxed seamlessly; a busy one
// (photo running off the frame) can't, so that image is cropped instead.
async function edge(file) {
  const { data, info } = await open(file).resize(64, 64, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (x > 1 && x < info.width - 2 && y > 1 && y < info.height - 2) continue;
    const i = (y * info.width + x) * 3; px.push([data[i], data[i + 1], data[i + 2]]);
  }
  const mean = [0, 1, 2].map((c) => px.reduce((a, p) => a + p[c], 0) / px.length);
  const spread = Math.sqrt(px.reduce((a, p) => a + p.reduce((b, v, c) => b + (v - mean[c]) ** 2, 0), 0) / px.length / 3);
  // median, so a highlight touching the edge doesn't tint the letterbox
  const [r, g, b] = [0, 1, 2].map((c) => px.map((p) => p[c]).sort((a, b) => a - b)[px.length >> 1]);
  return { colour: { r, g, b }, plain: spread < 18 };
}

// Detect a thin solid-colour frame (export borders, e.g. a 5px blue line):
// up to 24px of uniform rows/columns at an edge whose colour clearly differs
// from what's just inside. Returns how many px to strip from each side.
async function frame(file) {
  const { data, info } = await open(file).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
  const line = (horizontal, k) => {
    const n = horizontal ? W : H, vals = [];
    for (let t = 0; t < n; t += 3) vals.push(horizontal ? px(t, k) : px(k, t));
    const mean = [0, 1, 2].map((c) => vals.reduce((a, v) => a + v[c], 0) / vals.length);
    const sd = Math.sqrt(vals.reduce((a, v) => a + v.reduce((b, x, c) => b + (x - mean[c]) ** 2, 0), 0) / vals.length / 3);
    return { mean, sd };
  };
  const diff = (a, b) => Math.max(...a.map((v, c) => Math.abs(v - b[c])));
  const side = (horizontal, from, step) => {
    const edge = line(horizontal, from);
    if (edge.sd > 10) return 0;
    let k = 0;
    while (k < 24 && line(horizontal, from + step * k).sd <= 10 && diff(line(horizontal, from + step * k).mean, edge.mean) < 12) k++;
    const inside = line(horizontal, from + step * (k + 2));
    return k < 24 && diff(inside.mean, edge.mean) > 30 ? k : 0;
  };
  return { top: side(true, 0, 1), bottom: side(true, H - 1, -1), left: side(false, 0, 1), right: side(false, W - 1, -1), W, H };
}

async function writeCover(file, out, slug) {
  const f = await frame(file);
  const box = { left: f.left, top: f.top, width: f.W - f.left - f.right, height: f.H - f.top - f.bottom };
  const off = Math.abs(box.width / box.height / (16 / 9) - 1);
  const img = open(file).rotate().extract(box);
  const e = off > CROP_TOLERANCE ? await edge(await img.clone().png().toBuffer()) : null;
  if (!e || !e.plain) img.resize(COVER_W, COVER_H, { fit: "cover", position: COVER_FOCUS[slug] || "centre" });
  else img.resize(COVER_W, COVER_H, { fit: "contain", background: e.colour });
  await img.webp({ quality: 82 }).toFile(out);
  if (f.top || f.bottom || f.left || f.right) console.log(`  ${slug}: stripped frame t${f.top} b${f.bottom} l${f.left} r${f.right}`);
}
const IMG = /\.(jpe?g|png|webp|tiff?|avif)$/i;
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const open = (f) => sharp(f, { limitInputPixels: false });

const assets = {};
for (const [folder, slug] of Object.entries(SOURCES)) {
  let files;
  try { files = (await readdir(join(IN, folder))).filter((f) => IMG.test(f)).sort(byName); }
  catch { console.warn(`! missing folder assets/projects/${folder}`); continue; }
  const dest = join(OUT, slug);
  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });
  const entry = (assets[slug] = { cover: "", slides: [] });

  // cover: a file named face.* / cover.*, else any image that isn't a slide
  const face = files.find((f) => /^(face|cover)\./i.test(f)) || files.find((f) => !/^slide/i.test(f));
  const firstSlide = files.find((f) => /^slide/i.test(f));
  if (COVER_FROM_SLIDE.has(slug) && firstSlide) {
    const img = open(join(IN, folder, firstSlide));
    const { width } = await img.metadata();
    await img.extract({ left: 0, top: 0, width, height: Math.round(width * 9 / 16) })
      .resize({ width: COVER_W, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(dest, "cover.webp"));
    entry.cover = `assets/web/${slug}/cover.webp`;
  } else if (face) {
    await writeCover(join(IN, folder, face), join(dest, "cover.webp"), slug);
    entry.cover = `assets/web/${slug}/cover.webp`;
  }

  // every other non-slide image becomes a gallery image, keeping its shape
  entry.gallery = [];
  for (const [i, f] of files.filter((f) => f !== face && !/^slide/i.test(f)).entries()) {
    const name = `gallery-${String(i + 1).padStart(2, "0")}.webp`;
    const info = await open(join(IN, folder, f)).rotate().resize({ width: GALLERY_W, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(dest, name));
    entry.gallery.push({ src: `assets/web/${slug}/${name}`, w: info.width, h: info.height });
  }

  let n = 0;
  for (const f of files.filter((f) => /^slide/i.test(f))) {
    const buf = await open(join(IN, folder, f)).rotate().resize({ width: SLIDE_W, withoutEnlargement: true }).png().toBuffer();
    const { width, height } = await sharp(buf, { limitInputPixels: false }).metadata();
    for (let top = 0; top < height; top += CHUNK_H) {
      const h = Math.min(CHUNK_H, height - top);
      const name = `slide-${String(++n).padStart(2, "0")}.webp`;
      await sharp(buf, { limitInputPixels: false }).extract({ left: 0, top, width, height: h }).webp({ quality: 80 }).toFile(join(dest, name));
      entry.slides.push({ src: `assets/web/${slug}/${name}`, w: width, h });
    }
  }
  console.log(`${folder} -> ${slug}: cover ${entry.cover ? "yes" : "no"}, ${entry.slides.length} slide pieces, ${entry.gallery.length} gallery`);
}

await writeFile(join(ROOT, "js/assets.generated.js"),
  `// Generated by tools/build-slides.mjs — do not edit by hand.\nwindow.ASSETS = ${JSON.stringify(assets, null, 2)};\n`);
