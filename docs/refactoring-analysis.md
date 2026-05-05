# El Viajero — Refactoring Targets & Abstractions

Date: 2026-05-04
Repo: /root/elviajero-comercio

---

## P0 — HIGH IMPACT REFACTORS

### 1. Payment Gateway Factory
**Files:** `app/api/checkout/bancard/route.ts` (33L) + `pagopar/route.ts` (34L) + `paypal/route.ts` (43L) + `stripe/route.ts` (40L)
**Pattern:** 4 routes with ~90% identical boilerplate (validate cart, create order, return URL)
**Proposal:** `lib/payment/factory.ts` — one generic handler that receives gateway name, delegates to gateway-specific adapter
```typescript
// Instead of 4 route files:
POST → /api/checkout/[gateway]  // bancard | pagopar | paypal | stripe
```
**Effort:** 2h
**Benefit:** Adding new gateway = write adapter only (20 lines)

### 2. DB CRUD Factory
**Files:** `app/api/db/orders/route.ts` (37L) + `products/route.ts` (27L) + `promos/route.ts` (38L) + `reviews/route.ts` (33L) + `users/route.ts` (32L)
**Pattern:** 5 routes, each has GET (list) + POST (create) with almost identical Supabase queries
**Proposal:** `lib/db/crud-factory.ts`
```typescript
createCrudRoutes({ table: "products", adminOnly: true })
// Returns { GET, POST } handlers
```
**Effort:** 1h
**Benefit:** CRUD for new entities = 1 line

### 3. Supabase Client Consolidation
**Files:** `lib/supabase/client.ts` + `browser.ts` + `server.ts` + `middleware.ts` + `admin.ts` = 5 files
**Issue:** 5 different ways to create Supabase clients, some redundant (`client.ts` re-exports `browser.ts`)
**Proposal:** Consolidate to 3:
- `lib/supabase/browser.ts` — browser client
- `lib/supabase/server.ts` — server component client  
- `lib/supabase/admin.ts` — admin (service_role, for API routes)
- Remove: `client.ts`, simplify `middleware.ts` to reuse `server.ts`
**Effort:** 30min
**Benefit:** Less confusion, single source of truth

---

## P1 — MEDIUM IMPACT REFACTORS

### 4. localStorage Key Constants
**Files:** 6 files with 10+ localStorage key strings
**Issue:** `viajero_currency`, `viajero_lang`, `viajero_favs`, `viajero_favs_${id}`, `viajero_cart_activity`, `viajero_cart_reminder_sent`, `viajero_promos`
**Proposal:** `lib/storage-keys.ts`
```typescript
export const STORAGE_KEYS = {
  CURRENCY: "viajero_currency",
  LANG: "viajero_lang",
  FAVORITES: (userId?: string) => userId ? `viajero_favs_${userId}` : "viajero_favs",
  CART_ACTIVITY: "viajero_cart_activity",
  CART_REMINDER: "viajero_cart_reminder_sent",
  PROMOS: "viajero_promos",
} as const
```
**Effort:** 15min

### 5. Abandoned Cart / Cart Recovery Module
**Files:** `lib/abandoned-cart.ts`
**Issue:** Scattered across localStorage reads/writes, could be a clean service
**Also:** Related config lives in `content/es.json` (abandonedCart section)
**Proposal:** Consolidate into single service with config injection

### 6. Auth Context De-dup
**File:** `lib/auth-context.tsx` (200+ lines)
**Issue:** Giant context with login, register, OAuth, profile, addresses, favorites, orders ALL in one file
**Proposal:** Split into:
- `lib/auth/auth-context.tsx` — core auth (login, register, logout, session)
- `lib/auth/profile-hooks.ts` — profile, addresses
- `lib/auth/orders-hooks.ts` — orders
- `lib/auth/favorites.ts` — favorites (localStorage)

---

## P2 — LOW IMPACT / CODE QUALITY

