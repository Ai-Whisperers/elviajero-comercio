# Dayah LitWorks — AI Agent Guide

This is a **standalone Next.js 15 app** at **https://dayah.paragu-ai.com**.
Book cover design studio (Daihana Araujo, Asunción, est. 2019).

## Quick Links

- **Live site:** https://dayah.paragu-ai.com
- **GitHub:** https://github.com/Ai-Whisperers/dayah-litworks
- **Docker service:** `dayah-litworks_web` (Docker Swarm, port 3000)
- **Traefik labels:** Host(`dayah.paragu-ai.com`), auto SSL via LetsEncrypt
- **VPS IP:** 72.61.44.159 (same as paragu-ai-builder, different Docker service)
- **Old PAB path:** `/s/es/dayah-litworks` → 308 redirects to `/`

## Architecture

```
Cloudflare (DNS, SSL, CDN)
  └── dayah.paragu-ai.com A → 72.61.44.159 (proxied)
        └── Traefik (Docker Swarm, port 443 → 3000)
              └── dayah-litworks_web (Next.js standalone, port 3000)
```

**Independent from paragu-ai-builder.** Changes here NEVER affect other clients.

## Repository Structure

```
dayah-litworks/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home — hero, stats, services, portfolio, testimonials, process, CTA
│   ├── servicios/page.tsx        # Services + FAQ
│   ├── catalogo/page.tsx         # Portfolio with genre filter
│   ├── sobre/page.tsx            # About Daihana
│   ├── faq/page.tsx              # All FAQ items (accordion)
│   ├── contacto/page.tsx         # Contact cards (email, WhatsApp, Instagram)
│   ├── blog/page.tsx             # Blog index (5 posts)
│   ├── blog/[slug]/page.tsx      # Individual blog post
│   ├── privacidad/page.tsx       # Privacy policy
│   ├── terminos/page.tsx         # Terms with Daihana's 7 conditions
│   ├── not-found.tsx             # Custom 404 page
│   ├── layout.tsx                # Root layout (fonts, metadata, OG image)
│   ├── globals.css               # Tailwind v4 + @theme with brand colors
│   └── favicon.ico               # SVG favicon
├── components/                   # Section components (all standalone)
│   ├── header.tsx                # Sticky header with nav + locale toggle
│   ├── hero-section.tsx          # NOT USED — hero is inline in app/page.tsx
│   ├── stats.tsx                 # Stats counter grid
│   ├── services-section.tsx      # Services with dual-currency (USD+PYG), grouped by category
│   ├── portfolio-filtered.tsx    # Portfolio grid with genre filter buttons
│   ├── testimonials.tsx          # Testimonial cards 2x2 grid
│   ├── process.tsx               # Timeline with gradient connector
│   ├── faq.tsx                   # OLD — not imported anymore
│   ├── faq-section.tsx           # FAQ accordion (used)
│   ├── cta-banner.tsx            # Gradient CTA banner
│   ├── footer.tsx                # Dark footer with gradient border
│   ├── blog-card.tsx             # Blog post card
│   └── whatsapp-float.tsx        # Floating WhatsApp button (green, fixed position)
│   └── ui/
│       ├── button.tsx            # shadcn-based (CVA variants)
│       ├── badge.tsx             # shadcn-based
│       └── card.tsx              # shadcn-based
├── content/                      # ALL content (no database)
│   ├── es.json                   # Spanish content (62KB, 564 data points)
│   ├── en.json                   # English translation (59KB)
│   ├── tokens.json               # Design tokens (colors, components)
│   └── blog/                     # 5 markdown blog posts
│       ├── guia-de-tipografia-para-autores.md
│       ├── teoria-del-color-para-portadas-de-libros.md
│       ├── consejos-de-diseno-de-portadas-de-libros.md
│       ├── marketing-para-autores-independientes.md
│       └── antes-y-despues-de-redesignar-portadas-de-libros.md
├── lib/
│   ├── engine.ts                 # Content resolution (dot-path getter + placeholder fill)
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
├── public/
│   └── images/covers/            # 32 images (11 real JPGs + 13 SVGs + 8 misc)
├── next.config.ts                # output: standalone, redirects /s/* → /
├── Dockerfile                    # Multi-stage Next.js standalone build
├── docker-compose.yml            # Swarm stack with Traefik labels
└── package.json                  # Deps: next, react, lucide-react, clsx, framer-motion
```

