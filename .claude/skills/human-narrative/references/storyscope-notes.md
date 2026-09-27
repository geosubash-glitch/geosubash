# StoryScope — full notes

Russell, Rajendhran, Pham, Iyyer (University of Maryland) and Wieting (Google DeepMind).
"StoryScope: Investigating idiosyncrasies in AI fiction." COLM 2026. arXiv:2604.03136v6 (10 Aug 2026).
Code and data: https://github.com/jenna-russell/storyscope

---

## 1. The question

- Most AI-text detection looks at **surface style**: word choice, syntax, em-dashes, words like
  "delve" and "tapestry". Those cues work, but they are fleeting. GPT-5.4 cut its em-dash use,
  and fine-tuning to mimic human style drops AI detection on creative writing from 97% to 3%
  (Chakrabarty et al., 2026).
- The paper asks whether AI fiction can be told apart from human fiction by **discourse-level
  narrative choices** alone (plot structure, character agency, how information is revealed,
  temporal order), with style removed.
- Narrative features are harder to "humanise": changing them needs structural rewrites, not
  post-hoc edits.
- Motivation: AI fiction is already in the market. In March 2026 Hachette pulled the horror
  novel *Shy Girl* after it was flagged ~78% AI-generated, the first commercially published novel
  cancelled over AI allegations. Nearly 20% of 14,000 sampled self-published Amazon novels were
  flagged as largely AI-generated, up 41% year-on-year.
- Originality framing: US law requires minimal originality (Feist v. Rural, 1991); the US
  Copyright Office (2023) ties eligibility to sufficient human creative control. The paper uses
  **statistical rarity in narrative-feature space** as a proxy for originality (following
  Torrance, 1966).

## 2. Data

- 10,272 human-written short stories from Books3 (academic use only; human stories not released).
- A writing prompt was reverse-engineered from each human story with Gemini 2.5 Flash, then the
  same prompt was given to five LLMs: Gemini 3 Flash, Kimi K2.5, DeepSeek V3.2, Claude Sonnet 4.6,
  GPT-5.4. Six "sources" in total, 61,608 stories, mean 4,753 words. Models refused 24 stories.
- Human stories are longer (mean 6,403 words). Claude followed length instructions best (38.4%
  within 10% of target); Gemini, DeepSeek and Kimi wrote about half the asked length.
- Cost: ~$2,800 for generation, ~$1,600 for feature extraction, $4.4k total.

## 3. The pipeline

1. **Structured templates.** GPT-5.1 converts each story into a JSON template along 10 of the 12
   NarraBench dimensions: Agent, Social Network, Event, Plot, Structure, Setting, Time,
   Revelation, Perspective, Style (Paratext and Motivation excluded). Templates force later
   stages to reason about narrative content, not prose surface.
   - Without templates the discovered features were style-heavy (humour, register, imagery);
     with templates they were structure-heavy (emotional arcs, relationship trajectories, event
     density, flashbacks). Only 6 of the top 20 overlapped.
2. **Cross-source comparison.** For 100 held-out prompts (600 stories), GPT-5.1 compares all six
   anonymised templates per prompt and writes per-dimension notes, divergences and a summary.
   ~2.7M tokens of stories are compressed to ~686K tokens.
3. **Feature discovery.** One expert prompt per dimension proposes closed-form features
   (categorical, ordinal, scale, binary, multi-select). Three runs give 408 candidates,
   de-duplicated by embedding clustering (cosine 0.85) to **304 features**: 124 categorical,
   59 ordinal, 45 scale, 44 binary, 32 multi-select.
4. **Feature assignment.** Gemini 3 Flash (minimal thinking) scores every story on every feature,
   one dimension per call (single-call coverage was only 68.4% vs 95.4%). Repeatability
   Krippendorff's α = 0.90; human–model Cohen's κ = 0.84 (human–human 0.74).
5. **Classifiers.** XGBoost with bootstrap SHAP (50 resamples) sorts features into **core**
   (stable human-vs-AI markers across all five models: 30 features) and **fingerprint**
   (concentrated in one source: 75 features).

## 4. Headline results

| Model | Human vs AI macro-F1 | Six-way macro-F1 |
|---|---|---|
| Narrative only (257 features) | **93.2%** | **68.4%** |
| Core only (30) | 84.8% | 46.5% |
| Core + fingerprint (101) | 91.1% | 63.4% |
| Narrative + style (304) | 96.0% | 77.3% |
| Style only (39) | 85.8% | 60.4% |
| ModernBERT / stylometric / TF-IDF on raw text | ≥99.7% | ≥99.5% |
| Binoculars (zero-shot) | 55.9% | — |

- Narrative features alone keep **97%** of the combined model's performance.
- Length is not the explanation: on a length-matched test set the narrative model is unchanged
  (93.2%). Topic does not significantly change detectability (Kruskal–Wallis p = 0.46).
- **Style editing does not hide it.** After LAMP span-level rewriting (removing clichés,
  redundant exposition, purple prose) of 278 Gemini stories, narrative detection only drops
  from 95.5% to 93.9%. Fixing the prose does not fix the structure.
- Removing likely-memorised classics (Poe, Doyle, Wilde, Dickens, *The Yellow Wallpaper*…)
  changes nothing.
- No single narrative dimension is necessary or sufficient (agents alone 80.2%); the AI profile
  is spread across correlated dimensions.

## 5. What separates AI from human stories (the 30 core features)

Values are human vs AI (AI averaged over five models).

