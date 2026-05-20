# El Viajero — Plan Completo de Implementación
# El Viajero — Plan Completo de Implementación

> **Cliente:** Omar Aguilera — Tienda El Viajero  
> **Contacto:** WhatsApp +595 984 009751  
> **Sitio Live:** https://el-viajero.paragu-ai.com | viajero.paragu-ai.com  
> **Fecha:** 2026-05-19  
> **Objetivo:** Lanzamiento completo con todas las features solicitadas por el cliente

---

## ÍNDICE

1. [FEATURES DEL CLIENTE — POR ORDEN DE PRIORIDAD](#1-features-del-cliente--por-orden-de-prioridad)
2. [CRÍTICOS BLOCKERS](#2-críticos-blockers)
3. [PLAN DE EJECUCIÓN — PHASES](#3-plan-de-ejecución---fases)
4. [DEPENDECIAS DEL CLIENTE](#4-dependencias-del-cliente)
5. [CHECKLIST DE LANZAMIENTO](#5-checklist-de-lanzamiento)

---

## 1. FEATURES DEL CLIENTE — POR ORDEN DE PRIORIDAD

### P0 — CRÍTICO (debe hacerse ANTES de lanzamiento)

#### P0-1: Botón "Consultar por WhatsApp" en cada producto ⚠️ URGENTE
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (Q3, F1)
- **Qué quiere el cliente:** Cada tarjeta de producto en la tienda debe tener un botón "Consultar por WhatsApp" al lado de "Agregar al carrito"
- **Archivos:**
  - `app/tienda/page.tsx` — botón en tarjeta de producto
  - `components/product-modal.tsx` — botón en modal de detalle
  - `components/pages/product-content.tsx` — página de producto
- **Esfuerzo:** 2-3 horas
- **Spec:**
  - Botón "Consultar por WhatsApp" al lado de "Agregar al carrito"
  - Al hacer clic, abre WhatsApp con mensaje prellenado:
    - Nombre del producto
    - Precio
    - Link a la página del producto
  - Usar número de WhatsApp del cliente (no hardcoded)
- **Verificación:**
  - Navegar a `/tienda`
  - Hacer clic en cada producto
  - Confirmar que abre WhatsApp con mensaje correcto

#### P0-2: Carrusel de kits/promos sin auto-rotación
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (Q4), CLIENT_FEEDBACK_COMPLETE.md (F4)
- **Qué quiere el cliente:** Carrusel de kits/promos NO debe rotar automáticamente. Solo navegación manual con flechas.
- **Archivos:**
  - `components/kits-carousel.tsx` — crear componente
  - `app/page.tsx` — agregar componente a homepage
- **Esfuerzo:** 4-6 horas
- **Spec:**
  - Carrusel manual (solo avanza con clic en flechas izquierda/derecha)
  - NO auto-rotación
  - Para mostrar: kits (Semana Santa, pesca, camping, explorador), combos, promociones
  - Cada slide: imagen + nombre + precio → clic abre detalle o manda a WhatsApp
  - Contenido gestionable desde admin
- **Verificación:**
  - Verificar que NO rota automáticamente
  - Verificar que las flechas funcionan
  - Verificar que el contenido se carga desde promociones en DB

#### P0-3: CartProvider en root layout
- **Fuente:** upgrade-plan-2026-05-08.md (B1, H1), CLIENT_FEEDBACK_COMPLETE.md (C1)
- **Qué quiere el cliente:** Carrito debe funcionar en TODAS las páginas (no solo /tienda)
- **Archivos:**
  - `app/layout.tsx` — mover CartProvider de wrappers individuales al root
- **Esfuerzo:** 30 minutos
- **Spec:**
  - Mover CartProvider wrap de nivel de página a root layout
  - Esto arregla que el carrito se rompa en blog, contacto, faq, admin, etc.
- **Verificación:**
  - Navegar a `/blog`, `/contacto`, `/faq`, `/admin`
  - Verificar que el carrito funciona (badge count, abrir sidebar)
  - Verificar que NO hay errores en consola

#### P0-4: Números de teléfono/WhatsApp reales
- **Fuente:** upgrade-plan-2026-05-08.md (H9, M2), PLAN-LANZAMIENTO-5-DIAS.md (D6)
- **Qué quiere el cliente:** Números reales de Omar en todas partes del sitio
- **Archivos:**
  - `config/site.json` — actualizar contacto.whatsappPhone, contact.phone
  - `content/es.json` — actualizar todos los números en contacto, footer
- **Esfuerzo:** 10 minutos
- **Spec:**
  - Actualizar con número real: +595 984 009751
  - Verificar botón flotante de WhatsApp
  - Verificar footer contacto
- **Verificación:**
  - Hacer clic en botón flotante de WhatsApp
  - Verificar que abre el número correcto
  - Verificar footer contacto

---

### P1 — ALTA PRIORIDAD (impacta ventas)

#### P1-1: Checkout por WhatsApp desde el carrito
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F2)
- **Qué quiere el cliente:** Resumen del carrito debe tener botón "Checkout por WhatsApp" que genera mensaje formateado
- **Archivos:**
  - `components/cart-sidebar.tsx` — agregar botón de checkout
  - `app/checkout/page.tsx` — actualizar flujo
- **Esfuerzo:** 2-4 horas
- **Spec:**
  - Resumen del carrito muestra botón "Checkout por WhatsApp"
  - Genera mensaje WA formateado con:
    - Todos los items
    - Cantidades
    - Subtotales
    - Total
    - Datos del cliente (nombre, teléfono, ciudad, RUC)
  - Enviar a WhatsApp Business del cliente (+595 984 009751)
- **Verificación:**
  - Agregar productos al carrito
  - Hacer clic en "Checkout por WhatsApp"
  - Verificar que abre WhatsApp con mensaje completo
  - Verificar que todos los items están incluidos

#### P1-2: Sistema de pedidos en Admin
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F3)
- **Qué quiere el cliente:** Cuando cliente hace checkout por WhatsApp, se crea orden pendiente en panel admin
- **Archivos:**
  - `app/admin/pedidos/` — crear/actualizar página
  - `lib/orders.ts` — crear lógica de órdenes
  - `app/api/orders/route.ts` — crear API endpoint
- **Esfuerzo:** 4-6 horas
- **Spec:**
  - Al hacer checkout por WhatsApp, crear orden pendiente
  - Omar puede marcar: Pendiente → Confirmado → Enviado → Entregado → Pagado
  - Al confirmar, descontar automáticamente del stock
  - Dashboard de reportes:
    - Ventas del mes
    - Productos más vendidos
    - Ingresos totales
- **Verificación:**
  - Hacer pedido vía WhatsApp
  - Verificar que aparece en admin
  - Cambiar estado de pendiente → confirmado
  - Verificar que el stock se actualizó

#### P1-3: Carrusel de Kits/Promos (nueva sección)
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F4), ya mencionado en P0-2
- **Qué quiere el cliente:** Nueva sección debajo del hero con carrusel de kits/promos
- **Archivos:**
  - `app/page.tsx` — agregar sección
  - `components/kits-carousel.tsx` — crear componente
  - `content/es.json` — agregar datos de promociones
- **Esfuerzo:** 4-6 horas
- **Spec:**
  - Sección debajo del hero, encima de "Nuevos Productos"
  - Carrusel manual (solo avanza con clic en flechas, NO auto-rotación)
  - Para mostrar: kits (Semana Santa, pesca, camping, explorador), combos, promociones
  - Cada slide: imagen + nombre + precio → clic abre detalle o manda a WhatsApp
  - Contenido gestionable desde admin
- **Verificación:**
  - Verificar que sección aparece en homepage
  - Verificar carrusel manual funciona
  - Verificar que cada slide abre detalle/WhatsApp

#### P1-4: Performance de imágenes — WebP
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (C2), upgrade-plan-2026-05-08.md (H3)
- **Qué quiere el cliente:** Imágenes optimizadas para carga rápida en móvil
- **Archivos:**
  - `public/images/products/` — convertir todas a WebP
  - `public/images/marketing/` — optimizar banners
- **Esfuerzo:** 4-6 horas
- **Spec:**
  - Convertir todas las imágenes PNG a WebP
  - Comprimir a <100KB por imagen de producto
  - Agregar `loading="lazy"` a todas las imágenes
  - Agregar `srcset` para responsive
- **Verificación:**
  - Verificar tamaño de imágenes (<100KB)
  - Medir tiempo de carga en móvil
  - Verificar que se cargan progresivamente (lazy)

#### P1-5: SEO metadata en tienda + producto
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (S1, S2), upgrade-plan-2026-05-08.md (M5)
- **Qué quiere el cliente:** Sitio visible en Google Shopping, Product rich results
- **Archivos:**
  - `/app/tienda/page.tsx` — agregar generateMetadata
  - `/app/producto/[slug]/page.tsx` — agregar generateMetadata
- **Esfuerzo:** 3-5 horas
- **Spec:**
  - Agregar generateMetadata() con CollectionPage schema para /tienda
  - Agregar generateMetadata() con Product schema para /producto/[slug]
  - Schema de Producto debe incluir: precio, disponibilidad, imagen, ofertas
- **Verificación:**
  - Verificar metadata en /tienda (title, description, OG image)
  - Verificar metadata en página de producto (JSON-LD schema)
  - Verificar en Google Rich Results Test

---

### P2 — MEDIA PRIORIDAD (nice to have)

#### P2-1: Editor de categorías desde admin
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (F4), upgrade-plan-2026-05-08.md
- **Qué quiere el cliente:** Poder editar las categorías desde el panel de admin
- **Archivos:**
  - `app/admin/contenido/page.tsx` — ya parcialmente hecho, completar
- **Esfuerzo:** 2-3 horas
- **Spec:**
  - CRUD completo de categorías (crear, editar, eliminar)
  - Las 5 categorías que pidió Omar ya están configuradas
  - Verificar que funciona el editor
- **Verificación:**
  - Crear nueva categoría
  - Editar nombre/descripción
  - Eliminar categoría
  - Verificar que se actualiza en tienda

#### P2-2: Meta descripciones por página (SEO)
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (F6)
- **Qué quiere el cliente:** Meta descripciones para cada página
- **Archivos:**
  - `app/layout.tsx` — metadata por defecto
  - Cada página (tienda, producto, contacto, etc.) — metadata específica
- **Esfuerzo:** 3-5 horas
- **Spec:**
  - Meta description única por página
  - Keywords relevantes
  - Open Graph tags correctos
- **Verificación:**
  - Verificar meta description en cada página
  - Verificar OG tags
  - Verificar preview en WhatsApp/Facebook

#### P2-3: Open Graph tags
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (Q7)
- **Qué quiere el cliente:** Imagen y texto correcto al compartir en redes
- **Archivos:**
  - `app/layout.tsx` — openGraph metadata
  - `public/images/og-viajero.svg` — actualizar imagen
- **Esfuerzo:** 1-2 horas
- **Spec:**
  - Imagen OG real o ilustración pulida
  - Título y descripción correctos
  - URL correcto
- **Verificación:**
  - Compartir link en WhatsApp
  - Verificar que muestra imagen y texto correctos
  - Compartir en Facebook y Twitter

#### P2-4: Panel de contenido 100% funcional
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (A5)
- **Qué quiere el cliente:** Editor de contenido completo funcionando
- **Archivos:**
  - `app/admin/contenido/page.tsx` — completar funcionalidades
- **Esfuerzo:** 4-6 horas
- **Spec:**
  - Editar todas las secciones de contenido
  - Editar textos de homepage
  - Editar textos de contacto, FAQ, footer
- **Verificación:**
  - Editar cada sección
  - Verificar que cambios se reflejan en el sitio
  - Desplegar y verificar en production

#### P2-5: Fix de bug de búsqueda/filtro (marca NO funciona)
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (C5)
- **Qué quiere el cliente:** Filtro de marca debe funcionar
- **Archivos:**
  - `components/pages/tienda-content.tsx` — fix dependencias useMemo
- **Esfuerzo:** 2-3 horas
- **Spec:**
  - Remover `setTimeout` callback hack
  - Agregar `brandFilter, pricePreset` al array de dependencias de `useMemo`
- **Verificación:**
  - Filtrar por marca
  - Verificar que funciona en tiempo real
  - Verificar que NO hay delay con setTimeout

#### P2-6: Precios almacenados como integers
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (C6)
- **Qué quiere el cliente:** Precios como números, no strings formateados
- **Archivos:**
  - Supabase (ej_products) — actualizar schema
  - `lib/cart-context.tsx` — actualizar lógica
  - Todos los componentes que muestran precios — parsear strings a integers
- **Esfuerzo:** 2-3 horas
- **Spec:**
  - Almacenar precios como integers en Supabase
  - Parsear strings a integers solo una vez en el display layer
  - Calcular totales con integers
- **Verificación:**
  - Agregar productos al carrito
  - Verificar que el total se calcula correctamente
  - Verificar que no hay errores de parsing

---

### P3 — BAJA PRIORIDAD (post-lanzamiento)

#### P3-1: Imágenes del carrusel Hero editables desde admin
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F5)
- **Qué quiere el cliente:** Poder cambiar imágenes del carrusel desde admin
- **Archivos:**
  - `app/admin/contenido/page.tsx` — agregar editor de hero
  - `content/es.json` — agregar campo para hero images
  - `components/hero-carousel.tsx` — leer desde contenido
- **Esfuerzo:** 2-3 horas
- **Spec:**
  - Las imágenes del carrusel principal deben ser subibles/cambiables desde admin
  - Cada slide puede tener: imagen, título, descripción, link CTA
- **Verificación:**
  - Agregar nueva imagen de hero desde admin
  - Verificar que aparece en homepage
  - Eliminar y verificar que desaparece

#### P3-2: Contenido real de blog
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F6)
- **Qué quiere el cliente:** Reemplazar posts hechos por IA con historias reales
- **Archivos:**
  - `content/blog/posts-*.json` — actualizar posts
  - `app/blog/[slug]/page.tsx` — mostrar productos relacionados
