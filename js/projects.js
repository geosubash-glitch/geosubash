/* =============================================================================
   PROJECTS — the only file you edit to add or change work.

   Upload a project's files to  assets/projects/<folder>/
     face.*       the cover image (index hover, cards, project hero)
     slide.*      the long scroll-through presentation board
   then run  node tools/build-slides.mjs  (folder -> slug map at its top).
   It writes web-sized copies to assets/web/<slug>/ and js/assets.generated.js;
   the cover and slides below are filled in from that automatically.

   Any field left empty is simply hidden. A project with no cover yet shows a
   numbered placeholder, so the site never looks broken while you fill it in.
   ========================================================================== */

window.SITE = {
  name: "Geo Subash",
  role: "Industrial Designer",
  school: "NID Andhra Pradesh",
  location: "India",
  email: "geosubash@gmail.com",
  links: {
    behance: "https://www.behance.net/geosubash",
    linkedin: "https://www.linkedin.com/in/geo-subash-816a911ba/",
    instagram: "https://www.instagram.com/geo.subash",
    github: "https://github.com/geosubash-glitch",
  },
  resume: "",                           // e.g. "assets/resume.pdf"

  // shown on the About page
  certifications: [
    { title: "Introduction to generative AI and agents", issuer: "Microsoft Learn · 2026", url: "https://learn.microsoft.com/en-us/users/geosubash-4382/achievements/xexhxczy" },
    { title: "AI Fluency: Framework & Foundations", issuer: "Anthropic", url: "https://verify.skilljar.com/c/e5r4k2sif7tz" },
  ],

  intro:
    "Industrial designer building phygital objects — things that ask to be touched as much as understood.",

  about: [
    "I'm an industrial design student at NID Andhra Pradesh, working at the intersection of physical and digital products — interactive, \"phygital\" objects that ask to be touched as much as they ask to be understood.",
    "A large part of every project goes into its technical core: the electronics, mechanical systems, and code that make an idea actually behave the way it's meant to, not just look like it does. That layer takes the most time, and I like it that way.",
    "I try to pull in whatever discipline a project needs, even ones outside design, because working across fields is usually where the sharpest ideas turn up. Most of what I build starts close to home — a friction, a habit, or a small everyday moment worth designing around.",
  ],

  skills: [
    "SolidWorks", "Fusion 360", "KeyShot", "Arduino & embedded", "PCB design",
    "3D printing", "Prototyping", "Sketching", "Figma", "CMF",
  ],
};

