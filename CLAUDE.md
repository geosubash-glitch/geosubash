# Portfolio site — notes for Claude

- Static site on GitHub Pages; `main` deploys automatically.
- Content lives in `js/projects.js`. Uploads go in `assets/projects/<folder>/`
  (`face.*` cover, `slide*` long case-study board, anything else = gallery);
  run `node tools/build-slides.mjs` to rebuild `assets/web/` (folder → slug map at its top).
- Design: paper-and-ink spec-sheet look (Inter Tight + JetBrains Mono, one orange accent).
  A quieter "object catalogue" redesign was tried and rejected by the owner; don't reintroduce it.
- **Any project write-up, bio or story text must follow the `human-narrative` skill**
  (`.claude/skills/human-narrative/`). Only use facts from the uploads, READMEs or the owner.