- **Esfuerzo:** 8-12 horas
- **Spec:**
  - Omar graba audio de sus viajes → transcribir → IA escribe post → publicar
  - Cada post con:
    - Mapa de ruta
    - Productos relacionados al final
- **Verificación:**
  - Leer post
  - Verificar mapa de ruta
  - Verificar productos relacionados
  - Verificar que no es bullshit de IA

#### P3-3: Importación masiva de productos desde Excel
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F7)
- **Qué quiere el cliente:** Importar ~130 productos desde Excel/Sheets
- **Archivos:**
  - `app/admin/productos/` — agregar botón de importación
  - `lib/import-products.ts` — crear lógica de importación
  - `app/api/admin/import/route.ts` — crear endpoint
- **Esfuerzo:** 4-6 horas
- **Spec:**
  - Script para importar: leer sheet → matchear imágenes → crear en Supabase
  - IA puede ayudar con:
    - Descripciones
    - Renombrar imágenes
    - Validar datos
- **Verificación:**
  - Subir Excel
  - Verificar que productos se importan
  - Verificar que imágenes se matchean
  - Verificar que no hay errores

#### P3-4: Variante de producto (matriz)
- **Fuente:** CLIENT_FEEDBACK_COMPLETE.md (F8)
- **Qué quiere el cliente:** Productos con size × color × material × precio por variante
- **Archivos:**
  - Supabase (ej_products) — actualizar schema para variantes
  - `app/admin/productos/` — agregar UI de variantes
  - `app/producto/[slug]/page.tsx` — mostrar selector de variantes
  - `components/product-modal.tsx` — mostrar selector de variantes
