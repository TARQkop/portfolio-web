/* ==========================================================================
   content.js — THE ONE FILE YOU EDIT
   --------------------------------------------------------------------------
   Everything personal on the site lives here: name, bio, services, projects,
   experience, testimonials, contact details and social links.

   ALL of this is fictional placeholder content. Replace it with your own.
   (The <title> and social-sharing meta tags at the top of index.html are the
   only other places that mention the name — see README.md.)
   ========================================================================== */

window.SITE = {
  /* ---------- You ---------- */
  person: {
    name: "Tariq Ziad",
    firstName: "Alex",
    role: "Creative Professional",
    greeting: "Silav", // "hello" in Kurmanji Kurdish — change or remove
    location: "Duhok, Kurdistan, Iraq",
    city: "Duhok",
    timezone: "Asia/Baghdad", // used for the live local clock
    coordinates: "36.87° N, 42.99° E",
    availability: "Available for new projects",
    email: "hello@alexmorgan.example",
    phone: "+964 750 000 0000",
    portrait: "assets/images/portrait.svg", // swap for your own photo
    portraitAlt: "Portrait of Tariq Ziad (placeholder illustration)",
    resumeUrl: "" // e.g. "assets/alex-morgan-cv.pdf" — leave empty to hide the CV button
  },

  /* ---------- Hero ---------- */
  hero: {
    headline: ["I design", "things *worth*", "remembering."], // *word* = italic accent
    lead:
      "Multidisciplinary creative working across brand identity, web design, motion and art direction — turning rough ideas into clear, memorable work from the mountains of Kurdistan.",
    primaryCta: { label: "See selected work", href: "#projects" },
    secondaryCta: { label: "Start a conversation", href: "#contact" },
    marquee: [
      "Brand Identity",
      "Web Design",
      "Motion",
      "Art Direction",
      "Photography",
      "Typography"
    ]
  },

  /* ---------- About ---------- */
  about: {
    statement:
      "I believe good design is a kind of generosity. It makes complicated things feel obvious and ordinary things feel quietly special.",
    story: [
      "I grew up between mountains and screens — sketching logos in the margins of school notebooks, then teaching myself to build the websites they belonged on. That mix of drawing and making still shapes how I work.",
      "Today I collaborate with founders, studios and cultural projects, from the first sketch to launch day. I like briefs that are a little messy, where the answer is still waiting to be found."
    ],
    mission:
      "To make work that is clear, considered and a little unexpected — and to leave every client with something they are proud to put their name on.",
    vision:
      "A creative scene in Kurdistan and beyond where thoughtful design is part of everyday life, not a luxury.",
    values: [
      { title: "Clarity", text: "Strong ideas survive being explained in one sentence. I start there." },
      { title: "Craft", text: "Spacing, rhythm, texture — the details nobody names but everybody feels." },
      { title: "Curiosity", text: "I research, test and question before I decorate. Surprises come from there." },
      { title: "Care", text: "Honest timelines, open process, and support long after the launch." }
    ],
    toolkit: [
      { group: "Design", items: ["Brand systems", "Typography", "Layout", "Illustration"] },
      { group: "Motion", items: ["Title design", "Logo animation", "Looping graphics"] },
      { group: "Code", items: ["HTML & CSS", "JavaScript", "Accessibility", "Performance"] },
      { group: "Tools", items: ["Figma", "Illustrator", "After Effects", "Lightroom"] }
    ],
    languages: ["Kurdish (Kurmanji)", "Arabic", "English"]
  },

  /* ---------- Services ---------- */
  services: [
    {
      title: "Brand Identity",
      icon: "brand",
      text: "Naming support, logo systems, colour, type and guidelines — an identity that holds together from a favicon to a billboard.",
      tags: ["Logo", "Guidelines", "Packaging"]
    },
    {
      title: "Web Design & Build",
      icon: "web",
      text: "Fast, accessible, handcrafted websites. Designed in the browser, built without bloat, and easy to hand over.",
      tags: ["UI design", "Front-end", "Responsive"]
    },
    {
      title: "Motion & Animation",
      icon: "motion",
      text: "Title sequences, logo stings and interface motion that give a brand rhythm and personality.",
      tags: ["Brand motion", "Social", "UI motion"]
    },
    {
      title: "Art Direction",
      icon: "art",
      text: "Creative direction for campaigns and publications — mood, casting of ideas, and a consistent visual voice.",
      tags: ["Campaigns", "Editorial", "Moodboards"]
    },
    {
      title: "Photography",
      icon: "photo",
      text: "Landscape, product and documentary-style photography with a quiet, natural-light approach.",
      tags: ["Product", "Landscape", "Retouching"]
    }
  ],

  /* ---------- Projects ----------
     style: arches | dunes | rings | lines | blocks | burst | halftone | type
            (a generated cover is drawn from the palette)
     image: optional — e.g. "assets/images/projects/mountain-hour.jpg".
            If set, it replaces the generated cover.
     category: used by the filter buttons.                                   */
  projects: [
    {
      id: "mountain-hour",
      title: "Mountain Hour",
      category: "Brand",
      year: "2026",
      role: "Identity, packaging",
      client: "Concept project",
      tools: ["Illustrator", "Figma"],
      summary: "A warm identity for a small-batch coffee roaster, inspired by the first light on the mountains.",
      details: [
        "A concept identity built around the arch — the shape of a doorway, a mountain pass, and the first sliver of morning sun.",
        "The system includes a wordmark, a modular pattern of nested arches, a colour palette drawn from sunrise, and packaging that reveals a little more of the sun on every size."
      ],
      style: "arches",
      palette: ["#f1e4cf", "#e4421a", "#f2b134", "#17382f", "#0e1512"],
      image: ""
    },
    {
      id: "atlas-journal",
      title: "Atlas Journal",
      category: "Web",
      year: "2026",
      role: "Design, front-end",
      client: "Concept project",
      tools: ["Figma", "HTML", "CSS", "JavaScript"],
      summary: "An editorial website for an independent travel magazine, built for slow, absorbing reading.",
      details: [
        "A concept for a travel magazine that treats every story like a small exhibition: generous type, full-bleed photography and quiet motion.",
        "Built as a lightweight, accessible front-end with a reading mode, fluid typography and image loading tuned for slow connections."
      ],
      style: "dunes",
      palette: ["#f6e3c4", "#e9a15c", "#c4552d", "#6b2a22", "#2a1b22"],
      image: ""
    },
    {
      id: "slow-light",
      title: "Slow Light",
      category: "Art Direction",
      year: "2025",
      role: "Art direction, photography",
      client: "Personal series",
      tools: ["Lightroom", "Medium format film"],
      summary: "A photographic series about the hour when a city and its mountains trade places with the dark.",
      details: [
        "A personal series exploring dusk — long exposures, borrowed light and the soft edge between the built and the wild.",
        "Art directed as a printed zine and a companion web gallery, with a restrained palette pulled directly from the photographs."
      ],
      style: "rings",
      palette: ["#1b1d2b", "#f2b134", "#e4421a", "#7a2e3a", "#f3eee4"],
      image: ""
    },
    {
      id: "pulse",
      title: "Pulse",
      category: "Motion",
      year: "2025",
      role: "Motion design",
      client: "Concept project",
      tools: ["After Effects", "Illustrator"],
      summary: "A title sequence and looping graphics for a late-night music series.",
      details: [
        "A set of flowing line animations that react to rhythm — slow swells for ballads, tight ripples for dance floors.",
        "Delivered as a title sequence, social loops and a toolkit so the production team can extend it themselves."
      ],
      style: "lines",
      palette: ["#0f1a2b", "#ff6a3d", "#f2b134", "#3d6bff", "#f3eee4"],
      image: ""
    },
    {
      id: "noor",
      title: "Noor",
      category: "Motion",
      year: "2025",
      role: "Identity animation",
      client: "Concept project",
      tools: ["After Effects", "Cinema 4D"],
      summary: "An animated brand film for a boutique lighting studio — light as the main character.",
      details: [
        "Noor means light. The film lets a single beam unfold into a full sunburst, becoming the studio’s logo in the final frame.",
        "Created as a 20-second brand film with cut-downs for social channels and a reusable animated logo."
      ],
      style: "burst",
      palette: ["#14201c", "#f2b134", "#e4421a", "#f3eee4", "#2c4a3f"],
      image: ""
    },
    {
      id: "sefer",
      title: "Sefer",
      category: "Web",
      year: "2024",
      role: "Product design",
      client: "Concept project",
      tools: ["Figma", "Principle"],
      summary: "Interface design for a travel companion app that works as well offline as it does on fast Wi-Fi.",
      details: [
        "Sefer means journey. The concept is a calm travel companion that keeps itineraries, maps and tickets close — even without a connection.",
        "A modular colour-block system helps travellers recognise each part of a trip at a glance."
      ],
      style: "blocks",
      palette: ["#f3eee4", "#e4421a", "#f2b134", "#17382f", "#3d6bff"],
      image: ""
    },
    {
      id: "kani",
      title: "Kani",
      category: "Brand",
      year: "2024",
      role: "Identity, packaging",
      client: "Concept project",
      tools: ["Illustrator", "Blender"],
      summary: "Packaging and identity for a spring-water brand — clean, cool and quietly proud of its source.",
      details: [
        "Kani means spring. The identity uses a halftone ripple that grows from the label, echoing water moving outward from its source.",
        "A recyclable bottle system with a tactile label finish and a single bold colour per flavour."
      ],
      style: "halftone",
      palette: ["#eaf1ee", "#17382f", "#3d9a86", "#f2b134", "#0e1512"],
      image: ""
    },
    {
      id: "echo-type",
      title: "Echo Type",
      category: "Art Direction",
      year: "2024",
      role: "Type design, art direction",
      client: "Personal project",
      tools: ["Glyphs", "Figma"],
      summary: "A display typeface and specimen exploring repetition, echo and shadow.",
      details: [
        "An experimental display typeface where every letter has a faint echo — a study in how repetition creates depth and movement.",
        "Presented through an interactive specimen and a printed poster series."
      ],
      style: "type",
      palette: ["#f3eee4", "#15120f", "#e4421a", "#f2b134", "#17382f"],
      image: ""
    }
  ],

  /* ---------- Experience (fictional) ---------- */
  experience: [
    {
      period: "2024 — Now",
      role: "Independent Creative",
      org: "Studio Morgan",
      place: "Duhok · Remote",
      text: "Brand, web and motion projects for founders, studios and cultural organisations across the region and beyond."
    },
    {
      period: "2021 — 2024",
      role: "Art Director",
      org: "Northlight Agency",
      place: "Erbil",
      text: "Led visual direction for campaigns and digital products, working closely with strategists, writers and developers."
    },
    {
      period: "2019 — 2021",
      role: "Visual Designer",
      org: "Kani Creative",
      place: "Duhok",
      text: "Designed identities, packaging and websites for local businesses, and built the studio’s first design system."
    },
    {
      period: "2017 — 2019",
      role: "Design Intern → Junior Designer",
      org: "Zagros Print House",
      place: "Duhok",
      text: "Learned production, typography and the discipline of getting a design from screen to paper without surprises."
    }
  ],

  /* ---------- Process ---------- */
  process: [
    { title: "Listen", text: "We start with conversation: your goals, your audience, what success looks like and what to avoid." },
    { title: "Explore", text: "Research, references and rough sketches. I show direction early so we can course-correct together." },
    { title: "Craft", text: "The idea is refined into a finished, consistent system — every detail considered, nothing decorative." },
    { title: "Deliver", text: "Clean files, clear guidelines and a proper handover, with support once the work is out in the world." }
  ],

  /* ---------- Testimonials (SAMPLE — replace with real quotes) ---------- */
  testimonials: [
    {
      quote: "Alex listened more than they talked, then came back with an idea we hadn’t thought to ask for. It was exactly right.",
      name: "Layla Hassan",
      role: "Founder, Sample Roasters"
    },
    {
      quote: "Calm, precise and genuinely fun to work with. The website felt finished long before launch day.",
      name: "Daniel Reyes",
      role: "Editor, Sample Journal"
    },
    {
      quote: "Our brand finally looks like how we feel about our work. People comment on it constantly.",
      name: "Mina Aydin",
      role: "Director, Sample Studio"
    }
  ],

  /* ---------- Contact ---------- */
  contact: {
    heading: "Let’s make something worth remembering.",
    text: "Tell me about your project, your timeline and the kind of work you admire. I reply within a couple of working days.",
    projectTypes: ["Brand identity", "Website", "Motion", "Art direction", "Something else"],
    // To receive messages for real, paste a form endpoint here (for example a
    // Formspree URL: "https://formspree.io/f/xxxxxxx"). While this is empty the
    // form works in "demo mode": it validates, then offers to open your email app.
    formEndpoint: ""
  },

  /* ---------- Social links (replace the URLs) ---------- */
  socials: [
    { label: "Instagram", url: "https://www.instagram.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "GitHub", url: "https://github.com/" }
  ]
};
