# El Viajero — Implementation Plan (Batched)

## Strategy
3 phases, each builds on the last. Phase 1 = revenue-critical (without this, site can't sell). Phase 2 = growth (makes site competitive). Phase 3 = polish (makes site excellent).

Every batch is self-contained. Pick any batch and work it.

---

## PHASE 1: Revenue-Critical (must have to sell)

### BATCH 1A: Real Payment Gateway
**Files:** app/api/checkout/pagopar/route.ts, lib/payment/pagopar.ts, lib/payment/factory.ts
**What:** Connect Pagopar (primary PY payment) + Bancard (card processing) with real API keys. Test sandbox → live.
**Why:** Without this, every order goes to WhatsApp. No revenue flows through the site.
**Time:** 2-3 hours

### BATCH 1B: Real Product Photos
**Files:** All product images in /public/images/productos/*.svg, admin productos page, components/image-upload.tsx
**What:** Replace 34 SVG placeholders with real product photos. Add image upload to admin. Create a Supabase Storage public bucket for images.
**Why:** Customers won't buy what they can't see. SVGs look fake.
**Time:** 2 hours (photos) + 1 hour (upload UI)

### BATCH 1C: Configure OAuth Providers
**Files:** None (Supabase Dashboard config)
**What:** Set up Google Cloud Console OAuth, Meta Developer Facebook Login, plug into Supabase Auth Providers.
**Why:** Login/register buttons are on the site but don't work. Blocks account creation.
**Time:** 1 hour

### BATCH 1D: Dynamic Products (DB → Storefront)
**Files:** app/tienda/page.tsx, components/pages/tienda-content.tsx, components/pages/product-content.tsx, app/producto/[slug]/page.tsx
**What:** Make the tienda page and product detail page fetch from ej_products at runtime. So admin edits are live immediately.
**Why:** Admin edits products in DB but storefront shows old static data. Admin is useless without this.
**Time:** 3-4 hours

---

## PHASE 2: Growth & Operations

### BATCH 2A: Real Checkout Flow
**Files:** app/api/checkout/*, lib/cart-context.tsx, components/cart-sidebar.tsx, app/pedido/confirmado/*
**What:** Build a real checkout: cart → address → payment → confirmation. Guest checkout. WhatsApp fallback.
**Why:** Current "checkout" just opens WhatsApp. No order management, no tracking.
**Time:** 5-6 hours

### BATCH 2B: Shipping Integration
**Files:** app/api/shipping/*, lib/shipping/*, content/es.json
**What:** Shipping rate calculator by zone (Asuncion, Central, Interior). Courier API integration (Rapid, MAB). Free shipping threshold.
**Why:** Nobody buys without knowing delivery cost.
**Time:** 3-4 hours

### BATCH 2C: Admin Dashboard Real Stats
**Files:** app/admin/page.tsx, app/admin/reportes/page.tsx
**What:** Query ej_orders for revenue, order count, top products. Charts by day/week/month. CSV export.
**Why:** Admin currently shows 0s. Owner can't see how business is doing.
**Time:** 2-3 hours

### BATCH 2D: WhatsApp Automation
**Files:** lib/whatsapp/* (new), app/api/webhooks/*, Use Evolution API (already on VPS)
**What:** New order → WhatsApp notification to admin. Order status change → WhatsApp to customer. Abandoned cart → WhatsApp reminder.
**Why:** Paraguay runs on WhatsApp. Automating this saves hours/day for the owner.
**Time:** 4-5 hours

### BATCH 2E: Order & Inventory Management
**Files:** app/admin/pedidos/page.tsx, lib/inventory/* (new), app/api/db/orders/route.ts
**What:** Order status workflow (pendiente → confirmado → enviado → entregado), packing slips, inventory tracking, low stock alerts.
**Why:** Admin can't manage orders properly. Stock goes unmanaged.
**Time:** 4-5 hours

---

## PHASE 3: Polish & Excellence

### BATCH 3A: SEO & Analytics
**Files:** app/layout.tsx, content/es.json, app/sitemap.ts, app/blog/*, lib/seo/*
**What:** Configure GA4 (real ID). Product schema markup. Review schema. Blog with internal links. Google Search Console. Submit sitemap.
**Why:** Zero organic traffic currently. No analytics = flying blind.
**Time:** 4-5 hours

### BATCH 3B: Mobile & Performance
**Files:** components/header.tsx, app/layout.tsx, next.config.ts, public/sw.js (new)
**What:** Bottom nav bar for mobile. PWA with offline support. Push notifications. Lazy load images. Font optimization.
**Why:** 70%+ of Paraguayan traffic is mobile. Site is slow on 3G.
**Time:** 4-5 hours

### BATCH 3C: Customer Account Upgrade
**Files:** app/mi-cuenta/*, lib/auth-context.tsx
**What:** Passwordless login (magic link). Order tracking timeline. Saved payment methods. Address autocomplete. Downloadable invoices. Wishlist sharing.
**Why:** Basic account = low retention. Good account = repeat buyers.
**Time:** 5-6 hours

### BATCH 3D: Product Catalog Enrichment
**Files:** content/es.json, app/admin/productos/page.tsx, components/pages/*, app/api/products/route.ts
**What:** Variants (size/color), bundles, accessories mapping, category landing pages, rich descriptions, comparison table, gift guide.
**Why:** 34 products is thin for a real outdoor store. Need merchandising.
**Time:** 6-8 hours

### BATCH 3E: B2B Portal
**Files:** app/b2b/* (new), app/admin/b2b/* (new), lib/b2b/*
**What:** Wholesale login. Bulk pricing tiers. Minimum order quantities. Credit limit. B2B invoice generation.
**Why:** 2300 wholesale clients (from Superspuma context). This is the money.
**Time:** 8-10 hours

### BATCH 3F: Loyalty & Community
**Files:** app/loyalty/* (new), components/referral/*, lib/loyalty/*
**What:** Points system, referral program, social feed integration, user-generated content gallery, Instagram feed.
**Why:** Repeat customers are cheaper than new ones. Community builds brand.
**Time:** 6-8 hours

### BATCH 3G: Multi-Language Content
**Files:** content/en.json, content/gn.json (new), lib/i18n.ts, components/language-switcher.tsx
**What:** Complete English translation. Guarani basics. Translated SEO. Language-based URL routing.
**Why:** English for expats/tourists, Guarani for cultural connection. But ES is the priority.
**Time:** 4-6 hours

---

## Execution Strategy

**Work 1 batch at a time.** Each batch:
1. Write/change all files
2. Build (`npx next build`)
3. Docker build
4. Deploy (`docker stack deploy`)
5. Verify live

**Parallel rule:** Only run batches in parallel if they touch different files with no overlap. E.g., 1A (payments) + 1C (OAuth) can run in parallel because one is code, one is Supabase dashboard config.

**Time estimate total:** ~60-80 hours across all 15 batches.

Start with Batch 1A. Say the word.
