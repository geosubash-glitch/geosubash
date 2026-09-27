---
name: human-narrative
description: Write and edit narrative prose so it doesn't carry the structural tells of AI writing identified in the StoryScope paper (COLM 2026). Use whenever writing or rewriting stories, fiction, project case studies, portfolio write-ups, About/bio text, product stories or any prose that tells what happened and why, including this site's js/projects.js summaries and story blocks. Also use when asked to review text for sounding AI-written.
---

# Human narrative

StoryScope (Russell et al., COLM 2026) showed that AI fiction is recognisable from its
**narrative choices**, not just its wording: 93.2% human-vs-AI accuracy with all style removed,
and still 93.9% after the prose was edited to remove clichés. Polishing sentences does not fix
it; the structure has to change. Full notes on every finding: `references/storyscope-notes.md`.

The study is about fiction. For non-fiction (case studies, bios, product write-ups) use the
parts that carry over, listed below, and never invent facts, quotes, people or events to add
"texture". Only use material the person provided or that is in their files.

## The AI defaults to break

1. **Over-explaining the point.** AI narrators state the theme 77% of the time (humans 52%) and
   end arcs on the lesson learned.
   - Cut sentences that tell the reader what to conclude ("the real problem was never X",
     "from luck to certainty", "this taught me…"). Stop at the evidence and let the reader infer.
   - No closing moral or tagline paragraph.
2. **One tidy causal line.** AI favours a single chain from problem to solution (79% no
   subplots), a protagonist whose own choice resolves everything (69%), and endings in
   acceptance or understanding.
   - Keep the detours: what was tried and failed, what changed direction, what is still open.
   - Let the ending stay partly unresolved when the truth is unresolved (limitations, untested
     assumptions, next questions).
   - Credit others and outside factors where they actually mattered.
3. **Strictly chronological telling.** Humans use time jumps, flashbacks and delayed disclosure;
   AI goes from first clue to grand reveal.
   - Consider opening on the most telling moment (an observation, a failure, a user's words)
     and filling in the background afterwards, instead of always
     context → research → solution → result.
4. **Vague, unnamed world.** Humans name real texts, people, places, brands and numbers twice
   as often (47% vs 24%); AI keeps to vague allusion.
   - Name the specific things: the sources cited, the competitor products, the parts used,
     the place, the course, the guide, the actual figures.
5. **Performed emotion and sensory padding.** AI shows feelings through bodies and settings
   (81% vs 38%) and piles on sensory detail (smell 82% vs 57%). Humans often just name the
   feeling (29% vs 8%).
   - Say plainly what someone felt or wanted. Drop atmosphere that doesn't carry information.
6. **Narration instead of voices.** Humans use more dialogue and quoted speech.
   - Where the person has real quotes (interviews, user research), use them verbatim.
7. **Morally or practically clean protagonists.** Humans write ambivalent choices far more often
   (59% vs 38%).
   - Admit trade-offs: what the design gives up, who it doesn't serve, what cost more than hoped.
8. **Writing as if no one is reading.** Humans address the reader far more often.
   - An occasional direct aside is fine when it fits the voice. Don't force it.

## Claude-specific fingerprint (watch this in your own drafts)

Claude's stories are the most recognisable of the AI models. They escalate least, use the
narrowest range of event types and the most uniform voice, follow conventions reverently, and
favour quiet epilogues and flash-forward endings. So:
- Let intensity actually rise and fall; vary sentence and paragraph rhythm and length.
- Don't end on a calm, looking-ahead coda by reflex. End where the material ends.
- Vary section shapes rather than repeating one template for every project.

## Surface style still matters too

The paper names em-dashes and words like "delve" and "tapestry" as the classic surface tells.
Keep em-dashes rare (prefer full stops, commas, colons), and avoid stock phrases: "not just X
but Y", "a testament to", "seamless", "elevate", "delve", "tapestry", "journey", "unlock",
"in today's world".

## Checklist before finishing any narrative text

- [ ] No sentence that spells out the moral or the takeaway.
- [ ] At least one detour, failure, open question or trade-off is kept where it's true.
- [ ] Specific names and numbers instead of vague references.
- [ ] Real quotes used where available; nothing invented.
- [ ] Feelings named plainly; no bodily or atmospheric padding.
- [ ] Not every section uses the same problem → process → solution → lesson shape.
- [ ] Ending isn't a reflexive quiet epilogue.
- [ ] Em-dashes rare; none of the stock phrases above.
