# Dead Code Verdict & Action Plan

## GREEN — Revive & Integrate (worth keeping, just needs wiring)

These components do useful things but were never imported. Wire them into the existing UI:

| File | What it does | Where to integrate |
|------|-------------|-------------------|
| `components/delivery-calculator.tsx` | Calculates shipping fee by zone | Checkout page step 2 (replace inline shipping calc) |
| `components/coupon-input.tsx` | Promo code entry + validation | Cart sidebar + checkout summary |
| `components/cart-shipping.tsx` | Shipping estimator in cart sidebar | Cart sidebar (shown when items > 0) |
| `components/py-address-select.tsx` | Paraguay-specific address dropdown (departments/cities) | Checkout address form (replace free-text inputs) |
| `components/order-timeline.tsx` | Visual order status timeline (pendiente→confirmado→enviado→entregado) | Admin order detail + mi-cuenta/pedidos/detalle |
| `components/product-faq.tsx` | FAQ section per product | Product detail page below tabs |
| `components/reorder-button.tsx` | "Comprar de nuevo" button from past orders | Mi-cuenta/pedidos order list |
| `components/tax-display.tsx` | IVA 10% calculation for Paraguay | Checkout summary |
| `components/feedback-button.tsx` | Customer feedback form | Footer or post-purchase page |
| `components/checkout-stepper.tsx` | Step indicator (1-2-3) | Checkout page (replace inline stepper) |
| `lib/csrf.ts` | CSRF token generation for form security | All POST forms (security gap) |

**Effort to revive:** ~2 hours to import and wire all of these.

---

## YELLOW — Keep but will be useful later (don't delete, don't wire yet)

These are features that should exist but need product requirements or other infrastructure first:

| File | Why keep | When to use |
|------|---------|-------------|
| `components/cart-merger.tsx` | Merges guest cart into user cart after login | After guest checkout is built |
| `components/compare-checkbox.tsx` | Select products to compare | When comparison page (/comparar) is built |
| `components/local-storage-migrator.tsx` | Migrates old localStorage data to DB | After first deploy with DB (NOW is the time actually) |
| `components/notification-prefs.tsx` | Email/WhatsApp notification toggles | When user settings page is built |
| `components/offline-indicator.tsx` | Shows "offline" banner | When PWA is fully deployed |
| `components/profile-image.tsx` | Avatar upload | When user profile avatar is needed |
| `components/saved-card.tsx` | Saved payment methods | When payment gateway is live |
| `components/order-tracking-form.tsx` | Enter tracking number | When courier integration is active |
| `components/oos-notify.tsx` | "Notify me when back in stock" | BackInStockForm already exists, this is an alternative |
| `components/bulk-price.tsx` | Bulk pricing display | When B2B portal is active (ej_b2b_customers table exists) |
| `lib/bundle.ts` | Bundle/product kit logic | When bundling feature is built |
| `lib/bogo.ts` | Buy-one-get-one logic | When promo engine v2 is built |
| `lib/stock-history.ts` | Inventory change log | When stock management is built |
| `lib/abandoned-cart.ts` | Cart recovery tracking | When Evolution API is configured |
| `lib/admin-pdf.ts` | PDF export for admin | When report PDFs are needed |
| `lib/storage-keys.ts` | Centralized localStorage key constants | Refactoring goal for all localStorage usage |

**Effort to keep:** Zero. They compile fine. Just don't delete them.

---

## RED — Delete Now (obsolete, dangerous, or replaced)

| File | Why delete | Risk if kept |
|------|-----------|-------------|
| `lib/db.ts` | **Old SQLite database.** Dead since Supabase migration. Contains old auth + table setup. | Could be accidentally imported, creates SQLite files in Docker |
| `data/viajero.db` | Old SQLite data file. | Wastes space in Docker image |
| `data/users.json` | Old localStorage-mimicking storage. | Confuses future devs |
| `data/promos.json` | Same. | Same |
| `data/subscribers.json` | Same. | Same |
| `lib/api-auth.ts` | API key auth utility. Never imported by any route. | Dead code |
| `app/api/auth/google/route.ts` | **Hardcoded credential placeholders.** `process.env[GOOGLE_CLIENT_SECRET=proces...CRET]` — leaked secrets | Security risk |
| `app/api/webhooks/payment/route.ts` | Empty/placeholder webhook handler | Dead route |
| `app/api/shipping/rates/route.ts` | `/api/shipping/route.ts` already does this | Duplicate endpoint |
| `app/api/shipping/track/route.ts` | Not implemented, no tracking system | Dead route |
| `app/api/send-email/route.ts` | No email API key configured | Dead route |
| `components/header.tsx.rej` | Git reject file from failed patch | Garbage |
| `components/admin/admin-layout.tsx` (the OLD dark one) | Replaced by sidebar.tsx + admin-layout.tsx | Dual layout confusion |
| `components/image-upload.tsx` | Replaced by `components/admin/image-upload.tsx` | Duplicate |
| `components/empty-state.tsx` | Replaced by `CartEmptyState` in ui.tsx | Duplicate |
| `components/cod-option.tsx` | Single radio button. PickupOption.tsx is same pattern. | Over-split |
| `components/pickup-option.tsx` | Same as cod-option.tsx but for pickup | Over-split |
| `components/delivery-estimate-badge.tsx` | 12-line component. Never used. DeliveryCalculator does this better. | Over-split |
| `components/delivery-estimator.tsx` | Third delivery component. Never used. | Over-split |
| `components/delivery-estimate-badge.tsx` | 12 lines, never imported | Over-split |
| `components/print-product.tsx` | Print a product page. Never imported. | Over-split |
| `components/undo-delete.tsx` | Toast-based undo. Never imported. | Over-split |
| `components/use-confirm.tsx` | Confirmation dialog hook. Never imported. | Over-split |
| `components/validated-field.tsx` | Form validation wrapper. Never imported. | Over-split |
| `components/product-faq.tsx` | **Actually used** by product-content.tsx (keep!) | KEEP |
| `lib/db/crud-factory.ts` | Generic CRUD abstraction. Never imported. | Dead code |
| `lib/date-filter.tsx` | Date filter UI. Never imported. | Dead code |
| `public/sw.ts` | TypeScript source for sw.js. Compiled JS lives at sw.js. | Duplicate. Delete .ts, keep .js |
| `docs/storefront-redesign.md` | Old redesign doc predating Supabase migration | Obsolete |
| `docs/audit/` | Old audit docs from pre-migration | Obsolete |
| `scripts/apply_migration.js` | One-shot table creation script (already ran) | One-time use |
| `scripts/create_tables.mjs` | Same | One-time use |
| `ux-audit-2026-05-04.md` | Old UX audit | Obsolete |

**Total deletions:** ~25-30 files
**Space recovered:** ~3,000-4,000 lines of dead code
**Effort:** ~30 minutes

---

## NAMING FIXES (not dead, just poorly named)

| File | Problem | Fix |
|------|---------|-----|
| `components/bottom-nav.tsx` vs `mobile-bottom-nav.tsx` | Two bottom navs. `bottom-nav.tsx` is dead, `mobile-bottom-nav.tsx` is live. | Delete `bottom-nav.tsx` |
| `lib/auth-context.tsx` vs `lib/auth/auth-context.tsx` | Two auth contexts. `lib/auth-context.tsx` is used by most pages. `lib/auth/auth-context.tsx` is the NEW one that no pages import yet. | Either migrate all pages to new one or delete new one |
| `lib/db.ts` | Name suggests it's the active database. It's not. It's dead SQLite. | Delete |
| `data/` directory | Implies active data storage. All files are old/placeholder. | Delete directory |
