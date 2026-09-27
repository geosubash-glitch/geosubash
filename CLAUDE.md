# Portfolio site — notes for Claude

- Static site on GitHub Pages; `main` deploys automatically.
- Content lives in `js/projects.js`. Uploads go in `assets/projects/<folder>/`
  (`face.*` cover, `slide*` long case-study board, anything else = gallery);
  run `node tools/build-slides.mjs` to rebuild `assets/web/` (folder → slug map at its top).
- Design: deep ink navy (#0f1a2b), warm off-white text, one pale sky-blue highlight (#9fc5ff);
  one typeface, Bricolage Grotesque (narrow width for labels, no mono). "Get in touch" in the
  footer scrambles into the email on hover. A quieter "object catalogue" redesign was tried
  and rejected by the owner; don't reintroduce it.
- Work in progress lives in `window.ONGOING` (js/projects.js): shown as "Now" on the home page,
  page at `#/now/<slug>` with the FigJam board embedded live.
- About-page shelf (music, books, photos) is `data/shelf.json` + `assets/shelf/`, edited by the
  owner at `/admin.html` with a GitHub fine-grained token (Contents: read & write, this repo
  only) kept in their browser. Never commit a token.
- **Any project write-up, bio or story text must follow the `human-narrative` skill**
  (`.claude/skills/human-narrative/`). Only use facts from the uploads, READMEs or the owner.
