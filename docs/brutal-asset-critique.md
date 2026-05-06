# El Viajero — Brutal Asset Critique & Complete Upgrade Plan

## Executive Summary

We have ~82 images. ~60 are fine (hero carousel, product PNGs, promo images). 
**~15 assets are embarrassing.** This doc roasts each one, then prescribes the fix.

---

## THE ROAST

### 1. Logo — `public/images/logo.svg`

**Current state:** 200x60 SVG. A tiny mountain with a tent crammed into the left side. "El Viajero" text in a font that probably doesn't render on most systems (Poppins). Tagline "Todo para tu aventura" is microscopic at 10px. The mountain gradient goes from green to blue like someone couldn't decide on a brand color. The sun is a tiny yellow dot.

**Problems:**
- The icon is too small (28px) — invisible on mobile
- Uses Poppins which 90% of users don't have — falls back to ugly sans-serif
- The tent looks like an afterthought crammed under the mountain
- No brand recognition — could be any outdoor store
- Green-to-blue gradient is wrong — we're Camping/Forest, not Beach/Ocean

**Fix:** Complete redesign. Needs:
- Clean, bold icon that works at 32px (header) and 200px (OG image)
- Outdoor/Travel feel without being generic
- Must render well without web fonts (use system fonts or inline paths)
- Brand mark should work standalone (without text)

---

### 2. Favicon — `public/images/favicon.svg`

**Current state:** Green rounded rect with white "EV" text. Looks like a generic app icon from 2012. Zero personality.

**Problems:**
- "EV" means nothing to customers
- Looks like a banking app
- Doesn't convey camping, adventure, or Paraguay
- When tiled in browser tabs, blends into nothing

**Fix:** A minimalist mountain peak + tent icon @64x64. Must be recognizable at 16x16 browser tab size.

---

### 3. OG Image — `public/images/og-viajero.svg`

**Current state:** 1200x630 gradient (green → blue). "EV" in a white rounded box. Category tags using emojis. Looks like a template from 2018.

**Problems:**
- The "EV" logo square is laughably basic — white rounded rect with opacity
- Emoji in OG images render differently on every platform (Twitter vs Facebook vs WhatsApp)
- Mountain decoration paths are random noise — not recognizable shapes
- URL at bottom-right is tiny and useless
- No call-to-action or visual hook

**Fix:** Needs real brand photography or a polished illustration. Typography hierarchy: Brand → Value Prop → Location → CTA.

---

### 4-9. Category SVGs — 6 files in `public/images/categories/`

**Current state (BEFORE our upgrade):** 400x267 SVGs with emoji text (🏕️🎣🎒🚗🏍️🌾) on a light green background. It looked like an SMS message.

**Our fix:** We replaced them with vector illustrations. Better, but still not great.

**Remaining problems:**
- They're 400x267 but displayed as 20% opacity backgrounds — detail gets lost
- The category-layout.tsx renders an `<Image>` with `fill` + `object-cover` at `opacity-20` — the photo is barely visible under the green overlay
- Need richer, higher-contrast images that work through a dark overlay

**Fix:** Replace all 6 with high-contrast photo-realistic backgrounds. Darker tones, stronger silhouettes, so they're visible at 20% opacity through a `bg-primary/82` overlay.

---

### 10-11. PWA Icons — `icon-192.png`, `icon-512.png`

**Current state:** Simple green rounded rect with white mountain + tent + sun. Generated via Pillow.

**Problems:**
- Generated programmatically — jagged edges, no anti-aliasing
- The mountain is a basic polygon — looks like clip art
- When a user adds the site to their home screen, the icon looks amateurish
- No iOS/Android adaptive icon support

**Fix:** Properly rendered SVG → PNG conversion at correct sizes. Or a dedicated PWA icon set that mirrors the main logo.

---

### 12-17. Category Hero Banners — 6 files in `public/images/marketing/`

**Current state:** Photorealistic-style PNGs (1920x600) we just generated. Gradient sky + bokeh circles + basic silhouettes.

**Problems:**
- The "photorealistic" claim is generous — they're gradients with random circles
- No actual subjects (tents, fishing rods, cars) — just atmosphere
- They work OK as hero backgrounds but won't impress anyone
- For the price of the "real" ones, we could have generated proper AI images

**Fix:** These are acceptable as placeholders but need real AI-generated images when the budget allows.

---

### 18. `public/images/og-viajero.svg` (OG Image)

Already criticized above. Worth repeating: this is the image that shows up when you share the site on WhatsApp/Facebook/Twitter. It's **the most important image** for social proof, and it's embarrassing.

---

## THE UPGRADE PLAN

### Phase 1: Low Effort, High Impact (1 hour)

| # | What | Effort | Impact | Action |
|---|------|--------|--------|--------|
| 1 | Logo | 20min | High | AI-generate a proper outdoor/travel brand mark — mountain with path/trail motif, warm earthy colors, works at 32px |
| 2 | Favicon | 10min | High | Extract a simplified version of the new logo — must read at 16x16 |
| 3 | Category hero banners | 30min | Medium | Regenerate with actual subjects (not just gradients) |

### Phase 2: Medium Effort (2 hours)

| # | What | Effort | Impact | Action |
|---|------|--------|--------|--------|
| 4 | OG Image | 30min | High | Full redesign with brand photography, proper typography, CTA section |
| 5 | Category SVGs | 30min | Medium | Replace vector illustrations with photo-realistic composited images |
| 6 | PWA Icons | 15min | Medium | Generate clean set from SVG logo, all required sizes |

### Phase 3: Long-term (client provides)

| # | What | Effort | Impact | Action |
|---|------|--------|--------|--------|
| 7 | Real product photos | Client | High | Replace all 34 placeholder PNGs with actual product photos |
| 8 | Store photography | Client | Medium | Real photos of storefront, interior, team for /nosotros |
| 9 | Customer testimonial photos | Client | Low | Real customer photos replacing our avatar placeholders |

---

## Detailed Design Brief for Each Asset

### Logo Redesign

**Concept:** Mountain peak with a glowing trail or path that forms a "V" shape (for Viajero). Earthy green (#1B5E20) and warm gold (#E65100). The icon should work at 32x32 and 200x200.

**Reference style:** Patagonia (bold, clean) meets a Paraguayan mate gourd silhouette.

**Colors:** #1B5E20 (primary green), #E65100 (accent orange), #37474F (dark text)

### OG Image Redesign

**Layout:**
- Left 40%: Large mountain/tent illustration or photo
- Right 60%: Brand name + tagline + 3 category pills + location
- Bottom: URL with decorative wave
- No emoji — everything as rendered SVG text/paths

### Category Backgrounds

Each needs a photo-composite feel at 1920x600:
- Camping: Forest canopy with tent glow, moonlight
- Pesca: River/riverbank at golden hour, mist
- Outdoor: Mountain trail with backpack, morning light
- Autos: Highway at sunset, dashboard reflection
- Motos: Dirt road through fields, afternoon sun
- Campo: Rural farmland, rolling hills, farmhouse silhouette

---

## What We Should Generate Right Now

| Priority | Asset | Format | Where to use |
|----------|-------|--------|-------------|
| P1 | Full brand logo | SVG | Header, favicon, PWA, OG |
| P1 | Favicon | SVG/PNG | Browser tab, bookmarks |
| P2 | OG image | PNG | Social sharing |
| P2 | Category hero banners | PNG | Category pages |
| P3 | Category SVGs | SVG | Category page hero decorative |
| P3 | PWA icons | PNG | Home screen, splash screen |
