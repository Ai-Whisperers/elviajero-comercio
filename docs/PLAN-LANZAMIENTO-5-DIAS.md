# El Viajero — Plan de Lanzamiento: 5 Días

> Objetivo: Sitio 100% operativo con productos reales cargados, dominio propio activo, y Omar pudiendo vender.
> Fecha objetivo: Viernes 22/05/2026

---

## DÍA 1 — HOY (Lunes 18/05): Quick Wins + Fixes Críticos

| # | Tarea | Archivo/s | Estado |
|---|-------|-----------|--------|
| Q1 | Ocultar PagoPar/Bancard del checkout (solo WhatsApp/transferencia) | `app/checkout/page.tsx` | ✅ Ya está así |
| Q2 | Eliminar referencias a "caza" en todo el copy | `content/es.json`, `content/gn.json`, DB | ✅ Verificado: no hay |
| Q3 | Botón "Consultar por WhatsApp" en cada ficha de producto | `app/tienda/page.tsx`, `components/product-modal.tsx` | 🔄 Pendiente |
| Q4 | Carrusel de kits/promos: sin auto-rotación, navegación manual | `components/hero-carousel.tsx` | 🔄 Pendiente |
| C1 | Fix error 500 en /checkout | `app/checkout/page.tsx` | ✅ Arreglado hoy |
| C2 | Verificar editor de contenido en admin | `app/admin/contenido/page.tsx` | 🔄 Pendiente |
| C3-C6 | Fix carrito anidado, blog not-found, FAQ dark, error page | Varios | ✅ Arreglados en commit previo |

**Entregable D1:** Sitio estable, sin errores, checkout funcional.

---

## DÍA 2 — Martes 19/05: Features del Cliente + Admin

| # | Tarea | Archivo/s | Depende de |
|---|-------|-----------|------------|
| F1 | Botón "Consultar por WhatsApp" por producto (tienda + modal) | `components/product-modal.tsx` | Nada |
| F4 | Editor de categorías desde admin | `app/admin/contenido/page.tsx` | 🔄 Parcialmente hecho hoy |
| F5 | Logo minimalista con eslogan "Equipamientos Aventura" | `public/images/logo.svg` | **LOGO DE OMAR** |
| F6 | Meta descripciones por página (SEO) | `app/layout.tsx`, páginas | Nada |
| A5 | Panel de contenido 100% funcional | `app/admin/contenido/page.tsx` | Nada |
| Q7 | Open Graph tags (imagen, título, descripción) | `app/layout.tsx` | Nada |
| Q8 | Favicon real | `app/favicon.ico` | **LOGO DE OMAR** |

**Entregable D2:** Admin completo, botón WA por producto, SEO base listo.

---

## DÍA 3 — Miércoles 20/05: Productos Reales + Carga

| # | Tarea | Archivo/s | Depende de |
|---|-------|-----------|------------|
| D2 | Subir imágenes reales de productos | `public/images/products/` o CDN | **FOTOS DE OMAR** |
| D3 | Actualizar precios reales | Admin panel / DB | **PRECIOS DE OMAR** |
| D4 | Actualizar descripciones reales | Admin panel / DB | **DESCRIPCIONES DE OMAR** |
| Q9 | Eliminar productos de prueba (seed) | DB `ej_products` | Nada |
| F2 | Ocultar pasarelas de pago sin credenciales | `app/checkout/page.tsx` | ✅ Ya está |
| A1-A4 | Verificar paneles: productos, pedidos, clientes, categorías | Admin | Nada |

**Entregable D3:** Catálogo con productos reales de Omar. Él empieza a cargar.

---

## DÍA 4 — Jueves 21/05: Dominio + Infraestructura

| # | Tarea | Archivo/s | Depende de |
|---|-------|-----------|------------|
| I1 | Conectar dominio tiendaelvajero.com.py | DNS / Cloudflare / Traefik | **ACCESO DNS** |
| I2 | SSL (Let's Encrypt) para dominio propio | Traefik labels | I1 |
| D16 | Certificado SSL activo | — | I2 |
| D6 | Confirmar número WhatsApp Business activo | `config/site.json` | **CONFIRMACIÓN** |
| D7 | Configurar email corporativo | — | **EMAIL DE OMAR** |
| D9 | Horarios de atención en footer/contacto | `content/es.json` | **HORARIOS DE OMAR** |
| D10 | Zonas de envío actualizadas | `config/site.json` | **ZONAS DE OMAR** |

**Entregable D4:** tiendaelviajero.com.py resolviendo, SSL activo, datos del negocio reales.

---

## DÍA 5 — Viernes 22/05: Lanzamiento

| # | Tarea | Archivo/s | Depende de |
|---|-------|-----------|------------|
| — | Testing end-to-end: compra completa vía WhatsApp | — | Todo lo anterior |
| — | Testing responsive (mobile) | — | Nada |
| — | Testing admin: crear/editar/eliminar producto | — | Nada |
| — | Sitemap + robots.txt | `public/sitemap.xml` | Nada |
| D13-D15 | Políticas: devolución, términos, privacidad | `content/es.json` | **TEXTOS DE OMAR** |
| I7-I9 | Google Analytics, Search Console, Facebook Pixel | `<head>` | **IDs DE OMAR** |
| — | 🚀 COMMIT FINAL + DEPLOY + ANUNCIAR | — | — |

**Entregable D5:** Sitio live en dominio propio, Omar vendiendo.

---

## Dependencias Críticas (Bloqueantes)

| # | Qué necesito | De quién | Para qué día |
|---|-------------|----------|--------------|
| 1 | Logo (SVG, PNG o AI) | Omar | D2 |
| 2 | Fotos de productos (mínimo 10 para empezar) | Omar | D3 |
| 3 | Lista de productos con precios | Omar | D3 |
| 4 | Número WhatsApp Business confirmado | Omar/Ivan | D1 |
| 5 | Horarios de atención | Omar | D4 |
| 6 | Zonas de envío que cubre | Omar | D4 |
| 7 | Email corporativo | Omar | D4 |
| 8 | Redes sociales (IG, FB, TikTok handles) | Omar | D2 |
| 9 | Acceso a DNS / MaxiDominio | Ivan | D4 |
| 10 | Cloudflare token con Zone:Edit | Ivan | D4 |
| 11 | Datos bancarios para transferencias | Omar | D5 (opcional) |
| 12 | Credenciales PagoPar/Bancard | Omar | Post-launch |
| 13 | Políticas de devolución / términos | Omar | D5 (puedo usar genérico) |

---

## Notas Técnicas

- **Base de datos:** Supabase (`qyvokpribmbrosafntqa`). Los productos que cargue Omar quedan ahí. Cambios de código no tocan los datos.
- **Deploy:** `bash deploy.sh` en `/root/elviajero`. Tarda ~3 minutos.
- **Admin:** `https://el-viajero.paragu-ai.com/admin` (o `/admin` en dominio propio).
- **Categorías:** Ya están configuradas las 5 que pidió Omar.
