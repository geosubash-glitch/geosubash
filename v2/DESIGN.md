# v2 design notes

This is a plain personal site in the style of the early 2000s.
It has one column, system fonts, blue links and thin rules, with no buttons, search, sidebar or filters.
The owner's rule: it's a portfolio, so keep it as simple and as small as possible.

## Layout
- **One wide column (up to 1240px).** Wide like a modern screen rather than the square 800×600 pages of the time. The page reads from top to bottom in one path, so there's nothing to choose between.
  - Hick's law: fewer options, faster decisions.
  - Projects sit in two columns on wide screens, so the width is used rather than left empty, and in one column on phones. Each entry is the image, then the title, subtitle and year.
- **Titles come first and are links.** People scan the left edge and the first words of each line (Nielsen, *F-Shaped Pattern for Reading Web Content*, 2006).
- **Structure comes from spacing and 1px rules, not boxes or colour.** This is Gestalt proximity.
- **There are only two links in the header (Work, About).** Contact sits in the footer, where people look for it (Jakob's law).

## Type
- **Times New Roman for text, Helvetica for the name, titles, labels and captions.**
  - Times was the browser default on the early web, and Helvetica (Arial on Windows) was the standard sans.
  - The contrast between them separates reading from navigation without colour or boxes.
- **Size:** body text is 17px with 1.5 line height. Labels and captions are 13–15px Helvetica in grey.
  - Times has a small x-height, so it needs to be set a few pixels larger than a sans to read as easily on screen.
  - Larger on-screen type reads better (Rello, Pielot & Marcos, CHI 2016).
- **Line length:** the page is wide (1240px), but reading text is capped at 640px, about 70 characters a line.
  - Bringhurst recommends 45–75 characters.
  - Dyson & Haselgrove (2001) found medium line lengths read best on screen.
  - Images, slides and the board use the full width.
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
