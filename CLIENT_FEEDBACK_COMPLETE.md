# El Viajero - Complete Client Feedback & Requirements Tracker

**Client:** El Viajero (Tienda El Viajero)
**Contact:** WhatsApp +595 984 009751
**Live URLs:** https://el-viajero.paragu-ai.com | https://viajero.paragu-ai.com
**Repo:** /root/elviajero (elviajero-comercio on GitHub)
**Stack:** Next.js 15, Tailwind 4, TypeScript, Supabase (ej_products, ej_orders, etc.)
**Maturity:** HIGH - 107 components, full e-commerce, admin panel

---

## LAST UPDATED: 2026-05-19

---

## ✅ RESOLVED ISSUES

### 1. 🚨 Product Page 500 Error (FIXED 2026-05-19)
**Status:** ✅ RESOLVED
**Reported by:** User via error message + console logs
**Issue:** Product pages showing "Error del servidor" + React error #310 (infinite re-render loop)
**Root Cause:** `createClient()` called on every render, creating new Supabase reference. useEffect had `[supabase]` dependency → infinite loop
**Fix Applied:** Changed useEffect dependency from `[supabase]` to `[]` so it runs once on mount
**Files Modified:** `components/pages/product-content.tsx`
**Deployed:** Commit `1ab554e`, pushed to GitHub, GitHub Actions deploying

---

## ⚠️ CRITICAL ISSUES (Not Yet Addressed)

### C1. 🖼️ Image Performance - 133MB Unoptimized PNGs
**Source:** CRO Roast (2026-05-12)
**Impact:** HIGH - Users on 3G/4G connections download 30+ MB just to load catalog = 25+ seconds white space, abandoned site
**Current State:** 82 PNG images, 0 WebP files, product images are 1.4–2.9 MB each
**Fix Required:**
- Convert all to WebP format
- Serve via `<picture>` with `srcset`
- Add `loading="lazy"`
- Target <100KB per product image
**Estimated Effort:** 4-6 hours

### C2. 🏗️ Dual Data Source Chaos
**Source:** CRO Roast (2026-05-12)
**Impact:** MEDIUM - If Supabase is slow/down, products shown may not match actual inventory
**Current State:**
- Tries Supabase DB first, silently falls back to static JSON on error
- No error handling in fallback
- Prices stored as formatted strings ("Gs. 450.000") requiring regex parsing everywhere
**Fix Required:**
- Store prices as integers (cents/guaraníes)
- Parse once, format for display only
- Proper error handling for Supabase queries (display error to user)
**Estimated Effort:** 2-4 hours

### C3. 🛒 Checkout Problems
**Source:** CRO Roast (2026-05-12)
**Impact:** HIGH - Customers can't complete purchase online
**Current State:**
- Hardcoded WhatsApp number (`595981234567`) in checkout page
- "WhatsApp/Transferencia" is DEFAULT payment - redirects user to WhatsApp instead of completing checkout
- Bancard/PagoPar listed but minimal implementation
- No form validation - user can submit empty order
**Fix Required:**
- Extract WhatsApp number to env/config (not hardcoded)
- Implement real payment gateway completion flow (no redirect to WhatsApp)
- Add form validation before proceeding to Step 3
**Estimated Effort:** 4-8 hours

### C4. 🔍 Search & Filters Bug
**Source:** CRO Roast (2026-05-12)
**Impact:** MEDIUM - Brand filter literally doesn't work
**Current State:**
- Filter component has `setTimeout` callback hack (anti-pattern)
- `useMemo` missing `brandFilter` and `pricePreset` in dependency array
- Creates flash of unfiltered content, race conditions on rapid filter changes
**Fix Required:**
- Remove `setTimeout` callback, return from `useMemo` properly
- Add `brandFilter, pricePreset` to dependency array
**Estimated Effort:** 2-3 hours

