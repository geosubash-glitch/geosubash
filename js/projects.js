/* =============================================================================
   PROJECTS — the only file you edit to add or change work.

   Images live in  assets/projects/<slug>/
     cover.*      the main image (index hover, project hero)
     01.*, 02.*…  gallery images, shown in order on the project page

   Any field left empty is simply hidden. A project with no cover yet shows a
   numbered placeholder, so the site never looks broken while you fill it in.
   ========================================================================== */

window.SITE = {
  name: "Geo Subash",
  role: "Industrial Designer",
  school: "NID Andhra Pradesh",
  location: "India",
  email: "hello@example.com",           // TODO: your public contact email
  links: {
    behance: "https://www.behance.net/geosubash",
    linkedin: "https://www.linkedin.com/in/geo-subash-816a911ba/",
    instagram: "https://www.instagram.com/geo.subash",
    github: "https://github.com/geosubash-glitch",
  },
  resume: "",                           // e.g. "assets/resume.pdf"

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
    slug: "rebrush",
    title: "ReBrush",
    subtitle: "A safe-scrub adapter for motorcycle chains",
    year: "",                           // e.g. "2025"
    category: "Product Design",
    tags: ["Product Design", "Mechanical"],
    role: "",                           // e.g. "Solo — research, CAD, prototyping"
    duration: "",
    tools: [],                          // e.g. ["SolidWorks", "KeyShot"]
    material: "ABS",
    cover: "assets/projects/rebrush/cover.webp",
    // a nested list becomes one row on the project page
    images: [
      "assets/projects/rebrush/01.webp",
      "assets/projects/rebrush/02.webp",
      "assets/projects/rebrush/03.webp",
      ["assets/projects/rebrush/04.webp", "assets/projects/rebrush/05.webp"],
      ["assets/projects/rebrush/06.webp", "assets/projects/rebrush/07.webp", "assets/projects/rebrush/08.webp"],
      "assets/projects/rebrush/09.webp",
      "assets/projects/rebrush/10.webp",
    ],
    summary: [
      "Motorcycle chain maintenance is essential for the smooth functioning and safety of the vehicle. However, the current methods of cleaning the chain are often unsafe, messy, and inefficient. Users usually clean the chain by hand using separate brushes, which exposes them to the risk of injury — a rag or short brush can pull a hand into the sprocket in a split second, while proprietary cleaning kits wear out and are expensive to refill.",
      "ReBrush is a rigid adapter that locks two ordinary toothbrushes into a precise dual-head scrubber. Load two old brushes, lock them with a steel tension screw, and scrub — cleaning three faces of the chain at once while keeping hands more than six inches from the sprocket. When the bristles wear out, the refill is free: just swap in the next old toothbrush.",
    ],
    links: { github: "https://github.com/geosubash-glitch/safe_scrub" },
  },
  {
    slug: "creta-cmf",
    title: "Hyundai Creta CMF",
    subtitle: "Colour, material & finish redesign",
    year: "",
    category: "CMF",
    tags: ["CMF", "Automotive"],
    role: "",
    duration: "",
    tools: [],
    cover: "",
    images: [],
    summary:
      "A CMF (colour, material & finish) redesign for the Hyundai Creta, built on trend and market research and translated directly into the car's material palette and finish language — bringing the design forward while staying anchored to the brand's existing identity.",
    links: { behance: "" },
  },
  {
    slug: "audio-deck",
    title: "Tactile Audio Deck",
    subtitle: "An ESP32 music player with nothing but physical buttons",
    year: "",
    category: "Electronics",
    tags: ["Electronics", "Interaction", "Prototyping"],
    role: "",
    duration: "",
    tools: ["ESP32", "C++", "I2S DAC", "Perfboard"],
    cover: "",                          // TODO: add renders from the GitHub README
    images: [],
    summary: [
      "A standalone digital audio player and Bluetooth receiver built as a dedicated, single-purpose gadget with real tactile controls — no touchscreen, no bloat, just mechanical keys and a raw cassette-futurism feel.",
      "A 16-key mechanical matrix works as a hierarchical D-pad, with a hardware buzzer giving zero-latency click feedback on every press. A 128×64 OLED shows a live visualiser and scrolling track data, and sleeps on a timeout. Inside, a custom audio pipeline on an ESP32 switches between Bluetooth streaming and lossless WAV playback from an SD card, cleanly driving sensitive in-ear monitors.",
      "The chassis is a modular 'sandwich' of two perfboards on M3 standoffs — not just for looks: it physically separates the high-speed digital audio lines from the keypad scanning noise.",
    ],
    links: { github: "https://github.com/geosubash-glitch/ESP32-AUDIO-DECK" },
  },
];
