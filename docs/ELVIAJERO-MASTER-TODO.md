# El Viajero — Master Todo List

> Consolidated from: upgrade-plan-2026-05-08, reunion-cliente-2026-05-13, client-onboarding.md, STATUS.md, live site audit.
> Last updated: 2026-05-13

---

## QUICK WINS (< 1h total)

| # | Task | Files | Est. |
|---|------|-------|------|
| Q1 | Fix homepage stats (currently show 0) | `content/es.json` home.stats.items | 5m |
| Q2 | Remove /productos nav duplicate (consolidate to /tienda) | `components/header.tsx` line 19 | 2m |
| Q3 | Move CartProvider to root layout so cart works on ALL pages | `app/layout.tsx` | 5m |
| Q4 | Add ToastProvider to root layout | `app/layout.tsx` | 2m |
| Q5 | Fix admin dashboard stats query (uses `products`, should be `ej_products`) | `app/admin/page.tsx` | 5m |
| Q6 | Update WhatsApp number from placeholder to real (if client provides) | `content/es.json`, `config/site.json` | 5m |
| Q7 | Add breadcrumbs to /tienda and /producto/[slug] | `components/pages/tienda-content.tsx`, `components/pages/product-content.tsx` | 20m |
| Q8 | Re-enable /api/health endpoint or fix if broken | `app/api/health/route.ts` | 5m |
| Q9 | Add Product JSON-LD schema to /producto/[slug] | `components/pages/product-content.tsx` | 10m |
| | **Total** | | **~59m** |

---

## CRITICAL BUGS (block production)

| # | Task | Details | Files |
|---|------|---------|-------|
| C1 | **Cart broken on non-tienda pages** | CartProvider not in root layout → any page with <Header> but without CartProvider crashes | `app/layout.tsx` |
| C2 | **Stats show 0 everywhere** | Hero stats read from `content/es.json` which has placeholder zeros | `content/es.json` |
| C3 | **No real product photos** | All products use SVG/PNG illustrations. Trust-killer. Need real photos from client or stock. | `content/es.json` product.imageUrl |
| C4 | **No payment gateway connected** | Pagopar/Bancard/Stripe code exists but all fall back to WhatsApp due to missing API keys | `.env.local` |
| C5 | **WhatsApp uses placeholder number** | All CTAs point to +595981234567 | `content/es.json`, `config/site.json` |
| C6 | **Admin panel "fla roto"** | Something broke this morning during changes. Price editing demo worked but something broke. | Investigate |

---

## CLIENT-DELIVERABLES (waiting on client input)

| # | Item | Who | Depends On |
|---|------|-----|------------|
| D1 | **Real WhatsApp Business number** | Omar | None |
| D2 | **Real phone number** | Omar | None |
| D3 | **Social handles** (IG, FB, TikTok, YT) | Client | None |
| D4 | **Store hours** (open/close daily) | Client | None |
| D5 | **Delivery costs** (local + interior) | Client | None |
| D6 | **Free shipping threshold** (Gs.) | Client | None |
| D7 | **Real product photos** (~130 products) | Client | D9 (product list) |
| D8 | **Product master list** (Excel/Google Sheet) | Client | None |
| D9 | **Top 5 best-sellers** | Client | None |
| D10 | **Pagopar merchant account + API keys** | Client | None |
| D11 | **Bancard merchant account + API keys** | Client | None |
| D12 | **Logo** — client provides source material, we process with AI | Client (future session) | Future session |
| D13 | **Product images** — client provides photos, we enhance with AI | Client (future session) | Future session |
| D14 | **Logo trademark registration** | Client | D12 |
| D14 | **Testimonials / reviews from real customers** | Client | None |
| D15 | **Client email for transactional emails (Resend)** | Client | None |


---

## NEW FEATURES FROM MEETING (May 13)

### PRIORITY HIGH — Must ship with launch

