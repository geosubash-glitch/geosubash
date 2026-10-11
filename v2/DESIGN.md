# v2 design notes

The site should look like a personal homepage someone hand-coded around 1996–2000, the way browsers drew it then.
It stays simple: a name, two links, the work, and contact.
Below, each choice gives the period fact behind it.

## Colour: the browser defaults
| Thing | Value | Why |
|---|---|---|
| Page background | `#fff` white | The owner's choice. Browsers defaulted to grey #C0C0C0, but most authors overrode it with `<body bgcolor="#FFFFFF">`, so plain white is just as much of the period. |
| Text | `#000` | Default text colour. |
| Link | `#0000ee` | The default unvisited link blue. HTML5's suggested rendering adopted this value to match real browsers. |
| Visited link | `#551a8b` | Netscape Navigator 4's default visited colour. |
| Active link | `#ee0000` | Links flash red while the mouse button is down (the old `alink`). |

- **No hover colour change.**
  - `a:hover` first shipped in Internet Explorer 4 (1997) and wasn't in CSS2 drafts at the time.
  - Pages of the era changed state only on visit and on click.
- **No other colours.** The only extra colour is the blinking red square for work in progress.

## Type (owner's reference: Håkon Wium Lie, "Cascading HTML style sheets -- a proposal", CERN, 1994)
- **Everything is set in Times New Roman,** the browser default, including headings. There's no sans-serif anywhere.
- **Courier New is for data,** the way the proposal sets its code examples: project facts are a `<pre>` block.
- **Headings use the browser's default sizes:** h1 2em, h2 1.5em, h3 1.17em, all bold Times.
- **Body text is 16px with normal line height.** The page has an 8px margin, like an unstyled document.
- **Every page opens the same way:** a bold title, italic byline lines (role and school, email, date), then a thin rule. Sections follow under bold headings, as in the proposal.
- **Reading text is capped at about 70 characters a line** (Bringhurst: 45–75). The proposal itself runs text the full window width; that's the one deliberate difference, for readability.

## Structure and details
- **Rules are a default `<hr>`:** a thin grey line.
- **Linked images have a 2px border in the link colour.** Blue becomes purple once you've visited that project and flashes red on click.
  - Browsers drew this border on any image inside a link unless the author wrote `border=0`. It's the most recognisable trait of the period.
- **Quotes use the default `<blockquote>` indent** (40px) and italic Times.
- **Lists keep the default 40px indent and disc bullets.**
- **Navigation is plain text links separated by `|`.**
- **The footer carries the email address spelled out and a "Last updated" date,** two standard features of personal pages then.
- **The focus ring is the old dotted outline.**
- **Width:** the page runs wide, up to 1240px, rather than the narrow 640px or 800px pages of the time. This is the owner's choice. Projects sit in two columns, like a `<table width="100%">`.

## Motion
- **The turnaround drawing next to the name** is the owner's one-line portrait drawings, rebuilt by `tools/turnaround.py`:
  - Each drawing is traced into one continuous path.
  - In-between frames slide every point of one view onto its nearest partner in the next view.
  - Every frame is drawn with 1-pixel, un-smoothed lines on a 120px grid, like the MS Paint pencil.
  - The page shows it at exactly 2x with `image-rendering: pixelated`, about 11 frames a second.
- **The work-in-progress square blinks on and off once a second,** the rhythm of Netscape's `<blink>`.
- **"Get in touch" scrambles into the email on hover.** This is a late-90s DHTML-style effect, kept because the owner likes it.
- Both stop if the visitor's system asks for reduced motion.

## Avoid list check
- No gradients, drop shadows, rounded corners, emoji, icon sets, em dashes or taglines.
- The background is pure white. That is on the avoid list, but the owner asked for it, and it's the period look.

## Sources
- Default grey #C0C0C0: [Virginia Tech, Netscape/RGB Color Guide](https://scholar.lib.vt.edu/reports/soasis-slides/colors.html); [Hugs mailing list, 2001](https://mail.haskell.org/pipermail/hugs-bugs/2001-April/000256.html)
- Link colours: [WHATWG commit adopting #0000EE / #551A8B](https://lists.w3.org/Archives/Public/public-html-commits/2011Sep/0122.html); [O'Reilly, Dynamic HTML: The Definitive Reference (vlink #551a8b, Navigator 4)](https://www.oreilly.com/library/view/dynamic-html-the/1565924940/re727.html); [MDN, document.alinkColor](https://developer.mozilla.org/en-US/docs/Web/API/Document/alinkColor)
- `:hover` in IE4, 1997: [W3C www-style list, Dec 1997](https://lists.w3.org/Archives/Public/www-style/1997Dec/0243.html); [Index DOT Css, :hover](https://hepwww.pp.rl.ac.uk/users/adye/blooberry/indexdot/css/syntax/pseudo/pclasshover.htm)
- Fonts and `<font face>`: [Wikipedia, Web typography](https://en.wikipedia.org/wiki/Web_typography); [Eric Meyer, "All in the Font Family", Web Review, 1997](https://meyerweb.com/eric/articles/webrev/199711.html); [Pangram Pangram, The first fonts on the internet](https://pangrampangram.com/blogs/journal/internet-fonts)
- Linked-image borders: [O'Reilly, Web Design in a Nutshell, the img tag](https://www.oreilly.com/library/view/web-design-in/1565925157/ch09s04.html); [WHATWG list, borders on images inside links](https://lists.whatwg.org/pipermail/whatwg-whatwg.org/2010-April/025871.html)
- Web-safe palette: [Quackit, Web Safe Colors](https://www.quackit.com/html/codes/color/web_safe_colors.cfm)
- Link conventions: [Nielsen, Top Ten Mistakes Revisited (1999)](https://www.nngroup.com/articles/top-ten-mistakes-revisited-three-years-later/)
- Period personal sites for reference: [Web Design Museum, personal and portfolio](https://www.webdesignmuseum.org/gallery/year-1998-or-2001/tag-personal?ordr=nyear)
