# v2 design notes

The look comes from the owner's references: YouTube 2007, the Visual Studio start page and the Internet Vibes portal.
It should feel like a simple site from around 2006, hand-coded but carefully laid out.
Each rule below says what we do and why, with the source.

## Layout
- **A fixed 960px page, split into a 630px main column and a 310px sidebar with a 20px gap.**
  - This was the standard grid of that era (the 960 Grid System).
  - It also follows Müller-Brockmann's *Grid Systems in Graphic Design*: one grid, with every box edge on it.
- **Work goes on the left, supporting information on the right.**
  - Eye-tracking studies show people read the web in an F-shape: across the top, then down the left edge (Nielsen, *F-Shaped Pattern for Reading Web Content*, 2006).
  - So the projects sit on the left, and the sidebar holds things you look up rather than read (now, about, contact).
- **Every entry starts with its title, and each title is a link.**
  - In the F-pattern, readers scan the first two words of each line.
  - So the most important words come first ("Anchor", "Memory aid for older adults"), not words like "Project 01".
- **One container everywhere.** A box with a grey header bar and a 1px border.
  - Gestalt grouping (common region, proximity) does the structuring, so the page needs no decoration.
- **On phones the grid becomes one column.** The "Now working on" box moves to the top so it isn't buried under the list.

## Type
- **System fonts:** Verdana for text and UI, Arial for headings, Georgia only for the pull quote.
  - Verdana was drawn for low-resolution screens: large x-height and open spacing.
  - Bernard, Mills et al. (*Usability News*, 2001–2002) found Verdana and Arial at 12pt were among the most legible and preferred on screen.
  - System fonts also mean nothing to download, so text appears immediately.
- **Size scale:** 11 / 12 / 13 / 14 / 18 / 24px.
  - 11px is for metadata only (dates, types), always in grey, never for anything you have to read.
  - Text you actually read is 14px with 1.6 line height.
  - Rello, Pielot & Marcos (CHI 2016, *Make it big!*) found readability improves with larger screen sizes, so the reading text sits at the top of the small range. On phones everything goes up a step.
- **Line length:** reading text is capped at 600px, about 70 characters a line.
  - Bringhurst, *The Elements of Typographic Style*, recommends 45–75 characters.
  - Dyson & Haselgrove (2001) found medium line lengths read best on screen.
- **Contrast:** body text is #333 and metadata #6b6b66 on #f3f3ef. Both pass WCAG AA (4.5:1).

## Links and interaction
- **Links are blue and underlined, and visited links turn purple.** They go red on hover.
  - Nielsen, *Guidelines for Visualizing Links* (2004): users recognise underlined blue text as a link without thinking, and visited colours stop people going in circles.
- **Thumbnails are click targets too.** They're kept out of the tab order so keyboard users don't land on the same link twice.
  - Larger targets are faster to hit (Fitts's law).
- **Familiar placement:** name top-left goes home, tabs across the top, contact links top-right, footer links at the bottom.
  - Jakob's law: people spend most of their time on other sites and expect yours to work the same way.
- **Three tabs and one search.** Fewer choices mean faster decisions (Hick's law).
  - The search and type menu actually filter the projects; they're not decoration.
- **Breadcrumbs** on every inner page ("Home › Work › Anchor"), plus previous/next links under each project, so you're never stuck at a dead end.

## Motion
- Almost none, as the owner asked. Only two things move:
  - The "in research" square blinks in steps, like an old GIF.
  - "Get in touch" scrambles into the email address on hover.
- Both stop if the visitor's system asks for reduced motion.

## Owner's avoid list
- No gradients, shadows, rounded corners, emoji, icon sets, dot grids, em dashes or taglines.
- The page is off-white, not pure white.
