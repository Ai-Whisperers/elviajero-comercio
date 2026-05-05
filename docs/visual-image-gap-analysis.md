# Visual Image Gap Analysis — Remaining Opportunities

## Current Coverage: 65 images referenced, 0 missing, 0 orphaned

---

## GAP 1: Category Page Hero — Emoji Instead of Real Image
**Files:** `app/categoria/*/page.tsx` (6 pages)
**Issue:** Each category page passes an emoji (🎒🏕️🎣🚗🏍️🌾) displayed at 5xl size as the hero icon.
**Fix:** Could use the category marketing PNGs (`/images/marketing/category-*.png`) as a hero background or icon instead.
**Priority:** Low — emojis work, this is polish.

## GAP 2: Homepage Category Grid — Letter Instead of Icon
**File:** `app/page.tsx` line 239
**Code:** `{cat[0]}` (first letter of category name inside a circle)
**Fix:** Could use small category icon SVGs or emoji. Currently shows "C", "P", "A", "M", etc.
**Priority:** Medium — noticeable on homepage, makes it look bare.

## GAP 3: /productos Category Cards — Letter Fallback
**File:** `app/productos/page.tsx` line 36
**Code:** `{cat[0]}` as fallback when `CATEGORY_CARD_IMAGES[slug]` is undefined.
**Current state:** All 7 categories have PNG mappings (camping, pesca, playaypesca, accpersonales, automviles, motos, campo) so this fallback never triggers.
**Priority:** None — dead code path currently.

## GAP 4: Tienda Product Card — "Sin imagen" Fallback
**File:** `components/pages/tienda-content.tsx` line 50
**Code:** Shows "Sin imagen" text if `p.imageUrl` is empty.
**Current state:** All 34 products have imageUrl set, so this never triggers with current content.
**Priority:** None — dead code path currently.

## GAP 5: Testimonials — No Avatar Photos
**File:** `content/es.json` lines 581-601 (4 testimonials)
**Issue:** No `image` or `avatar` field. The homepage renders text-only testimonials with stars — no human photos.
**Fix:** Could add avatar photos for the 4 customer testimonials. Need real headshot-style PNGs.
**Priority:** Medium — adds trust/credibility.

## GAP 6: Blog Post Hero — Images Used Well
**Status:** Already done — each blog post has an image, rendered at 800x450 in `app/blog/[slug]/page.tsx`.
**Priority:** None.

## GAP 7: About/Nosotros Page — No Store/Location Photos
**File:** `app/nosotros/page.tsx`
**Issue:** Uses text-only. No photos of the store, team, or owners.
**Priority:** Medium-high for trust-building.

## GAP 8: Contact Page — Uses contact-hero-storefront.png
**Status:** Already done — uses the hero storefront image.
**Priority:** None.

## GAP 9: Promotions — Uses promo PNGs
**Status:** Already done — 3 promotions with promo-combo-pesca, promo-envio-gratis, promo-kit-camping.
**Priority:** None.

## GAP 10: Header Logo — Uses logo.svg
**File:** `components/header.tsx` line 44
**Status:** Functional SVG logo. Could upgrade to a real brand logo PNG if desired.
**Priority:** Low — SVG looks fine.

---

## Recommended Next Images to Generate

| Priority | What | Where | Why |
|----------|------|-------|-----|
| 1 (HIGH) | 4 testimonial avatars (round headshots) | Homepage /es.json | Adds credibility, humanizes the store |
| 2 (MED) | 6 category icons (replacing `cat[0]` letter) | Homepage page.tsx line 239 | Visual polish on main page |
| 3 (MED) | 6 category hero backgrounds (replacing emoji) | Category pages | Makes category pages feel premium |
| 4 (LOW) | Storefront/team photos for /nosotros | Nosotros page | Trust-building for new visitors |