- **Esfuerzo:** 8-12 horas
- **Spec:**
  - Matriz de variantes: size × color × material × precio
  - Selector visual de variante en página de producto
  - Cada variante tiene su propio precio y stock
- **Verificación:**
  - Verificar que variantes se muestran
  - Cambiar variante y verificar precio/stock
  - Agregar al carrito y verificar variante correcta

#### P3-5: Logo minimalista con eslogan "Equipamientos Aventura"
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (F5), docs/brutal-asset-critique.md
- **Qué quiere el cliente:** Logo minimalista — "el texto nomás y el eslogan"
- **Archivos:**
  - `public/images/logo.svg` — nuevo logo
  - `app/layout.tsx` — actualizar OG image
- **Esfuerzo:** 30 minutos
- **Spec:**
  - Minimalista: texto + eslogan "Equipamientos Aventura"
  - Opción: imagen sola sin texto (pero cliente dijo "tiene que decir sí o sí El Viajero")
  - Paraguay auténtico — cerros paraguayos, árboles nativos, paisaje local
  - Funciona en corte circular (WhatsApp, redes)
- **Verificación:**
  - Verificar en header
  - Verificar en favicon
  - Verificar en OG image
  - Verificar en WhatsApp (icono pequeño)

#### P3-6: Favicon real
- **Fuente:** PLAN-LANZAMIENTO-5-DIAS.md (Q8), docs/brutal-asset-critique.md
- **Qué quiere el cliente:** Favicon reconocible a 16x16
- **Archivos:**
  - `public/favicon.ico` — nuevo favicon
  - `app/layout.tsx` — actualizar link
