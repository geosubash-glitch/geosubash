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
  portrait: "assets/about/portrait.webp",
  resume: "",                           // e.g. "assets/resume.pdf"

  // shown on the About page
  certifications: [
    { title: "Introduction to generative AI and agents", issuer: "Microsoft Learn · 2026", url: "https://learn.microsoft.com/en-us/users/geosubash-4382/achievements/xexhxczy" },
    { title: "AI Fluency: Framework & Foundations", issuer: "Anthropic", url: "https://verify.skilljar.com/c/e5r4k2sif7tz" },
  ],

  intro:
    "Industrial design student at NID Andhra Pradesh. I build physical things with electronics and code inside.",

  about: [
    "I'm an industrial design student at NID Andhra Pradesh. I like objects that are part physical, part digital, and most of my time goes into the part you don't see: the electronics, mechanisms and code that make an idea actually work.",
    "Most of what I build starts close to home, from a friction, a habit or a small everyday moment.",
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
    subtitle: "A memory aid for older adults",
    year: "2026",
    category: "Interactive Product Design",
    tags: ["Interaction", "Product Design", "Research"],
    team: "Geo Subash, Sarang V",
    guide: "Lakshya",
    tools: [],
    summary: [
      "Sarang V and I looked at how older adults in India keep track of one-off tasks, like a bank visit at 3 PM. Anchor is a clip-on recorder you say the task into, and a tray whose light fills in as the time gets close. The product images are concept renders.",
    ],
    links: { "Spiral light simulation": "https://geosubash-glitch.github.io/smartlight/" },
  },
  {
    slug: "rebrush",
    title: "ReBrush",
    subtitle: "A chain cleaner made from old toothbrushes",
    year: "",
    category: "Product Design",
    tags: ["Product Design", "Research", "Engineering"],
    duration: "6 weeks",
    guide: "Archana",
    tools: [],
    summary: [
      "Riders often clean their chain with the engine running, a hand inches from the sprocket, holding an old toothbrush. ReBrush clamps two discarded toothbrushes into one tool that keeps hands away. It took more than twenty prototypes.",
    ],
    links: {},
  },
  {
    slug: "lapcare",
    title: "Lapcare WL-102",
    subtitle: "Keyboard teardown and redesign",
    year: "",
    category: "Detailing & Assembly",
    tags: ["Engineering", "Product Design"],
    tools: [],
    summary: [
      "I took apart a Lapcare WL-102 wireless keyboard, priced every part, and redesigned it with USB-C charging and keys for volume and mic. The screw count went from 16 to 6.",
    ],
    links: {},
  },
  {
    slug: "latent",
    title: "Latent",
    subtitle: "Film looks for old CCD photos",
    year: "",
    category: "Software & Interface",
    tags: ["Software", "Interaction"],
    tools: ["Python", "Code logic with Gemini"],
    summary: [
      "A photo editor for old CCD cameras that keeps the sensor's colour quirks instead of correcting them. Each photo is shown in 15 film looks side by side, and the grain is modelled on Ilford HP5. Code logic written with Gemini.",
    ],
    links: { github: "https://github.com/geosubash-glitch/latentworkspaces-v1.0.15-CCDera" },
  },
  {
    slug: "audio-deck",
    title: "FR4 Deck",
    subtitle: "An ESP32 music player with physical keys",
    year: "2026",
    category: "Electronics",
    tags: ["Engineering", "Interaction"],
    tools: ["ESP32", "C++ / Arduino", "PCM5102A DAC", "SSD1306 OLED", "Code logic with Claude & Gemini"],
    summary: [
      "A music player and Bluetooth receiver with sixteen keys and no touchscreen.",
    ],
    // told as a story on the project page; numbers point at the uploaded
    // gallery images (0 = 01.png, 1 = 02.png, 2 = 03.png)
    story: [
      {
        "label": "01, Why",
        "heading": "I wanted keys, not a touchscreen",
        "text": "A single-purpose player for WAV files and Bluetooth, tuned to sound clean on my in-ear monitors."
      },
      {
        "images": [
          0,
          1
        ],
        "caption": "The bare build on FR4 perfboard"
      },
      {
        "label": "02, Keys",
        "heading": "The keypad",
        "text": "A 4×4 keypad works as a D-pad, and a buzzer clicks on every press.",
        "list": [
          [
            "2 · 8",
            "Up · Down"
          ],
          [
            "4 · 6",
            "Previous · Next track"
          ],
          [
            "5",
            "Play / Pause"
          ],
          [
            "A · B",
            "Volume up · down"
          ],
          [
            "D",
            "Bluetooth / SD card"
          ],
          [
            "*",
            "Menu"
          ],
          [
            "1",
            "Visualiser"
          ]
        ]
      },
      {
        "label": "03, Inside",
        "heading": "Most of the time went into the pins",
        "text": "Sharing one ESP32 between the display, SD card, DAC and keypad caused SPI conflicts and memory crashes until the OLED and SD reader moved to other pins.",
        "list": [
          [
            "Controller",
            "ESP32, 38-pin"
          ],
          [
            "Audio",
            "PCM5102A DAC, 16-bit / 44.1 kHz"
          ],
          [
            "Display",
            "0.96\" SSD1306 OLED"
          ],
          [
            "Storage",
            "microSD"
          ],
          [
            "Chassis",
            "Two FR4 perfboards on nylon standoffs"
          ]
        ]
      },
      {
        "image": 2,
        "caption": "Product label",
        "label": "04, Next",
        "heading": "Next",
        "text": "A Li-Po battery without charger noise in the audio, a synth mode, and a printed case."
      }
    ],
    links: { github: "https://github.com/geosubash-glitch/ESP32-AUDIO-DECK" },
  },
  {
    slug: "creta-cmf",
    title: "Hyundai Creta CMF",
    subtitle: "Colour and material study",
    year: "",
    category: "CMF",
    tags: ["CMF", "Research"],
    tools: [],
    summary: [
      "A colour and material study for the Hyundai Creta, for a 25 to 35-year-old IT professional's family car. The palette came from headphones by Sony, Bose, Sennheiser and Beats: one colour in different finishes, with small copper and rose-gold accents.",
    ],
    links: {},
  },
];

// Work in progress, shown in its own "Now" block on the home page and not
// numbered with finished projects. `board` is the FigJam link; the page embeds
// it live (the board must be shared as "anyone with the link can view").
window.ONGOING = [
  {
    slug: "patient-transfers",
    title: "Patient transfers",
    subtitle: "How carers move people who can't move themselves",
    status: "In research",
    year: "2026",
    category: "Product Design · Research",
    tags: ["Research", "Product Design"],
    board: "https://www.figma.com/board/MXgtUhK8ImltCtHCKq468F/tcp-?node-id=0-1",
    summary: [
      "At Nirmal Hriday Bhavan, about a hundred residents, most over 80, are lifted between bed, chair and toilet entirely by hand. This research is looking for an aid that takes that load off carers' backs. The board below is where it stands.",
    ],
    links: { "Open the research board": "https://www.figma.com/board/MXgtUhK8ImltCtHCKq468F/tcp-?node-id=0-1" },
  },
];

// Merge in the generated cover + slides for each project.
for (const p of [...window.PROJECTS, ...window.ONGOING]) {
  const a = (window.ASSETS || {})[p.slug] || {};
  p.cover = p.cover || a.cover || "";
  p.slides = a.slides || [];
  p.gallery = a.gallery || [];            // uploaded extra images, {src, w, h}
  p.images = p.images || [];
}
