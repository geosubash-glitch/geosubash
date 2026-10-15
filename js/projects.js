/* Site info and projects.
   Covers and slides are merged in from js/assets.generated.js: add files to
   assets/projects/<folder>/ (face.* = cover, slide.* = board), then run
   node tools/build-slides.mjs. Empty fields are hidden. */

window.SITE = {
  name: "Geo Subash",
  role: "Industrial Designer",
  school: "NID Andhra Pradesh",
  location: "Kerala, India",
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
    subtitle: "Voice wearable and tabletop light for one-off tasks in later life",
    year: "2026",
    course: "Interactive Product Design",
    category: "Interaction Design",
    tags: ["Elderly care", "Assistive technology", "Physical computing"],
    guide: "Lakshya Shrivastava",
    tools: ["Figma", "ESP32", "Foam modelling", "AI renders"],
    summary: [
      "Anchor helps older adults remember one-off tasks, such as a bank visit or a short course of medicine, that fall outside their daily routine. A clip-on wearable records the task by voice, and a tray by the door lights up gradually as the time approaches. A working prototype converts spoken Malayalam into a task and time on a round display.",
    ],
    links: { "Spiral light simulation": "https://geosubash-glitch.github.io/smartlight/" },
  },
  {
    slug: "rebrush",
    title: "ReBrush",
    subtitle: "Motorcycle chain cleaner made from old toothbrushes",
    year: "2025",
    course: "Simple Product Design",
    category: "Product Design",
    tags: ["Safety", "Sustainability", "Prototyping"],
    duration: "6 weeks",
    guide: "Archana",
    tools: [],
    summary: [
      "Riders clean their own chains with old toothbrushes, often with the engine idling in gear and a hand right next to the sprocket. ReBrush clamps two discarded toothbrushes into slide-in slots with a toothed locking plate, so it cleans both sides of the chain at once and keeps the hand well away. It took five rounds of hand-built prototypes, each tested on the bike.",
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
    other: true,      // listed under Archive, not on the home strip
    title: "Latent",
    subtitle: "Film emulation for CCD photos",
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
    subtitle: "ESP32 music player",
    year: "2026",
    category: "Electronics",
    tags: ["Engineering", "Interaction"],
    tools: ["ESP32", "C++ / Arduino", "PCM5102A DAC", "SSD1306 OLED", "Code logic with Claude & Gemini"],
    summary: [
      "A music player and Bluetooth receiver with sixteen keys and no touchscreen.",
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
    links: { github: "https://github.com/geosubash-glitch/ESP32-AUDIO-DECK" },
  },
  {
    slug: "creta-cmf",
    title: "Creta CMF",
    subtitle: "Colour, material and finish study for the Hyundai Creta",
    year: "2025",
    category: "Product Design",
    tags: ["CMF", "Automotive", "Trend research"],
    guide: "Nimesh Bhushan",
    tools: ["Photoshop", "Illustrator", "AI renders"],
    summary: [
      "A colour, material and finish proposal for the Hyundai Creta, built from fashion, lifestyle and tech-product trends. Studying premium headphones and earbuds, the objects the buyer already chooses by feel, led to soft body colours paired with copper or brushed aluminium accents, across six colourways inside and out.",
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

// merge generated covers and slides
for (const p of [...window.PROJECTS, ...window.ONGOING]) {
  const a = (window.ASSETS || {})[p.slug] || {};
  p.cover = p.cover || a.cover || "";
  p.slides = a.slides || [];
  p.gallery = a.gallery || [];            // uploaded extra images, {src, w, h}
  p.images = p.images || [];
}
