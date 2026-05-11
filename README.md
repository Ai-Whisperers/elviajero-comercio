# El Viajero — E-Commerce

**Live:** [https://el-viajero.paragu-ai.com](https://el-viajero.paragu-ai.com)

Full-featured e-commerce store for El Viajero — a Paraguayan outdoor, camping, and fishing equipment retailer. Built on the [ParaguAI Platform](https://paragu-ai.com) with Next.js 15, React 19, Tailwind CSS v4, and Supabase.

## Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15.5 (App Router, SSR/SSG) |
| **UI** | React 19 + Tailwind CSS v4 + Radix UI |
| **Animation** | Framer Motion 12 |
| **Data** | Supabase (PostgreSQL, Auth, Storage) |
| **Auth** | Supabase Auth (email/password, Google, Facebook) |
| **i18n** | Custom ES/EN/GN locale switching |
| **Commerce** | Local workspace packages (`@ai-whisperers/auth`, `@ai-whisperers/commerce`) |
| **Deployment** | Docker (standalone) + Traefik on VPS |

## Features

- **WhatsApp-first ordering** — All CTAs link to WhatsApp with prefilled templates; Evolution API integration for admin notifications
- **Currency toggle** — PYG/USD with `localStorage` persistence
- **Language toggle** — Español, English, Guaraní
- **Dark mode** — System-aware with manual override
- **Admin panel** — 16 pages: products, orders, users, promos, blog, content, reviews, subscribers, B2B, analytics, theme, images
- **Product catalog** — 12 products across 6 categories
- **Loyalty & benefits** — Points system, B2B pricing, stock alerts
- **Blog** — Multi-post blog with SEO metadata

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (for auth & database)

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (admin APIs) |
| `EVOLUTION_API_URL` | Evolution API base URL for WhatsApp |
| `EVOLUTION_API_KEY` | Evolution API key |
| `EVOLUTION_INSTANCE` | Evolution instance name |

## Workspace Packages

This monorepo uses npm workspaces:

- **`packages/auth`** (`@ai-whisperers/auth`) — Supabase clients, auth context, types, storage keys
- **`packages/commerce`** (`@ai-whisperers/commerce`) — Cart context/state management, currency switcher, commerce types

Both are installed from GitHub Packages (`@ai-whisperers` registry).

## Content Management

Static page copy lives in `content/{locale}.json` files (es, en, gn). Dynamic data (products, orders, users) comes from Supabase.

## Database

Supabase PostgreSQL with the following tables:
`profiles`, `products`, `categories`, `orders`, `order_items`, `addresses`, `promo_codes`, `reviews`, `subscribers`, `abandoned_carts`, `stock_alerts`

Migrations: `supabase/migrations/`

## Build & Deploy

```bash
# Build
npm run build

# Docker
docker build -t elviajero:prod .
docker stack deploy -c docker-compose.yml elviajero --with-registry-auth
```

## Design System

- **Colors:** Green `#1B5E20` (primary), Orange `#E65100` (accent)
- **Font:** Inter
- **Voice:** Practical, adventurous — Spanish/English/Guaraní

## Pages

Home, Tienda (catalog), Product detail (12 products), Blog (6+ posts), Nosotros (About), Contacto, FAQ, Promociones, Privacidad, Términos, Sitemap, Checkout, Order lookup, My Account (profile, orders, addresses, favorites, benefits, settings), Register, Login, Password recovery.

Admin panel: Dashboard, Products, Orders, Users, Categories, Promos, Blog, Content editor, Subscribers, Reviews, B2B clients, Analytics, Theme, Image upload.

## License

Private — © 2025–2026 Ai-Whisperers
