# El Viajero — Executive Summary: All Areas of Improvement

Date: May 8, 2026

This document consolidates all research findings into a single prioritized roadmap.

---

## 5 Domains × 40+ Improvement Areas

### A. TECHNOLOGY & ARCHITECTURE (10 areas)

| # | Area | Current State | Target State | Priority |
|---|------|--------------|--------------|----------|
| A1 | @ai-whisperers packages | 17 packages, 11 unused, 6 duplicated | Remove all, inline the 2 used ones | P1 |
| A2 | Private npm registry | .npmrc with GitHub PAT, breaks CI without VPN | Eliminate dependency | P1 |
| A3 | Content duplication | Products duplicated in es.json (71KB) and Supabase | Single source of truth (Supabase) | P2 |
| A4 | Dockerfile optimization | 365MB image, TypeScript shipped, ARG vs ENV confusion | Slim to 250MB, runtime env vars | P2 |
| A5 | Security: keys in version control | Supabase keys in docker-compose.yml (committed) | Docker secrets or .env only | P0 |
| A6 | Security: CSP header | Missing | Add to next.config.ts | P2 |
| A7 | Build pipeline | Manual deploy.sh, no CI/CD | Automated CI/CD | P2 |
| A8 | Test coverage | 2 Jest test files for 88 pages | Minimum smoke tests per page | P2 |
| A9 | Performance monitoring | None | GA4 + GSC + CWV monitoring | P1 |
| A10 | Error handling | Basic try/catch in API routes | Structured error responses, error boundaries | P2 |

### B. E-COMMERCE FEATURES (12 areas)

| # | Area | Current State | Target State | Priority |
|---|------|--------------|--------------|----------|
| B1 | **Live payments** | Pagopar/Bancard/Stripe keys not set | Activate Pagopar primary | **P0** |
| B2 | **Abandoned cart recovery** | API exists, not active | WhatsApp + email recovery flows | **P0** |
| B3 | **Shipping calculator** | Missing | Carrier integration with live rates | **P0** |
| B4 | Order tracking UX | Basic status page | Branded tracking with timeline + notifications | P1 |
| B5 | PWA / offline mode | Missing | Service worker, install prompt, offline cart | P2 |
| B6 | Push notifications | Missing | Browser push for order updates | P2 |
| B7 | Customer segmentation | None | RFM-based segments | P2 |
| B8 | Email automation | Newsletter only | Behavioral flows (welcome, browse, post-purchase) | P2 |
| B9 | Loyalty program | None | Points per purchase, referral, birthday rewards | P3 |
| B10 | B2B / bulk pricing | None | Volume tiers, B2B registration | P2 |
| B11 | POS integration | Manual sync | Real-time inventory sync with physical store | P3 |
| B12 | Rental system | Not applicable | Item booking, deposits, availability calendar | P3 |

### C. SEO & MARKETING (12 areas)

| # | Area | Current State | Target State | Priority |
|---|------|--------------|--------------|----------|
| C1 | GA4 enhanced e-commerce | Not set up | Full tracking (funnel, products, revenue) | **P0** |
| C2 | Google Search Console | Not set up | Performance monitoring, query analysis | P1 |
| C3 | Google Business Profile | Not optimized | Complete profile, photos, reviews, posts | P1 |
| C4 | Structured data | Basic schema only | Product, breadcrumb, FAQ, review schemas | P1 |
| C5 | Local directories | None | Paginas Amarillas, Infonegocios, etc. | P1 |
| C6 | MercadoLibre presence | None | Seller account, product listings, Mercado Ads | P1 |
| C7 | Facebook Shops | None | In-app checkout, Instagram Shopping | P1 |
| C8 | WhatsApp Business API | Manual float button | Automated: cart recovery, orders, support | P1 |
| C9 | Influencer marketing | None | Micro-influencer program (5K-50K followers) | P2 |
| C10 | TikTok strategy | None | Short-form video content | P2 |
| C11 | Guarani content | No Guarani | Bilingual content strategy | P3 |
| C12 | Voice search optimization | None | FAQ pages, conversational content, schema | P3 |

### D. BUSINESS GROWTH (8 areas)

| # | Area | Current State | Target State | Priority |
|---|------|--------------|--------------|----------|
| D1 | Cross-border (Brazil) | Nothing | CDE pickup, BRL+PIX, Portuguese content | P2 |
| D2 | B2B corporate sales | Nothing | Retreat kits, volume pricing, LinkedIn | P2 |
| D3 | Warranty & repair | Nothing | In-house repair + warranty handling | P2 |
| D4 | Gear rental program | Nothing | 10-15 items for rent, daily/weekly pricing | P2 |
| D5 | Content marketing | 6 blog posts | 50 articles, YouTube channel, destination guides | P2 |
| D6 | Affiliate program | Nothing | 10% commission for micro-influencers | P2 |
| D7 | Social media strategy | Inconsistent | 3-5x/week Instagram, daily Facebook, 2-3x/week TikTok | P2 |
| D8 | Cross-border (Argentina) | Nothing | Mercado Libre Argentina, nocnoc | P3 |

### E. COMPLIANCE & REGULATORY (3 areas)

| # | Area | Current State | Target State | Priority |
|---|------|--------------|--------------|----------|
| E1 | Data protection (Law 6534/2020) | Privacy policy exists | Full consent records, opt-out mechanisms | P1 |
| E2 | GDPR prep (Law 7593/25, Nov 2027) | Nothing | DPO appointment, DPIA, breach notification | P2 |
| E3 | SMS marketing compliance | Not applicable | Bilingual (ES/GN) consent, opt-out keywords | P3 |

---

## Top 10 Immediate Actions (Week 1)

| # | Action | Domain | Effort | Impact |
|---|--------|--------|--------|--------|
| 1 | Set Pagopar/Bancard API keys | B1 | 30 min | **Revenue unlock** |
| 2 | Activate cart recovery API + WhatsApp | B2 | 2-4h | Recovery 10-20% of abandoned carts |
| 3 | Set up GA4 enhanced e-commerce | C1 | 2h | Measurement foundation |
| 4 | Set up Google Search Console | C2 | 30 min | Search performance data |
| 5 | Claim/optimize Google Business Profile | C3 | 1h | #1 local SEO factor |
| 6 | Register on local directories | C5 | 2h | Local citation building |
| 7 | Add Product + Breadcrumb + FAQ schema | C4 | 2h | SERP visibility boost |
| 8 | Implement shipping calculator | B3 | 4-8h | Reduce cart abandonment |
| 9 | Build WhatsApp automation | C8 | 8-16h | 24/7 sales + support |
| 10 | Remove dead @ai-whisperers packages | A1 | 4h | Simplify build, remove PAT dependency |

---

## Estimated Impact

| Metric | Current | With improvements (6 months) |
|--------|---------|------------------------------|
| Conversion rate | Unknown (no analytics) | 2-3% (industry avg) |
| Monthly orders | 0 (payments not live) | 50-200 |
| Average order value | Unknown | ~$50-80 |
| Monthly revenue | $0 | $2,500-$16,000 |
| SEO traffic | Minimal | 500-2,000 monthly organic visits |
| Customer acquisition | Passive | Active via MercadoLibre + Meta Ads + SEO |
