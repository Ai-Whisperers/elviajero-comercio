# El Viajero — Status (2026-05-21)

## Live
https://tiendaelviajero.com.py (HTTP 200, Docker Swarm, Traefik reverse proxy)

## Deployed Commit
`c871551` — Unified site shell, honest stats, cart works on all pages

## What's Working (Verified)

### Core Commerce
- 34+ products in Supabase across 7 categories
- Product catalog with filters, price range, sort, search autocomplete
- Cart sidebar with add/remove/update quantity — works on EVERY page (not just homepage)
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
- Docker Swarm deployment with Traefik reverse proxy
- Custom domain: tiendaelviajero.com.py (Max Domain DNS)
- Supabase backend: 9 tables with RLS policies
- CI/CD: GitHub Actions (typecheck → test → build → docker validate)
- Staging workflow ready (needs DNS + secrets)
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
5. **Staging environment** — CI workflow ready, needs DNS record and GitHub secrets configured.

## Client Name
Omar Aguilera (owner, Mariano Roque Alonso)

## WhatsApp
+595 984 009751 (hardcoded, needs client confirmation)

## Social Handles
- Instagram: @elviajero_py
- Facebook: facebook.com/elviajeropy
- TikTok: @elviajero_py
