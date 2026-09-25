// Shrinks full-size exports into web-ready images for the site.
//
//   raw/<Project Folder>/**/*.{jpg,png,pdf,…}  ->  assets/projects/<project-folder>/*.webp
//
// Originals stay out of git (raw/ is ignored) — keep them in Google Drive.
// A file named cover.* becomes the cover, otherwise the first image does.
// Every other image (and every page of a PDF) becomes 01.webp, 02.webp… in
// path order. Writes assets/projects/<slug>/manifest.json recording which
// original each output came from, plus assets/projects/index.json.
import sharp from "sharp";
import { readdir, mkdir, writeFile, mkdtemp, rm } from "node:fs/promises";
import { join, parse, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "assets/projects");
const MAX_W = 2400;
const IMG = /\.(jpe?g|png|webp|tiff?|avif|gif)$/i;
const PDF = /\.pdf$/i;

const slugify = (s) => s.normalize("NFKD").replace(/[^\w\s-]/g, "").trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/-+/g, "-") || "project";
const byName = (a, b) => a.localeCompare(b, undefined, { numeric: true });

async function walk(dir) {
  const out = [];
  for (const e of (await readdir(dir, { withFileTypes: true })).sort((a, b) => byName(a.name, b.name))) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

// Drive downloads often arrive wrapped in extra folders — unwrap them, but
// stop at a folder that holds media directly (that one is a project).
const visible = async (d) => (await readdir(d, { withFileTypes: true })).filter((e) => !e.name.startsWith("."));
let raw = join(ROOT, "raw");
for (;;) {
  const entries = await visible(raw);
  if (entries.length !== 1 || !entries[0].isDirectory()) break;
  const inner = join(raw, entries[0].name);
  if ((await visible(inner)).some((e) => e.isFile() && (IMG.test(e.name) || PDF.test(e.name)))) break;
  raw = inner;
}

const index = [];
for (const dir of (await readdir(raw, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort(byName)) {
  const slug = slugify(dir);
  const files = await walk(join(raw, dir));
  const tmp = await mkdtemp(join(tmpdir(), "pdf-"));

  // expand PDFs into page images
  const sources = [];
  for (const f of files) {
    if (IMG.test(f)) sources.push({ file: f, from: relative(raw, f) });
    else if (PDF.test(f)) {
      const prefix = join(tmp, slugify(parse(f).name));
      try {
        execFileSync("pdftoppm", ["-r", "110", "-jpeg", f, prefix]);
        for (const pg of (await readdir(tmp)).filter((n) => n.startsWith(parse(prefix).name)).sort(byName))
          sources.push({ file: join(tmp, pg), from: `${relative(raw, f)} (page ${pg.match(/(\d+)\.jpg$/)?.[1] ?? "?"})` });
      } catch { console.warn(`  ! could not render ${relative(raw, f)} (is pdftoppm installed?)`); }
    }
  }
  if (!sources.length) { await rm(tmp, { recursive: true }); continue; }

  const coverIdx = Math.max(0, sources.findIndex((s) => /^cover$/i.test(parse(s.file).name)));
  await mkdir(join(OUT, slug), { recursive: true });
  const manifest = { name: dir, slug, cover: "", images: [], skipped: files.filter((f) => !IMG.test(f) && !PDF.test(f)).map((f) => relative(raw, f)) };
  let n = 0;
  for (const [i, s] of sources.entries()) {
    const name = i === coverIdx ? "cover.webp" : `${String(++n).padStart(2, "0")}.webp`;
    try {
      const info = await sharp(s.file).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(OUT, slug, name));
      const entry = { src: `assets/projects/${slug}/${name}`, from: s.from, width: info.width, height: info.height, kb: Math.round(info.size / 1024) };
      i === coverIdx ? (manifest.cover = entry) : manifest.images.push(entry);
      console.log(`  ${s.from} -> ${slug}/${name}  ${entry.kb} KB`);
    } catch (e) {
      if (i !== coverIdx) n--;
      manifest.skipped.push(`${s.from} (${e.message})`);
    }
  }
  await writeFile(join(OUT, slug, "manifest.json"), JSON.stringify(manifest, null, 2));
  index.push({ name: dir, slug, images: manifest.images.length + (manifest.cover ? 1 : 0), skipped: manifest.skipped.length });
  await rm(tmp, { recursive: true });
}
await writeFile(join(OUT, "index.json"), JSON.stringify(index, null, 2));
console.log(`\n${index.length} project folders processed.`);
