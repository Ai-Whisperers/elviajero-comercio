# Visual Assets Implementation Plan

## Current State

- **114 image files** on disk across old SVGs + new marketing PNGs
- **99 images referenced** in code (content/es.json routes, components, layouts)
- **15 orphaned files** on disk (unused)
- **~25 old SVGs** in `public/images/productos/` fully replaced by new PNGs in `public/images/marketing/products/`
- **7 SVG category images** partially unused (slug mismatch in dynamic loading)
- `config/images.json` is dead config (zero code references)

---

## Task 1: Enable NEW Product PNGs in Tienda Content

**Status: ALREADY DONE** — content/es.json products (lines 130-441) already reference `public/images/marketing/products/*.png`.

## Task 2: Enable Hero Carousel Image 4

- `hero-carousel-04-shop-warm.png` exists on disk but NOT referenced in content/es.json
- content/es.json only references 1,2,3,5 for carousel (line 792 has no 04)
- **Action:** Add slide 4 data to content/es.json home.hero slides array (currently 4 slides, should be 5)

## Task 3: Fix Category Slug → SVG Mapping Mismatch

`category-layout.tsx` (line 24) loads `/images/categories/${slug}.svg` but slugs passed by individual category pages don't match actual filenames:

| Page | slug used | expected file | actual file | Match? |
|------|-----------|---------------|-------------|--------|
| camping | `camping` | categories/camping.svg | ✓ | YES |
| pesca | `pesca` | categories/pesca.svg | ✓ | YES |
| campo | `campo` | categories/campo.svg | ✓ | YES |
| motos | `motos` | categories/motos.svg | ✓ | YES |
| accesorios | `outdoor` | categories/outdoor.svg | categories/accesorios.svg | NO |
| autos | `autos` | categories/autos.svg | categories/automoviles.svg | NO |
| (playa-y-pesca) | no page | — | categories/playa-y-pesca.svg | orphaned |

**Action:** Either rename SVGs to match slugs or change slug parameters. Fix the category SVGs to match the actual slug values passed.

## Task 4: Upgrade Hero Background from SVG to PNG

- `hero-carousel` component and `/app/page.tsx` hero section still use `/images/hero-bg.svg`
- New PNG assets available: `tienda-hero-bg.png` (already used in tienda-content.tsx), `hero-carousel-*.png`
- **Action:** Replace the generic SVG background with one of the hero carousel images as fallback

## Task 5: Clean Up Orphaned Assets (15 files)

Safely deletable (not referenced in any tsx/ts/json/js):

| File | Reason |
|------|--------|
| `/images/accesorios.svg` | replaced by marketing/category-accesorios.png |
| `/images/automoviles.svg` | replaced |
| `/images/camping.svg` | replaced |
| `/images/campo.svg` | replaced |
| `/images/motos.svg` | replaced |
| `/images/pesca.svg` | replaced |
| `/images/categories/accesorios.svg` | dead — URLs don't match app slugs |
| `/images/categories/automoviles.svg` | same |
| `/images/categories/camping.svg` | dead — no category pages call camping slug from code (only accesorios autos camp pesca moto) WAIT: camping page DOES exist. Actually all 6 category SVGs are potentially used by the dynamic URL pattern. See Task 3 re: fixing slug mapping. |
| `/images/categories/playa-y-pesca.svg` | no matching category page exists |
| `/images/marketing/hero-carousel-04-shop-warm.png` | not in content/es.json carousel array |
| `/images/product-placeholder.svg` | never referenced in code |
| `/images/productos/*.svg` (25 files) | replaced by PNGs |

## Task 6: Remove Dead Config

- `config/images.json` — zero code imports, all its references are stale
- **Action:** Delete the file

---

## Implementation Order

1. **Add hero carousel slide 4** to content/es.json
2. **Rename category SVGs** to match actual slug values used by pages (or rename SVGs — easier)
3. **Upgrade hero backgrounds** from SVG to PNG
4. **Delete orphaned SVGs** (`public/images/productos/*.svg`, `public/images/accesorios.svg`, `public/images/automoviles.svg`, `public/images/camping.svg`, `public/images/campo.svg`, `public/images/motos.svg`, `public/images/pesca.svg`, `public/images/product-placeholder.svg`, `public/images/categories/playa-y-pesca.svg`)
5. **Delete `config/images.json`**

## Verification

- [ ] All product pages show new PNG images
- [ ] Hero carousel has 5 slides (including shop-warm)
- [ ] Category pages show correct SVG backgrounds
- [ ] No 404 image loads anywhere
- [ ] Build succeeds
- [ ] Orphaned files removed, codebase clean
