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
    "Industrial design student at NID Andhra Pradesh. I make objects that mix the physical and the digital: a chain cleaner built from old toothbrushes, a memory aid for elders, a music player with sixteen keys and no screen.",

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
      "It started with an elderly woman filling in a form. She couldn't recall the details, so she reached for a small notebook. Sarang V and I spent the project on that gap: not memory loss from disease, but prospective memory, remembering to do something later, which is the first thing to slip for one-off tasks. India has 140 million people over 60, and 14 million of them live alone.",
      "Two people shaped the brief. Ashok, 68, a retired teacher: \"If I have to visit the bank at 3 PM, I spend the whole day stressing about not forgetting it.\" Sunita, 71: \"When the doctor gives me a temporary afternoon medicine, I keep missing it.\" Across seven studies and three rounds of interviews the pattern held. Routines were fine, one-off tasks failed, and every lapse pushed people further onto their families; 65–70% are already partly dependent.",
      "Anchor splits the job in two. A clip-on wearable records a task when you hold its button and say it once. A tabletop tray shows the task on a small round display and lights a spiral that fills in as the time gets closer; pressing reset clears it. It is scoped to normal ageing, not dementia, where reminders stop helping. The product images are concept renders and mockups, and the spiral's timing exists as a browser simulation.",
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
      "The key finding came out of YouTube comment sections. Under maintenance tutorials, riders kept describing the same shortcut: cleaning the chain with the engine running in first gear, hand inches from the sprocket. Two medical papers on chain-sprocket hand injuries (Geevarughese et al.; Nishar et al.) showed where that ends, so safety became the first requirement, ahead of cost.",
      "A Google Forms survey found the people doing their own maintenance were mostly on 125cc-plus bikes with O-ring or X-ring chains, and that they skipped commercial kits for jugaad: an old toothbrush, cardboard, a plastic bag over the tyre. Watching one rider clean a chain step by step (WD-40, brush, WD-40 again, a hose on the turning wheel, lube on the moving chain) showed the rest: cramped hands, no leverage on the inner links, degreaser all over the tyre.",
      "The toothbrush already works, so ReBrush keeps it and fixes everything around it. Over six weeks I built more than twenty prototypes, and most failed for plain reasons. Some didn't fit every brush. Rubber bands kept snapping. One version grew too big and used too much material; another's fastening was never reliable. The final tool takes any two discarded brushes in open-ended slots and clamps them with a toothed plate that bites into the handles, so they don't twist while scrubbing.",
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
      "I took apart a Lapcare WL-102, a 104-key wireless keyboard that runs on AAA cells and weighs 400 g, mapped every part from the keycaps and rubber-dome sheet down to the membrane layers and the small PCB with its RF transmitter, and priced each one. The parts came to roughly ₹765–1,680.",
      "Two changes came out of the teardown. The AAA cells gave way to an 800 mAh Li-Po pouch charged over USB-C through a TP4056 module and a step-down converter, and three keys were added for volume and mic mute, for calls and online classes. With those features and the manufacturing and assembly changes below, the estimate came to ₹935–1,900.",
      "For assembly, the screw count dropped from 16 to 6 with snap-on clips doing the rest, and the battery moved into the main body, so the separate lid is gone. For moulding, the back plate is only thick where the electronics sit, the status light became a window in the body instead of a separate part, and the key stems got taller while the domes got thinner, keeping the feel with less plastic.",
    ],
    links: {},
  },
  {
    slug: "latent",
    title: "Latent",
    subtitle: "A film-emulation workspace for old CCD-sensor photographs",
    year: "",
    category: "Software & Interface",
    tags: ["Software", "Interaction"],
    tools: ["Python", "Code logic with Gemini"],
    summary: [
      "Most film presets clean a digital photo up and then lay grain on top. Latent goes the other way for old CCD cameras: it keeps the sensor's colour bias and the particular way it clips highlights, and works with them instead of correcting them away.",
      "You point it at a folder, and each photo is split into 15 film-stock versions at once, laid out in a grid you compare by hovering. Pick one and a workbench opens with tone curves, a luma waveform and geometric transforms. This release, v1.0.15-CCDera, is tuned only for CCD files.",
      "The grain is modelled on Ilford HP5: Gaussian noise weighted by brightness, strongest in the midtones and falling to nothing in blown-out sky and deep shadow, which is roughly how film behaves. The code logic was written with Gemini.",
    ],
    links: { github: "https://github.com/geosubash-glitch/latentworkspaces-v1.0.15-CCDera" },
  },
  {
    slug: "audio-deck",
    title: "FR4 Deck",
    subtitle: "A tactile ESP32 audio player with nothing but physical buttons",
    year: "2026",
    category: "Electronics",
    tags: ["Engineering", "Interaction"],
    tools: ["ESP32", "C++ / Arduino", "PCM5102A DAC", "SSD1306 OLED", "Code logic with Claude & Gemini"],
    summary: [
      "A standalone music player and Bluetooth receiver with sixteen mechanical keys and no touchscreen, built to drive sensitive in-ear monitors cleanly.",
    ],
    // told as a story on the project page; numbers point at the uploaded
    // gallery images (0 = 01.png, 1 = 02.png, 2 = 03.png)
    story: [
      {
        label: "01, Why",
        heading: "I wanted buttons.",
        text: [
          "I wanted a single-purpose gadget with actual keys instead of a touchscreen. FR4 Deck (model DAP-ESP32-M16) is that: a player for WAV files on a microSD card that also works as a Bluetooth receiver, with a raw, cassette-futurism look that comes from leaving the boards exposed.",
          "It had to sound clean on my IEMs, which pick up every bit of noise, and a lot of the hardware decisions below come from that.",
        ],
      },
      { images: [0, 1], caption: "The bare build: ESP32, DAC, microSD reader and buzzer on FR4 perfboard" },
      {
        label: "02, Keys",
        heading: "Sixteen keys, no screen to learn.",
        text: "A 4×4 mechanical keypad works as a D-pad with a few extra functions. A buzzer wired straight to the ESP32 clicks on every press, so you know it registered. The small OLED shows a visualiser and the track name, then switches off after a while, partly for battery and partly because it was too bright in a dark room.",
        list: [
          ["2 · 8", "Up · Down"],
          ["4 · 6", "Previous · Next track"],
          ["5", "Confirm · Play / Pause"],
          ["A · B", "Volume +10% · −10%"],
          ["D", "Switch Bluetooth / SD card"],
          ["*", "System menu"],
          ["1", "Live audio visualiser"],
        ],
      },
      {
        label: "03, Inside",
        heading: "Most of the time went into the pins.",
        text: [
          "Getting the display, the SD card, the DAC and the keypad to share one ESP32 without SPI conflicts or \"Guru Meditation\" memory crashes took a lot of trial and error. The OLED and SD reader ended up on alternative pins to keep the keypad away from the I2S audio buffer, and the display bus runs at 400 kHz because slower settings made the audio stutter.",
          "Even then, the Bluetooth stack and audio libraries were too big for the default memory layout; it only compiles with the \"Huge APP\" partition scheme. The two stacked perfboards on nylon standoffs aren't just styling either: they keep the audio lines physically away from the keypad scanning noise.",
        ],
        list: [
          ["Controller", "ESP32 dev module, 38-pin"],
          ["Audio", "PCM5102A I2S DAC · 16-bit / 44.1 kHz"],
          ["Display", "0.96\" SSD1306 OLED, I2C at 400 kHz"],
          ["Input", "4×4 mechanical matrix keypad"],
          ["Storage", "microSD over SPI"],
          ["Feedback", "5 V active piezo buzzer"],
          ["Chassis", "Two FR4 perfboards on M3 nylon standoffs"],
        ],
      },
      {
        image: 2,
        caption: "Product label",
        label: "04, Not done",
        heading: "Still open.",
        text: [
          "Battery power is next: a Li-Po cell with a TP4056 charger and an MT3608 boost converter, without letting the converter's noise into the audio. After that, a synth mode that turns the keypad into an instrument, and a printed snap-fit case.",
        ],
      },
    ],
    links: { github: "https://github.com/geosubash-glitch/ESP32-AUDIO-DECK" },
  },
  {
    slug: "creta-cmf",
    title: "Hyundai Creta CMF",
    subtitle: "Taking colour and material ideas from headphones to an SUV",
    year: "",
    category: "CMF",
    tags: ["CMF", "Research"],
    tools: [],
    summary: [
      "The buyer I designed for: an IT professional aged 25 to 35 in a tier 1 or 2 city, in a family of three or four, who wants a strong road presence and a car that is still easy to drive in the city. The persona board places them alongside brands like Samsung, Decathlon and JBL.",
      "Four competitors got a close look. The Kia Seltos is sporty and rugged, with matte paints and heavy cladding. The Maruti Grand Vitara goes premium with chrome and copper accents and dual-tone leather. The Toyota RAV4 is premium but minimal, with a single-tone cabin, and the Honda HR-V is minimal and futuristic in single-tone fabric. Alongside that, fashion trends were combining older movements into new ones: Y2K into Y3K, athleisure, modern boho, the maximalist \"mob wife\" look.",
      "The palette came from headphones: Sony WH-1000XM6, Sennheiser Accentum Plus, Soundcore Life Q30, Bose QuietComfort Ultra and Beats Studio Pro. They share one move, the same colour in different finishes and materials, along with soft pastels, small metallic accents in rose gold and brushed aluminium, and quiet branding. On the Creta that became five exterior and interior schemes, among them warm tan with brushed-copper pillars, deep blue with pale leather, and dark graphite with copper trim.",
    ],
    links: {},
  },
];

// Merge in the generated cover + slides for each project.
for (const p of window.PROJECTS) {
  const a = (window.ASSETS || {})[p.slug] || {};
  p.cover = p.cover || a.cover || "";
  p.slides = a.slides || [];
  p.gallery = a.gallery || [];            // uploaded extra images, {src, w, h}
  p.images = p.images || [];
}
