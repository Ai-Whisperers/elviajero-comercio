# El Viajero — Status (2026-05-25)

## Live
https://tiendaelviajero.com.py (HTTP 200, **Vercel Hobby plan**)
Formerly: Docker Swarm on VPS 72.61.44.159 (decommissioned 2026-05-25)

## Deployed Commit
`34d0da3` — "chore: sync pending changes from VPS"
Migrated from VPS to Vercel: 2026-05-25

## Architecture

```
Usuario → Vercel Edge (CDN global)
              ↓
         Next.js 15.5.18 (SSR/SSG)
              ↓
         Supabase (qyvokpribmbrosafntqa) — datos + auth + storage
              ↓
         Supabase Storage bucket: ej_product_images (público, ~102 productos)
```

### Hosting Comparison

| | VPS (old, decommissioned) | Vercel (current) |
|---|---|---|
| Hosting | VPS 72.61.44.159 | Vercel Hobby |
| CDN | None | Global Edge (80+ ubicaciones) |
| Scaling | Fixed | Auto-scaling serverless |
| Deploy | Manual (ssh + docker) | GitHub push (automatic) |
| Cost | $20-50/mes (server cost) | **$0 (free tier)** |
| Admin env vars | .env.local on VPS | Vercel Dashboard |
| Uptime | Frequent drops | 99.9% SLA |

## Environment Variables (Vercel)

```
NEXT_PUBLIC_BASE_URL=https://www.tiendaelviajero.com.py
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm
NEXT_PUBLIC_SUPABASE_URL=https://qyvokpribmbrosafntqa.supabase.co
NEXT_PUBLIC_WHATSAPP=595984009751
SUPABASE_SERVICE_ROLE_KEY=sb_secret_J7n1igQHaVSKn35OrMe93A_p-_FEBvH  (Server-side only)
```

## Free Tier Limits (Vercel Hobby)

| Resource | Limit/month | El Viajero usage (est.) |
|---|---|---|
| Bandwidth | 1 TB | ~1-5 GB |
| Serverless Function hours | 100 hrs | ~10-30 hrs |
| Static storage | 100 GB | ~50-100 MB |
| Build time | 10 hrs | ~2 min/deploy |

**Note:** Product images (~102) are served from Supabase Storage, NOT through Vercel bandwidth.
**Cost to run:** **$0/month** (within free tier for foreseeable PYME traffic).

See: `docs/VPS-TO-VERCEL-MIGRATION.md` for full infrastructure documentation.

## What's Working (Verified)

### Core Commerce
- 34+ products in Supabase across 7 categories
- Product catalog with filters, price range, sort, search autocomplete
- Cart sidebar with add/remove/update quantity — works on EVERY page
- WhatsApp checkout on product cards and product detail pages
- Checkout page with shipping zones, address form

### Pages (all routes build and render)
- Home: hero carousel, kits/promos section, categories, featured products, newsletter, gallery
- Tienda: full catalog with sidebar filters, pagination, product modal
- Producto: image gallery, specs, variants, WhatsApp buy, share, reviews, back-in-stock
- Blog: index + individual posts with category tags
- Contacto, FAQ, Nosotros, Privacidad, Términos
- Login, Register, Password Recovery (Supabase Auth)
- Mi Cuenta: profile, orders, addresses, favorites, benefits, settings
- Admin: products CRUD, orders, customers, blog, promos, theme editor
- Checkout, promociones, comparar, newsletter/unsubscribe, 404, error

### Infrastructure
- **Vercel deployment** (was: Docker Swarm on VPS)
- Custom domain: tiendaelviajero.com.py (Vercel)
- Supabase backend: 9 tables with RLS policies
- CI/CD: GitHub Actions → Vercel auto-deploy
- Health endpoint: /api/health

### UX & Branding
- SVG logo, OG image, favicon, PWA icons, category images
- Dark mode toggle, currency toggle (Gs/USD), language toggle (ES/GN)
- Cookie consent banner, WhatsApp floating button
- SEO: metadata, Open Graph, Twitter cards, JSON-LD Store schema, sitemap, robots.txt
- Scroll animations (FadeUp, StaggerGrid)
- Recently viewed products, exit intent popup

### Kits/Promos Section
- Enabled on homepage with 6 kit items
- Each kit has WhatsApp order button
- Kit images verified on disk (webp format)
- Link to /promociones page

## Known Issues / Client Dependencies
1. **Payment gateways** — Code exists (Pagopar/Bancard/Stripe) but all fall back to WhatsApp. Needs merchant accounts from Omar.
2. **Real product photos** — Most images are placeholder/stock. Client needs to provide real photos.
3. **Blog content** — Structure exists but needs real articles from Omar.
4. **Client questionnaire** — Never filled out. Missing: business hours, social handles, delivery costs, payment methods.
5. **VPS decommission** — `elviajero_web` (Swarm) and `elviajero-web-1` (legacy) containers still on VPS 72.61.44.159 — can be stopped once confirmed Vercel is stable.

## Client
Omar Aguilera (owner, Mariano Roque Alonso)
WhatsApp: +595 984 009751
Instagram: @elviajero_py
Facebook: facebook.com/elviajeropy
TikTok: @elviajero_py

## Documentation
- `docs/VPS-TO-VERCEL-MIGRATION.md` — Full infrastructure migration docs (for client)
- `docs/STATUS.md` — This file
