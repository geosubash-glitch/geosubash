// Shrinks full-size exports into web-ready images for the site.
//
//   raw/<project-slug>/*.{jpg,png,…}   ->   assets/projects/<project-slug>/*.webp
//
// Originals stay out of git (raw/ is ignored) — keep them in Google Drive.
// The first file named cover.* becomes the cover; everything else is renamed
// 01.webp, 02.webp… in filename order. Prints the `cover` / `images` lines to
// paste into js/projects.js.
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const RAW = join(ROOT, "raw");
const OUT = join(ROOT, "assets/projects");
const MAX_W = 2400;
const EXT = /\.(jpe?g|png|webp|tiff?|avif)$/i;

for (const slug of (await readdir(RAW, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const files = (await readdir(join(RAW, slug))).filter((f) => EXT.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  await mkdir(join(OUT, slug), { recursive: true });
  const images = [];
  let cover = "";
  let n = 0;
  for (const f of files) {
    const isCover = !cover && /^cover$/i.test(parse(f).name);
    const name = isCover ? "cover.webp" : `${String(++n).padStart(2, "0")}.webp`;
    const info = await sharp(join(RAW, slug, f))
      .rotate()
      .resize({ width: MAX_W, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(OUT, slug, name));
    const rel = `assets/projects/${slug}/${name}`;
    isCover ? (cover = rel) : images.push(rel);
    console.log(`  ${f} -> ${name}  ${(info.size / 1024).toFixed(0)} KB`);
  }
  console.log(`\n${slug}:\n  cover: "${cover}",\n  images: ${JSON.stringify(images)},\n`);
}