## Content Architecture

All content is in `content/es.json`. No database, no external API. Structure:

```json
{
  "home": {
    "hero": { "headline": "...", "subheadline": "...", "ctaPrimaryText": "...", "backgroundImage": "/images/...", "overlayColor": "rgba(10,10,20,0.88)" },
    "stats": { "items": [{ "value": "+80", "label": "Proyectos entregados" }] },
    "services": { "title": "Nuestros Servicios", "items": [{ "name": "...", "priceUSD": "$45", "pricePYG": "₲300.000", "delivery": "1–2 semanas", "includes": ["..."] }] },
    "portfolio": { "title": "Trabajos Recientes", "items": [{ "title": "...", "imageUrl": "/images/...", "category": "Romance" }] },
    "testimonials": { "title": "Lo que dicen mis clientes", "items": [{ "text": "...", "author": "María González", "rating": 5 }] },
    "process": { "title": "Proceso", "steps": [{ "number": 1, "title": "...", "description": "..." }] },
    "faq": { "items": [{ "q": "¿Cuánto tarda?", "a": "..." }] }
  },
  "ctaBanner": { "title": "¿Listo para tu próxima portada?", "buttonText": "Quiero mi portada", "buttonHref": "https://wa.me/595986868241" },
  "footer": { "email": "dayahlitworks@gmail.com" }
}
```

## Design System (Tailwind CSS v4 @theme)

Defined in `app/globals.css`:

```css
@theme {
  --color-primary: #94abd6;
  --color-secondary: #d43d5e;
  --color-background: #0a0a14;
  --color-surface: #11132a;
  --color-surface-light: #1b2040;
  --color-foreground: #eaeaea;
  --color-muted-foreground: #a0aac8;
  --color-border: #1b2040;
}
```

Fonts: Playfair Display (headings, 800 weight) + Inter (body, 400 weight).

## Image Assets

| Category | Count | Type | Resolution |
|----------|-------|------|------------|
| Real cover JPGs | 11 | Client's actual work | 600×900 (book ratio) |
| Gradient premade SVGs | 6 | Real cover art with brand gradient | SVG vector |
| Gradient placeholder SVGs | 8 | "COVER / Dayah LitWorks" fallback | SVG vector |
| Service card SVGs | 4 | Service illustrations (unused, for future) | SVG vector |
| Brand assets | 4 | logo-blanco.svg, hero-bg.svg, dlw-master.png, og-dayah.png | — |

Real covers are referenced in BOTH `home.portfolio.items[].imageUrl` (home page) AND `home.products.items[].imageUrl` (catalog page). SVG placeholders are only in `home.products.items[].image` (catalog fallback).

## Services (8 items, 3 categories)

- **Portadas Personalizadas** (3): eBook $45/₲300K, Paperback $80/₲500K, Combo $120/₲800K
- **Portadas Premade** (2): eBook $35/₲250K, Combo $80/₲500K
- **Maquetación Interior** (3): eBook $25/₲160K, Paperback $35/₲250K, Combo $50/₲320K

## Build & Deploy

```bash
# Build
npm run build

# Docker
docker build -t dayah-litworks:prod .
docker service update --force dayah-litworks_web

# Quick deploy (from repo root)
docker build -t dayah-litworks:prod . && docker service update --force dayah-litworks_web
```

## CRITICAL PATTERNS

### When adding content
- Edit `content/es.json` (Spanish) and `content/en.json` (English)
- Rerun `npm run build` + rebuild Docker
- Content changes are STATIC — no database, no API

### When adding a page
1. Create `app/[page-name]/page.tsx`
2. Import Header, Footer, WhatsAppFloat
3. Import content with `import content from "@/content/es.json"`
4. Wire data using dot-path access: `content.home?.services?.items`

### When adding a section component
1. Create `components/[name].tsx`
2. Import into the page that needs it
3. Pass content data as props
4. For client-side interactivity (filters, accordions), add `'use client'`

### Image paths
- Always use `/images/covers/[filename]` (Next.js serves from `public/images/covers/`)
- Never use `/sites/...` paths (those are for the old PAB)
- First 4 portfolio images use `loading="eager"` + `fetchPriority="high"`
- Cover images use `aspect-[2/3]` for proper book proportions
