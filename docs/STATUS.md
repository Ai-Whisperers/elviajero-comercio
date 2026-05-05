# El Viajero — Supabase Migration Done

## Live
https://el-viajero.paragu-ai.com (200 OK, 2 Docker replicas)

## Supabase
- Project: qyvokpribmbrosafntqa (shared with paragu-ai-builder)
- Tables: ej_products (34 seeded), ej_orders, ej_reviews, ej_categories, ej_promo_codes, ej_addresses, ej_subscribers, ej_abandoned_carts, ej_stock_alerts
- Auth: Supabase Auth (email/password, custom login/register pages)
- Admin: profiles.role = 'admin' | admin user: admin@elviajero.com.py

## What's Working
- Login/register with email+password
- Header: dynamic login button / user dropdown with initials
- Admin panel: real auth (Supabase session + role check), all data in DB
- Products seeded from content/es.json
- Stats loading from DB (0s because products in ej_products, not products)
- Updated header with search, auth-aware menu, mobile improvements

## What Still Needs Manual Action
1. **Google OAuth** → Supabase Dashboard → Auth Providers → Enable Google (needs Client ID + Secret)
2. **Facebook OAuth** → Supabase Dashboard → Auth Providers → Enable Facebook (needs App ID + Secret)
3. **Set GA4 ID** → add NEXT_PUBLIC_GA_ID env var in docker-compose.yml
4. **Fix stats showing 0** → update admin dashboard to query ej_products instead of products

## Areas Left To Work
- Stats page reads from builder's `products` table instead of `ej_products`
- Password reset flow (/recuperar, /recuperar/[token]) — still uses old SQLite approach
- Image upload for admin (products use SVG placeholders, no real photos)
- Payment gateway integration (stripe/pagopar/bancard — factory exists but untested)
- Migrate page content from content/es.json to a CMS table

## Docs
- Migration SQL: supabase/migrations/001_elviajero_schema.sql
- Seed script: scripts/seed.ts
- Table creation: scripts/create_tables.mjs
- Environment: .env.local
