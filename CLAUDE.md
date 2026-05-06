# El Viajero — AI Agent Guide

## Quick Links
- **Live:** https://el-viajero.paragu-ai.com
- **Repo:** github.com/Ai-Whisperers/elviajero-comercio
- **Local:** /root/elviajero
- **Docker service:** elviajero_web (2 replicas)
- **VPS:** 72.61.44.159
- **Traefik:** Host(`el-viajero.paragu-ai.com`) || Host(`viajero.paragu-ai.com`)

## Architecture
Cloudflare (DNS, SSL) → VPS → Traefik → elviajero_web:3000

## Pages
12 pages: Home, Tienda (catalog), Blog (6 posts), Nosotros, Contacto, FAQ, Promociones, Privacidad, Términos, Sitemap

## Design System
Green (#1B5E20) + orange (#E65100) on light background. Fonts: Inter. Voice: practical, adventurous, Spanish/English/Guaraní.

## Data Layer
**Supabase** (PostgreSQL) — shared project `qyvokpribmbrosafntqa`
- Customer auth: Supabase Auth (email/password, Google, Facebook)
- Tables: profiles, products, categories, orders, addresses, promo_codes, reviews, subscribers, abandoned_carts, stock_alerts
- Admin auth: profiles.role = 'admin'
- Supabase clients: `lib/supabase/server.ts` (SSR), `lib/supabase/browser.ts` (client), `lib/supabase/admin.ts` (service_role)
- Migration: `supabase/migrations/001_elviajero_schema.sql`
- RLS policies on all tables

## Content (Static)
Content in `content/es.json` (and other locales) for page copy.
Dynamic data (products, orders) comes from Supabase.

## Build & Deploy
```bash
npm run build
docker build -t elviajero:prod .
docker stack deploy -c docker-compose.yml elviajero --with-registry-auth
```

## Critical Patterns
- All products in content/es.json (12 products, 6 categories)
- WhatsApp-first ordering (all CTAs go to WhatsApp with prefilled templates)
- Currency toggle (PYG/USD) with localStorage persistence
- Language toggle (ES/EN/GN)
- Dark mode toggle
- Full admin panel

## Client Onboarding
See `docs/client-questionnaire.md` for the full onboarding questionnaire.
See `docs/brand-guide.md` for brand identity details.