### AI over-explains its themes (thematic over-determination)
- Thematic explicitness and moralising: 3.28 vs **3.94** (1–5).
- Moral / philosophical weighting: 3.26 vs 3.68.
- Thematic unity (everything serves one theme): 4.41 vs 4.74.
- Narrator explicitly states the theme: 52% vs **77%**. A grieving character's arc typically ends
  with the narrator stating the lesson learned.
- Dialogue used for philosophical debate: 34% vs 59%.
- References are vague implicit echoes: 50% vs 72%.
- "AI spells out meaning rather than trusting the reader to infer it."

### AI over-writes the body and senses (sensory and embodied performativity)
- Emotion conveyed through bodily sensation/metaphor: 38% vs **81%**. Where a person writes "felt
  afraid", AI writes a tightening chest, cold sweat and dimming lamplight.
- Explicit emotion labels ("she was angry"): **29%** human vs 8% AI.
- Setting as a mirror of inner state: 3.58 vs 4.07.
- Smell-based imagery: 57% vs 82%. Sensory density 3.66 vs 3.93.
- More environmental/ecological emphasis (2.83 vs 3.21) and deeper interior access (3.67 vs 3.93).

### AI streamlines structure
- One continuous causal chain from inciting incident to ending: 3.92 vs 4.20.
- Resolution driven by the protagonist's own choice: 46% vs **69%**.
- No subplots at all: 57% vs **79%**.
- Resolution through internal understanding/acceptance: 27% vs 47%. Humans are more comfortable
  with ambiguous or unresolved endings.
- Central character introduced by external description: 30% vs 52%.
- Clearer opening spatial grounding, finer spatial granularity, more investment built before the
  threat arrives.
- "AI tells the same story from first clue to the grand reveal; a human mystery might open at
  the funeral and spiral backward through decades."

### Humans engage the outside world (intertextual richness, reader engagement)
- Explicit named references to real texts, authors, brands, places: **47%** vs 24%. AI avoids
  naming real things and sticks to vague allusion.
- Balanced mix of explicit and implicit references: 37% vs 16%.
- Breaking the fourth wall (0.67 vs 0.39) and addressing the reader directly (0.28 vs 0.07).
  "AI writes as though no one is watching."

### Humans complicate time (temporal complexity)
- More chronological discontinuity, flashbacks and flash-forwards (anachrony 2.58 vs 2.31).
- Nonlinear framing to delay disclosure (1.96 vs 1.68).
- Revelations that force re-reading of earlier scenes (3.28 vs 2.95).

### Humans are more varied (narrative diversity)
- More locations (1.34 vs 1.08) and more dialogue relative to narration (2.95 vs 2.70).
- Subplots that run parallel to the theme: 42% vs 21%.
- Morally ambivalent protagonists: **59%** vs 38%.

## 6. Convergence and rarity

- The five AI models form one tight cluster in narrative space, separate from human stories.
  Mean human–AI centroid distance is 1.6× the AI–AI distance, and even the closest human–AI pair
  is farther apart than the most distant AI–AI pair.
- Human stories are more spread out (22% larger radius) and **rarer**: mean rarity percentile
  0.71 vs 0.49 (Cohen's d = 0.83). 24.7% of human stories fall in the rarest 10% of the corpus,
  vs 7.1% of AI stories. For a given prompt, the human story is the rarest of six 57.8% of the
  time (chance 16.7%). The rarest tail is still mixed; AI can be unusual, just less often.
- All six most-confused pairs in attribution are AI↔AI (Gemini↔DeepSeek worst).

## 7. Per-model fingerprints

- **Claude: "keeps it cool".** The most distinctive AI. Event intensity escalates less than in
  any other source; lowest event-type diversity; the most uniform narrative voice; reverent,
  continuist treatment of literary tradition (62% vs 39–56%); favours epilogues and
  flash-forward endings; avoids dream sequences; prefers quiet endings over "avalanche" endings.
- **GPT: "likes to gossip".** Gossip and rumour as plot mechanism (64% vs 44–55%); frames stories
  as reflections from years or decades later; ensemble social networks; subverts expectations
  more than other AI (41% vs 27–36%); leaves reconciliations ambiguous.
- **Gemini:** tidiest endings, long denouements, bleakest settings (88% tagged bleak/oppressive),
  expanding protagonist social trajectory, siege/ordeal schemas, defaults to external character
  description.
- **DeepSeek:** front-loads crucial context; interleaves backstory evenly; visible narrator.
- **Kimi:** fewest fingerprints; sits at the generic centre of AI narrative space; introduces
  characters in action; opens in medias res.
- **Human fingerprints (32):** characters introduced in dialogue, single focaliser, back-loaded
  revelation, crossover-genre ambition, visible withholding, twist placement.
- Per-class F1 (narrative only): Human 0.89, Claude 0.77, GPT 0.73, Gemini 0.60, DeepSeek 0.57,
  Kimi 0.55.

## 8. Takeaways the authors draw

- AI stories are systematically more thematically explicit, causally tidy and temporally linear;
  human stories are structurally more diverse and occupy a rarer region.
- As surface signatures get patched out by new model versions or light edits, narrative
  structure is a more durable basis for authorship analysis.
- Their features give a measurable proxy for narrative uniqueness.
- Limits worth remembering: the study is about **long-form fiction** (~5,000 words) written from
  a one-paragraph prompt; all numbers are averages with heavy overlap between individual
  stories; LLMs extracted the features (validated against humans at κ = 0.84).