- **Esfuerzo:** 30 minutos
- **Spec:**
  - Icono de pico de montaña + tienda @64x64
  - Debe ser reconocible a 16x16
  - Tema camping/aventura
- **Verificación:**
  - Verificar en browser tab
  - Verificar en bookmarks
  - Verificar en mobile home screen

---

## 2. CRÍTICOS BLOCKERS

### B1: CartProvider NO en root layout ⚠️ URGENTE
- **Impacto:** ALTO — Carrito se rompe en TODAS las páginas excepto /tienda, /producto, /checkout, /
- **Estado:** NO RESUELTO
- **Esfuerzo:** 30 minutos
- **Archivos:** `app/layout.tsx`
- **Fix:** Mover CartProvider de wrappers individuales de página al root layout

### B2: Performance de imágenes — 133MB PNG sin optimizar ⚠️
- **Impacto:** ALTO — Usuarios 3G/4G descargan 30+ MB solo para cargar el catálogo = 25+ segundos en blanco, abandonan el sitio
- **Estado:** NO RESUELTO
- **Esfuerzo:** 4-6 horas
- **Fix:**
  - Convertir todas las imágenes a WebP
  - Servir vía `<picture>` con `srcset`
  - Agregar `loading="lazy"`
  - Objetivo: <100KB por imagen de producto