### 7. Header Component Abstract Sections
**File:** `components/header.tsx` (357 lines)
**Issue:** Largest component. Mixes nav, search, currency, lang, cart, auth, dark mode
**Proposal:** Extract into smaller sub-components:
- `components/header/nav.tsx` — navigation links
- `components/header/actions.tsx` — search, currency, lang, dark mode
- `components/header/cart-badge.tsx` — cart icon + count
- `components/header/auth-menu.tsx` — login / user menu

### 8. Admin Layout Split
**File:** `components/admin/admin-layout.tsx` (143 lines)
**Issue:** Contains auth check, sidebar, header, content area — could split into sidebar + header
**Proposal:**
- `components/admin/sidebar.tsx`
- `components/admin/admin-header.tsx`

### 9. Cart Context Simplify
**File:** `lib/cart-context.tsx` (117 lines)
**Issue:** Interface CartItem, Context, Provider, add/remove/update/clear all in one file
**Proposal:** Extract CartItem type to separate file, keep context focused

### 10. Magic Numbers
**File:** `lib/currency.tsx`
**Issue:** `RATE_PYG_PER_USD = 7400` hardcoded — should come from config or API
**Proposal:** Move to `content/es.json` (paymentGateway section has rate field already) or fetch from external API

---

## ARCHITECTURE DIAGRAM (current vs proposed)

### Current:
```
app/api/
├── checkout/
│   ├── bancard/route.ts    ← 4 nearly identical files
│   ├── pagopar/route.ts
│   ├── paypal/route.ts
│   └── stripe/route.ts
├── db/
│   ├── orders/route.ts     ← 5 nearly identical CRUD files
│   ├── products/route.ts
│   ├── promos/route.ts
│   ├── reviews/route.ts
│   └── users/route.ts
├── auth/route.ts
├── orders/route.ts
└── ...

lib/
├── cart-context.tsx         ← 117 lines, 5 concerns
├── auth-context.tsx         ← 200+ lines, 6 concerns
├── supabase/
│   ├── client.ts             ← redundant (re-exports browser.ts)
│   ├── browser.ts
│   ├── server.ts
│   ├── middleware.ts
│   └── admin.ts
│   
components/
├── header.tsx                ← 357 lines, 6 sub-components
├── admin/admin-layout.tsx    ← 143 lines, 3 sections
```

### Proposed:
```
app/api/
├── checkout/[gateway]/route.ts  ← 1 file, delegates to adapters
├── db/
│   ├── [[resource]]/route.ts   ← 1 file, factory-generated
│   └── ...

lib/
├── supabase/
│   ├── browser.ts
│   ├── server.ts
│   └── admin.ts                ← client.ts + middleware.ts removed
├── payment/
│   ├── factory.ts              ← handles routing + validation
│   ├── bancard.ts              ← gateway adapter (20 lines)
│   ├── pagopar.ts
│   ├── paypal.ts
│   └── stripe.ts
├── db/
│   └── crud-factory.ts         ← generates GET/POST from table name
├── auth/
│   ├── auth-context.tsx
│   ├── profile-hooks.ts
│   ├── orders-hooks.ts  
│   └── favorites.ts
├── storage-keys.ts             ← single source for all localStorage keys
├── cart-context.tsx             ← same size but cleaner

components/
├── header/
│   ├── index.tsx
│   ├── nav.tsx
│   ├── actions.tsx
│   ├── cart-badge.tsx
│   └── auth-menu.tsx
├── admin/
│   ├── admin-layout.tsx
│   ├── sidebar.tsx
│   └── admin-header.tsx
```

## QUICK WINS (15 min each)
1. Create `lib/storage-keys.ts` — eliminates magic string risk
2. Remove `lib/supabase/client.ts` — it's a redundant re-export
3. Consolidate `lib/currency.tsx` rate into content config
4. Extract `lib/cart-context.tsx` CartItem type to `lib/types.ts`

## MEDIUM WINS (1-2h each)
5. Payment gateway factory (2h) — biggest RoI
6. DB CRUD factory (1h) — cleanest abstraction
7. Auth context split (1h) — maintainability

## BIG WINS (3-4h each)
8. Payment gateway factory + test suite
9. Full architecture reorg (header split, admin split, supabase consolidation)
10. Shared package extraction to @elviajero/common (if any other site would benefit)
