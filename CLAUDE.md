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

## Don't make it look vibe-coded (owner's list)

Before shipping any change, check it against these. Use one only if there's a real reason,
and keep it restrained.

1 harsh gradients · 2 Lucide icons · 3 pure white background · 4 rainbow colouring ·
5 drop shadows · 6 three feature cards in a row · 7 emojis · 8 liquid glass · 9 em dashes ·
10 Inter / Geist / Space Grotesk · 11 coloured left stripe · 12 fake testimonials ·
13 bento grids · 14 terminal window · 15 "it's not X, it's Y" · 16 checkmark bullets ·
17 three pricing tiers · 18 no real product demos · 19 soft corner radius ·
20 purple and black · 21 no skeleton loaders · 22 radial orbs · 23 dot grids ·
24 sparkle icons · 25 animated arrows · 26 no terms · 27 no privacy policy ·
28 hover animations · 29 neon colours · 30 basic pastel colours

How the site handles them now: square corners, no shadows or gradients, no em dashes, a
panel colour behind loading images, and `#/privacy` for a short privacy note and terms.
The owner **likes the motion and wants it kept**: the page wipe between pages, text rising in,
the hero name reveal, the scrolling skills bar (slash separators, no sparkles), the pulsing
"in progress" dot, row/arrow/image hover animations, the cursor-follow preview and the footer
scramble. Don't strip these in the name of the list above.
- **No taglines.** The owner finds slogan-style one-liners cringe ("I build X with Y inside",
  "Objects with…", clever section headlines). Keep subtitles as plain descriptions
  ("Motorcycle chain cleaner"), no intro tagline, no text on the share image beyond the name.
