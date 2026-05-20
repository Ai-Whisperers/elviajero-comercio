# El Viajero — Resumen Ejecutivo del Plan de Implementación

> **Cliente:** Omar Aguilera — Tienda El Viajero  
> **Sitio Live:** https://el-viajero.paragu-ai.com | viajero.paragu-ai.com  
> **Fecha:** 2026-05-19  
> **Tiempo total estimado:** ~51-52 horas (6-15 días)

---

## ESQUEMA EJECUTIVO

```
HOY (FASE 1) → ESTA SEMANA (FASE 2-3) → POST-LANZAMIENTO (FASE 4-5)
  (47 min)           (23-36 horas)                    (27-39 horas)
```

---

## FASE 1 — QUICK WINS (47 minutos) ⚡

**Objetivo:** Desbloquear críticos en <1 hora

| # | Tarea | Tiempo | Impacto |
|---|-------|--------|---------|
| Q1 | CartProvider a root layout | 30 min | ALTO — Carrito funciona en todas las páginas |
| Q2 | Números de teléfono/WhatsApp reales | 10 min | ALTO — Clientes pueden llamar a la tienda |
| Q3 | Fix estadísticas de homepage | 5 min | MEDIO — Admin muestra datos reales |

**Entregable:** Sitio estable, carrito funcionando, números correctos.

---

## FASE 2 — FEATURES DEL CLIENTE (12-19 horas) 🎯

**Objetivo:** Implementar TODO lo que Omar pidió específicamente

| # | Tarea | Tiempo | Qué pidió Omar |
|---|-------|--------|-----------------|
| P0-1 | Botón "Consultar por WhatsApp" en cada producto | 2-3h | "Consultar por WhatsApp" al lado de "Agregar al carrito" |
| P0-2 | Carrusel de kits/promos sin auto-rotación | 4-6h | Carrusel manual (solo flechas, NO auto-rotar) |
| P0-3 | Checkout por WhatsApp desde el carrito | 2-4h | Botón que genera mensaje completo con todos los items |
| P0-4 | Sistema de pedidos en Admin | 4-6h | Panel de órdenes con estados (Pendiente→Confirmado→Enviado→Entregado) |

**Entregable:** Omar puede recibir y gestionar pedidos vía WhatsApp. Clientes pueden consultar productos y hacer checkout directo a WhatsApp.

---

## FASE 3 — PERFORMANCE & SEO (11-17 horas) ⚡

**Objetivo:** Sitio rápido, visible en Google Shopping

| # | Tarea | Tiempo | Impacto |
|---|-------|--------|---------|
| P1-1 | Optimizar imágenes (WebP, <100KB) | 4-6h | ALTO — Carga rápida en móvil (30s → 3s) |
| P1-2 | SEO metadata en tienda + producto | 3-5h | ALTO — Visible en Google Shopping |
| P1-3 | Fix bug de búsqueda/filtro (marca) | 2-3h | MEDIO — Filtro de marca funciona |
| P1-4 | Precios como integers en DB | 2-3h | MEDIO — No más parsing frágil |

**Entregable:** Sitio carga rápido en móvil. Aparece en Google. Filtros funcionan.

---

## FASE 4 — ADMIN & BRANDING (10-16 horas) 🎨

**Objetivo:** Admin completo, branding profesional

| # | Tarea | Tiempo | Qué pidió Omar |
|---|-------|--------|-----------------|
| P2-1 | Editor de categorías desde admin | 2-3h | CRUD completo de categorías |
| P2-2 | Meta descripciones por página | 3-5h | SEO metadata por página |
| P2-3 | Open Graph tags correctos | 1-2h | Imagen y texto al compartir en redes |
| P2-4 | Panel de contenido 100% funcional | 4-6h | Editar textos de homepage, contacto, FAQ, footer |

**Entregable:** Omar puede gestionar todo el contenido desde el panel. Compartir en redes se ve bien.

---

## FASE 5 — POST-LANZAMIENTO (17-33 horas) 🚀

**Objetivo:** Features avanzadas para crecimiento