### B3: Checkout se redirige a WhatsApp en lugar de completar
- **Impacto:** ALTO — Los clientes no pueden completar la compra online
- **Estado:** NO RESUELTO
- **Esfuerzo:** 2-3 horas
- **Fix:**
  - Extraer número de WhatsApp a env/config (no hardcoded)
  - Implementar flujo real de pasarela de pago (sin redirección a WhatsApp)
  - Validación de formulario antes de proceder al Step 3

### B4: Número de teléfono/WhatsApp falsos
- **Impacto:** ALTO — Los clientes no pueden llamar a la tienda
- **Estado:** NO RESUELTO
- **Esfuerzo:** 10 minutos
- **Archivos:** `config/site.json`, `content/es.json`
- **Fix:** Actualizar con números reales de Omar (+595 984 009751)

### B5: Bug de búsqueda/filtros (filtro de marca NO funciona)
- **Impacto:** MEDIO — El filtro de marca literalmente no funciona
- **Estado:** NO RESUELTO
- **Esfuerzo:** 2-3 horas
- **Archivos:** `components/pages/tienda-content.tsx`
- **Fix:**
  - Remover `setTimeout` callback hack
  - Agregar `brandFilter, pricePreset` al array de dependencias de `useMemo`

### B6: Precios almacenados como strings formateados
- **Impacto:** MEDIO — Frágil, dependiente de locale, propenso a romperse
- **Estado:** NO RESUELTO
- **Esfuerzo:** 2-3 horas
- **Fix:** Almacenar precios como integers en Supabase, parsear una vez en el display layer

---

