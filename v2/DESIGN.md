# v2 design notes

This is a plain personal site in the style of the early 2000s.
It has one column, system fonts, blue links and thin rules, with no buttons, search, sidebar or filters.
The owner's rule: it's a portfolio, so keep it as simple and as small as possible.

## Layout
- **One 720px column.** The page reads from top to bottom in one path, so there's nothing to choose between.
  - Hick's law: fewer options, faster decisions.
  - Each project is one row: thumbnail, title, subtitle, year.
- **Titles come first and are links.** People scan the left edge and the first words of each line (Nielsen, *F-Shaped Pattern for Reading Web Content*, 2006).
- **Structure comes from spacing and 1px rules, not boxes or colour.** This is Gestalt proximity.
- **There are only two links in the header (Work, About).** Contact sits in the footer, where people look for it (Jakob's law).

## Type
- **System fonts:** Verdana for text, Arial for headings, Georgia only for the interview quote.
  - Verdana was drawn for screens.
  - Bernard, Mills et al. (*Usability News*, 2001–2002) found Verdana and Arial among the most legible fonts on screen.
  - Nothing has to download.
- **Size:** body text is 14px with 1.6 line height, and dates and captions are 12px in grey.
  - Larger on-screen type reads better (Rello, Pielot & Marcos, CHI 2016).
- **Line length:** reading text is capped at 600px, about 70 characters a line.
  - Bringhurst recommends 45–75 characters.
  - Dyson & Haselgrove (2001) found medium line lengths read best on screen.
- **Contrast:** text #333 and metadata #6b6b66 on #f3f3ef. Both pass WCAG AA.

## Links
- **Links are blue and underlined, visited links purple, and hover red** (Nielsen, *Guidelines for Visualizing Links*, 2004).
- **The whole project row is one link,** so it's a large target (Fitts's law).

## Motion
- Only two things move:
  - The "now" square blinks.
  - "Get in touch" scrambles into the email address on hover.
- Both stop if the visitor's system asks for reduced motion.

## Owner's avoid list
- No gradients, shadows, rounded corners, emoji, icon sets, em dashes or taglines.
- The page is off-white.
