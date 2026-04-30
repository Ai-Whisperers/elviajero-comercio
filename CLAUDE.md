# El Viajero — AI Agent Guide

Standalone Next.js 15 app at **https://viajero.paragu-ai.com**.
Outdoor/camping/fishing e-commerce store in Asuncion (est. 2018).

## Quick Links
- **Live:** https://viajero.paragu-ai.com
- **Repo:** github.com/Ai-Whisperers/elviajero-comercio
- **Docker service:** elviajero-comercio_web (2 replicas)
- **VPS:** 72.61.44.159
- **Traefik:** viajero.paragu-ai.com → elviajero-comercio_web:3000

## Architecture

User → Cloudflare (SSL) → VPS → Traefik → elviajero-comercio_web:3000

## Pages (12, all static)

| Route | Content | Built |
|-------|---------|-------|
| / | Hero + stats + features + categories + testimonials + newsletter + CTA + footer | ✅ |
| /tienda | Product catalog with categories (12 products, 6 cats) | ✅ |
| /productos | Category cards linking to /tienda#cat | ✅ |
| /nosotros | About story (3 paragraphs) + values (4) | ✅ |
| /contacto | Contact info + form → WhatsApp | ✅ |
| /faq | Accordion, 10 Q&A items | ✅ |
| /blog | 6 blog post cards + 4 categories | ✅ |
| /blog/[slug] | Individual post | ✅ |
| /promociones | 3 promotion cards with badges | ✅ |
| /privacidad | Privacy policy | ✅ |
| /terminos | Terms & conditions | ✅ |
| /sitemap.xml | SEO sitemap | ✅ |

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| --color-primary | #1B5E20 | Buttons, headings, hero bg |
| --color-secondary | #37474F | Footer bg |
| --color-accent | #E65100 | Badges, promo bg |
| --color-background | #FAFAFA | Page bg |
| --color-surface | #FFFFFF | Cards |
| --color-foreground | #1A1A2E | Body text |
| --color-muted-foreground | #6B7280 | Secondary text |

## Content

**Editable file:** `content/es.json` — 505 lines, all text/pricing/products/FAQ.

Key sections:
- `home.hero` — headline + CTAs
- `home.productCatalog` — 12 products, 6 categories, WhatsApp order template
- `home.features` — 6 feature cards
- `home.testimonials` — 4 real client reviews
- `home.finalCta` — bottom CTA
- `faq` — title, hero, 10 items
- `promociones.promotions` — 3 promotions

## Build & Deploy

```bash
npm run build                          # Build Next.js
docker build -t elviajero-comercio:prod .
docker stack deploy -c docker-compose.yml elviajero-comercio --detach=false
```

**AFTER content changes** in content/es.json, the app imports it at build time. Run `npm run build` + rebuild Docker image.

## Critical Patterns

1. **No PAB paths** — all links use standalone routes (/, /tienda, /faq, etc.)
2. **Content-driven pages** — every page reads from content/es.json
3. **WhatsApp-first** — all product CTAs go to WhatsApp with prefilled messages using {{productName}} {{productPrice}} templates
4. **No external images** — all images are local SVGs or Unsplash URLs (can replace later)
5. **Light theme** — green + orange on white bg, outdoor/fresh feel
