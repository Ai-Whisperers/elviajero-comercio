# El Viajero — 100-Item Storefront Redesign Plan

> Deep research de mejores practicas UX/UI, arquitectura de componentes, herramientas y patrones
> Basado en: analisis del codebase (55+ componentes commerce, 19 API routes, 35+ lib modules), revision de mejores practicas REI/Decathlon/Backcountry/Patagonia/MercadoLibre, y estado actual del sitio

---

## Arquitectura Actual del Codebase

### Mapa de Componentes Commerce (55 archivos)

```
web/components/commerce/          → 48 componentes de UI
web/lib/commerce/                 → 35 modulos de logica/data
web/app/api/storefront/[site]/    → 17 endpoints REST
web/app/s/[locale]/[site]/tienda/ → 3 pages (page.tsx + 2 categoria)
web/app/s/[locale]/[site]/        → PDP, carrito, checkout, favoritos, quiz
```

### Problemas Estructurales Identificados

1. **Hardcoding de fun4me**: `trust-strip.tsx` defaults, `tienda-toolbar.tsx` TAG_GROUPS, `discreet-mode-toggle.tsx`, `tienda-quick-filters.tsx`, `product-finder-quiz.tsx` — todos asumen contenido de sex shop
2. **Sin sistema de per-tenant overrides**: No hay mecanismo para que `viajero-comercio` tenga trust items, category tiles, o filters distintos a fun4me sin modificar componentes compartidos
3. **Sin SSR para data del sitio**: La pagina de tienda usa `force-dynamic` (correcto), pero los trust items y category configs son estaticos
4. **Imagenes**: `next/image` con `fill` y `object-cover` ya optimiza OK, pero aspect ratio default es 4:5 (correcto) y las imagenes reales son placeholder de Unsplash

---

## PARTE 1: UX / UI — 50 Items

### SECCION A: Hero / Identidad de Pagina (Items 1-7)

**1. Hero section aspiracional en /tienda**
- Estado: No existe. Empieza directo con "Nuestra tienda" h1
- Accion: Agregar hero section arriba del grid con imagen de fondo outdoor (montaña/bosque al amanecer), headline "Equipate para tu proxima aventura", mini-CTAs a categorias
- Referencia: REI /tienda tiene hero con foto de expedicion
- Implementacion: Nueva Server Component `TiendaHero`, recibe site data de loader
- Archivo: `web/components/commerce/tienda-hero.tsx`
- Dependencias: `next/image`, `loadSite(siteSlug)` para obtener tokens de color

**2. Headline contextual por busqueda/filtro**
- Estado: "Nuestra tienda" siempre, incluso cuando hay filtros activos
- Accion: Si hay busqueda → "Resultados para \"[query]\"" | Si hay categoria → "[Categoria]" | Si hay filtros → "[N] productos filtrados"
- Referencia: Backcountry cambia el H1 segun contexto
- Implementacion: Logica condicional en `TiendaPage` basada en `searchParams`
- Archivo: `web/app/s/[locale]/[site]/tienda/page.tsx`

**3. Imagen hero con overlay de gradiente**
- Estado: No hay hero
- Accion: Overlay gradiente `from-[var(--primary)]/80 to-transparent` sobre la imagen hero, con texto blanco
- Referencia: Patagonia usa overlay oscuro con texto blanco brillante
- CSS: `bg-gradient-to-r from-black/60 to-transparent`

**4. Hero con CTA dual: "Ver Catalogo" + "Hablanos por WhatsApp"**
- Estado: No existe
- Accion: Dos botones bajo el headline — primary (ver catalogo → scroll al grid) y secondary (WhatsApp → link wa.me)
- Referencia: Practica standard en e-commerce outdoor

**5. Mini category CTAs en hero**
- Estado: Las categorias estan solo en toolbar y tiles abajo
- Accion: En el hero, mostrar las 3-4 categorias principales como pills clickeables
- Referencia: Decathlon muestra deportes principales en hero

