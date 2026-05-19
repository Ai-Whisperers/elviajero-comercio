# Plan Completo: Fix de 35 Issues del Panel Admin
**Proyecto:** El Viajero Admin Panel
**Fecha:** 2026-05-19
**Issues totales:** 35
**Estimación total:** ~40-50 horas de trabajo

---

## FASE 1: SEGURIDAD CRÍTICA (Día 1-2)
> **Objetivo:** Cerrar todos los agujeros de seguridad antes de que el sitio esté en producción.

### 1.1 Auth Middleware para API Admin
- **Archivos:** `middleware.ts`, `lib/auth.ts` (nuevo)
- **Tarea:** Crear helper `requireAdmin(req)` que:
  - Lea el JWT de la cookie `sb-access-token`
  - Verifique la sesión con Supabase
  - Haga `SELECT role FROM profiles WHERE id = user_id`
  - Retorne 401/403 si no es admin
- **Impacto:** Todas las rutas `/api/admin/*`
- **Tiempo:** 3h

### 1.2 Aplicar requireAdmin a todas las API routes
- **Archivos:** Todos los `route.ts` bajo `app/api/admin/`
- **Tarea:** Importar y llamar `requireAdmin(req)` al inicio de cada handler (GET/POST/PATCH/DELETE)
- **Lista completa de rutas a proteger:
  - `/api/admin/products` (GET/POST/PATCH/DELETE)
  - `/api/admin/orders` (GET/POST/PATCH)
  - `/api/admin/customers` (GET)
  - `/api/admin/categories` (GET/POST/DELETE)
  - `/api/admin/promos` (GET/POST/PATCH/DELETE)
  - `/api/admin/stock-movements` (GET/POST)
  - `/api/admin/stock-alerts` (GET/POST)
  - `/api/admin/blog` (GET/POST/PATCH/DELETE)
  - `/api/admin/content` (GET/POST)
  - `/api/admin/users` (GET)
  - `/api/admin/staff` (GET/PATCH)
  - `/api/admin/invoices` (GET/POST/PATCH)
  - `/api/admin/returns` (GET/PATCH)
  - `/api/admin/reviews` (GET/DELETE)
  - `/api/admin/activity` (GET/POST)
  - `/api/admin/stats` (GET)
  - `/api/admin/delivery-zones` (GET/POST)
  - `/api/admin/theme` (GET/POST)
  - `/api/admin/whatsapp-templates` (GET/POST)
  - `/api/admin/abandoned-carts` (GET/POST)
  - `/api/admin/b2b` (GET/POST/PATCH)
  - `/api/admin/subscribers` (GET/POST)
  - `/api/admin/notifications` (GET/POST/PATCH)
  - `/api/admin/setup` (GET)
  - `/api/admin/enrich` (POST)
  - `/api/upload-image` (POST)
- **Tiempo:** 4h

### 1.3 Fix middleware.ts para cubrir API routes
- **Archivo:** `middleware.ts`
- **Tarea:** Agregar `/api/admin/:path*` al matcher de rutas protegidas
- **Tiempo:** 30min

### 1.4 Rate limiting básico
- **Archivo:** `lib/rate-limit.ts` (nuevo), `middleware.ts`
- **Tarea:** Implementar rate limiting por IP para `/api/admin/*` (ej: 100 req/min)
- **Tiempo:** 2h

---

## FASE 2: INTEGRIDAD DE DATOS (Día 2-4)
> **Objetivo:** Arreglar schemas, normalizar JSON, establecer FKs.

### 2.1 Normalizar ej_orders.note en columnas propias
- **Migración SQL:** `supabase/migrations/004_normalize_orders.sql`
- **Nuevas columnas en `ej_orders`:**
  - `payment_status` (text, default 'pending')
  - `payment_proof_url` (text)
  - `delivery_zone_id` (uuid, nullable)
  - `promo_code` (text)
  - `discount_applied` (integer, default 0)
  - `internal_notes` (text)
- **Tarea:**
  - Crear columnas
  - Migrar datos existentes desde `note` JSON
  - Actualizar `/api/admin/orders` para usar columnas nuevas
  - Actualizar frontend que lee/escribe `note`
- **Tiempo:** 5h

### 2.2 Foreign key: category_id en ej_products
- **Migración SQL:** `supabase/migrations/005_category_fk.sql`
- **Tareas:**
  - Agregar `category_id uuid REFERENCES ej_categories(id)`
  - Migrar datos existentes (mapear nombres a IDs)
  - Actualizar `/api/admin/products` para usar `category_id`
  - Actualizar `/api/admin/categories` DELETE para validar uso
  - Actualizar frontend dropdown de categorías
- **Tiempo:** 4h

### 2.3 Estandarizar schema de stock_movements
- **Archivos:** `app/api/admin/stock-movements/route.ts`, `app/api/admin/orders/route.ts`
- **Tarea:**
  - Usar siempre las columnas: `type`, `quantity`, `stock_before`, `stock_after`, `reference`, `note`
  - En `orders/route.ts`, al confirmar pedido, insertar stock movement con schema correcto
  - Actualizar `/admin/stock` page para mostrar datos correctamente