### C5. 📱 SEO - No Metadata on Tienda/Product Pages
**Source:** CRO Roast (2026-05-12)
**Impact:** HIGH - Invisible to Google Shopping, Product rich results, basic SERP visibility
**Current State:**
- Tienda page exports no metadata
- No `<title>`, no meta description, no Open Graph
- Product pages lack `generateMetadata()`
- Only SEO is in root layout (generic "El Viajero — Tu Aventura Empieza Acá")
**Fix Required:**
- Add `generateMetadata()` to tienda page with CollectionPage schema
- Add `generateMetadata()` to all product pages with Product schema (price, availability, image, offers)
**Estimated Effort:** 3-5 hours

### C6. 🧭 Navigation Confusion
**Source:** CRO Roast (2026-05-12) + Upgrade Plan
**Impact:** LOW - Confusing routing
**Current State:**
- `es.json` has TWO navigation arrays:
  - "items" with Productos → /productos
  - "ui" with Tienda → /tienda
- User sees "Tienda" in nav but breadcrumb leads nowhere useful
**Fix Required:**
- Remove duplicate /productos nav link or redirect properly
- Consolidate to single nav structure
**Estimated Effort:** 1 hour

### C7. 💰 Price String Parsing Hell
**Source:** CRO Roast (2026-05-12)
**Impact:** MEDIUM - Brittle, locale-dependent, prone to breaking
**Current State:**
- Every price stored as "Gs. 450.000" string with thousand separators
- Requires `parseInt(s.replace(/[^\d]/g, ""))` everywhere
- Used in: filters, product cards, checkout, price comparisons
**Fix Required:**
- Store prices as integers in DB
- Parse once at display layer, format with proper locale
**Estimated Effort:** 2-3 hours

### C8. 🏛️ CartProvider Not in Root Layout
**Source:** Upgrade Plan (2026-05-08)
**Impact:** HIGH - Cart crashes on non-wrapped pages
**Current State:**
- `CartProvider` only wrapped around `/tienda`, `/producto/[slug]`, `/checkout`, `/`
- `<CartBadge>` in header calls `useCart()` directly
- Pages like `/blog`, `/nosotros`, `/contacto`, `/faq`, `/admin/*`, `/mi-cuenta/*`, `/categoria/*` crash at runtime
**Fix Required:**
- Move `CartProvider` wrapping from individual page wrappers into `app/layout.tsx`
**Estimated Effort:** 30 minutes

### C9. 📊 Admin Dashboard Stats Query Wrong Table
**Source:** Upgrade Plan (2026-05-08)
**Impact:** MEDIUM - Admin stats show 0
**Current State:**
- Admin dashboard queries `products` table instead of `ej_products`
- All pages should use `ej_products` (Supabase migrated schema)
**Fix Required:**
- Change query from `products` to `ej_products` in `/app/admin/page.tsx` line 7
**Estimated Effort:** 10 minutes

### C10. 🖼️ Product Images are Still Illustrations
**Source:** CRO Roast + Upgrade Plan
**Impact:** HIGH - Trust killer for customers
**Current State:**
- Products use generated illustration images (`/images/marketing/products/*.png`)
- No real product photos from client
- Placeholder SVGs instead of photos
**Fix Required:**
- Replace with real product photos
- OR enable admin image upload to Supabase storage bucket (`ej_product_images`)
- OR use high-quality Unsplash stock photos as temporary
**Estimated Effort:** Depends on client (4-8 hours)

### C11. 💳 No Payment Gateways Connected
**Source:** Upgrade Plan + STATUS.md
**Impact:** HIGH - Customers cannot pay online
**Current State:**
- Checkout API has code for Pagopar, Bancard, Stripe
- All three fall back to WhatsApp when API keys are missing
- `.env` file lacks real `PAGOPAR_PUBLIC_KEY`, `PAGOPAR_PRIVATE_KEY`, `BANCARD_PUBLIC_KEY`, `BANCARD_PRIVATE_KEY`, `STRIPE_SECRET_KEY`
**Fix Required:**
- Get real payment gateway API keys from Osmar
- Add to `.env.local` and `docker-compose.yml`
- Test end-to-end checkout flow
**Estimated Effort:** Depends on Osmar (2-4 hours)

