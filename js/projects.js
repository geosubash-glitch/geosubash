/* Site info and projects.
   Covers and slides are merged in from js/assets.generated.js: add files to
   assets/projects/<folder>/ (face.* = cover, slide.* = board), then run
   node tools/build-slides.mjs. Empty fields are hidden. */

window.SITE = {
  name: "Geo Subash",
  role: "Industrial Designer",
  school: "NID",
  location: "Kerala",
  email: "geosubash@gmail.com",
  links: {
    behance: "https://www.behance.net/geosubash",
    linkedin: "https://www.linkedin.com/in/geo-subash-816a911ba/",
    instagram: "https://www.instagram.com/geo.subash",
    github: "https://github.com/geosubash-glitch",
  },
  portrait: "assets/about/portrait.webp?v=3",
  resume: "",                           // e.g. "assets/resume.pdf"

  // shown on the About page
  certifications: [
    { title: "Introduction to generative AI and agents", issuer: "Microsoft Learn · 2026", url: "https://learn.microsoft.com/en-us/users/geosubash-4382/achievements/xexhxczy" },
    { title: "AI Fluency: Framework & Foundations", issuer: "Anthropic", url: "https://verify.skilljar.com/c/e5r4k2sif7tz" },
  ],

  intro: "",

  about: [
    "Hi, I'm Geo, an industrial design student at NID Andhra Pradesh. I design products and build them far enough to test them: the form, the electronics inside and the code that runs them.",
    "Most of my projects start from something I've noticed in everyday life.",
  ],

  skills: [
    "Fusion 360", "Arduino & embedded", "PCB design",
    "3D printing", "Prototyping", "Rapid sketching", "Adobe Creative Suite", "Figma", "CMF",
  ],
};

