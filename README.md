# Tariq Ziad — Personal Portfolio

A premium editorial portfolio built with **only HTML, CSS and vanilla JavaScript**. No frameworks, no build step, no dependencies (apart from the Google Fonts stylesheet).

**To view it:** open `index.html` in any modern browser — or serve the folder with any static host.

All names, bios, projects and contact details are **fictional placeholders**.

---

## Project structure

```
alex-morgan-portfolio/
├── index.html              Page structure, SEO + Open Graph metadata, hero artwork (inline SVG)
├── README.md               This file
├── css/
│   └── style.css           Design tokens, layout, animations, dark mode, responsive, reduced-motion
├── js/
│   ├── content.js          ★ ALL personal content lives here — edit this file
│   ├── art.js              Generative project covers + icon set (SVG)
│   └── script.js           Rendering + every interaction
└── assets/
    └── images/
        ├── portrait.svg    Placeholder portrait — replace with your photo
        ├── favicon.svg     Browser-tab icon
        └── og-cover.png    1200×630 social-share image
```

---

## Making it yours

### 1. Edit `js/content.js` (almost everything)
| Section | What to change |
|---|---|
| `person` | name, role, city, timezone (drives the live clock), email, phone, portrait path, CV path |
| `hero` | headline lines (wrap a word in `*stars*` for the italic accent), intro, CTA labels, marquee words |
| `about` | statement, story paragraphs, mission, vision, values, toolkit, languages |
| `services` | title, text, tags, icon (`brand`, `web`, `motion`, `art`, `photo`) |
| `projects` | title, category, year, role, tools, summary, details, **cover style + palette** or your own `image` |
| `experience` | roles, studios, years |
| `process`, `testimonials` | steps and quotes (the testimonials are samples — replace with real ones before publishing) |
| `contact`, `socials` | heading, text, form endpoint, social URLs |

The "At a glance" numbers on the About section are **calculated from your content** (project count, services, skills, languages), so they can never be out of date or invented.

### 2. Use real project images
In any project, set `image: "assets/images/projects/my-project.jpg"`. It replaces the generated cover everywhere (grid, list preview, modal). Without an image, a cover is drawn from the project's `style` (`arches`, `dunes`, `rings`, `lines`, `blocks`, `burst`, `halftone`, `type`) and `palette`.

### 3. Use your own photo
Save it as `assets/images/portrait.jpg` and set `portrait: "assets/images/portrait.jpg"` in `content.js`. A 3:4 portrait works best.

### 4. Also update in `index.html`
Search engines and social platforms read the static HTML, so change these once:
- `<title>`, `meta name="description"`, `meta name="author"`
- the `og:` and `twitter:` tags (use full `https://…` URLs for `og:image` once deployed)
- the JSON-LD `Person` block in `<head>`
- the `aria-label` on the logo link (it names "Tariq Ziad")

### 5. Make the contact form send real messages
The form validates and shows a success state, but **it does not send anything on its own**. While `contact.formEndpoint` is empty, the success message says so honestly and offers a button to send the message from the visitor's email app.

To receive messages, create a form on a service such as Formspree or Basin and paste its URL:
```js
contact: { formEndpoint: "https://formspree.io/f/your-id", … }
```

---

## Features
- Animated loader, staggered hero entrance, mouse-parallax mountain scene
- Sticky glass header with a sliding active-section indicator and scroll-progress bar
- Full-screen mobile menu (focus-managed, `Esc` to close)
- Light / dark theme (remembers choice, follows system preference)
- Scroll-reveal animations, scroll-lit statement text, animated counters
- Project gallery: category filtering with FLIP animation, grid ↔ list views, floating image preview
- Project modal: keyboard navigation (← → Esc), prev/next, "start a similar project" prefills the form
- Draggable, keyboard-accessible testimonial slider
- Accessible form validation with inline errors and a honeypot field
- Copy-email button, live local-time clock, back-to-top with progress ring
- Custom cursor and magnetic buttons (fine-pointer devices only)
- Respects `prefers-reduced-motion`; works at 320 px → 4K with no horizontal scroll

## Colours & type
Design tokens are CSS variables at the top of `css/style.css` (`--bg`, `--ink`, `--accent`, `--saffron`, `--pine` …). Fonts: **Fraunces** (display), **Hanken Grotesk** (text), **JetBrains Mono** (labels), loaded from Google Fonts with sensible system fallbacks if offline.
