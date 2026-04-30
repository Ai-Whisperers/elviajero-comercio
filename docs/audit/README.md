# El Viajero — Full Audit: 1,000 Items

> Deep analysis, critique, and actionable todo list covering every aspect of the site.
> Generated: 2026-04-30 | Status: Comprehensive audit complete

---

## Summary

| Area | Items | Status | Biggest Issue |
|------|-------|--------|---------------|
| **000: Data & Config** | 100 | 🟡 Placeholder contact info | WhatsApp number missing from client |
| **100: SEO & Meta** | 100 | 🔴 No structured data anywhere | JSON-LD missing entirely |
| **200: UX & Design** | 100 | 🟡 Functional but generic | No hero image, no animations |
| **300: Content & Copy** | 100 | 🔴 Fake testimonials, placeholder contact | Homepage lacks visual identity |
| **400: E-Commerce** | 100 | 🔴 No payment gateway | Cart only sends WhatsApp — no real checkout |
| **500: Images & Media** | 100 | 🔴 20/30 products have NO image | Only Unsplash & empty URLs |
| **600: Code Quality** | 100 | 🟡 `any` types, duplicated data | Every page uses `as any` |
| **700: Mobile** | 50 | 🟡 Not tested on real devices | Unknown mobile issues likely |
| **750: Performance** | 50 | 🟡 Unused 30kB+ libs | framer-motion installed, zero usage |
| **800: Security** | 50 | 🔴 No CSP, plaintext passwords | Auth stores passwords in localStorage |
| **850: SEO Technical** | 50 | 🔴 Sitemap URL wrong | "viajero" not "el-viajero" |
| **900: Domain** | 50 | 🔴 No domain purchased | Still on staging subdomain |
| **950: Launch** | 50 | 🟡 Needs final QA | Ready pending domain + data |
| **TOTAL** | **1,000** | — | — |

## Quick Wins (Top 20 Impact Items)

| # | Item | Effort | Impact | Why |
|---|------|--------|--------|-----|
| 1 | 000 Fix sitemap base URL | 2 min | High | Google can't index correctly |
| 2 | 006 Replace [PENDIENTE] WhatsApp | 5 min | Critical | Cart checkout is BROKEN |
| 3 | 070-079 Replace all product images | 1-2 hr | High | 20 products have no image |
| 4 | 200 Wire hero-bg.svg | 5 min | Medium | Page is solid green — boring |
| 5 | 314-316 Fix stats numbers | 5 min | Medium | "+500" is false (real: 200+) |
| 6 | 618 Remove duplicate WhatsAppFloat | 2 min | Low | Code hygiene |
| 7 | 631-635 Deduplicate product catalog | 15 min | Medium | Two copies drift apart |
| 8 | 300-309 Rewrite tone to "aventurero" | 30 min | Medium | Current copy is too generic |
| 9 | 660-669 Add error boundaries | 30 min | Medium | Any crash breaks whole site |
| 10 | 630 Remove unused config pages | 5 min | Low | Cleanup |
| 11 | 280-284 Fix newsletter endpoint | 20 min | Medium | Currently submits to /api/404 |
| 12 | 500-539 Generate product images | 2 hr | High | 67% of products have no photo |
| 13 | 600-608 Add TypeScript types | 1 hr | Medium | `any` prevents catching bugs |
| 14 | 680-684 Remove unused deps | 10 min | Low | Shaves 30+ kB from bundle |
| 15 | 850-858 Fix sitemap + add posts | 15 min | High | Blog posts not in sitemap |
| 16 | 130-139 Add JSON-LD structured data | 1 hr | High | Rich snippets in Google |
| 17 | 801-806 Add security headers | 15 min | Medium | CSP/HSTS not configured |
| 18 | 900 Purchase domain | 30 min | High | Can't launch without it |
| 19 | 960-968 Full QA test pass | 1 hr | High | Must pass before launch |
| 20 | 280 Build /api/subscribe endpoint | 30 min | Low | Newsletter currently 404s |

## Critical Path (Must Fix Before Launch)

```
1. GET client data (WhatsApp, phone, hours, social)   ← BLOCKER
2. Purchase domain + DNS setup                          ← BLOCKER
3. Replace all [PENDIENTE] values                       ← 30 min
4. Generate + upload product images                     ← 2 hr
5. Fix WhatsApp links across cart and modals            ← 15 min
6. Add structured data                                   ← 1 hr
7. Fix sitemap                                           ← 15 min
8. Security headers                                      ← 15 min
9. Full QA pass                                          ← 1 hr
10. Final build + deploy                                ← 10 min
```

## Files Generated

| File | Coverage |
|------|----------|
| `docs/audit/000-data.md` | Business data, config, location, hours, contact, delivery, legal |
| `docs/audit/100-seo.md` | Titles, meta, Open Graph, structured data, sitemap, keywords, localization |
| `docs/audit/200-ux.md` | Hero, navigation, product cards, grid, promo, stats, features, testimonials, newsletter, footer |
| `docs/audit/300-content.md` | Tone, homepage copy, product descriptions, blog, FAQ, about, contact, legal |
| `docs/audit/400-ecommerce.md` | Cart, WhatsApp flow, payment integration, product model, filtering, accounts, orders |
| `docs/audit/500-images.md` | Product photos, brand images, hero images, SVGs, optimization, OG images |
| `docs/audit/600-code.md` | TypeScript, components, state, data duplication, routing, build config, error handling |
| `docs/audit/700-launch.md` | Mobile (50 items), Performance (50), Security (50), SEO Tech (50), Domain (50), Launch (50) |
