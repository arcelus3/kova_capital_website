# Kova Capital — Website README

Single-page, bilingual (ES / EN) landing site for Kova Capital.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Page structure and markup |
| `styles.css` | All styles (mobile-first, responsive) |
| `script.js` | i18n, scroll reveal, nav, form logic |
| `copy.json` | **All copy in both languages** — edit here, not in HTML |
| `hero.jpg` | Hero background photo (placeholder — replace with final) |
| `README.md` | This file |

---

## How to run locally

Open `index.html` directly in a browser **or** serve it with any static server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

---

## How to swap the hero photo

1. Prepare a high-resolution photo (minimum 1600 × 900 px, JPEG or WebP).
   - Preferred content: a clean Mexican industrial setting — warehouse interior, HVAC technician at work, facility management context. **No stock photos of suited men shaking hands.**
2. Name the file `hero.jpg` (or `hero.webp`) and place it in the same directory as `index.html`.
3. If you use a different filename, update the `<img src="...">` inside the `.hero-media` div in `index.html`.

---

## How to add Santiago's photo

1. Place a portrait photo (minimum 600 × 800 px) in the project directory, e.g. `santiago.jpg`.
2. In `index.html`, find the `.profile-photo-placeholder` div and replace it with:

```html
<img
  src="santiago.jpg"
  alt="Santiago Arcelus Ortega — Fundador y Searcher, Kova Capital"
  class="profile-photo"
  loading="lazy"
/>
```

3. Add this CSS rule to `styles.css`:

```css
.profile-photo {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: calc(var(--radius) + 2px);
}
```

---

## How to add institution / LP logos

### Background institution logos (next to Santiago's bio)

1. Place logo files (SVG preferred, or PNG with transparent background) in the project directory.
2. In `index.html`, find the `.profile-logos` div and replace each `.institution-logo-placeholder` with:

```html
<img src="kartoi-logo.svg" alt="Kartoi" class="institution-logo" height="36" loading="lazy" />
```

3. Add CSS:

```css
.institution-logo {
  height: 36px;
  width: auto;
  opacity: 0.7;
  filter: grayscale(1);
  transition: opacity 0.2s ease, filter 0.2s ease;
}
.institution-logo:hover { opacity: 1; filter: none; }
```

### LP / investor logos

Same process — find the `.lp-logos` div and replace `.lp-logo-placeholder` elements with `<img>` tags.

---

## How to edit copy

All text content lives in `copy.json`. The file has two top-level keys: `"es"` and `"en"`.

- Edit the Spanish copy under `"es"`.
- Edit the English copy under `"en"`.
- **Do not change the key names** (e.g. `"hero.headline"`) — only change the values.
- After saving, reload the page in the browser.

Example:

```json
"hero": {
  "headline": "Compramos una empresa mexicana. Una sola. Para dirigirla durante los próximos diez años.",
  ...
}
```

---

## How to connect the contact form

The form currently posts to `/api/contact` as a placeholder. To make it functional:

### Option A — Formspree (simplest, no backend needed)

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form and copy the endpoint URL (e.g. `https://formspree.io/f/abcdefgh`).
3. In `script.js`, find this line:

```js
const res = await fetch('/api/contact', {
```

Replace `/api/contact` with your Formspree URL:

```js
const res = await fetch('https://formspree.io/f/abcdefgh', {
```

### Option B — Netlify Forms

If deploying on Netlify, add `netlify` attribute to the form tag in `index.html`:

```html
<form class="contact-form" id="contact-form" name="contact" netlify novalidate>
```

Then update the fetch URL in `script.js` to post to `"/"` with a `form-name` field.

### Option C — Custom backend / serverless function

Point the fetch URL to your own endpoint. The form sends JSON with these fields:
`nombre`, `empresa`, `sector`, `contacto`, `mensaje`, `lang`.

---

## How to update the WhatsApp link

In `index.html`, find:

```html
<a href="https://wa.me/521XXXXXXXXXX" ...>
```

Replace `521XXXXXXXXXX` with Santiago's full international number (country code + number, no spaces or dashes). Example for a Mexico City number: `5215512345678`.

---

## How to update the LinkedIn URL

In `index.html`, find:

```html
<a href="https://linkedin.com/in/santiago-arcelus" ...>
```

Replace with the correct LinkedIn profile URL.

---

## Deployment

The site is a fully static set of files — no build step required.

Deploy to any static host:
- **Netlify**: drag-and-drop the folder at [app.netlify.com](https://app.netlify.com)
- **Vercel**: `npx vercel` in the project directory
- **GitHub Pages**: push to a repo and enable Pages in Settings
- **Any web host**: upload all files to the public root directory

---

## Palette reference

| Token | Hex | Usage |
|---|---|---|
| Navy | `#0E1B2C` | Primary background, text |
| Off-white | `#F6F2EC` | Light background, hero text |
| Copper | `#C4855A` | Accent, labels, CTAs |

---

## Three clarifying questions before v2

Before the next iteration, please confirm:

1. **Brand color**: The current palette uses deep navy + off-white + copper/terracotta. Is this the direction you want, or do you have a specific brand color in mind?
2. **Hero photography**: Should we keep the current warehouse placeholder, or do you have a specific photo (or photographer brief) you'd like to use?
3. **LP logos**: Do you have logos and names ready to publish, or should the placeholder blocks remain for now?
