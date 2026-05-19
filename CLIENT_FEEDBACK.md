# El Viajero - Client Feedback & Requirements Tracker

Last updated: 2026-05-19

---

## Current Status
- **Live:** el-viajero.paragu-ai.com | viajero.paragu-ai.com
- **Repo:** /root/elviajero (elviajero-comercio on GitHub)
- **Stack:** Next.js 15, Tailwind 4, TypeScript, Supabase + SQLite
- **Maturity:** HIGH - 107 components, full e-commerce, admin panel

---

## Known Issues & Feedback

### 1. 🚨 Product Page 500 Error (FIXED 2026-05-19)
**Status:** ✅ RESOLVED
**Issue:** Product pages showing "Error del servidor" + React error #310 (infinite re-render)
**Root Cause:** `createClient()` called on every render, causing new Supabase reference. useEffect had `[supabase]` dependency → infinite loop.
**Fix:** Changed useEffect dependency from `[supabase]` to `[]` so it runs once on mount.
**Deployed:** Commit 1ab554e, GitHub Actions deploying.

### 2. 🖼️ Image Performance (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issue:** 133 MB of PNG images, 0 WebP. Product images are 1.4–2.9 MB each.
**Impact:** Mobile users on 3G/4G connections download 30+ MB just to load catalog = 25+ seconds white space.
**Fix Required:** Convert all to WebP, serve via `<picture>` with `srcset`, add `loading="lazy"`. Target <100KB per image.

### 3. 🏗️ Dual Data Source Chaos (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issue:** Product data tries Supabase first, silently falls back to static JSON on error. Prices stored as formatted strings ("Gs. 450.000") requiring regex parsing everywhere.
**Impact:** If Supabase down/slow, products shown may not match actual inventory. Price parsing brittle, locale-dependent.
**Fix Required:**
- Store prices as integers (cents/guaraníes)
- Parse once, format for display
- Proper error handling for Supabase queries

### 4. 🛒 Checkout Problems (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issues:**
- Hardcoded WhatsApp number (`595981234567`) in checkout page
- "WhatsApp/Transferencia" is DEFAULT payment - redirects user to WhatsApp instead of completing checkout
- Bancard/PagoPar listed but minimal implementation
- No form validation - user can submit empty order
**Fix Required:**
- Extract WhatsApp number to env/config
- Implement real payment gateway completion flow
- Add form validation before proceeding

### 5. 🔍 Search & Filters Bug (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issue:** Filter component has `setTimeout` callback hack (re-render anti-pattern). `useMemo` missing `brandFilter` and `pricePreset` dependencies.
**Impact:** Brand filter doesn't update memo. Flash of unfiltered content, race conditions on rapid filter changes.
**Fix Required:**
- Remove `setTimeout` callback, return from `useMemo` properly
- Add `brandFilter, pricePreset` to dependency array

### 6. 📱 SEO - No Metadata (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issue:** Tienda page exports no metadata. No `<title>`, no meta description, no Open Graph, no structured data.
**Impact:** Invisible to Google Shopping, Product rich results, basic SERP visibility.
**Fix Required:**
- Add `generateMetadata()` to tienda page with CollectionPage schema
- Add `generateMetadata()` to all product pages with Product schema (price, availability, image, offers)

### 7. 🧭 Navigation Confusion (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issue:** `es.json` has TWO navigation arrays - "items" with Productos→/productos, "ui" with Tienda→/tienda.
**Impact:** User sees "Tienda" in nav but breadcrumb leads nowhere useful or confused routing.

### 8. 💰 Price String Parsing Hell (from CRO Roast)
**Status:** ⚠️ NOT ADDRESSED
**Issue:** Every price stored as "Gs. 450.000" string with thousand separators. Requires `parseInt(s.replace(/[^\d]/g, ""))` everywhere.
**Fix Required:** Store as integers, format for display only.

---

## Feature Requests (from Build Wishlist)

### Tier 2.3 - El Viajero Polish
**Priority:** 🟢 SOON
**Estimated:** 24h

| Feature | Notes |
|---------|--------|
| Supabase migration | Currently SQLite - fragile for multi-replica Docker. Migrate to Supabase for durability. |
| Real payment gateway | Bancard vPOS integration - complete checkout flow without WhatsApp redirect |
| Stock sync | Reconcile online store with physical shop inventory |
| Auto-order to WhatsApp | New orders → auto-forward to shop WhatsApp (+595981234567) |
| Delivery tracking | Real-time courier integration |
| Product variant matrix | Size × color × material × price per variant |

---

## What's Working ✅

- Full e-commerce flow (cart, checkout, orders, shipping, coupons)
- Multi-payment gateway (Bancard, PagoPar, PayPal, Stripe)
- Full admin panel (10+ pages: products, orders, categories, users, coupons, reviews, etc.)
- SEO complete (sitemap, JSON-LD, RSS, OG, robots) - on root layout
- Analytics (GA4)
- Auth system (custom pg JWT)
- Cart persistence
- Multi-currency (PYG/USD) with live conversion
- Multi-language (ES/EN/GN locales)
- Dark mode
- Cookie consent
- Product comparison
- Recently viewed + wishlist + back-in-stock
- BOGO + bundles auto-promos
- Exit intent + abandoned cart recovery
- Blog engine

---

## Next Actions

1. **Immediate** (blocked by deploy):
   - Verify product page fix is live (check https://el-viajero.paragu-ai.com/producto/*)
   - Monitor for any re-render errors in browser console

2. **High Priority** (from CRO roast + wishlist):
   - Convert images to WebP, optimize to <100KB each
   - Add SEO metadata to tienda page and all product pages
   - Fix search/filter useMemo dependencies (brand filter broken)
   - Remove dual navigation confusion
   - Implement real checkout flow (not WhatsApp redirect)
   - Fix price storage as integers

3. **Medium Priority** (from wishlist):
   - Supabase migration (replace SQLite)
   - Stock sync system
   - Auto-order to WhatsApp
   - Delivery tracking
   - Product variant matrix

---

## Sources

- `/root/priorities/repos/elviajero-deep-analysis.md` - Architecture analysis
- `/root/priorities/build-wishlist.md` - All client requests
- CRO Roast session 20260512 - Live site audit (from search results)
- Supabase schema `supabase/migrations/002_ej_tables.sql` - Product table structure
- Current codebase `/root/elviajero/`
