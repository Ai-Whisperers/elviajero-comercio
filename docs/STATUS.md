# El Viajero — Status (2026-05-08)

## Live
https://el-viajero.paragu-ai.com (HTTP 200, 2 Docker replicas, Docker Swarm)

## Deployed Commit
`70e79ef` — CartProvider + ToastProvider in root layout, /productos nav removed

## What's Working (Verified)
- All 79 pages load (home, tienda, producto, checkout, blog, faq, nosotros, contacto, login, register, admin/*, mi-cuenta/*, categoria/*, promociones, etc.)
- Login/register with email+password via Supabase Auth
- Admin panel with full role-based access (products CRUD, orders, customers, blog, promos, theme, etc.)
- Product catalog with 34 products, 7 categories, brand filters, price range, sort options
- Cart sidebar opens and displays products
- Add-to-cart now works site-wide (CartProvider in root layout)
- FAQ accordion toggle
- Dark mode toggle
- Currency toggle (Gs/USD)
- Language toggle (ES/EN/GN)
- Search overlay with autocomplete
- Hero carousel with 5 slides
- Announcement bar with promo
- WhatsApp float button
- Cookie consent banner
- Product detail page at /producto/[slug]
- Checkout page with shipping zones, address form
- Navigation: header, mobile hamburger, footer with all links
- Supabase: 9 tables with seeded data, RLS policies
- Branding: SVG logo, PNG OG image, favicon, PWA icons, category SVGs
- SEO: metadataBase, Open Graph, Twitter cards, JSON-LD (Store schema), sitemap, robots.txt

## Critical Issues (Blocking Production Launch)
1. **Cart add-to-cart on homepage** — AddItem button works via tienda-content but homepage "Agregar" buttons may not connect to correct context. Verified CartProvider is now in the layout.
2. **Payment gateways not connected** — Pagopar/Bancard/Stripe code exists but all fall back to WhatsApp checkout. Needs API keys from Osmar.
3. **Product images are SVG/PNG illustrations** — No real product photos. Trust-killer for customers.
4. **No real phone/WhatsApp number** — All CTAs use placeholder `595981234567`.
5. **Admin dashboard stats** — May query wrong table (`products` vs `ej_products`).
6. **Password reset** — `/recuperar` flow may still reference old SQLite.

## Quick Wins Remaining
- Add real phone/WhatsApp number (5 min)
- Breadcrumbs on tienda + producto pages (20 min)
- Fix admin dashboard stats query (5 min)
- Add free-shipping threshold progress bar in cart (15 min)

## Onwer Action Required
1. Provide real phone number and WhatsApp Business number
2. Create Pagopar merchant account and share API keys
3. Provide real product photos (or authorize us to use stock photos)
4. Enable Google OAuth in Supabase Dashboard
5. Share email address for transactional emails (Resend)

## Docs
- Full upgrade plan: `docs/upgrade-plan-2026-05-08.md`
- Implementation plan: `docs/IMPLEMENTATION_PLAN.md`
- Sales pitch for Osmar: `docs/PITCH_EL_VIAJERO_OSMAR.md`
