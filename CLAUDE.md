# Portfolio site — notes for Claude

- Static site on GitHub Pages; `main` deploys automatically.
- Content lives in `js/projects.js`. Uploads go in `assets/projects/<folder>/`
  (`face.*` cover, `slide*` long case-study board, anything else = gallery);
  run `node tools/build-slides.mjs` to rebuild `assets/web/` (folder → slug map at its top).
- Design direction: a quiet object catalogue. One serif (Newsreader), warm grey paper,
  no accent colour, almost no motion. Avoid generic "AI agency site" tropes: giant
  all-caps name, mono labels, marquees, cursor-follow images, page wipes, "Let's talk →".
- **Any project write-up, bio or story text must follow the `human-narrative` skill**
  (`.claude/skills/human-narrative/`). Only use facts from the uploads, READMEs or the owner.