| # | Feature | Spec | Files |
|---|---------|------|-------|
| F1 | **WhatsApp Direct Button per product** | Each product card + detail page shows "Consultar por WhatsApp" alongside "Agregar al carrito". Opens WA with prefilled message: product name, price, link. | `components/pages/tienda-content.tsx`, `components/pages/product-content.tsx` |
| F2 | **WhatsApp Checkout from cart** | Cart summary shows "Checkout por WhatsApp" button. Generates formatted WA message: all items, quantities, subtotals, total, customer data (name, phone, city, RUC). Sends to client's WhatsApp Business. | `components/cart-sidebar.tsx`, `app/checkout/page.tsx` |
| F3 | **Order creation on WA checkout** | When customer clicks "Confirmar pedido" → creates order in Supabase (status: pending) → sends WA message to client. | `lib/orders.ts`, `app/api/orders/route.ts` |
| F4 | **Order management in admin** | Admin can mark orders: Confirmado / Cancelado / Enviado / Pagado. Status change → stock auto-updates. | `app/admin/pedidos/` |
| F5 | **Kits / Promos carousel (new section)** | Section below hero on homepage. Manual-advance carousel (arrow clicks only, no auto-rotate). Each slide: image + name + price → WA inquiry. Content managed from admin. | `app/page.tsx`, `components/kits-carousel.tsx` |
| F6 | **Admin-editable carousel images** | Hero carousel images should be changeable from admin panel (currently only text is editable). | Admin content editor |

### PRIORITY MEDIUM — Ship within 1 week of launch

| # | Feature | Spec |
|---|---------|------|
| F7 | **Real blog content** | Replace AI-generated blog posts with client's real stories. Client records audio → transcribe → IA writes → publish. Each post has map + related products. |
| F8 | **Travel consulting CTA** | "Planificá tu viaje con nosotros" → WhatsApp. Separate revenue stream. |
| F9 | **Blog → product linking** | Each blog post shows related products at bottom. Buyable via WA. |
| F10 | **Product bulk import from Excel** | Client has ~130 products in Excel/Sheets. Script to import: read sheet → match images → create in Supabase. |
| F11 | **AI-assisted product descriptions** | Import script uses IA to generate descriptions from minimal specs. |

### PRIORITY LOW — Post-launch v2

| # | Feature | Spec |
|---|---------|------|
| F12 | **Interactive route maps** | Google Maps embedded with fishing/camping spots. Each spot shows recommended products. |
| F13 | **User accounts + loyalty** | Optional accounts with first-purchase discount, loyalty points. |
| F14 | **Pagopar/Bancard online payment** | Activate when client provides credentials. |
| F15 | **Order tracking portal** | Customer-facing `/pedido/buscar` with real lookup by ID/phone. |
| F16 | **Invoice generation (SIFEN)** | Paraguayan electronic invoicing compliance. |
| F17 | **Mobile bottom nav** | Quick access: Home, Tienda, Carrito, Cuenta, WhatsApp. |
| F18 | **Free-shipping threshold bar** | Progress bar in cart showing how close to free shipping. |
| F19 | **Low-stock / agotado badges** | Show stock status on product cards. |

---

## ADMIN PANEL WORK

| # | Task | Priority |
|---|------|----------|
| A1 | **Fix broken thing from this morning** | 🔥 Critical |
| A2 | Fix stats dashboard query (uses wrong table name) | HIGH |
| A3 | Make carousel images admin-editable | HIGH |
| A4 | Add order management UI (confirm/cancel/ship/pay) | HIGH |
| A5 | Add kits/promos management in admin | HIGH |
| A6 | Add blog post creation UI | MEDIUM |
| A7 | Add bulk product import UI | MEDIUM |
| A8 | Add sales reports dashboard | MEDIUM |
| A9 | Add customer list with order history | MEDIUM |
| A10 | Add stock alerts management | LOW |

---