window.PROJECTS = [
  {
    slug: "anchor",
    title: "Anchor",
    subtitle: "A memory companion for independent elders",
    year: "2026",
    category: "Interactive Product Design",
    tags: ["Interaction", "Product Design", "Research"],
    team: "Geo Subash, Sarang V",
    guide: "Lakshya",
    tools: [],
    summary: [
      "140 million people in India are over 60, and most are still independent. Routine holds — it's the one-off task that slips: a bank visit at 3 PM, a short course of afternoon medicine. The memory at stake is prospective memory, remembering to do something later, and it's the first thing to go for non-routine tasks.",
      "Research moved from one everyday observation through seven studies, three rounds of interviews, two personas and journey maps to a single question: how might we build memory support into familiar objects, so remembering takes no effort? The answer had to ask almost nothing of memory, put the task in the room, help without being noticed, and stay calm — never alarming.",
      "Anchor is two objects. A wearable, clipped to a collar or worn on the wrist, catches a task the moment it's spoken — hold, say it once, let go. A tabletop tray then holds it quietly: a spiral of light slowly builds through the day as the time approaches, the round display shows the task, and a physical reset closes the loop. No alarms, no screen to learn — from luck to certainty.",
    ],
    links: { "Spiral light simulation": "https://geosubash-glitch.github.io/smartlight/" },
  },
  {
    slug: "rebrush",
    title: "ReBrush",
    subtitle: "A safer motorcycle chain cleaner made from old toothbrushes",
    year: "",
    category: "Product Design",
    tags: ["Product Design", "Research", "Engineering"],
    duration: "6 weeks",
    guide: "Archana",
    tools: [],
    summary: [
      "Riders often clean their chains with the engine idling in gear to save time — bringing hands and makeshift tools right up to the sprocket's pinch points, a leading cause of fingertip injuries. Professional kits are expensive, so most people improvise with a single old toothbrush, cardboard or plastic bags, and get poor reach, messy overspray and real risk.",
      "Digital ethnography of forums and videos, a survey of riders across bike segments and step-by-step task analysis mapped exactly where the friction was. That became four goals: absolute safety, universal modularity, sustainable low cost and ergonomic control.",
      "ReBrush clamps two discarded toothbrushes into a rigid dual-head scrubber that reaches both sides of the chain from a safe distance. Open-ended slide-in slots accept almost any brush, and a toothed locking plate bites into the handles so they can't twist under load. More than 25 prototypes tested fit, strength, clearance, torsional stability and quick-swap loading before the final model.",
    ],
    links: {},
  },
  {
    slug: "lapcare",
    title: "Lapcare WL-102",
    subtitle: "Keyboard teardown and DFM / DFA redesign",
    year: "",
    category: "Detailing & Assembly",
    tags: ["Engineering", "Product Design"],
    tools: [],
    summary: [
      "A full teardown of the Lapcare WL-102, a 104-key 2.4 GHz wireless keyboard — mapping its function, user process, every exterior and interior part, and an approximate bill of materials (₹765–1,680).",
      "The redesign adds a rechargeable Li-Po battery with USB-C charging (TP4056 charge module and a buck converter, with the wiring worked out) and dedicated volume and mic-mute keys — then pushes the whole product through design for manufacturing and assembly.",
      "For manufacturing: an integrated light-indicator window, a back plate that's only thicker at the electronics zone, a flat membrane support and taller key stems with thinner domes to save plastic. For assembly: screws cut from 16 to 6, snap-on clips, the battery built into the main body and separate lids removed entirely.",
    ],
    links: {},
  },
  {
    slug: "latent",
    title: "Latent",
    subtitle: "A film-emulation workspace for CCD-sensor photographs",
    year: "",
    category: "Software & Interface",
    tags: ["Software", "Interaction"],
    tools: ["Python", "Code co-written with Gemini"],
    summary: [
      "Latent is an opinionated editing workspace that gives creative direction without endless options. Rather than imitating analog film with texture overlays, it simulates each stage of development natively at the pixel level — treating the digital image as a living chemical environment.",
      "Release v1.0.15-CCDera is tuned for old CCD sensors: instead of correcting their quirks, it splits each raw file into 15 film-stock hypotheses shown side by side in an evaluation matrix, so a sensor's colour bias and highlight clipping become material to design with.",
      "The workflow runs in three stages — a discovery bay for mounting and scanning local files, the evaluation matrix, and a workbench with tone splines, luma waveforms and geometric transforms. Grain is driven by luminance, so it peaks in the midtones and dissolves into clipped highlights and deep shadows the way real film does.",
    ],
    links: { github: "https://github.com/geosubash-glitch/latentworkspaces-v1.0.15-CCDera" },
  },
  {
    slug: "audio-deck",
    title: "Tactile Audio Deck",
    subtitle: "An ESP32 music player with nothing but physical buttons",
    year: "",
    category: "Electronics",
    tags: ["Engineering", "Interaction"],
    tools: ["ESP32", "C++", "I2S DAC", "Perfboard"],
    summary: [
      "A standalone digital audio player and Bluetooth receiver built as a dedicated, single-purpose gadget with real tactile controls — no touchscreen, no bloat, just mechanical keys and a raw cassette-futurism feel.",
      "A 16-key mechanical matrix works as a hierarchical D-pad, with a hardware buzzer giving zero-latency click feedback on every press. A 128×64 OLED shows a live visualiser and scrolling track data, and sleeps on a timeout. Inside, a custom audio pipeline on an ESP32 switches between Bluetooth streaming and lossless WAV playback from an SD card, cleanly driving sensitive in-ear monitors.",
      "The chassis is a modular 'sandwich' of two perfboards on M3 standoffs — not just for looks: it physically separates the high-speed digital audio lines from the keypad scanning noise.",
    ],
    links: { github: "https://github.com/geosubash-glitch/ESP32-AUDIO-DECK" },
  },
  {
    slug: "creta-cmf",
    title: "Hyundai Creta CMF",
    subtitle: "Translating tech-product CMF trends to an SUV",
    year: "",
    category: "CMF",
    tags: ["CMF", "Research"],
    tools: [],
    summary: [
      "A colour, material and finish study for the Hyundai Creta (₹11–20 L), aimed at its core buyer: a 25–35-year-old IT professional in a tier 1 or 2 city — a practical, budget-conscious, tech-enthusiast family driver who wants a strong road presence that still feels modern and easy to live with.",
      "Research mapped how competitors use CMF — the Kia Seltos goes sporty and rugged with matte paints and heavy cladding, the Grand Vitara premium with chrome and copper accents and dual-tone leather, the RAV4 premium-minimal, the HR-V minimal-futuristic — alongside macro trends from Y2K and Y3K to athleisure, modern bohemian and the maximalist 'mob wife' look. The core insight: today's aesthetics come from combining and modifying existing movements.",
      "A mood board of premium headphones and tech products distilled the direction — same colour in different finishes and materials, pastel and soft tones, metallic accents like rose gold and brushed aluminium, and minimal, subtle branding. That language was translated into five exterior and interior schemes for the Creta, from warm tan with brushed-copper pillars to deep blue with pale leather and dark graphite with copper trim.",
    ],
    links: {},
  },
];

// Merge in the generated cover + slides for each project.
for (const p of window.PROJECTS) {
  const a = (window.ASSETS || {})[p.slug] || {};
  p.cover = p.cover || a.cover || "";
  p.slides = a.slides || [];
  p.images = p.images || [];
}
