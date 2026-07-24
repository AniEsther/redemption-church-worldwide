# The Redemption Church Worldwide — Website

A modern, animated, fully responsive church website built with **React 18 + Vite + Tailwind CSS**.

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Structure

- `src/pages` — one file per route (Home, About, Pastors, Ministries, Sermons, Events, Gallery, Contact, Give, Prayer Request, Testimonies)
- `src/components` — shared UI: Navbar, Footer, PageHero, Reveal (scroll animation), Counter (stat count-up), Countdown, BibleVerse, ScrollToTop, WhatsAppButton, Loader
- `src/data/content.js` — all church copy, service times, sermons, events, testimonials, and gallery images in one place — edit this file to update site content
- `tailwind.config.js` — brand tokens (brown / gold / ivory / ink palette, Playfair Display + Cinzel + Inter type system)

## Customizing

- **Church details, bank info, service times:** edit `src/data/content.js`
- **Colors:** edit the `brown` / `gold` palette in `tailwind.config.js`
- **Images:** gallery and hero images currently use Unsplash placeholder URLs — swap in your own church photography by replacing the URLs in `content.js` and `Home.jsx`
- **WhatsApp number:** update the link in `src/components/WhatsAppButton.jsx`
- **Google Map:** update the embed query in `Home.jsx` / `Contact.jsx` iframe `src`

## Notes

- Dark mode toggle is in the navbar (persists only for the session).
- Forms (Contact, Prayer Request, Newsletter) are front-end only — wire them to your email service, Formspree, or a backend endpoint to actually send data.
- Respects `prefers-reduced-motion` for accessibility.
