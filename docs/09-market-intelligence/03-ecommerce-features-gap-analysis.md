# El Viajero — E-Commerce Features Gap Analysis

Date: May 8, 2026
Comparison: Current state vs best-in-class LATAM e-commerce benchmarks

---

## Feature Status Matrix

| Feature | Status | Priority | Impact | Notes |
|---------|--------|----------|--------|-------|
| Shopping cart | ✅ Done | — | — | Basic cart with sidebar |
| Product catalog | ✅ Done | — | — | 6 categories, 34 products |
| Search & filters | ✅ Done | — | — | Autocomplete, category filters |
| User accounts | ✅ Done | — | — | Supabase auth, profile mgmt |
| Blog | ✅ Done | — | — | 6 posts, categories |
| Admin panel | ✅ Done | — | — | 15 pages |
| WhatsApp integration | ✅ Done | — | — | Float button, manual |
| Newsletter | ✅ Done | — | — | Footer signup |
| Promo codes | ✅ Done | — | — | Via Supabase |
| Product reviews | ✅ Done | — | — | With ratings |
| Recently viewed | ✅ Done | — | — | localStorage |
| Compare products | ✅ Done | — | — | Basic implementation |
| Exit intent popup | ✅ Done | — | — | With offer |
| Cookie consent | ✅ Done | — | — | EU-style |
| Dark mode | ✅ Done | — | — | Toggle |
| Currency toggle | ✅ Done | — | — | PYG/USD |
| Language toggle | ✅ Done | — | — | ES/EN/GN |
| Order tracking | ✅ Basic | P1 | High | Basic order status |
| — | — | — | — | — |
| **Live payments** | ❌ Missing | **P0** | **Blocking** | Pagopar/Bancard keys not set |
| **Abandoned cart recovery** | ❌ Missing | **P0** | **High** | Cart recovery API exists but inactive |
| **Shipping calculator** | ❌ Missing | **P0** | **High** | 63% abandon due to surprise shipping |
| Google Analytics 4 | ❌ Missing | P1 | High | No conversion tracking |
| Google Search Console | ❌ Missing | P1 | High | No search performance data |
| Product schema markup | ❌ Missing | P1 | High | Missing from product pages |
| Breadcrumb schema | ❌ Missing | P1 | Medium | Affects SERP display |
| FAQ schema | ❌ Missing | P1 | Medium | For blog/FAQ pages |
| Review schema | ❌ Missing | P1 | Medium | Stars in search results |
| Google Business Profile | ❌ Missing | P1 | High | Not claimed/optimized |
| MercadoLibre listing | ❌ Missing | P1 | High | 65% market share |
| Facebook Shops | ❌ Missing | P1 | Medium | Integrated checkout |
| WhatsApp Business API | ❌ Missing | P1 | High | Manual only, no automation |
| Push notifications | ❌ Missing | P2 | Medium | Browser push |
| Customer segmentation | ❌ Missing | P2 | Medium | RFM-based marketing |
| Email automation | ❌ Missing | P2 | Medium | Behavioral flows |
| Order tracking UX | ❌ Missing | P2 | Medium | Branded tracking page |
| PWA / offline mode | ❌ Missing | P2 | Medium | Service worker |
| Loyalty program | ❌ Missing | P2 | Low-Med | Points system |
| B2B / bulk pricing | ❌ Missing | P2 | Medium | Volume discounts |
| Rental booking | ❌ Missing | P3 | Medium | Gear rental |
| Multi-warehouse | ❌ Missing | P3 | Low | Single location |
| POS integration | ❌ Missing | P3 | Low | Real-time inventory sync |

---

## P0 — Blocking Revenue

### 1. Live Payments
- Pagopar and Bancard configured in docker-compose.yml but keys not set
- No Stripe keys either
- Site cannot process real payments
- **Fix:** Set Pagopar public/private keys + Bancard keys from client

### 2. Abandoned Cart Recovery
- 70% cart abandonment industry average
- Best-in-class recovers 18-22%
- For a store with the current traffic: potentially $X,XXX/month in recovered revenue
- **Quick win:** Use existing WhatsApp integration to send cart reminder messages
- Cart recovery API endpoint already exists at `/api/cart-recovery`

### 3. Shipping Calculator
- 63% of cart abandonment due to unexpected shipping costs
- No live calculation during checkout
- **Fix:** API endpoint exists at `/api/shipping` but needs carrier integration

---

## P1 — High Impact

### Analytics & Measurement
- GA4 enhanced e-commerce tracking would reveal: conversion funnel leaks, top products, customer lifetime value
- GSC needed for search performance data
- Meta Pixel (now Conversion API) for ad attribution

### Structured Data (SEO)
- Product schema (review stars, price, availability in search results)
- BreadcrumbList (breadcrumb in SERP)
- FAQ schema (expandable in search)
- Review schema (star ratings in SERP)

### Marketplaces & Social Commerce
- MercadoLibre = 65% of Paraguayan e-commerce. Not being on it means leaving money on the table
- Facebook Shops / Instagram Shopping for in-app checkout
- Mercado Ads for retail media (growing $2B market in LATAM)

### WhatsApp Automation
- Manual WhatsApp float button → automate with WhatsApp Business API
- Use cases: abandoned cart recovery, order confirmations, shipping updates, promotions
- Several local providers (Woztell, Unify360, Wopy) can set this up

---

## P2 — Growth Features

### Customer Retention
- Order tracking page with branded UI and real-time status
- Push notifications for order updates
- Email automation flows: welcome, browse abandonment, post-purchase follow-up, re-engagement
- Loyalty program: points per purchase, birthday rewards, referral bonuses

### Personalization
- Customer segmentation (new vs returning, high vs low spend, category preference)
- Product recommendations based on browsing/purchase history
- Personalized email content

### B2B & Wholesale
- Bulk pricing tiers (e.g., 10+ units, 50+ units)
- B2B registration flow (request quote, net terms)
- Corporate account management

---

## P3 — Long-term

### Experience & Platform
- PWA with service worker for offline mode and installability
- Rental booking system (specific items, date range, deposit)
- Multi-warehouse / multi-location inventory
- Real-time POS-to-website inventory sync
- Advanced analytics dashboard with revenue forecasting