### C12. 📞 Real Phone/WhatsApp Numbers Missing
**Source:** Upgrade Plan + STATUS.md
**Impact:** HIGH - Customers can't call the store
**Current State:**
- All CTAs use placeholder `595981234567`
- WhatsApp button uses hardcoded number
**Fix Required:**
- Update `config/site.json` and `content/es.json` with real numbers
**Estimated Effort:** 10 minutes

---

## 🔴 CRITICAL INFRASTRUCTURE ISSUES

### I1. CartProvider Scope Problem
**Status:** 🚨 URGENT
**Impact:** Cart functionality broken on all pages except /tienda, /producto, /checkout, /
**Fix:** Move CartProvider to `app/layout.tsx` (C8 above)

### I2. Supabase vs SQLite Dual Database
**Status:** 🚨 URGENT for production
**Current State:**
- Supabase migration completed (ej_products, ej_orders, etc.)
- But some code may still reference SQLite `data/viajero.db`
**Fix:**
- Audit all code paths for SQLite references
- Ensure all DB calls use Supabase client
**Estimated Effort:** 2-4 hours

---

## 🎯 FEATURE REQUESTS (From Build Wishlist)

### F1. Supabase Migration (Completed)
**Status:** ✅ DONE
**Details:** Full schema with RLS policies, 34 seeded products, 9 tables migrated

### F2. Real Payment Gateway
**Priority:** HIGH
**Details:** Bancard vPOS integration - complete checkout flow without WhatsApp redirect
**Estimated Effort:** 4-8 hours (requires API keys from Osmar)

### F3. Stock Sync System
**Priority:** MEDIUM
**Details:** Reconcile online store with physical shop inventory
**Estimated Effort:** 8-12 hours

### F4. Auto-order to WhatsApp
**Priority:** MEDIUM
**Details:** New orders → auto-forward to shop WhatsApp (+595981234567)
**Estimated Effort:** 4-6 hours

### F5. Delivery Tracking
**Priority:** MEDIUM
**Details:** Real-time courier integration
**Estimated Effort:** 6-10 hours

### F6. Product Variant Matrix
**Priority:** MEDIUM
**Details:** Size × color × material × price per variant
**Estimated Effort:** 8-12 hours

---

## ✅ WHAT'S WORKING

### Full E-commerce Flow
- Cart sidebar with add/remove/quantities/multi-select/merger
- Checkout with shipping zones, address form, Supabase order creation
- Payment gateway routing (Pagopar/Bancard/Stripe/WhatsApp)
- Orders with status tracking
- Shipping calculator (COD, pickup, delivery zones)
- Coupons (percentage/fixed), BOGO, bundle discounts
- Order confirmation with WhatsApp notification

### Admin Panel
- Full dashboard with sidebar navigation
- Products CRUD (create, read, update, delete) + bulk import
- Orders management (view, status updates, export)
- Categories management
- Customers management
- Coupons/Promo codes management
- Reviews management
- Blog editor
- Theme editor
- Subscribers management
- Enrich AI features
- Stats dashboard
- Activity log

### SEO
- MetadataBase for root layout
- Open Graph tags
- Twitter cards
- JSON-LD (Store schema, Product schema)
- Sitemap generation
- robots.txt
- Google/Facebook verification

### UX Features
- Dark mode toggle
- Currency toggle (PYG/USD)
- Language toggle (ES/EN/GN)
- Cookie consent
- Search overlay with autocomplete
- Hero carousel (5 slides)
- Announcement bar with promo
- WhatsApp float button
- Product comparison
- Recently viewed
- Wishlist
- Back-in-stock notifications
- Exit intent popup
- Abandoned cart recovery

### Auth System
- Email + password via Supabase Auth
- Custom login/register pages
- Admin role check
- Session persistence
- Password reset flow (/recuperar)

### Navigation
- Header with mobile hamburger
- Footer with all links
- Category icons
- Bottom mobile navigation

---

## 🎨 BRANDING & DESIGN ISSUES

### D1. Logo Problems
**Source:** Brutal Asset Critique
**Current:** 200x60 SVG, Poppins font (not on most systems), tiny 28px icon, generic mountain gradient
**Issues:**
- Icon too small for mobile
- Font fallback issues
- Generic outdoor store look (not camping/travel specific)
- Green-to-blue gradient wrong for brand
**Fix Required:** Complete redesign as outlined in upgrade plan
**Estimated Effort:** 1 hour