- **Tiempo:** 2h

### 2.4 Fix deducción de stock por ID no por nombre
- **Archivo:** `app/api/admin/orders/route.ts`
- **Tarea:** Cambiar `eq("name", item.name)` por `eq("id", item.id)`
- **Tiempo:** 30min

### 2.5 Validación de inputs en Content API
- **Archivo:** `app/api/admin/content/route.ts`
- **Tarea:** Crear schema Zod con keys permitidas (siteName, tagline, hero, about, etc.)
- **Tiempo:** 1h

### 2.6 Validación de slug único en Blog
- **Archivo:** `app/api/admin/blog/route.ts`
- **Tarea:** Antes de PATCH/POST, verificar que el slug no exista ya
- **Tiempo:** 30min

### 2.7 Validación de roles permitidos en Staff
- **Archivo:** `app/api/admin/staff/route.ts`
- **Tarea:** Validar que `role` esté en `['admin','ventas','bodega','customer']`
- **Tiempo:** 15min

---

## FASE 3: PERFORMANCE Y ESCALABILIDAD (Día 4-6)
> **Objetivo:** Paginación, índices, queries eficientes.

### 3.1 Paginación en API routes
- **Patrón:** `?page=1&limit=20` en todas las listas
- **Rutas a modificar:**
  - `/api/admin/orders` — paginado + filtros por status
  - `/api/admin/customers` — paginado + search server-side
  - `/api/admin/users` — paginado
  - `/api/admin/activity` — paginado + filtros por fecha
  - `/api/admin/products` — ya tiene search pero falta paginación
  - `/api/admin/stock-movements` — paginado
- **Tiempo:** 6h

### 3.2 Order detail: fetch por ID, no lista completa
- **Archivo:** `app/admin/pedidos/detalle/page.tsx`, `app/api/admin/orders/route.ts`
- **Tarea:**
  - Agregar soporte `?id=xxx` en GET de orders
  - Frontend pasar `orderId` como query param
  - Retornar 404 si no existe
- **Tiempo:** 1h

### 3.3 Stats endpoint: usar agregaciones SQL
- **Archivo:** `app/api/admin/stats/route.ts`
- **Tarea:** Reemplazar fetch-all-orders-in-JS por `.rpc('get_admin_stats')` o queries con `sum()`, `count()`
- **Tiempo:** 2h

### 3.4 Índices de base de datos
- **Migración SQL:** `supabase/migrations/006_indexes.sql`
- **Índices a crear:**
  ```sql
  CREATE INDEX idx_orders_status_created ON ej_orders(status, created_at DESC);
  CREATE INDEX idx_orders_user_id ON ej_orders(user_id);
  CREATE INDEX idx_products_category ON ej_products(category_id);
  CREATE INDEX idx_activity_action ON ej_activity_log(action, created_at DESC);
  CREATE INDEX idx_activity_entity ON ej_activity_log(entity_type, entity_id);
  CREATE INDEX idx_stock_movements_product ON ej_stock_movements(product_id, created_at DESC);
  ```
- **Tiempo:** 1h

### 3.5 Debounce en search inputs
- **Archivo:** `lib/hooks.ts` (nuevo `useDebounce`)
- **Tarea:** Aplicar a todos los `SearchInput` del admin
- **Tiempo:** 1h

---

## FASE 4: UX Y ROBUSTEZ (Día 6-8)
> **Objetivo:** Estados de loading, errores, feedback al usuario.

### 4.1 Estados de loading durante mutaciones
- **Archivo:** `components/admin/ui.tsx`
- **Tarea:** Crear `LoadingButton` component. Reemplazar todos los botones "Guardar" para que:
  - Se deshabiliten durante fetch
  - Muestren spinner
  - Prevengan double-submit
- **Tiempo:** 2h

### 4.2 Manejo de errores user-facing
- **Patrón:** Crear `Toast` / `Alert` component global
- **Archivos:** Todas las páginas admin
- **Tarea:** Reemplazar todos los `.catch(() => setLoading(false))` por `.catch(err => showToast(err.message))`
- **Tiempo:** 3h

### 4.3 Reemplazar alert() por toast inline
- **Archivo:** `app/admin/fotos/page.tsx`
- **Tarea:** Usar el mismo sistema de toast en vez de `alert()`
- **Tiempo:** 30min

### 4.4 Estandarizar formatos de respuesta API
- **Archivo:** `lib/api.ts` (nuevo helper)
- **Patrón:** Todas las rutas retornan `{success: boolean, data?: T, error?: string}`
- **Tarea:** Refactorizar todas las API routes para usar helpers consistentes
- **Tiempo:** 3h

### 4.5 Tipado: reemplazar any[] por interfaces
- **Archivo:** `types/admin.ts` (nuevo)
- **Tareas:**
  - Definir interfaces: `Product`, `Order`, `Customer`, `Category`, `StockMovement`, etc.
  - Reemplazar `useState<any[]>()` en todas las páginas admin
- **Tiempo:** 3h

