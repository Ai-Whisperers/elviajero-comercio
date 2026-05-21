# El Viajero — Upgrade Plan (2026-05-08)

> Prepared for: Omar Aguilera
> Live site: https://el-viajero.paragu-ai.com
> Report for: Kiki / Hermes Agent

---

## 1. ALREADY DONE (from git log)

- [x] **Logo & Branding** — SVG logo, PNG OG image, favicon, PWA icons, hero banners, category SVGs
- [x] **Admin Panel** — Full redesign with emerald/zinc theme, sidebar, Lucide icons, loading states, skeletons, DataTable, bulk import, search, pagination
- [x] **Auth** — Supabase Auth (email/password), custom login/register pages, admin role check, session persistence, password reset route
- [x] **Supabase Migration** — Full schema (ej_products, ej_orders, ej_reviews, ej_categories, ej_promo_codes, etc.), 34 seeded products, RLS policies
- [x] **Refactoring** — Auth context split (4 modules), header split (5 subcomponents), admin layout split, payment gateway factory, DB CRUD factory, storage-keys, types extraction, supabase client cleanup
- [x] **Cart System** — CartContext + CartProvider with localStorage persistence, cart badge, cart sidebar, "Agregar" button on /tienda, save-for-later, toast notifications, share cart, reorder button
- [x] **Checkout Page** — Full checkout flow with shipping zones, address form, Supabase order creation, Pagopar/Bancard/Stripe/WhatsApp gateway routing
- [x] **Product Detail Page** — `/producto/[slug]` route with image gallery, add-to-cart, quantity selector, WhatsApp inquiry, Product schema JSON-LD
- [x] **Search** — Search overlay with autocomplete, product name/brand search, debounced
- [x] **Admin Features** — Products (CRUD + bulk), orders (CRUD), customers, reviews, promos, content editor, blog, categories, B2B, theme editor, stats dashboard, subscribers, enrich AI
- [x] **Homepage** — Hero carousel (5 slides), animated stats, new arrivals grid, featured products, testimonials, category icons, features section, newsletter, WhatsApp float
- [x] **SEO** — MetadataBase, Open Graph, Twitter cards, JSON-LD (Store schema), sitemap, Google/Facebook verification, PWA manifest
- [x] **Internationalization** — ES/EN/GN toggles, PYG/USD currency toggle
- [x] **Design** — Brand colors (green #1B5E20, accent #E65100), Inter fonts, dark mode, responsive

---

## 2. CRITICAL BUGS (block production readiness)

### B1. [CRITICAL] CartProvider not in root layout — add-to-cart broken on homepage

**Problem:** `CartProvider` is only wrapped around `/tienda`, `/producto/[slug]`, `/checkout`, and `/` (homepage). It is NOT in `app/layout.tsx`. The `<CartBadge>` component in the header calls `useCart()` directly. Any page that includes `<Header>` but isn't wrapped with `CartProvider` will crash at runtime (e.g. `/blog`, `/nosotros`, `/contacto`, `/faq`, `/promociones`, `/login`, `/register`, `/admin/*`, `/mi-cuenta/*`, `/categoria/*`, `/recuperar`, etc.).

**Fix:** Move `CartProvider` wrapping from individual page wrappers into `app/layout.tsx`.

**File:** `app/layout.tsx` lines 75-78

```diff
  <body>
    <ErrorBoundary>
-     <CurrencyProvider>{children}</CurrencyProvider>
+     <CurrencyProvider>
+       <CartProvider>
+         <ToastProvider>
+           {children}
+         </ToastProvider>
+       </CartProvider>
+     </CurrencyProvider>
    </ErrorBoundary>
  </body>
```

**Status:** [ ] NOT DONE

---

### B2. [CRITICAL] Stats show 0 on homepage

**Problem:** The stats section on the homepage (`/app/page.tsx` lines 38, 92-102) reads from `content/es.json` static data. The JSON has placeholder values like `"0"` for categories, products, clients, and Paraguay. No Supabase query runs to count real data.

**Files:** `app/page.tsx` line 38, `content/es.json` home.stats.items

**Fix:** Replace static stats with real Supabase counts, or update the JSON with real numbers.

**Status:** [ ] NOT DONE

---

### B3. [CRITICAL] Product images are still placeholders (SVG/PNG illustrations)

**Problem:** Products use generated illustration images (`/images/marketing/products/*.png`) rather than real product photos. This kills trust for first-time visitors. The detail page also lacks a real image gallery.

**Files:** `content/es.json` product.imageUrl fields, `public/images/marketing/products/*.png`

**Status:** [ ] NOT DONE

---

### B4. [CRITICAL] No payment gateways connected — all fall back to WhatsApp

**Problem:** The checkout API (`app/api/checkout/route.ts`) has full code for Pagopar, Bancard, and Stripe, but all three fall back to WhatsApp when their API keys are missing. The `.env` file lacks real `PAGOPAR_PUBLIC_KEY`, `PAGOPAR_PRIVATE_KEY`, `BANCARD_PUBLIC_KEY`, `BANCARD_PRIVATE_KEY`, and `STRIPE_SECRET_KEY`. Customers cannot pay online — they can only order via WhatsApp inquiry.

**Files:** `app/api/checkout/route.ts` lines 41-48, 82-88, 117-123

**Status:** [ ] NOT DONE

---

### B5. [CRITICAL] Search redirect / misrouting — navigation has "/productos" route pointing nowhere

**Problem:** The header nav includes a `/productos` link (line 19 of `components/header.tsx`) that routes to `/app/productos/page.tsx`, which is likely a redirect or empty page. This confuses customers. The search overlay works but may misroute search results.

**Files:** `components/header.tsx` line 19, `app/productos/page.tsx`

**Status:** [ ] NOT DONE (needs investigation)

---

## 3. HIGH PRIORITY IMPROVEMENTS

### H1. Move CartProvider to root layout
Same as B1 above — this is the single highest-impact fix.

**Files:** `app/layout.tsx`

---

### H2. Fix homepage stats with real numbers
Update `content/es.json` with actual store data (e.g., +200 productos, +150 clientes, 7 categorías, Paraguay-wide delivery).

**Files:** `content/es.json` home.stats.items

---

### H3. Add real product photos
Replace placeholder PNG illustrations with real product photos. Either:
- Upload real photos to Supabase storage bucket (`ej_product_images`)
- Use high-quality Unsplash/stock photos as temporary replacements
- Enable admin image upload (the bucket and component exist but are untested)

**Files:** `content/es.json` product.imageUrl fields, admin image upload component

---

### H4. Connect at least one payment gateway (Pagopar priority #1)
Pagopar is the dominant payment method in Paraguay. Omar needs to:
1. Create a Pagopar merchant account
2. Add `PAGOPAR_PUBLIC_KEY` and `PAGOPAR_PRIVATE_KEY` to `.env.local` and `docker-compose.yml`
3. Test the checkout flow end-to-end

**Files:** `app/api/checkout/route.ts`, `.env.local`

---

### H5. Fix admin dashboard stats
Admin dashboard (`/admin`) shows 0 for users, products, orders, revenue because it queries the `products` table instead of `ej_products`.

**Files:** `app/admin/page.tsx` line 7

---

### H6. Add CartProvider + CartSidebar to layout so cart works everywhere
See B1. This ensures the cart badge in the header doesn't crash on any page, and the cart sidebar is accessible site-wide.

---

### H7. Remove duplicate /productos nav link or redirect to /tienda
The nav has both "Tienda" and "Productos" pointing to different routes. Consolidate.

**Files:** `components/header.tsx` line 19

---

### H8. Enable passwordless/guest checkout
Current flow forces account creation. Add guest checkout option and/or WhatsApp-only ordering without registration.

**Files:** `app/checkout/page.tsx`, `app/login/page.tsx`

---

### H9. Add real phone number and WhatsApp number to config
Update `config/site.json` and `content/es.json` with Omar's real phone and WhatsApp number.

**Files:** `config/site.json`, `content/es.json`

---

### H10. Configure Google Analytics (GA4)
GA4 is referenced in code but uses placeholder ID. Add real `NEXT_PUBLIC_GA_ID`.

**Files:** `.env.local`, `docker-compose.yml`

---

## 4. MEDIUM PRIORITY IMPROVEMENTS

### M1. Enable Google/Facebook OAuth in Supabase
Buttons show but OAuth isn't configured. Omar needs to add Client ID/Secret in Supabase dashboard.

**Files:** Supabase Dashboard > Auth Providers

---

### M2. Add real phone number to WhatsApp CTAs
All WhatsApp links use placeholder `595981234567`. Replace with Omar's real number.

**Files:** `content/es.json`, `config/site.json`, various components

---

### M3. Set up email sending (Resend)
Cart recovery, order confirmations, and password reset emails need a configured Resend API key.

**Files:** `.env.local` → add `RESEND_API_KEY`

---

### M4. Add breadcrumbs to all pages
No breadcrumb navigation exists. Add for SEO and UX, especially on /producto/[slug] and /tienda.

---

### M5. Add structured data for products (Product schema)
Only Store schema exists. Each product page should have Product schema with price, availability, image.

**Files:** `components/pages/product-content.tsx` (already partially done — verify)

---

### M6. Add low-stock and "agotado" badges to product cards
The tienda page already has stock badge code but it needs stock data populated in the DB.

**Files:** `components/pages/tienda-content.tsx` lines 28-33

---

### M7. Add free-shipping threshold progress bar in cart
Show how close the customer is to free shipping based on cart total vs thresholds in config.

**Files:** `components/cart-sidebar.tsx`

---

### M8. Add invoice generation for Paraguayan SIFEN compliance
Paraguay requires electronic invoicing (factura electrónica). This is needed before scaling.

---

### M9. Add order tracking portal for customers
Customer-facing page at `/pedido/buscar` exists but needs real order lookup by ID/phone.

**Files:** `components/order-tracking-form.tsx`

---

### M10. Add mobile bottom navigation bar
Standard in LatAm e-commerce. Quick access to: Home, Tienda, Carrito, Cuenta, WhatsApp.

---

## 5. CHECKLIST SUMMARY

| Priority | Item | Status |
|----------|------|--------|
| CRITICAL | CartProvider in root layout (`app/layout.tsx`) | [ ] NOT DONE |
| CRITICAL | Homepage stats show 0 (`content/es.json`) | [ ] NOT DONE |
| CRITICAL | Real product photos (replace SVGs/illustrations) | [ ] NOT DONE |
| CRITICAL | Connect payment gateway (Pagopar/Bancard keys) | [ ] NOT DONE |
| CRITICAL | Fix /productos nav duplicate or misroute | [ ] NOT DONE |
| HIGH | Admin dashboard stats querying wrong table | [ ] NOT DONE |
| HIGH | Cart accessible site-wide | [ ] NOT DONE |
| HIGH | Real phone/WhatsApp numbers in config | [ ] NOT DONE |
| HIGH | Guest checkout / WhatsApp-only ordering | [ ] NOT DONE |
| HIGH | GA4 configuration | [ ] NOT DONE |
| MEDIUM | Google/Facebook OAuth setup | [ ] NOT DONE |
| MEDIUM | WhatsApp CTA numbers | [ ] NOT DONE |
| MEDIUM | Email sending (Resend API key) | [ ] NOT DONE |
| MEDIUM | Breadcrumbs | [ ] NOT DONE |
| MEDIUM | Product schema JSON-LD | [ ] PARTIALLY DONE |
| MEDIUM | Low-stock / agotado badges | [ ] EXISTS IN CODE, NEEDS DATA |
| MEDIUM | Free-shipping progress bar | [ ] NOT DONE |
| MEDIUM | Invoice generation (SIFEN) | [ ] NOT DONE |
| MEDIUM | Order tracking portal | [ ] NOT DONE |
| MEDIUM | Mobile bottom nav bar | [ ] NOT DONE |

---

## QUICK WINS (can be done in <1 hour total)

1. **Fix homepage stats** — edit `content/es.json` lines with real numbers (5 min)
2. **Fix /productos nav** — remove duplicate link in `components/header.tsx` (2 min)
3. **Add CartProvider to layout** — 4 lines in `app/layout.tsx` (5 min)
4. **Update phone numbers** — edit `content/es.json` and `config/site.json` (5 min)
5. **Add breadcrumbs** to tienda and product pages (20 min)
6. **Fix admin stats query** — change `products` to `ej_products` in `app/admin/page.tsx` (5 min)

**Total quick wins:** ~42 minutes → site goes from "broken" to "demo-ready"

---

*Generated by Hermes Agent on 2026-05-08. Based on analysis of git log, live site, and codebase documentation.*
