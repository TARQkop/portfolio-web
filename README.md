# Alex Morgan Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Responsive-Design-0A0A0A?style=for-the-badge" alt="Responsive design" />
  <img src="https://img.shields.io/badge/Status-Portfolio%20Template-4CAF50?style=for-the-badge" alt="Portfolio template" />
</p>

A premium personal portfolio website built with HTML, CSS, and vanilla JavaScript. The project is designed to present creative work, brand identity, web design, motion, and digital storytelling in a modern editorial layout.

## Preview

Open the site directly in a browser:

```bash
index.html
```

Or run a local web server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Features

- Premium editorial-style portfolio layout
- Fully responsive design for mobile, tablet, and desktop
- Dark and light theme support
- Smooth scrolling and subtle motion effects
- Interactive project filtering and modal gallery
- Custom SVG illustrations and branded visual system
- Accessible navigation and mobile menu behavior
- Contact form UX with validation and email fallback
- No framework or build dependency required

## Project Structure

```text
alex-morgan-portfolio/
├── index.html              # Main page structure and meta tags
├── README.md               # Project documentation
├── css/
│   └── style.css           # Styles, theme system, and responsive layout
├── js/
│   ├── content.js          # Personal info, portfolio content, projects, services
│   ├── art.js              # Generative artwork and SVG visuals
│   └── script.js           # Rendering logic and interactivity
├── assets/
│   └── images/
│       ├── portrait.svg    # Placeholder portrait image
│       ├── favicon.svg     # Browser tab icon
│       ├── og-cover.png    # Social share image
│       └── ...
└── ...
```

## Quick Start

1. Clone the repository
2. Open `index.html` in your browser, or run a local server
3. Edit the content in `js/content.js`
4. Replace placeholder assets in `assets/images/`
5. Update SEO metadata in `index.html`

## Customization

### Personal details
Edit `js/content.js` to update:

- Name and title
- Email, phone, city, and location
- Hero text and call-to-action buttons
- About section and mission statement
- Services, projects, and testimonials
- Social profiles and contact links

### Replace placeholder media
Update these files with your own branding assets:

- `assets/images/portrait.svg`
- `assets/images/favicon.svg`
- `assets/images/og-cover.png`

### SEO and social tags
Customize the metadata in `index.html`:

- Page title
- Meta description
- Open Graph tags
- Twitter card settings
- JSON-LD structured data

## Deployment

This is a static portfolio, so it can be deployed easily to:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting provider

Example for GitHub Pages:

```bash
git add .
git commit -m "Initial portfolio release"
git push origin main
```

Then enable GitHub Pages in your repository settings.

## Notes

This project currently uses demo or placeholder content. Before publishing, replace the sample text, images, and portfolio entries with your real work and contact information.

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- SVG graphics
- Google Fonts

## License

This project is provided for personal or portfolio use. You are free to adapt it for your own website or portfolio project.

## Contact

For questions or collaboration opportunities, update the contact information inside `js/content.js` and ensure the form is connected to your preferred service such as Formspree, Basin, or your own backend endpoint.

---

<p align="center">
  <strong>Built for showcasing creative work and personal branding.</strong>
</p>
