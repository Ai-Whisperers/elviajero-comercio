# El Viajero — Upgrade Plan

> Phased implementation roadmap based on confirmed client answers.
> Updated: 2026-04-30

---

## Phase 0: Fix Config Errors (Immediate — 1 session)

Fix the inaccuracies in `site.json` and content that contradict the source of truth.

| # | Task | File | Effort |
|---|------|------|--------|
| 0.1 | Rename business to "El Viajero" everywhere | `site.json`, `content/es.json` | 10 min |
| 0.2 | Fix address to Mariano Roque Alonso, La Concordia, Cnel. Felipe Toledo | `site.json` | 5 min |
| 0.3 | Remove placeholder email — add note that email comes with domain | `site.json`, `content/es.json` | 5 min |
| 0.4 | Fix founded year to ~2025 | `site.json` | 2 min |
| 0.5 | Update hours to open every day, continuado | `site.json` | 5 min |
| 0.6 | Set delivery zones to "Todo Paraguay" | `site.json` | 5 min |

## Phase 1: Logo + Brand Identity (Session 1-2)

**Budget**: Included in base package (logo design)
**Client confirmed**: No logo exists, needs one, has ideas

| # | Task | Deliverable | Effort |
|---|------|-------------|--------|
| 1.1 | Logo concept (nature/outdoor, green/blue/black palette, rústico style) | 2-3 proposals | 1 hr |
| 1.2 | Logo refinement based on feedback | Final logo (PNG + SVG) | 30 min |
| 1.3 | Brand color palette finalization | Token overrides | 15 min |
| 1.4 | Favicon + apple-touch-icon from logo | Brand images | 15 min |
| 1.5 | OG default image (logo on brand bg) | OG image | 15 min |

## Phase 2: Real Product Images (Session 2-3)

**Client confirmed**: Has some photos, can share. No logo.
**All images currently**: Unsplash placeholders.

| # | Task | Detail | Effort |
|---|------|--------|--------|
| 2.1 | Collect product photos from client | WhatsApp/Drive transfer | — |
| 2.2 | Create brand hero image (outdoor scene, storefront or product collage) | 1920×1080 | 30 min |
| 2.3 | Create category cover images (camping, pesca, etc.) | 6 images | 30 min |
| 2.4 | Wire images into `images.json` and content | Config | 15 min |

## Phase 3: Product Seed + Commerce DB (Session 2-3)

**Client confirmed**: 50-200 products, wants online catalog with cart + payment.
**Seed exists**: 96 products in `src/content/commerce-seeds/viajero_comercio.seed.json`
**Script exists**: `scripts/seed-viajero-commerce.ts`

| # | Task | Detail | Effort |
|---|------|--------|--------|
| 3.1 | Review/trim product seed against client's actual inventory | Align seed JSON | 30 min |
| 3.2 | Add `precioAnterior` / `precioActual` fields if schema supports it | Schema + seed | 20 min |
| 3.3 | Run seed script to populate Supabase | `npx tsx scripts/seed-viajero-commerce.ts` | 5 min |
| 3.4 | Verify commerce-catalog renders products | Manual check | 10 min |

## Phase 4: Full E-Commerce Features (Session 3-4)

**Client wants**: Cart, online payment (credit/debit via pasarela), user registration/login.
**Also wants**: WhatsApp ordering as complement.

| # | Task | Detail | Effort |
|---|------|--------|--------|
| 4.1 | Enable cart + checkout for viajero-comercio | Config + API | 1 hr |
| 4.2 | Configure payment gateway (credit/debit via pasarela) | Pagopar or Bancard | 1 hr |
| 4.3 | Enable user registration / login | Supabase Auth config | 30 min |
| 4.4 | Price display: show "precio anterior" + "precio actual" | Product card component | 30 min |
| 4.5 | Promotional banner system (seasonal offers, gift combos) | PromoBanner config | 30 min |

## Phase 5: Site Content Polish (Session 3-4)

**Owner wants**: Weekly updates, full admin access.

| # | Task | Detail | Effort |
|---|------|--------|--------|
| 5.1 | About page — write store story based on questionnaire | Content | 20 min |
| 5.2 | FAQ — populate with real questions/products | Content | 20 min |
| 5.3 | Contact page — verify map coordinates | Config | 10 min |
| 5.4 | Testimonials — add if client has any | Content | 15 min |

## Phase 6: Domain + Launch (Session 4-5)

**Client wants**: `tiendaelviajero.com.py`

| # | Task | Detail | Effort |
|---|------|--------|--------|
| 6.1 | Register domain (Hostinger or partner registrar) | External | — |
| 6.2 | Set up domain email | External | — |
| 6.3 | Configure Cloudflare DNS + Pages domain | Config | 20 min |
| 6.4 | Final QA pass | Checklist | 30 min |
| 6.5 | Launch | Deploy | 10 min |

---

## Effort Summary

| Phase | Tasks | Estimated Time | Client Cost |
|-------|-------|---------------|-------------|
| 0: Fix config | 6 micro-tasks | 30 min | Included |
| 1: Logo + brand | 5 tasks | 2 hr | Design fee |
| 2: Images | 4 tasks | 1 hr | Included |
| 3: Product seed | 4 tasks | 1 hr | Included |
| 4: E-commerce | 5 tasks | 3-4 hr | Dev fee |
| 5: Content | 4 tasks | 1 hr | Included |
| 6: Domain + launch | 5 tasks | 1 hr | Domain cost |
| **Total** | **33 tasks** | **~10 hr** | |

## What Client Chose (from questionnaire)

- **Budget**: Unsure — needs recommendation
- **Timeline**: ASAP (1-2 weeks)
- **Access**: Full — owner manages site themselves
- **Updates**: Weekly

---

## Reference Files

| File | Purpose |
|------|---------|
| `docs/source-of-truth.md` | All confirmed client answers |
| `docs/questionnaire.md` | Raw completed questionnaire |
| `docs/research.md` | Competitor research (40+ stores) |
| `docs/competition-dossier.md` | Deep competitive analysis |
| `docs/storefront-redesign.md` | 100-item UX redesign plan |
| `site.json` | Live site configuration |
| `content/es.json` | Site content (needs updates per Phase 0) |