### D2. Favicon
**Current:** Green rounded rect with "EV" text, looks like generic app icon
**Fix Required:** Mountain peak + tent icon @64x64, must be recognizable at 16x16
**Estimated Effort:** 30 minutes

### D3. OG Image
**Current:** 1200x630 gradient, "EV" in white rounded box, emoji in OG images
**Fix Required:** Real brand photography or polished illustration with proper typography hierarchy
**Estimated Effort:** 1-2 hours

### D4. Category SVGs
**Current:** 400x267 SVGs with emoji text, 20% opacity backgrounds make photos barely visible
**Fix Required:** Replace with high-contrast photo-realistic backgrounds, darker tones for 20% opacity visibility
**Estimated Effort:** 2 hours

### D5. Category Hero Banners
**Current:** Photorealistic-style PNGs (1920x600), gradient sky + bokeh circles, no actual subjects
**Fix Required:** Real product photos or AI-generated images with actual subjects (tents, fishing rods, etc.)
**Estimated Effort:** 4-6 hours

### D6. PWA Icons
**Current:** Simple green rounded rect, generated programmatically, jagged edges, no anti-aliasing
**Fix Required:** Properly rendered SVG → PNG conversion at correct sizes, or dedicated PWA icon set
**Estimated Effort:** 1 hour

---

## 📊 PRIORITY FIX LIST (by revenue impact)

| Priority | Item | Status | Effort | Impact |
|----------|------|--------|--------|---------|
| P0 | CartProvider to root layout (I1) | NOT DONE | 30 min | HIGH - Cart crashes on all non-wrapped pages |
| P0 | Product page 500 error (FIXED) | ✅ DONE | 10 min | HIGH - Customers couldn't view products |
| P1 | Image performance - WebP conversion | NOT DONE | 4-6h | HIGH - Mobile users abandon site (30s load) |
| P1 | SEO metadata on tienda + product pages | NOT DONE | 3-5h | HIGH - Invisible to search engines |
| P2 | Real payment gateway connection | NOT DONE | 4-8h | HIGH - Customers can't pay online |
| P2 | Fix dual data source chaos | NOT DONE | 2-4h | MEDIUM - Wrong products shown on Supabase error |
| P2 | Real product photos | NOT DONE | 4-8h | HIGH - Trust killer for customers |
| P2 | Search/filter bug fix | NOT DONE | 2-3h | MEDIUM - Brand filter broken |
| P2 | Checkout form validation | NOT DONE | 2-3h | MEDIUM - Empty orders submitted |
| P3 | Navigation confusion cleanup | NOT DONE | 1h | LOW - Confusing routing |
| P3 | Admin dashboard stats query | NOT DONE | 10 min | MEDIUM - Stats show 0 |
| P3 | Real phone/WhatsApp numbers | NOT DONE | 10 min | HIGH - Customers can't call store |
| P3 | Price storage as integers | NOT DONE | 2-3h | MEDIUM - Brittle parsing, prone to break |
| P4 | Guest checkout / WhatsApp-only | NOT DONE | 4-6h | MEDIUM - Force account creation |
| P4 | Breadcrumbs on pages | NOT DONE | 20 min | MEDIUM - Better UX/SEO |
| P4 | Stock sync system | NOT DONE | 8-12h | MEDIUM - Inventory accuracy |
| P4 | Auto-order to WhatsApp | NOT DONE | 4-6h | MEDIUM - Order automation |
| P4 | Delivery tracking | NOT DONE | 6-10h | MEDIUM - Customer experience |
| P4 | Product variant matrix | NOT DONE | 8-12h | MEDIUM - SKU management |
| P5 | Logo redesign | NOT DONE | 1h | MEDIUM - Brand identity |
| P5 | Favicon fix | NOT DONE | 30 min | LOW - Browser tab visibility |
| P5 | OG image redesign | NOT DONE | 1-2h | HIGH - Social sharing quality |
| P5 | Category banners | NOT DONE | 4-6h | MEDIUM - Visual appeal |
| P5 | PWA icons | NOT DONE | 1h | LOW - Home screen quality |
| P6 | Free-shipping progress bar | NOT DONE | 30 min | LOW - Cart UX improvement |
| P6 | Invoice generation (SIFEN) | NOT DONE | 4h | MEDIUM - Paraguay compliance |
| P6 | Order tracking portal | NOT DONE | 3h | LOW - Customer self-service |
| P6 | Mobile bottom nav bar | NOT DONE | 2h | LOW - Standard LatAm e-commerce |