window.PROJECTS = [
  {
    slug: "anchor",
    title: "Anchor",
    subtitle: "Reminder device for older adults",
    year: "2026",
    course: "Interactive Product Design",
    category: "Interaction Design",
    tags: ["Product design", "Interaction design", "Assistive technology"],
    guide: "Lakshya Shrivastava",
    tools: ["Figma", "ESP32", "Foam modelling", "AI renders"],
    summary: [
      "A reminder device that helps older adults keep track of one-off tasks outside their daily routine, like a bank visit or a short course of medicine. They say the task out loud to a small clip-on device, and a tray by the door slowly lights up as the time gets closer.",
    ],
    links: { "Spiral light simulation": "https://geosubash-glitch.github.io/smartlight/" },
  },
  {
    slug: "rebrush",
    title: "ReBrush",
    subtitle: "Motorcycle chain cleaner",
    year: "2025",
    course: "Simple Product Design",
    category: "Product Design",
    tags: ["Product design", "Automotive", "Mobility"],
    duration: "6 weeks",
    guide: "Archana",
    tools: [],
    summary: [
      "A holder for two used toothbrushes that lets motorcycle riders clean both sides of the chain at once, with the hand kept away from the sprocket. Many riders clean the chain with an old toothbrush while the engine runs in gear. It went through five rounds of hand-built prototypes, each tried on a bike.",
    ],
    links: {},
  },
  {
    slug: "lapcare",
    other: true,      // listed under Archive, not on the home strip
    title: "Lapcare WL-102",
    subtitle: "Keyboard teardown and redesign",
    year: "",
    course: "Detailing and Assembly",
    category: "Product Design",
    tags: ["Product design", "Design for assembly"],
    tools: [],
    summary: [
      "A teardown and redesign of the Lapcare WL-102 wireless keyboard. I took it apart, priced every part, and redesigned it with USB-C charging and keys for volume and mic. The screw count went from 16 to 6.",
    ],
    links: {},
  },
  {
    slug: "daybook",
    other: true,      // listed under Archive, not on the home strip
    title: "Daybook",
    subtitle: "A study of how an app system works",
    year: "2026",
    category: "App design",
    tags: ["User experience", "Interface design", "System mapping"],
    summary: [
      "A self-initiated study of how an app system works, using a personal journal as the subject. The journal is a private writing app for Android and the web, with sign-in, offline writing, encryption, backup and printing. I built the app and documented how its parts (accounts, storage, security, backup and updates) work together.",
    ],
    links: { "Source code": "https://github.com/geosubash-glitch/daybook", "Live app": "https://geosubash-glitch.github.io/daybook/" },
    notes: { 0: { label: "Video pitch", text: "A 22-second pitch for Daybook. Sound on." } },
  },
  {
    slug: "latent",
    other: true,      // listed under Archive, not on the home strip
    title: "Latent",
    subtitle: "Film emulation for CCD photos",
    year: "",
    category: "Software",
    tags: ["Interface design", "Photography"],
    tools: ["Python", "Code logic with Gemini"],
    summary: [
      "A photo editor that lets people who shoot on old CCD digital cameras keep the colour quirks of these sensors instead of correcting them, and compare a photo across 15 film looks at once.",
    ],
    links: { "Source code": "https://github.com/geosubash-glitch/latentworkspaces-v1.0.15-CCDera" },
    // short notes shown before parts of the board (numbers are the uploaded slide-NN files)
    notes: {
      7: { label: "Stage 01, Discovery bay", text: "Local file mounting, directory scanning and clean metadata ingestion. The clip shows a folder of CCD photos being browsed." },
      9: { label: "Stage 02, Evaluation matrix", text: "A parallel grid of 15 film stock looks, each previewed on the photo the moment the pointer moves over it." },
      11: { label: "Stage 03, Workbench", text: "A calibration bay with custom tone curves, luma waveforms and geometric transforms. The clips show the geometry controls, then the colour wheels." },
    },
  },
  {
    slug: "audio-deck",
    title: "FR4 Deck",
    subtitle: "ESP32 music player",
    year: "2026",
    category: "Electronics",
    tags: ["Product design", "Electronics"],
    tools: ["ESP32", "C++ / Arduino", "PCM5102A DAC", "SSD1306 OLED", "Code logic with Claude & Gemini"],
    summary: [
      "A music player and Bluetooth receiver with sixteen keys and no touchscreen, for listening to WAV files on in-ear monitors.",
    ],
    // image numbers index the gallery (0 = 01.png)
    story: [
      {
        "label": "01, Why",
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
        "text": "A Li-Po battery without charger noise in the audio, a synth mode, and a printed case."
      }
    ],
    links: { "Source code": "https://github.com/geosubash-glitch/ESP32-AUDIO-DECK" },
  },
  {
    slug: "minecraft",
    title: "Minecraft Progression Map",
    subtitle: "A map of how Minecraft progression works",
    year: "2026",
    course: "System Visualisation",
    category: "Interaction Design",
    tags: ["Interaction design", "Data visualisation", "Games"],
    team: "Rishav and Adwaith",
    summary: [
      "An interactive map of Minecraft progression, for players who want to see how the game fits together. It lays out 106 key items, from the first oak log to the End, and shows what each one needs and what it unlocks. Trace path lists every step to an item, so the diamond pickaxe comes out as 14 steps back to a wood log.",
    ],
    links: { "Live map": "https://geosubash-glitch.github.io/minecraftmap/" },
  },
  {
    slug: "creta-cmf",
    title: "Creta CMF",
    subtitle: "Colour and finish study for the Hyundai Creta",
    year: "2025",
    course: "Colour, Material and Finish",
    category: "CMF",
    tags: ["CMF design", "Automotive"],
    guide: "Nimesh Bhushan",
    tools: ["Photoshop", "Illustrator", "AI renders"],
    summary: [
      "A colour, material and finish proposal for the Hyundai Creta, based on trends in fashion, lifestyle and tech products, mainly premium headphones and earbuds. It pairs soft body colours with copper or brushed aluminium accents, in six colourways inside and out.",
    ],
    links: {},
  },
];

// Work in progress. `board` is a FigJam link shared as "anyone with the link can view".
window.ONGOING = [
  {
    slug: "patient-transfers",
    title: "Patient transfers",
    subtitle: "Research on moving patients",
    status: "In research",
    course: "Technically Complex Product Design",
    year: "2026",
    category: "Product Design",
    tags: ["Product design", "Assistive technology", "Healthcare"],
    board: "https://www.figma.com/board/MXgtUhK8ImltCtHCKq468F/tcp-?node-id=0-1",
    summary: [
      "Research towards a product that helps carers move older residents between bed, chair and toilet. At Nirmal Hriday Bhavan they lift about a hundred residents, most over 80, entirely by hand. The research so far is on the board below.",
    ],
    links: { "Research board": "https://www.figma.com/board/MXgtUhK8ImltCtHCKq468F/tcp-?node-id=0-1" },
  },
];

// merge generated covers and slides
for (const p of [...window.PROJECTS, ...window.ONGOING]) {
  const a = (window.ASSETS || {})[p.slug] || {};
  p.cover = p.cover || a.cover || "";
  p.slides = a.slides || [];
  p.gallery = a.gallery || [];            // uploaded extra images, {src, w, h}
  p.images = p.images || [];
}