**6. Animacion de entrada en hero**
- Estado: Sin animaciones
- Accion: `animate-fade-in` con `animation-delay` escalonado para headline, subheadline, CTAs
- Referencia: tailwind.config.js ya tiene `fade-in`, `slide-up`, `fade-up` keyframes
- CSS: Usar `animate-fade-up` con `animation-delay: 100ms, 200ms, 300ms`

**7. Hero responsive: mobile vs desktop**
- Estado: No existe, no aplica
- Accion: Hero con `aspect-video` en desktop, `aspect-[4/5]` en mobile (imagen mas cuadrada, texto superpuesto)
- Implementacion: `media query` en Tailwind

### SECCION B: Category Navigation (Items 8-15)

**8. Category tiles con imagen de fondo**
- Estado: Tiles actuales tienen iconos SVG y fondo degradado de color. Buenos pero planos.
- Accion: Cada tile deberia tener una foto representativa de la categoria como fondo (fondo oscurecido con overlay, texto blanco)
- Referencia: MercadoLibre, Falabella usan fotos de productos en categorias
- Archivo: `web/components/commerce/tienda-category-tiles.tsx`
- Implementacion: `backgroundImage: url(...)` con overlay `bg-black/40`

**9. Mas tiles por fila (3x3 en vez de 2x4)**
- Estado: `grid-cols-2 sm:grid-cols-4` — 2 en mobile, 4 en desktop
- Accion: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` — tiles mas cuadrados y grandes
- Referencia: Airbnb muestra 4 columnas de categorias limpias
- Archivo: `tienda-category-tiles.tsx`

**10. Category tiles con hover efecto "pop"**
- Estado: `hover:-translate-y-0.5 hover:shadow-md` — sutil pero poco wow
- Accion: Agregar `hover:scale-[1.02]` + `transition-transform duration-300` + sombra mas pronunciada
- Referencia: Backcountry usa hover scale sutil

**11. Iconos de categoria en los pills del toolbar**
- Estado: Ya implementado (item #6 anterior) con emojis 🏕️🎣🎒
- ✅ Verificar que se deployó correctamente
- Archivo: `web/components/commerce/tienda-toolbar.tsx`

**12. Categoria "Todo" prominente**
- Estado: Aparece solo cuando hay filtros activos
- Accion: Siempre mostrar "Todo" como primer pill, con count total
- Referencia: MercadoLibre siempre muestra "Todos" primero

**13. Quick category scroll horizontal en mobile**
- Estado: Las categorias se wrappean en filas
- Accion: En mobile, las categorias deberian ser scroll horizontal con `overflow-x-auto` y `scroll-snap-type`
- Referencia: Instagram, Pinterest usan scroll horizontal de categorias
- CSS: `flex overflow-x-auto gap-2 snap-x snap-mandatory`

**14. Imagenes placeholder para categorias sin foto**
- Estado: Todas las categorias usan iconos SVG
- Accion: Para las tiles, usar emojis como fallback si no hay imagen disponible, y un color de fondo distintivo por categoria
- Referencia: Slack usa emojis como iconos de canal

**15. Badge de cantidad en tiles**
- Estado: Ya muestra count
- ✅ Ya implementado: `{tile.count > 0 ? ...${tile.count} : ''}`

### SECCION C: Product Grid & Cards (Items 16-28)

**16. Grid: 3 columnas desktop en vez de 4**
- Estado: `lg:grid-cols-4`
- Accion: Cambiar a `lg:grid-cols-3`. Productos mas grandes = mas detalle visual = mejor conversion
- Referencia: Patagonia, Backcountry, Outdoor Voices usan 3 cols en desktop
- Archivo: `web/app/s/[locale]/[site]/tienda/page.tsx` linea del grid

**17. 1 columna en mobile en vez de 2**
- Estado: `min-[420px]:grid-cols-2`
- Accion: `grid-cols-1` en mobile. 2 columnas en mobile es muy angosto para productos con descripcion
- Referencia: Casi todo e-commerce premium usa 1 columna mobile
- Dato: Pruebas A/B muestran que 1 columna en mobile puede aumentar conversion hasta 15%

**18. Gap mas amplio entre cards**
- Estado: `gap-5 sm:gap-6 lg:gap-8`
- Accion: `gap-6 sm:gap-8 lg:gap-10`. Mas aire entre productos = cada producto se destaca mas
- Referencia: Apple Store usa gaps generosos

**19. Imagenes con aspect-ratio 4:5 (actual)**
- Estado: El componente `ProductImage` ya usa `aspect-[4/5]` como default
- ✅ Correcto: 4:5 es el estandar de Google Shopping y da 25% mas altura que 1:1
- Archivo: `web/components/commerce/product-image.tsx`

**20. Marca visible en cada card**
- Estado: No existe campo marca en la card
- Accion: Leer `product.brand` del schema y mostrarlo como texto small-caps arriba del nombre
- Schema: El schema `Product` ya tiene `brand: string | null` (definido en `products.ts`)
- Archivo: `web/components/commerce/product-card.tsx`

**21. Hover image swap (ya existe)**
- Estado: Ya implementado — cuando hay 2+ imagenes, la segunda aparece en hover
- ✅ Verificar funcionamiento

**22. Badge "Nuevo" condicional (ya existe)**
- Estado: Ya implementado — muestra "NUEVO" si createdAt < 14 dias y no es seed
- ✅ Funciona

**23. Badge "Envio gratis" en card (NUEVO)**
- Estado: Ya implementado — muestra badge verde cuando `priceCents >= 300000`
- ✅ Verificar deploy

**24. Cuotas sin interes en card (NUEVO)**
- Estado: Ya implementado via `InstallmentLine` + config en `lib/commerce/installments.ts`
- ✅ Verificar deploy

**25. Review stars con placeholder**
- Estado: Muestra stars solo si hay reviews reales
- Accion: Si no hay reviews, mostrar "Nuevo · Se el primero en opinar" como texto suave
- Referencia: Backcountry muestra count aunque sea 0
- Archivo: `web/components/commerce/product-card.tsx`

**26. Quick view modal lazy-loaded (ya existe)**
- Estado: `QuickViewModal` con `dynamic(() => import(...), { ssr: false })` — ~8kb de JS que solo se carga al hacer click
- ✅ Excelente practica

**27. Wishlist heart (ya existe)**
- Estado: Boton de corazon con estado persistente via cookie
- ✅ Funciona

**28. Badge "Bajo stock" (ya existe)**
- Estado: Muestra "¡Ultimas N!" cuando inventory_qty <= low_stock_threshold
- ✅ Funciona

**29. CTA "Agregar al carrito" con feedback de carga**
- Estado: Muestra "Agregando..." mientras la promesa de addItem esta pendiente
- ✅ Funciona

**30. Color swatches en card (futuro)**
- Estado: No aplica (productos no tienen variantes de color en el schema actual)
- Accion: Si se agregan variantes, mostrar mini circulos de color en la card
- Referencia: Decathlon, REI muestran swatches de color

### SECCION D: Trust & Social Proof (Items 31-38)

**31. Trust strip contextual por tenant (NUEVO)**
- Estado: Ya implementado — viajero-comercio tiene trust items custom (envio gratis, WhatsApp, pagos, cambios)
- ✅ Verificar deploy

**32. Free shipping threshold config para viajero**
- Estado: `lib/commerce/shipping-threshold.ts` solo tiene `fun4me: 20_000_000`
- Accion: Agregar `'viajero-comercio': 30_000_000` (Gs. 300.000)
- Impacto: El cart drawer mostrara la barra de progreso de envio gratis
- Archivo: `web/lib/commerce/shipping-threshold.ts`

**33. Progress bar de envio gratis en cart drawer**
- Estado: Solo funciona si `getFreeShippingThresholdCents` > 0
- Accion: Una vez configurado el threshold, el cart drawer automaticamente muestra "Te faltan Gs. X para envio gratis"
- Referencia: Práctica standard que aumenta AOV (average order value)

**34. Trust strip compacto en PDP (no en tienda)**
- Estado: El PDP ya importa `TrustStrip` con items default. Para viajero deberia mostrar items custom.
- Accion: Pasar `items` prop al `TrustStrip` en el PDP basado en `siteSlug`
- Archivo: `web/app/s/[locale]/[site]/producto/[slug]/page.tsx`

**35. Badge "Compra verificada" en reviews**
- Estado: No existe
- Accion: Marcar reviews de compradores verificados con un badge
- Referencia: Amazon, MercadoLibre

**36. Seccion "Los mas vendidos" en /tienda**
- Estado: No existe
- Accion: Rail horizontal de productos ordenados por popularidad (usando `getPopularityByBusiness`)
- Archivo: `web/lib/commerce/products.ts` ya tiene `getPopularityByBusiness`
- Componente: Reutilizar `RecentlyViewedRail` pattern

**37. Social proof: "X personas estan viendo esto"**
- Estado: No existe
- Accion: Mostrar contador en cards de alta demanda. Requiere WebSocket o polling periodico
- Prioridad: Baja — feature avanzado

**38. Seccion de "Recien vistos"**
- Estado: El componente `RecentlyViewedRail` existe pero puede no mostrar data
- Accion: Verificar que `recordRecentVisit` se dispara en PDP y que `RecentlyViewedRail` consulta la cookie correctamente
- Archivo: `web/components/commerce/recently-viewed-rail.tsx`

### SECCION E: Search & Filters (Items 39-45)

**39. Quick filters redesign**
- Estado: Label "Rapido:" confuso, valores en millones (Gs 10000000 = Gs 100k)
- Accion: Cambiar label a "Filtros rapidos:" o sacar label, usar iconos de $, mostrar valores legibles (Gs 100.000)
- Archivo: `web/components/commerce/tienda-quick-filters.tsx`

**40. Search placeholder contextual**
- Estado: "Buscar productos"
- Accion: Placeholder rotativo o contextual: "Buscas carpa, bolsa de dormir, equipo de pesca..."
- Referencia: Decathlon usa "Busca tu deporte, tu equipo, tu marca..."
- Archivo: `web/components/commerce/header-search.tsx`

**41. Search suggestions dropdown**
- Estado: `search-suggest/route.ts` endpoint existe
- Accion: Verificar que el dropdown de sugerencias funciona en `header-search.tsx`
- Archivo: `web/app/api/storefront/[site]/search-suggest/route.ts`

**42. URL-driven filters (ya implementado)**
- Estado: Todos los filtros son URL params — compartibles, back-button friendly
- ✅ Excelente practica

**43. Active filter chips con boton "X" (ya implementado)**
- Estado: Muestra chips de filtros activos con boton de cerrar
- ✅ Funciona

**44. Price range slider visual**
- Estado: Inputs de texto para min/max
- Accion: Agregar slider de rango HTML5 con dos thumb. Mas intuitivo que escribir numeros
- Referencia: REI, Backcountry usan slider de precio
- Implementacion: Input type="range" con JS para sincronizar dos valores
- Prioridad: Media — los inputs de texto funcionan

**45. Filter drawer a pantalla completa en mobile**
- Estado: Los filtros se muestran inline, colapsados detras de un toggle en mobile
- Accion: Hacer que el toggle abra un drawer overlay a pantalla completa con los filtros, como MercadoLibre
- Referencia: MercadoLibre mobile tiene filtros en modal full-screen
- Archivo: `web/components/commerce/tienda-toolbar.tsx`

### SECCION F: PDP — Product Detail Page (Items 46-50)

**46. Galeria de imagenes con zoom**
- Estado: PDP probablemente muestra una sola imagen
- Accion: Galeria con thumbnails abajo + zoom on hover (CSS `scale(1.5)` con `transform-origin` basado en mouse position)
- Referencia: Amazon, REI

**47. Sticky CTA mobile en PDP**
- Estado: Ya existe `pdp-sticky-mobile-cta.tsx`
- ✅ Verificar funcionamiento

**48. Product care guide**
- Estado: Ya existe `pdp-care-guide.tsx` pero tiene copy de fun4me ("empaque discreto")
- Accion: Hacer el care guide per-tenant o editable via content JSON
- Archivo: `web/components/commerce/pdp-care-guide.tsx`

**49. Breadcrumbs en PDP**
- Estado: Ya existen breadcrumbs en tienda. Verificar que PDP tambien tenga
- Referencia: Ya importa `Breadcrumbs` en `commerce/breadcrumbs.tsx`

**50. Cross-sell / "Completá tu equipo" en PDP**
- Estado: No existe
- Accion: Mostrar productos relacionados por categoria al final del PDP
- Referencia: "Frequently bought together" de Amazon

---

## PARTE 2: TECNICO — 30 Items

### SECCION G: Arquitectura de Componentes (Items 51-60)

**51. Sistema de per-tenant overrides**
- Estado: No existe. Trust strip, category tiles, configs son globales.
- Accion: Crear `lib/commerce/tenant-config.ts` que exporte configs por siteSlug:
```typescript
interface TenantCommerceConfig {
  trustItems?: TrustItem[]
  freeShippingThresholdCents?: number
  installments?: { maxCuotas: number; minAmountCents: number }
  hideDiscreetMode?: boolean
  categoryIcons?: Record<string, string>
}
const CONFIGS: Record<string, TenantCommerceConfig> = {
  'viajero-comercio': { ... },
  fun4me: { ... },
}
```
- Archivo nuevo: `web/lib/commerce/tenant-config.ts`

**52. Desacoplar TAG_GROUPS de tienda-toolbar**
- Estado: `TAG_GROUPS` hardcodeado con tags de fun4me (silicona, base-agua, parejas, etc.)
- Accion: Mover a `tenant-config.ts` o hacerlo configurable por sitio. Para viajero, no hay tags asi que el bloque entero deberia ocultarse
- Archivo: `web/components/commerce/tienda-toolbar.tsx`

**53. Desacoplar product-finder-quiz**
- Estado: `product-finder-quiz.tsx` tiene tipos hardcodeados como `'para_ella' | 'para_el' | 'parejas'`
- Accion: Deshabilitar el quiz para viajero (via config) o hacerlo configurable por vertical
- Archivo: `web/components/commerce/product-finder-quiz.tsx`

**54. Ocultar discreet-mode-toggle para viajero**
- Estado: `discreet-mode-toggle.tsx` es solo para fun4me
- Accion: No renderizar si `tenantConfig.hideDiscreetMode === true`
- Archivo: `web/components/commerce/commerce-header.tsx`

**55. Ocultar currency-toggle si solo hay PYG**
- Estado: CurrencyToggle se muestra siempre
- Accion: Si el tenant solo opera en PYG, ocultar el toggle
- Archivo: `web/components/commerce/commerce-header.tsx`

**56. Server Components donde sea posible**
- Estado: `TiendaToolbar` es Client Component (necesario por useRouter/useSearchParams)
- ✅ Correcto: No se puede evitar. El resto de la pagina es Server Component.

**57. React Server Actions para add-to-cart**
- Estado: `handleAdd` en `ProductCard` usa `fetch` POST via `useCartStore`
- Accion: Migrar a Server Actions cuando Next.js estabilice la API para mutaciones
- Prioridad: Futuro — la implementacion actual funciona

**58. Lazy loading de modales y heavy components**
- Estado: `QuickViewModal` ya usa `dynamic()` con `ssr: false`
- ✅ Correcto. Aplicar mismo patron a otros modales si existen.

**59. Bundle size budget para /tienda**
- Estado: No hay monitoreo
- Accion: Agregar `next/bundle-analyzer` y establecer budget de ~150kb JS inicial para /tienda

**60. Error boundaries para secciones de commerce**
- Estado: No hay error boundaries especificos
- Accion: Envolver grid de productos, toolbar, y trust strip en Error Boundaries individuales para que una falla no tumbe toda la pagina

### SECCION H: Performance (Items 61-70)

**61. Image CDN / next/image optimization**
- Estado: `next/image` con `fill` y `sizes` ya optimiza automaticamente
- ✅ Next.js ya hace WebP/AVIF conversion, lazy loading y responsive images

**62. Preconnect a Supabase storage**
- Estado: `NEXT_PUBLIC_SUPABASE_URL` es origen de datos
- Accion: Agregar `<link rel="preconnect" href={supabaseUrl}>` en layout
- Archivo: `web/app/s/[locale]/[site]/layout.tsx`

**63. Optimistic UI para add-to-cart**
- Estado: `handleAdd` espera la promesa, muestra "Agregando..."
- Accion: Agregar optimistic update: el item aparece en el carrito inmediatamente, y se revierte si la API falla
- Referencia: Patron standard en e-commerce moderno

**64. Infinite scroll con "Load More" button**
- Estado: Paginacion clasica con « 1 2 3 … 11 »
- Accion: Reemplazar con boton "Cargar mas productos" al final. El boton carga la siguiente pagina via API fetch + append al grid existente. Paginacion clasica existe como fallback en el footer
- Referencia: Backcountry, Decathlon, REI usan "Load More"
- Archivo nuevo: `web/components/commerce/tienda-load-more.tsx` (Client Component)

**65. Virtual scrolling para grids grandes**
- Estado: 126 productos, 11 paginas — no justifica virtual scroll aun
- Prioridad: Futuro (>500 productos)

**66. Skeleton loading states**
- Estado: No hay skeletons. La pagina espera a que los datos carguen (Server Component = streaming)
- Accion: Agregar `loading.tsx` en `app/s/[locale]/[site]/tienda/` con skeleton grid de 6-12 cards placeholder
- Archivo nuevo: `web/app/s/[locale]/[site]/tienda/loading.tsx`

**67. Streaming SSR con Suspense boundaries**
- Estado: `force-dynamic` significa que la pagina espera a todo antes de renderizar
- Accion: Envolver grid, toolbar, y trust strip en `<Suspense>` con fallbacks individuales. El hero se renderiza primero, mientras el grid carga
- Archivo: `web/app/s/[locale]/[site]/tienda/page.tsx`

**68. Cache de productos frecuentes**
- Estado: Cada request a /tienda hace query a Supabase
- Accion: Agregar `stale-while-revalidate` via Next.js `fetch` cache o Supabase cache headers
- Prioridad: Media — la DB responde rapido para 126 productos

**69. Prefetch de pagina siguiente**
- Estado: No hay prefetch
- Accion: En paginacion, prefetchear `?page=N+1` via `<Link prefetch>` o `router.prefetch()`
- Archivo: `web/components/commerce/tienda-pagination.tsx`

**70. Compresion de imagenes**
- Estado: Las imagenes de Unsplash ya vienen optimizadas
- Accion: Cuando se suban fotos reales, usar Supabase Image Transformation API o Cloudflare Images para servir en sizes apropiados
- Referencia: Supabase `?width=400&quality=80` en URLs de storage

### SECCION I: SEO & Accesibilidad (Items 71-78)

**71. Canonical URLs con noindex en filtros**
- ✅ Ya implementado en `generateMetadata` de tienda page

**72. JSON-LD structured data para Store + Products**
- Estado: `jsonLdForPage` existe en `lib/engine/schema-org.ts`
- ✅ Verificar que se genera para viajero-comercio

**73. Alt text en imagenes de producto**
- Estado: `ProductImage` recibe `alt` prop — las imagenes de seed tienen alt en el JSON
- ✅ OK

**74. Skip to main content**
- ✅ Ya implementado via `Saltar al contenido principal`

**75. ARIA labels en componentes interactivos**
- Estado: Botones tienen `aria-label`, `aria-pressed`, `aria-current`
- ✅ Buen nivel de accesibilidad

**76. Focus management en modales**
- Estado: `QuickViewModal` deberia atrapar foco cuando abre
- Accion: Verificar implementacion. Si no, agregar `useFocusTrap` o similar

**77. Keyboard navigation en grid**
- Estado: Productos son `<article>` dentro de grid. Cada card tiene un `<Link>` al PDP
- Accion: Verificar que tab navigation recorre las cards en orden logico

**78. Meta descriptions por pagina de categoria**
- Estado: Las category pages ya generan meta con count de productos y descripcion
- ✅ OK

### SECCION J: Data Layer (Items 79-84)

**79. Analytics: trackAddToCart, trackAddToWishlist**
- ✅ Ya implementado en `product-card.tsx`

**80. Search events tracking**
- ✅ Ya implementado: `recordSearchEvent` en tienda page

**81. Funnel analytics**
- ✅ `lib/commerce/funnel.ts` existe con seguimiento de conversion

**82. Purchase tracker**
- ✅ `purchase-tracker.tsx` existe

**83. View item tracking**
- ✅ `pdp-view-tracker.tsx` existe

**84. Session token para carrito anonimo**
- ✅ `getSessionToken` + `getCartBySessionToken` implementado

### SECCION K: Testing & CI (Items 85-90)

**85. Unit tests para componentes commerce**
- Estado: No se encontraron tests especificos para commerce (solo `platform-fallback.test.ts`)
- Accion: Agregar tests para: ProductCard rendering, InstallmentLine calculo, TrustStrip items, TiendaQuickFilters toggle, TiendaPagination page calculation

**86. E2E tests para flujo de compra**
- Estado: No hay E2E
- Accion: Playwright test que recorre: /tienda → filtrar → agregar al carrito → checkout → confirmacion

**87. Visual regression tests**
- Estado: No existen
- Accion: Chromatic o Percy para detectar cambios visuales no intencionales en /tienda

**88. Lint rules para commerce**
- Estado: No hay reglas especificas
- Accion: Agregar regla que forbida hardcodear copy de fun4me en componentes compartidos

**89. TypeScript strict mode**
- ✅ El proyecto usa TypeScript con tipos bien definidos

**90. Bundle analyzer en CI**
- Accion: Agregar `@next/bundle-analyzer` para monitorear tamaño de JS en /tienda

---

## PARTE 3: INFRAESTRUCTURA & TOOLS — 10 Items

### SECCION L: Herramientas y MCPs (Items 91-100)

**91. Supabase Management API (MCP)**
- Ya instalado como skill `supabase` con herramientas: `search_docs`, `list_tables`, `execute_sql`, `deploy_edge_function`, `get_logs`, etc.
- Uso para commerce: Inspeccionar tabla `products`, agregar columnas (brand, tags), monitorear logs de webhooks Pagopar
- Referencia: `/home/ai-whisperers/.agents/skills/supabase/SKILL.md`

**92. Supabase Postgres Best Practices skill**
- Skill instalado con guias de performance: indexing, RLS, query optimization
- Uso: Optimizar queries de `listActiveProducts`, agregar indices compuestos para filtros comunes (business_id + status + category + price_cents)

**93. Firecrawl skills (search + scrape + crawl)**
- Instalados: `firecrawl-search`, `firecrawl-scrape`, `firecrawl-crawl`, `firecrawl-map`, `firecrawl-agent`
- Uso para viajero: Scrapear productos de competidores (Camping44, El Mohicano) para seed data, buscar imagenes de referencia
- Limite: Credits agotados — considerar upgrade o usar DuckDuckGo como fallback

**94. DuckDuckGo Search skill**
- Skill instalado: `duckduckgo-search` via `ddgs` CLI
- Uso: Busqueda gratuita para research de mercado, sin API key
- Archivo skill: `/home/ai-whisperers/.claude/skills/hermes/research/duckduckgo-search/SKILL.md`

**95. Paraguay Context skill**
- Skill instalado con contexto de negocios paraguayos: pagos (Bancard, Pagopar, Tigo Money), legal (RUC, Timbrado, IVA), SMB categories
- Uso: Asegura que recomendaciones de pricing, pagos y copy sean apropiadas para Paraguay
- Archivo: `/home/ai-whisperers/.claude/skills/paraguay-context/SKILL.md`

**96. Frontend UI/UX skill**
- Skill de diseno: tipografia (evitar Inter/Roboto/Arial), color, animacion, composicion
- Uso: Guia de diseno para implementar los items de UX de esta lista
- Archivo: `/home/ai-whisperers/.claude/skills/frontend-ui-ux/SKILL.md`

**97. Cursor/VSCode MCP setup**
- Estado: No se encontraron archivos `.cursor` o `.vscode` en el codebase
- Accion: Considerar agregar configuracion de MCP servers para Cursor o Claude Desktop que permita:
  - Acceso a Supabase directamente desde el editor
  - Preview de cambios en /tienda en tiempo real
  - Linting con reglas especificas de commerce

**98. sRules / AI coding rules**
- Estado: No se encontraron archivos `srules` en el codebase
- Accion: Crear `.claude/rules/` con reglas especificas para el proyecto commerce:
  - "No hardcodear copy de fun4me en componentes compartidos"
  - "Siempre usar `tenant-config.ts` para valores per-site"
  - "`TrustStrip` defaults deben ser genericos, no de fun4me"
  - "Category icons deben ser configurables por tenant"

**99. Next.js Bundle Analyzer**
- Herramienta: `@next/bundle-analyzer`
- Accion: Agregar al proyecto para monitorear el impacto de cambios en el bundle de /tienda
- Config en `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
module.exports = withBundleAnalyzer({ ... })
```

**100. Playwright E2E testing**
- Skill instalado: `playwright` para browser automation
- Accion: Crear test E2E basico que:
  1. Navega a /tienda
  2. Verifica que los category tiles se renderizan
  3. Filtra por categoria "Camping"
  4. Verifica que los productos cambian
  5. Agrega un producto al carrito
  6. Verifica que el carrito se actualiza
- Archivo skill: `/home/ai-whisperers/.claude/skills/playwright/SKILL.md`

---

## APENDICE: Resumen de Archivos a Crear/Modificar

### Archivos Nuevos
```
web/components/commerce/tienda-hero.tsx
web/components/commerce/tienda-load-more.tsx
web/lib/commerce/tenant-config.ts
web/app/s/[locale]/[site]/tienda/loading.tsx
.claude/rules/commerce-rules.md
```

### Archivos a Modificar (Prioridad Alta)
```
web/components/commerce/tienda-category-tiles.tsx       → imagenes de fondo
web/components/commerce/tienda-toolbar.tsx               → TAG_GROUPS a config
web/components/commerce/tienda-quick-filters.tsx          → labels legibles
web/components/commerce/commerce-header.tsx               → ocultar discreet mode si aplica
web/components/commerce/product-card.tsx                  → mostrar marca
web/components/commerce/pdp-care-guide.tsx                → copy generico
web/lib/commerce/shipping-threshold.ts                    → viajero config
web/lib/commerce/installments.ts                          → viajero config (YA)
web/app/s/[locale]/[site]/tienda/page.tsx                 → hero, 3 cols, 1 col mobile, trust items (YA parcial)
```

### Archivos a Modificar (Prioridad Media)
```
web/components/commerce/trust-strip.tsx                    → defaults genericos
web/components/commerce/discreet-mode-toggle.tsx           → ocultable por config
web/components/commerce/recently-viewed-rail.tsx           → verificar funcionamiento
web/components/commerce/tienda-pagination.tsx              → load more option
web/app/s/[locale]/[site]/producto/[slug]/page.tsx         → trust items contextual
```

---

## Proximos Pasos Inmediatos (Sprint 1 — 5 items de alto impacto)

| # | Item | Archivo | Esfuerzo |
|---|------|---------|----------|
| 1 | Crear `tenant-config.ts` con configs por sitio | Nuevo | 1h |
| 2 | Hero section en /tienda | Nuevo `tienda-hero.tsx` | 2h |
| 3 | Grid 3 cols desktop / 1 col mobile | `tienda/page.tsx` | 15min |
| 4 | Free shipping threshold + cart bar | `shipping-threshold.ts` | 10min |
| 5 | Skeleton loading state | Nuevo `loading.tsx` | 30min |

Total Sprint 1: ~4 horas para cambiar COMPLETAMENTE la percepcion de la pagina.
