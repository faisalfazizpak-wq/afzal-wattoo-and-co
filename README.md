# Afzal Wattoo & Co. — Pitch Website

Personal-brand website for **Afzal Wattoo** (Afzal Wattoo & Co.), Etihad Town
Phase 4 specialist, Lahore — built around his face value, his team, and the
Etihad Town Phase 4 installment plans, so his social-media audience
(@afzalwattooofficial, ~120K followers) can turn into WhatsApp leads.

> This is a pitch/demo website prepared for Afzal Wattoo & Co. Prices and the
> payment plan follow the published Etihad Town Phase 4 plan and are subject
> to change — final rates are confirmed at booking.

## Design

- **Blue + white** SERHANT-style clean editorial design: deep navy `#0A2A6B` /
  royal `#123E8F` on white, huge bold headlines (Archivo), small uppercase
  labels, thin dividers, lots of whitespace.
- Afzal's real photos throughout (Porsche photo as the Home hero; office
  portrait on About / Team).
- Animations: logo preloader, page-transition wipe, scroll reveals, animated
  counters, hero 3D tilt — all in plain CSS/JS + GSAP (CDN).

## Multi-page structure

A true multi-page static site — each page is a real, separate HTML file that
shares one stylesheet and one script:

| File | Page |
| --- | --- |
| `index.html` | Home — hero, counters, explore cards, Phase 5 teaser |
| `about.html` | About Afzal — his story, timeline, awards |
| `etihad-town-phase-4.html` | Etihad Town Phase 4 — location, interactive plot-size explorer |
| `payment-plans.html` | Payment Plans — full plan table + **interactive installment calculator** |
| `team.html` | Team — Afzal Wattoo, Shahid Wattoo (Director Sales & Marketing), core team |
| `videos.html` | Videos & Social — reels carousel, Instagram / TikTok / Facebook |
| `contact.html` | Contact — Book a Deal form (opens the enquiry in WhatsApp) |
| `assets/styles.css` | Shared stylesheet for all pages |
| `assets/app.js` | Shared script (calculator, counters, reveals, menu, form) |

Images are inlined as data URIs inside the HTML/CSS, so the repository is
fully self-contained text — no binary assets to manage.

## Tech

Plain **HTML + CSS + JavaScript** — no build step, no framework, no server
code. Fonts (Archivo / Manrope) and GSAP load from public CDNs; everything
else works offline.

## How to open / deploy

- **Locally:** just open `index.html` in a browser, or serve the folder with
  any static server, e.g. `python3 -m http.server` and visit
  `http://localhost:8000`.
- **Deploy:** drop the whole folder onto any static host — GitHub Pages,
  Netlify, Vercel, Cloudflare Pages, or plain web hosting. No configuration
  needed; `index.html` is the entry point.

## Etihad Town Phase 4 — published plan (3 years)

20% booking · 10% balloting · 30 monthly installments of 1% · 4 balloon
payments of 5% · 20% on possession.

| Size | Total | Booking (20%) | Monthly (1%) |
| --- | --- | --- | --- |
| 5 Marla | PKR 59,00,000 | PKR 11,80,000 | PKR 59,000 |
| 10 Marla | PKR 1,05,00,000 | PKR 21,00,000 | PKR 1,05,000 |
| 1 Kanal | PKR 2,10,00,000 | PKR 42,00,000 | PKR 2,10,000 |
| 2 Kanal | PKR 3,80,00,000 | PKR 76,00,000 | PKR 3,80,000 |

Location: Pine Avenue & Chenab Road, Lahore — next to Lake City, ~5 minutes
from Ring Road (Halloki Interchange).