| # | Tarea | Tiempo | Qué pidió Omar |
|---|-------|--------|-----------------|
| P3-1 | Imágenes de hero editables desde admin | 2-3h | Cambiar imágenes del carrusel desde panel |
| P3-2 | Contenido real de blog | 8-12h | Historias reales de Omar (audio → transcripción → IA → post) |
| P3-3 | Importación masiva de productos desde Excel | 4-6h | Importar ~130 productos desde Excel/Sheets |
| P3-4 | Variante de producto (matriz) | 8-12h | Size × color × material × precio |
| P3-5 | Logo minimalista | 30 min | "El texto nomás y el eslogan: Equipamientos Aventura" |
| P3-6 | Favicon real | 30 min | Reconocible a 16x16 (montaña + tienda) |

**Entregable:** Omar puede cargar 130 productos con un click. Blog con historias reales. Logo profesional. Variantes de producto.

---

## BLOQUEANTES DEL CLIENTE (lo que Omar TIENE que proveer)

### INMEDIATO (bloquea FASE 1-2)

| # | Qué necesito | Estado |
|---|-------------|--------|
| 1 | WhatsApp Business confirmado (+595 984 009751) | ❌ Sin confirmar |
| 2 | Número de teléfono real | ❌ Sin confirmar |
| 3 | Horarios de atención (Lunes–Domingo, continuas) | ❌ Sin confirmar |
| 4 | Zonas de envío que cubre | ❌ Sin confirmar |
| 5 | Email corporativo | ❌ Sin confirmar |

### ESTA SEMANA (desbloquea FASE 3)

| # | Qué necesito | Para qué fase |
|---|-------------|--------------|
| 6 | Fotos de productos (mínimo 10 para empezar) | FASE 3 (optimizar imágenes) |
| 7 | Lista de productos con precios | FASE 3 (importación masiva) |
| 8 | Logo final (material de fuente) | FASE 5 (branding) |

### INFRAESTRUCTURA (Ivan)

| # | Qué necesito | Para qué fase |
|---|-------------|--------------|
| 9 | Acceso a DNS / MaxiDominio | FASE 6 (dominio) | ❌ Ivan sin acceso |
| 10 | Cloudflare token con Zone:Edit | FASE 6 (SSL) | ❌ Token read-only |
| 11 | Credenciales PagoPar/Bancard | Post-lanzamiento | ❌ Omar no tiene |

---

## PRÓXIMOS PASOS CONCRETOS

### HOY (47 minutos)

1. [ ] Mover CartProvider a root layout (`app/layout.tsx`)
   - 4 líneas de código
   - Verificar que carrito funciona en blog, contacto, faq, admin

2. [ ] Actualizar números de teléfono/WhatsApp (`config/site.json`, `content/es.json`)
   - Cambiar placeholder a +595 984 009751
   - Verificar botón flotante de WhatsApp

3. [ ] Fix estadísticas de homepage (`app/admin/page.tsx`)
   - Cambiar query de `products` a `ej_products`
   - Verificar que admin muestra números reales

4. [ ] Desplegar y verificar en production
   - `bash deploy.sh`
   - Probar carrito en todas las páginas

### ESTA SEMANA (12-19 horas)

1. [ ] Implementar botón "Consultar por WhatsApp"
   - Crear botón en tarjeta de producto (`app/tienda/page.tsx`)
   - Crear botón en modal de detalle (`components/product-modal.tsx`)
   - Crear botón en página de producto (`components/pages/product-content.tsx`)
   - Al hacer clic, abrir WhatsApp con: nombre, precio, link

2. [ ] Implementar carrusel de kits/promos
   - Crear `components/kits-carousel.tsx`
   - Agregar a homepage debajo del hero
   - NO auto-rotar, solo flechas manuales
   - Contenido desde promociones en DB
   - Gestionable desde admin

3. [ ] Implementar checkout por WhatsApp desde el carrito
   - Actualizar `components/cart-sidebar.tsx` con botón "Checkout por WhatsApp"
   - Generar mensaje formateado con:
     - Todos los items
     - Cantidades
     - Subtotales
     - Total
     - Datos del cliente (nombre, teléfono, ciudad, RUC)
   - Enviar a +595 984 009751