## 3. PLAN DE EJECUCIÓN — FASES

### FASE 1 — QUICK WINS (<1 hora)

| # | Tarea | Esfuerzo | Impacto | Archivos |
|---|-------|----------|---------|----------|
| Q1 | Fix CartProvider a root layout | 30 min | ALTO | `app/layout.tsx` |
| Q2 | Actualizar números de teléfono/WhatsApp reales | 10 min | ALTO | `config/site.json`, `content/es.json` |
| Q3 | Fix estadísticas de homepage | 5 min | MEDIO | `app/admin/page.tsx` |
| Q4 | Remover enlace `/productos` duplicado en nav | 2 min | BAJO | `components/header.tsx` |

**Total FASE 1:** ~47 minutos

---

### FASE 2 — FEATURES P0-3 (4-6 horas)

| # | Tarea | Esfuerzo | Prioridad | Archivos |
|---|-------|----------|-----------|----------|
| P0-1 | Botón "Consultar por WhatsApp" en cada producto | 2-3h | P0 | `app/tienda/page.tsx`, `components/product-modal.tsx` |
| P0-2 | Carrusel de kits/promos sin auto-rotación | 4-6h | P0 | `components/kits-carousel.tsx`, `app/page.tsx` |
| P0-3 | Checkout por WhatsApp desde el carrito | 2-4h | P1 | `components/cart-sidebar.tsx`, `app/checkout/page.tsx` |
| P0-4 | Sistema de pedidos en Admin | 4-6h | P1 | `app/admin/pedidos/`, `lib/orders.ts` |

**Total FASE 2:** ~12-19 horas

---

### FASE 3 — PERFORMANCE & SEO (7-11 horas)

| # | Tarea | Esfuerzo | Prioridad | Archivos |
|---|-------|----------|-----------|----------|
| P1-1 | Performance de imágenes — WebP | 4-6h | P1 | `public/images/products/`, `public/images/marketing/` |
| P1-2 | SEO metadata en tienda + producto | 3-5h | P1 | `/app/tienda/page.tsx`, `/app/producto/[slug]/page.tsx` |
| P1-3 | Fix bug de búsqueda/filtro (marca) | 2-3h | P2 | `components/pages/tienda-content.tsx` |
| P1-4 | Precios como integers | 2-3h | P2 | Supabase, `lib/cart-context.tsx` |

**Total FASE 3:** ~11-17 horas

---

### FASE 4 — ADMIN & BRANDING (4-9 horas)

| # | Tarea | Esfuerzo | Prioridad | Archivos |
|---|-------|----------|-----------|----------|
| P2-1 | Editor de categorías desde admin | 2-3h | P2 | `app/admin/contenido/page.tsx` |
| P2-2 | Meta descripciones por página (SEO) | 3-5h | P2 | `app/layout.tsx`, páginas |
| P2-3 | Open Graph tags | 1-2h | P2 | `app/layout.tsx`, `public/images/og-viajero.svg` |
| P2-4 | Panel de contenido 100% funcional | 4-6h | P2 | `app/admin/contenido/page.tsx` |

**Total FASE 4:** ~10-16 horas

---

### FASE 5 — POST-LANZAMIENTO (16-24 horas)

| # | Tarea | Esfuerzo | Prioridad | Archivos |
|---|-------|----------|-----------|----------|
| P3-1 | Imágenes del carrusel Hero editables | 2-3h | P3 | `app/admin/contenido/page.tsx`, `content/es.json` |
| P3-2 | Contenido real de blog | 8-12h | P3 | `content/blog/posts-*.json`, `app/blog/[slug]/page.tsx` |
| P3-3 | Importación masiva de productos desde Excel | 4-6h | P3 | `app/admin/productos/`, `lib/import-products.ts` |
| P3-4 | Variante de producto (matriz) | 8-12h | P3 | Supabase, `app/producto/[slug]/page.tsx` |
| P3-5 | Logo minimalista | 30 min | P3 | `public/images/logo.svg` |
| P3-6 | Favicon real | 30 min | P3 | `public/favicon.ico` |

**Total FASE 5:** ~17-33 horas

