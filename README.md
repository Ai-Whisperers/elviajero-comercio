# El Viajero — E-commerce

Camping, pesca, accesorios outdoor y más en Paraguay.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Deployment:** Docker Swarm on VPS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password, Google, Facebook)
- **Analytics:** Google Analytics (GA4) + Vercel Analytics
- **Domain:** tiendaelviajero.com.py

## Pages

Home, Tienda (catalog), Blog (6 posts), Nosotros, Contacto, FAQ, Promociones, Privacidad, Términos

## Getting Started

```bash
npm install
cp .env.example .env.local  # fill in Supabase keys
npm run dev
```

## Deploy

```bash
npm run build
docker build -t elviajero:prod .
docker stack deploy -c docker-compose.yml elviajero --with-registry-auth
```