4. [ ] Implementar sistema de pedidos en Admin
   - Crear `app/admin/pedidos/` (lista de órdenes)
   - Crear `lib/orders.ts` (lógica de estados)
   - Crear endpoint API `app/api/orders/route.ts`
   - Workflow: Pendiente → Confirmado → Enviado → Entregado → Pagado
   - Al confirmar, descontar del stock automáticamente
   - Dashboard de reportes: ventas del mes, productos más vendidos

### PRÓXIMA SEMANA (11-17 horas)

1. [ ] Optimizar imágenes (WebP, <100KB)
   - Convertir todas las imágenes PNG a WebP
   - Comprimir a <100KB por imagen
   - Agregar `loading="lazy"` a todas
   - Agregar `srcset` para responsive

2. [ ] Agregar SEO metadata
   - `generateMetadata()` en `/app/tienda/page.tsx` (CollectionPage schema)
   - `generateMetadata()` en `/app/producto/[slug]/page.tsx` (Product schema)
   - Incluir precio, disponibilidad, imagen, ofertas

3. [ ] Fix bug de búsqueda/filtro
   - Remover `setTimeout` callback hack
   - Agregar `brandFilter, pricePreset` a dependencias `useMemo`

4. [ ] Convertir precios a integers en DB
   - Almacenar precios como integers en Supabase
   - Parsear strings a integers solo en display layer
   - Calcular totales con integers

---

## CRONOGRAMA DE LANZAMIENTO

```
HOY (Día 1):    FASE 1 — Quick Wins (47 min) → Deploy
Día 2-3:         FASE 2 — Features del cliente (12-19h) → Deploy
Día 4-6:         FASE 3 — Performance & SEO (11-17h) → Deploy
Día 7-10:        FASE 4 — Admin & Branding (10-16h) → Deploy
Día 11-15:       FASE 5 — Post-lanzamiento (17-33h) → Deploy
Día 16:           🚀 LANZAMIENTO OFICIAL
```

**Total:** ~15 días (51-52 horas de desarrollo)

---

## MÉTRICAS DE ÉXITO

### Antes de FASE 1
- Carrito se rompe en blog, contacto, faq, admin
- Números de teléfono falsos
- Estadísticas del admin muestran 0
- Imágenes pesadas (30+ MB para cargar)

### Después de FASE 1
- ✅ Carrito funciona en todas las páginas
- ✅ Números de teléfono/WhatsApp reales
- ✅ Estadísticas del admin correctas
- Sitio estable y deployado

### Después de FASE 2
- ✅ Clientes pueden consultar productos vía WhatsApp
- ✅ Carrusel de kits/promos manual funcionando
- ✅ Checkout por WhatsApp desde el carrito
- ✅ Sistema de pedidos en admin activo

### Después de FASE 3
- ✅ Sitio carga en <3 segundos en móvil
- ✅ Aparece en Google Shopping
- ✅ Filtros de búsqueda funcionan
- Precios almacenados como integers (frágilidad eliminada)

### Después de FASE 4
- ✅ Omar puede gestionar contenido desde admin
- ✅ Compartir en redes se ve profesional
- ✅ SEO metadata correcta en todas las páginas

### Después de FASE 5
- ✅ Omar puede importar 130 productos con un click
- ✅ Blog con historias reales de Omar
- ✅ Logo profesional minimalista
- ✅ Variantes de producto disponibles
- Favicon reconocible en tabs

---

## NOTAS DE RIESGO

### Riesgo ALTO
- **Cliente sin confirmar WhatsApp Business** → Bloquea FASE 2 (checkout por WhatsApp, sistema de pedidos)
- **Cliente sin proveer fotos de productos** → Bloquea FASE 3 (optimización de imágenes)
- **Cliente sin proveer logo final** → Bloquea FASE 5 (branding)

### Mitigación
- Reunión con Omar esta semana para confirmar:
  1. WhatsApp Business confirmado (+595 984 009751)
  2. Mínimo 10 fotos de productos para empezar
  3. Logo final (material de fuente)
  4. Horarios de atención definitivos
  5. Zonas de envío que cubre

---

**Documento completo:** `/root/elviajero/docs/PLAN-COMPLETO-IMPLEMENTACION-2026-05-19.md`

---

*Generado por Hermes Agent el 2026-05-19*