## INFRASTRUCTURE & DEVOPS

| # | Task | Status |
|---|------|--------|
| I1 | **DNS propagation** — MaxiDominio → Cloudflare → Hostinger | ⏳ Waiting on MaxiDominio ticket |
| I2 | **SSL cert** — via Cloudflare (auto) | ⏳ After DNS |
| I3 | **Domain verification** — `tiendaelviajero.com.py` resolves | ⏳ After DNS |
| I4 | **Traefik config** for production domain | ✅ Done (in deploy) |
| I5 | **Docker Swarm** — 2 replicas running | ✅ Done |

| I7 | **GA4** — add real measurement ID | MEDIUM |
| I8 | **Resend** — add API key for transactional emails | MEDIUM |
| I9 | **Supabase** — confirm branch is on production, not develop | Verify |
| I10 | **Database backup** — configure automated backups | MEDIUM |

---

## WHAT IS DONE (verified)

### Code/Infra
- [x] All 79 pages render (200 OK) at el-viajero.paragu-ai.com
- [x] Supabase schema: 9+ tables, RLS policies, seeded data
- [x] Auth: login/register/forgot-password, admin role check
- [x] Admin panel: products CRUD, orders, customers, promos, blog, theme
- [x] Cart system: add/remove, sidebar, localStorage persistence
- [x] Checkout flow: address form, shipping zones, order creation
- [x] Product catalog: 34 products, 7 categories, brand/price filters, sort
- [x] Search: overlay with autocomplete, debounced
- [x] i18n: ES/EN/GN, PYG/USD toggle
- [x] Dark mode toggle
- [x] Homepage: hero carousel (5 slides), stats, featured, testimonials, newsletter
- [x] SEO: Open Graph, Twitter cards, JSON-LD, sitemap, robots.txt, PWA manifest
- [x] Design: green #1B5E20 + orange #E65100, Inter, responsive
- [x] Docker: 2 replicas in Swarm, healthcheck, Traefik
- [x] WhatsApp float button site-wide

### Client Meeting (May 13)
- [x] Logo feedback collected (minimalist, Paraguay-authentic, circular-crop friendly)
- [x] Logo selected (the one with Paraguayan landscape)
- [x] DNS email sent to MaxiDominio (CC included)
- [x] New leads identified: Rocío (gym), Valentina (recetarios), campaign season
- [x] Client gave sales/pricing strategy consultation (publish tiered prices, target students, paid ads)
- [x] Architecture explained and accepted (Cloudflare → Hostinger → Docker → IA)

---

## ROADMAP TIMELINE

```
NOW ──────────────────────────────────────────────────────────────────►

PRE-LAUNCH                        LAUNCH                          POST-LAUNCH
┌─────────────────────┐    ┌──────────────────┐    ┌──────────────────────────┐
│ Q1-Q9 Quick wins    │    │ DNS propagates   │    │ Real blog content         │
│ C1-C6 Critical bugs │    │ tiendaelviajero  │    │ Route maps                │
│ D1-D16 Client input │    │ .com.py LIVE     │    │ User accounts + loyalty   │
│ F1-F6 New features  │    │                  │    │ Pagopar/Bancard live       │
│ A1 Admin fix        │    │                  │    │ SIFEN invoices            │
│ I6 Change password  │    │                  │    │ Mass outreach to leads    │
│ I9 Verify Supabase  │    │                  │    │ Gym template → Rocío      │
└─────────────────────┘    └──────────────────┘    └──────────────────────────┘
     Days 1-3                    Day 3-5                  Week 2-4
```

---

## SHORT INSTRUCTIONS FOR DEVELOPER

Start with `Q1-Q9` (quick wins, ~1h), then `C1-C6` (critical bugs), then `F1-F6` (new features from meeting). Client deliverables `D1-D16` need to be chased — they block launch. The DNS `I1` is the hard blocker — once MaxiDominio responds, domain goes live.
