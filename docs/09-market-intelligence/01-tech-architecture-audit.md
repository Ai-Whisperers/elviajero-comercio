# El Viajero — Tech Architecture & Code Audit

Date: May 8, 2026
Audit depth: Full source-level analysis

---

## 1. Build Baseline

| Metric | Value |
|--------|-------|
| Node modules total | 554MB |
| Standalone build | 69MB |
| Pages (static + dynamic) | 88 routes |
| Components | 103 files |
| Lib modules | 31 files |
| API routes | 25+ |
| Content file | 71KB / 1990 lines |
| Docker image | 365MB |
| RAM limit | 512MB |
| Replicas | 2 |

---

## 2. @ai-whisperers Packages — Value vs Bloat

### Actually imported in source code:
| Package | Used in | What for |
|---------|---------|----------|
| `@ai-whisperers/auth` | 20+ files | AuthProvider, useAuth, createClient, createAdminClient |
| `@ai-whisperers/commerce` | 14 files | useCart, CartProvider, CurrencySwitcher, types |

### NOT imported anywhere in source code (dead weight):
| Package | Size | Status |
|---------|------|--------|
| `@ai-whisperers/admin` | 116K | ZERO imports |
| `@ai-whisperers/api-helpers` | 84K | ZERO imports |
| `@ai-whisperers/catalog` | source | ZERO imports |
| `@ai-whisperers/checkout` | source | ZERO imports |
| `@ai-whisperers/i18n` | 220K | ZERO imports |
| `@ai-whisperers/payments` | 36K | ZERO imports |
| `@ai-whisperers/product` | source | ZERO imports |
| `@ai-whisperers/seo` | 52K | ZERO imports |
| `@ai-whisperers/theme` | 84K | ZERO imports |
| `@ai-whisperers/ui-extras` | 324K | ZERO imports |
| `@ai-whisperers/whatsapp` | 52K | ZERO imports |
| `@ai-whisperers/product` (devDep) | source | Duplicate |
| `@ai-whisperers/checkout` (devDep) | source | Duplicate |
| `@ai-whisperers/catalog` (devDep) | source | Duplicate |
| `@ai-whisperers/ui-extras` (devDep) | source | Duplicate |
| `@ai-whisperers/payments` (devDep) | source | Duplicate |
| `@ai-whisperers/api-helpers` (devDep) | source | Duplicate |

**11 of 17 packages are dead weight.** 6 are duplicated in both deps and devDeps.

### Component-level duplication
Every export from unused packages has an identical local implementation:
- 19 components match `@ai-whisperers/product`
- 9 components match `@ai-whisperers/commerce` (but commerce IS used)
- 7 components match `@ai-whisperers/catalog`
- 16 components match `@ai-whisperers/ui-extras`

**Recommendation:** Remove all 17 @ai-whisperers package references. The 2 actually-used packages are thin wrappers over Supabase + React context that could be inlined. This removes the GitHub npm registry dependency, NODE_AUTH_TOKEN requirement, and simplifies deployment.

---

## 3. Content Duplication

`content/es.json` has the same product data duplicated in two sections:
- `home.productCatalog.products` — 34 products
- `home.featuredProducts.products` — same products, subset
- `productos.list` — same 34 products again

~12KB of pure duplication. Products are also stored in Supabase (ej_products table with 34 rows). The content file products appear to be a static fallback that's never used since the API routes query Supabase directly.

**Recommendation:** Remove static product data from content/es.json. Keep only page copy, navigation, and UI text. Products should be 100% Supabase-driven.

---

## 4. Security Issues

| Severity | Issue | Location |
|----------|-------|----------|
| CRITICAL | Hardcoded Supabase keys in version control | docker-compose.yml lines 13-14 |
| HIGH | GitHub PAT in .npmrc (not gitignored) | .npmrc |
| MEDIUM | No Content-Security-Policy header | next.config.ts |
| LOW | NEXT_PUBLIC_ vars baked into Docker build | Dockerfile ARG/ENV |
| LOW | TypeScript shipped in production image | 8.7MB typescript.js in node_modules |

---

## 5. Build & Infrastructure

### Dockerfile issues
- TypeScript compiler shipped to production (8.7MB)
- NODE_AUTH_TOKEN build-time dependency blocks CI without VPN
- NEXT_PUBLIC_ env vars are build-time ARGs instead of runtime ENV

### Docker compose issues
- 2 replicas at 512MB each is tight for Node.js 20 standalone
- Keys in compose file should be docker secrets or .env file
- Traefik labels work but port mapping 3000 is unused (swarm routes via network)

### Deployment
- deploy.sh builds + deploys but doesn't tag with git hash for rollback
- No CI/CD pipeline beyond the single script
- No canary or blue-green deploy

---

## 6. Code Quality

### Mixed import patterns
Some files import from `@ai-whisperers/auth/supabase/*` while others use local `lib/supabase/*` equivalents. Both exist with identical implementations.

### Large client components
The homepage (`app/page.tsx`) is 373 lines of client-side code with inline state management. Should be split into smaller components.

### Missing error boundaries
Most API routes have try/catch but no structured error responses. The admin panel shows skeleton loaders but no error recovery.

### Tests
Jest configured with 2 test files found in `__tests__/` — minimal coverage for a 88-page application.

---

## 7. Performance

### Good
- Most page chunks are 20-28KB (client bundle)
- Static pages where possible (most pages are prerendered)
- Image optimization (Next.js Image component)
- Standalone output mode

### Needs work
- 188KB framework chunk is large (could code-split)
- No bundle analysis ran
- No Core Web Vitals monitoring
- No image CDN beyond Next.js built-in
- No service worker / PWA
- No lazy loading for below-fold content