---

## 4. DEPENDENCIAS DEL CLIENTE

### INMEDIATO (bloquea FASE 1-2)

| # | Qué necesito | De quién | Bloquea | Estado |
|---|-------------|----------|----------|--------|
| 1 | Número WhatsApp Business confirmado | Omar | P0-1, P0-3, P0-4 | ❌ Sin confirmar |
| 2 | Número de teléfono real | Omar | Q2, B4 | ❌ Sin confirmar |
| 3 | Horarios de atención | Omar | Footer/contacto | ❌ Sin confirmar |
| 4 | Zonas de envío que cubre | Omar | Config shipping | ❌ Sin confirmar |
| 5 | Email corporativo | Omar | Emails transaccionales | ❌ Sin confirmar |

### ESTA SEMANA (desbloquea FASE 3-4)

| # | Qué necesito | De quién | Para qué fase |
|---|-------------|----------|--------------|
| 6 | Fotos de productos (mínimo 10 para empezar) | Omar | FASE 3 (P1-1) |
| 7 | Lista de productos con precios | Omar | FASE 3 (P1-1) |
| 8 | Logo final (material de fuente) | Omar | FASE 5 (P3-5) |
| 9 | Datos bancarios para transferencias | Omar | Checkout (opcional) | ❌ Post-lanzamiento |
| 10 | Credenciales PagoPar/Bancard | Omar | Pasarelas de pago | ❌ Post-lanzamiento |
| 11 | Políticas de devolución / términos | Omar | FASE 5 (legal) | ⚠️ Puedo usar genérico |

### INFRAESTRUCTURA (desbloquea dominio)

| # | Qué necesito | De quién | Para qué fase |
|---|-------------|----------|--------------|
| 12 | Acceso a DNS / MaxiDominio | Ivan | FASE 6 (dominio) | ❌ Sin acceso |
| 13 | Cloudflare token con Zone:Edit | Ivan | FASE 6 (SSL) | ❌ Token read-only |

---

## 5. CHECKLIST DE LANZAMIENTO

### CHECKLIST TÉCNICO

- [ ] **FASE 1:** Quick WINS (47 min)
  - [ ] CartProvider en root layout
  - [ ] Números de teléfono/WhatsApp actualizados
  - [ ] Estadísticas de homepage funcionando
  - [ ] Enlace `/productos` removido o corregido
  - [ ] Desplegado y verificado en production

- [ ] **FASE 2:** Features P0-3 (12-19h)
  - [ ] Botón "Consultar por WhatsApp" en cada producto
  - [ ] Carrusel de kits/promos sin auto-rotación
  - [ ] Checkout por WhatsApp desde el carrito
  - [ ] Sistema de pedidos en Admin (CRUD + estados)
  - [ ] Desplegado y verificado en production

- [ ] **FASE 3:** Performance & SEO (11-17h)
  - [ ] Imágenes optimizadas (WebP, <100KB)
  - [ ] SEO metadata en tienda (CollectionPage schema)
  - [ ] SEO metadata en productos (Product schema)
  - [ ] Bug de búsqueda/filtro arreglado
  - [ ] Precios como integers en DB
  - [ ] Desplegado y verificado en production

- [ ] **FASE 4:** Admin & Branding (10-16h)
  - [ ] Editor de categorías completo
  - [ ] Meta descripciones en todas las páginas
  - [ ] Open Graph tags correctos
  - [ ] Panel de contenido 100% funcional
  - [ ] Desplegado y verificado en production

- [ ] **FASE 5:** Post-lanzamiento (17-33h)
  - [ ] Imágenes de hero editables desde admin
  - [ ] Contenido real de blog (historias de Omar)
  - [ ] Importación masiva de productos desde Excel
  - [ ] Variante de producto (matriz)
  - [ ] Logo minimalista final
  - [ ] Favicon real
  - [ ] Desplegado y verificado en production

---

### CHECKLIST DE DATOS DEL CLIENTE

