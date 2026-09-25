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
    behance: "",                        // e.g. "https://behance.net/…"
    linkedin: "",
    instagram: "",
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
    subtitle: "Motorcycle chain cleaning tool",
    year: "",                           // e.g. "2025"
    category: "Product Design",
    tags: ["Product Design", "Mechanical"],
    role: "",                           // e.g. "Solo — research, CAD, prototyping"
    duration: "",
    tools: [],                          // e.g. ["SolidWorks", "KeyShot"]
    cover: "assets/projects/rebrush/cover.jpg",
    images: [],
    summary:
      "Motorcycle chain maintenance is essential for the smooth functioning and safety of the vehicle. However, the current methods of cleaning the chain are often unsafe, messy, and inefficient. Users usually clean the chain by hand using separate brushes, which exposes them to the risk of injury.",
    links: { behance: "" },
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
];
