# Supabase Migration — El Viajero ✓

## Completed (90% of code written)

### WP2-5: All Code Rewritten
All code has been migrated from SQLite/localStorage to Supabase:

**Auth:**
- `lib/supabase/server.ts` - SSR Supabase client with cookie management
- `lib/supabase/browser.ts` - Browser client for client components
- `lib/supabase/admin.ts` - Service role client for admin operations
- `lib/supabase/middleware.ts` + `middleware.ts` - Session refresh middleware
- `app/auth/callback/route.ts` - OAuth callback endpoint
- `lib/auth-context.tsx` - Rewritten: Supabase Auth replaces SQLite sessions
- `app/login/page.tsx` - Added Google + Facebook OAuth buttons
- `app/register/page.tsx` - Added social signup

**API Routes (all 10 rewritten):**
- `api/auth` → Supabase Auth (signInWithPassword, signUp, signOut)
- `api/addresses` → addresses table
- `api/orders` → orders table
- `api/products` → products table
- `api/update-profile` → profiles table
- `api/change-password` → supabase.auth.updateUser()
- `api/subscribe` → subscribers table
- `api/cart-recovery` → abandoned_carts table
- `api/stock-alert` → stock_alerts table
- `api/db/*` → Admin routes with service_role client

**Admin Panel (all 11 pages rewritten):**
- `admin/page.tsx` - Dashboard from DB
- `admin/productos` - Full CRUD on products
- `admin/pedidos` - Orders from DB
- `admin/usuarios` - Profiles from DB
- `admin/categorias` - Categories from DB
- `admin/promos` - Promo codes from DB
- `admin/resenas` - Reviews from DB
- `admin/suscriptores` - Subscribers from DB
- `admin/importar` - CSV import to DB
- `admin/reportes` - Reports from DB
- `admin/tema` - UI preference (localStorage, unchanged)
- `components/admin/admin-layout.tsx` - Real auth with role='admin' check

**Infra:**
- `next.config.ts` - Added Supabase image hostname
- `docker-compose.yml` - Removed SQLite volume, added Supabase env vars
- `.env.local` - Created with real keys
- `.env.example` - Template for new devs
- `CLAUDE.md` - Updated with new architecture

## What Still Needs Manual Action (blocked by Supabase access)

### WP1: Create Tables (via Supabase Dashboard)
Run this SQL in the Supabase Dashboard SQL Editor:
```
https://supabase.com/dashboard/project/qyvokpribmbrosafntqa/sql/new
```

SQL file: `/root/elviajero/supabase/migrations/001_elviajero_schema.sql`

This creates all 10 tables + RLS policies + auto-profile trigger.

### WP6: Seed Data
After tables are created, run:
```bash
cd /root/elviajero
npx tsx scripts/seed.ts
```
This seeds products from content/es.json and creates an admin user.

### WP3: Configure OAuth Providers
In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Google → add Client ID + Secret from Google Cloud Console
3. Enable Facebook → add App ID + Secret from Meta Developer
4. Set Site URL: https://el-viajero.paragu-ai.com
5. Add redirect URL: https://el-viajero.paragu-ai.com/auth/callback

### WP7: Deploy
```bash
cd /root/elviajero
docker build -t elviajero:prod .
docker stack deploy -c docker-compose.yml elviajero
```

## Files Changed
- 35+ files written/rewritten
- 0 files deleted (existing SQLite code left in place but no longer called)
- Build passes with zero errors