---

## 📝 IMMEDIATE ACTION REQUIRED

### NOW (This Week)
1. **CartProvider to root layout** - 30 min
   - File: `app/layout.tsx`
   - Move CartProvider wrap from page level to root
   - Test cart works on all pages (blog, contact, faq, admin, etc.)

2. **Real phone/WhatsApp numbers** - 10 min
   - Update `config/site.json` with Osmar's real numbers
   - Update `content/es.json` phone numbers
   - Test WhatsApp float button

3. **Homepage stats fix** - 5 min
   - Update `app/admin/page.tsx` line 7 to query `ej_products` instead of `products`

### THIS WEEK (High Priority)
4. **Image optimization** - 4-6h
   - Convert all 82 PNG images to WebP
   - Compress to <100KB per image
   - Add `loading="lazy"` and `srcset`

5. **SEO metadata** - 3-5h
   - Add `generateMetadata()` to `/app/tienda/page.tsx`
   - Add `generateMetadata()` to `/app/producto/[slug]/page.tsx`
   - Include Product schema, CollectionPage schema

6. **Search/filter bug fix** - 2-3h
   - Fix `components/pages/tienda-content.tsx` useMemo dependencies
   - Remove `setTimeout` callback hack

7. **Checkout form validation** - 2-3h
   - Add client-side validation before proceeding to Step 3

8. **Price storage refactor** - 2-3h
   - Store prices as integers in Supabase
   - Parse once at display layer

### NEXT WEEK (Medium Priority)
9. **Payment gateway connection** - 4-8h (requires Osmar API keys)
10. **Real product photos** - 4-8h (from client)
11. **Stock sync system** - 8-12h
12. **Auto-order to WhatsApp** - 4-6h
13. **Delivery tracking** - 6-10h
14. **Breadcrumbs** - 20 min
15. **Guest checkout** - 4-6h

---

## 📋 CLIENT-PROVIDED DATA STILL NEEDED

### From Osmar
- Real phone number(s) for store
- Real WhatsApp Business number for auto-order forwarding
- Pagopar merchant account API keys (public + private)
- Bancard vPOS API keys (if using Bancard)

### From Osmar / Client
- Real product photos (34 products)
- Storefront photography for /nosotros page
- Real customer testimonials for homepage
- Any branded assets they have

---

## 📚️ DOCUMENTATION REFERENCE

- `/root/elviajero/docs/upgrade-plan-2026-05-08.md` - Full upgrade plan with checklist
- `/root/elviajero/docs/STATUS.md` - Current status and known issues
- `/root/elviajero/docs/brutal-asset-critique.md` - Branding issues and fixes
- `/root/elviajero/docs/IMPLEMENTATION_PLAN.md` - Implementation plan details
- `/root/priorities/repos/elviajero-deep-analysis.md` - Architecture analysis
- `/root/priorities/build-wishlist.md` - All client feature requests

---

## 📊 SUMMARY

**Total Known Issues:** 12 (1 resolved, 11 pending)
**Total Feature Requests:** 6 major areas (payment, stock, tracking, variants)
**Total Branding Issues:** 6 (logo, favicon, OG image, categories, banners, PWA icons)
**Total Quick Wins:** 5 (under 1 hour each)
**Estimated Total Effort:** ~60-80 hours for all pending items

**Blocking Issues:**
1. CartProvider not in root layout (P0) - 30 min
2. Real phone numbers (P3) - 10 min
3. Admin dashboard stats query (P3) - 5 min