- [ ] **Datos básicos:**
  - [ ] WhatsApp Business confirmado (+595 984 009751)
  - [ ] Número de teléfono real
  - [ ] Horarios de atención (Lunes–Domingo, continuas)
  - [ ] Zonas de envío (Asunción, Central, Interior)
  - [ ] Email corporativo

- [ ] **Productos:**
  - [ ] Fotos reales de productos (mínimo 10 para empezar)
  - [ ] Lista maestra de productos con precios (~130 productos)
  - [ ] Descripciones reales de productos

- [ ] **Branding:**
  - [ ] Logo final (material de fuente de Omar)
  - [ ] Fotos de tienda para página /nosotros
  - [ ] Testimonios de clientes reales

- [ ] **Legal:**
  - [ ] Políticas de devolución
  - [ ] Términos y condiciones
  - [ ] Política de privacidad

- [ ] **Pagos:**
  - [ ] Credenciales PagoPar (API keys)
  - [ ] Credenciales Bancard (API keys)
  - [ ] Datos bancarios para transferencias (opcional)

---

### CHECKLIST DE INFRAESTRUCTURA

- [ ] **Dominio:**
  - [ ] Comprar tiendaelviajero.com.py
  - [ ] Configurar DNS (A record a VPS IP)
  - [ ] Verificar que resuelve a el-viajero.paragu-ai.com

- [ ] **SSL:**
  - [ ] Certificado Let's Encrypt activo
  - [ ] HTTPS funcionando en tiendaelviajero.com.py

- [ ] **Analytics:**
  - [ ] Google Analytics 4 configurado (NEXT_PUBLIC_GA_ID)
  - [ ] Google Search Console verificada
  - [ ] Facebook Pixel (NEXT_PUBLIC_FACEBOOK_PIXEL_ID)

---

## RESUMEN EJECUTIVO

| Fase | Tiempo estimado | Prioridad | Estado |
|-------|----------------|-----------|--------|
| FASE 1 — Quick Wins | 47 min | CRÍTICO | ❌ Pendiente |
| FASE 2 — Features P0-3 | 12-19h | ALTA | ❌ Pendiente |
| FASE 3 — Performance & SEO | 11-17h | ALTA | ❌ Pendiente |
| FASE 4 — Admin & Branding | 10-16h | MEDIA | ❌ Pendiente |
| FASE 5 — Post-lanzamiento | 17-33h | BAJA | ❌ Pendiente |

**Total estimado:** ~51-122 horas (~6-15 días)

---

## PRÓXIMOS PASOS

1. **HOY (FASE 1):**
   - [ ] Empezar con CartProvider a root layout (30 min)
   - [ ] Actualizar números de teléfono/WhatsApp (10 min)
   - [ ] Fix estadísticas de homepage (5 min)
   - [ ] Desplegar y verificar

2. **ESTA SEMANA (FASE 2):**
   - [ ] Implementar botón "Consultar por WhatsApp"
   - [ ] Implementar carrusel de kits/promos
   - [ ] Implementar checkout por WhatsApp desde carrito
   - [ ] Implementar sistema de pedidos en admin

3. **PRÓXIMA SEMANA (FASE 3):**
   - [ ] Optimizar imágenes (WebP)
   - [ ] Agregar SEO metadata
   - [ ] Fix bugs de búsqueda/filtro
   - [ ] Convertir precios a integers

4. **POST-LANZAMIENTO (FASE 4-5):**
   - [ ] Completar admin y branding
   - [ ] Implementar features post-lanzamiento

---

**Documentos de referencia:**
- `/root/elviajero/CLIENT_FEEDBACK_COMPLETE.md` — Tracker completo de feedback
- `/root/elviajero/docs/STATUS.md` — Estado actual e issues conocidos
- `/root/elviajero/docs/PLAN-LANZAMIENTO-5-DIAS.md` — Plan de 5 días
- `/root/elviajero/docs/upgrade-plan-2026-05-08.md` — Plan de upgrade
- `/root/elviajero/docs/reunion-cliente-2026-05-13.md` — Actas de reunión
- `/root/elviajero/docs/brutal-asset-critique.md` — Issues de branding

---

*Generado por Hermes Agent el 2026-05-19 basado en análisis completo de feedback del cliente.*