### 4.6 Constantes para estados (magic strings)
- **Archivo:** `lib/constants.ts`
- **Tareas:**
  ```ts
  export const ORDER_STATUS = {
    PENDING: 'pendiente',
    CONFIRMED: 'confirmado',
    SHIPPED: 'enviado',
    DELIVERED: 'entregado',
    CANCELLED: 'cancelado'
  } as const;
  ```
  - Reemplazar strings hardcodeados en frontend y backend
- **Tiempo:** 2h

---

## FASE 5: ARQUITECTURA Y DEUDA TÉCNICA (Día 8-10)
> **Objetivo:** Sacar datos de JSONB, limpieza, optimización de imágenes.

### 5.1 Mover invoices a tabla propia
- **Migración SQL:** Crear `ej_invoices` table
- **Archivos:** `/api/admin/invoices/*`, `/admin/facturacion/page.tsx`
- **Tarea:**
  - Crear tabla con columnas apropiadas
  - Migrar datos desde `ej_site_config`
  - Actualizar API para usar tabla
  - Agregar generación secuencial de números (no `Date.now().toString(36)`)
- **Tiempo:** 3h

### 5.2 Mover returns a tabla propia
- **Similar a 5.1**
- **Tiempo:** 2h

### 5.3 Mover blog posts a tabla propia
- **Migración SQL:** Crear `ej_blog_posts`
- **Tarea:** Migrar desde `ej_site_config` JSONB
- **Tiempo:** 2h

### 5.4 Cleanup de ej_site_config
- **Tarea:** Revisar qué datos aún usan `ej_site_config` y decidir si merecen tabla propia
- **Tiempo:** 1h

### 5.5 Cleanup de activity_log y notifications
- **Migración SQL:** `supabase/migrations/007_cleanup_logs.sql`
- **Tarea:**
  - Agregar cron job o function para borrar entries > 90 días
  - Agregar paginación con date range en API
- **Tiempo:** 2h

### 5.6 Optimización de imágenes
- **Archivo:** `app/api/upload-image/route.ts`
- **Tarea:**
  - Convertir a WebP automáticamente (usar sharp si está disponible, o servicio externo)
  - Generar thumbnails
  - Agregar CDN caching headers
- **Tiempo:** 3h

### 5.7 Fix Enrich API: no localhost por default
- **Archivo:** `app/api/admin/enrich/route.ts`
- **Tarea:**
  - Si `AI_ENRICH_URL` no está seteado, retornar 503 "Service not configured"
  - Agregar timeout al fetch (10s)
- **Tiempo:** 30min

### 5.8 Fix stats: no parsear currency en JS
- **Archivo:** `app/api/admin/stats/route.ts`
- **Tarea:** Almacenar `total` como integer (centavos) en DB, o usar función SQL
- **Tiempo:** 1h

---

## CHECKLIST DE VERIFICACIÓN FINAL

- [ ] Todas las rutas `/api/admin/*` retornan 401/403 sin sesión admin válida
- [ ] Rate limiting activo en API admin
- [ ] `ej_orders` tiene columnas normalizadas, `note` ya no es JSON
- [ ] `ej_products.category_id` existe con FK a `ej_categories`
- [ ] Stock movements usan un solo schema
- [ ] Orders deducen stock por `product_id`
- [ ] Blog valida slug único
- [ ] Content API valida schema Zod
- [ ] Todas las listas tienen paginación server-side
- [ ] Order detail carga por ID
- [ ] Stats usa agregaciones SQL
- [ ] Índices creados en DB
- [ ] Botones deshabilitados durante mutaciones
- [ ] Errores muestran toast en vez de silent fail
- [ ] No hay `alert()` en el código
- [ ] Respuestas API son consistentes
- [ ] No hay `any[]` en estados admin
- [ ] Estados usan constantes en vez de strings
- [ ] Invoices, returns, blog en tablas propias
- [ ] Activity log tiene cleanup > 90 días
- [ ] Imágenes se convierten a WebP
- [ ] Enrich API no llama localhost
- [ ] `parseInt(s.replace(...))` eliminado de stats

---

## ORDEN DE EJECUCIÓN RECOMENDADO

```
Día 1: 1.1 + 1.2 + 1.3 (Seguridad)
Día 2: 1.4 + 2.1 + 2.2 (Auth + Normalización)
Día 3: 2.3 + 2.4 + 2.5 + 2.6 + 2.7 (Data integrity)
Día 4: 3.1 (Paginación parte 1)
Día 5: 3.2 + 3.3 + 3.4 + 3.5 (Performance)
Día 6: 4.1 + 4.2 + 4.3 (UX robustez)
Día 7: 4.4 + 4.5 + 4.6 (Código limpio)
Día 8: 5.1 + 5.2 + 5.3 (Tablas propias)
Día 9: 5.4 + 5.5 + 5.6 + 5.7 + 5.8 (Deuda técnica)
Día 10: Testing, checklist, deploy
```

---

## NOTAS

- Todas las migraciones SQL deben ser idempotentes (`IF NOT EXISTS`)
- Hacer backup de producción antes de correr migraciones
- Probar cada fase en staging antes de pasar a la siguiente
- Documentar breaking changes para el equipo
