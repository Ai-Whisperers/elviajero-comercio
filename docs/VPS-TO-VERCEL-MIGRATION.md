# El Viajero — Migración VPS → Vercel (2026-05-25)

## Resumen Ejecutivo

El sitio de El Viajero fue migrado del VPS compartido (72.61.44.159) a **Vercel**, una plataforma de hosting serverless con CDN global. El cambio resuelve los problemas de disponibilidad, velocidad y mantenimiento que aquejaban al sitio.

**Estado actual:** ✅ Live en https://tiendaelviajero.com.py (Vercel, HTTP 200)

---

## El Problema: VPS Compartido

### Cómo funcionaba (viejo)

El sitio corría en un servidor privado virtual (VPS) en 72.61.44.159, compartido con **~50 sitios y servicios** de Ai-Whisperers (Trentina, Magnolio, De Abasto a Casa, etc.).

```
Internet → Traefik (reverse proxy en VPS) → Contenedor Docker (El Viajero)
```

**Problemas recurrentes:**

1. **Caídas por saturación de recursos** — El VPS tiene 387 GB de disco, 81% usado. 50+ contenedores compiten por CPU y RAM. Cuando la carga subía, los sitios se caían o respondían lentísimo.

2. **El router (Traefik) era un punto único de falla** — Traefik redirige el tráfico al contenedor correcto según el dominio. Cuando fallaba o se reconfiguraba mal, el tráfico de El Viajero iba a parar a otro sitio (por ejemplo: clientes reportaron ver "De Abasto a Casa" en tiendaelviajero.com.py).

3. **Despliegues manuales y arriesgados** — Para actualizar el sitio había que entrar al servidor, reconstruir la imagen Docker, y reiniciar el servicio. Si algo salía mal, el sitio quedaba caído hasta que alguien lo reparara.

4. **Sin CDN global** — Todo el tráfico pasaba por un solo servidor en Paraguay. Usuarios en Asunción Capital o fuera del país experimentaban tiempos de carga lentos.

5. **Cambios inesperados** — Cuando otros sitios se actualizaban, se reconfiguraban, o se agregaban nuevos, el Traefik a veces redirigía tráfico incorrectamente. También había conflicto entre `elviajero_web` (Swarm) y `elviajero-web-1` (legacy standalone) — ambos nombres coexistían y causaban confusión en routing.

6. **Admin panel roto** — Las credenciales de Supabase (service_role key) estaban en el `.env.local` del VPS, no en el código. Cuando el contenedor se reconstruía sin ese archivo, el admin perdía acceso a las funcionalidades avanzadas.

**Síntomas que experimentaba el cliente:**
- 404s inesperados
- El sitio mostrando contenido de otro negocio
- Cambios que el cliente no había solicitado aparecían
- El sitio caído sin aviso

---

## La Solución: Vercel

### Arquitectura nueva

```
Usuario → Vercel Edge (CDN global, 80+ ubicaciones)
              ↓
         Next.js (SSR/SSG) → Supabase (datos + auth)
              ↓
         Supabase Storage (imágenesbucket: ej_product_images)
```

### Componentes

| Componente | Rol | Plan |
|---|---|---|
| **Vercel** | Hosting del sitio (HTML, JS, CSS) | Hobby (gratis) |
| **Supabase** | Base de datos, Auth, Storage | Free tier |
| **GitHub** | Código fuente, CI/CD automático | Gratis |
| **Supabase Bucket** | Imágenes de productos (~102 productos) | Free tier |

### Por qué Vercel resuelve estos problemas

| Problema VPS | Solución en Vercel |
|---|---|
| Caídas por saturación | Auto-scaling serverless, 80+ servidores globales |
| Traefik = punto único de falla | Vercel tiene redundancia automática, cero configuración manual |
| Despliegues manuales | GitHub Actions: cada push rebuild automática |
| Sin CDN | CDN global edge en 80+ ubicaciones |
| Cambios inesperados | Entorno aislado, configuración en git, no hay acceso SSH al servidor |
| Admin panel sin acceso | Variables de entorno en Vercel Dashboard, versionadas junto con el código |

---

## Costos: Plan Gratuito (Hobby)

Vercel Hobby = **$0/mes**. No hay costo fijo.

### Límites mensuales

| Recurso | Límite | Uso estimado El Viajero |
|---|---|---|
| Ancho de banda | 1 TB/mes | ~1-5 GB/mes |
| Horas de función serverless | 100 horas/mes | ~10-30 horas/mes |
| Almacenamiento estático | 100 GB | ~50-100 MB |
| Dominios personalizados | ✅ | ✅ |
| SSL (HTTPS) | ✅ | ✅ |
| Despliegues automáticos | ✅ | ✅ |

### Nota crítica: Las imágenes NO pasan por Vercel

Las ~102 imágenes de productos están en **Supabase Storage** (bucket `ej_product_images`). Cuando un cliente abre el sitio:

1. El navegador descarga HTML/JS/CSS desde Vercel (~200-500 KB)
2. Las imágenes se cargan **directamente desde Supabase Storage** (bucket público)

**Vercel solo sirve el código shell.** Las imágenes pesan 500 KB - 5 MB por visita, pero eso no cuenta contra el límite de Vercel.

### Costos reales para El Viajero

| Escenario | Vercel | Supabase | Total |
|---|---|---|---|
| Uso normal PYME | **$0** | **$0** | **$0/mes** |
| Mes con mucho tráfico (500 visitas) | **$0** | **$0** | **$0/mes** |
| Sobresale 1 TB en Vercel | $0.15/GB adicional | — | Muy improbable |
| Sobresale límite Supabase | — | Escala automática | Muy improbable |

**Probabilidad de que El Viajero exceda los límites gratuitos:** < 1% (necesitaría más de 50.000 visitas/mes, extremo para una PYME Paraguay).

### Qué pasa si se excede un límite

- **Vercel:** El sitio muestra una página de "límite alcanzado" temporalmente. El contenido en Supabase **no se pierde**. Ai-Whisperers recibe alerta y gestiona la reactivación o upgrade.
- **Supabase:** Similar — contenido seguro, hay plan de contingencia.

---

## Gestión del Servicio

Ai-Whisperers ofrece esto como parte del servicio:

- **Monitoreo de uso** — Dashboard de Vercel + Supabase con acceso para revisar consumo en tiempo real
- **Alertas proactivas** — Si el uso supera el 80% de cualquier límite, te comunicamos antes de que sea crítico
- **Gestión de límites** — Si el negocio crece y los límites gratuitos se quedan cortos, te presentamos opciones con presupuesto claro
- **Mantenimiento de código** — Actualizaciones de seguridad, mejoras de rendimiento, parches
- **Despliegues** — cualquier cambio que necesites se hace vía GitHub, sin downtime

**Tu responsabilidad como cliente: cero.** Ai-Whisperers se ocupa de todo.

---

## Detalles Técnicos del Deployment

### Repositorio
https://github.com/Ai-Whisperers/elviajero-comercio

### Dominio
- `tiendaelviajero.com.py` → configurado en Vercel (antes apuntaba a VPS 72.61.44.159)
- DNS: Max Domain DNS (gestión independiente de Vercel)

### Variables de Entorno en Vercel

```
NEXT_PUBLIC_BASE_URL=https://www.tiendaelviajero.com.py
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KQ-sFNr7r6AauoG0B4nyTg_vuPHmeCm
NEXT_PUBLIC_SUPABASE_URL=https://qyvokpribmbrosafntqa.supabase.co
NEXT_PUBLIC_WHATSAPP=595984009751
SUPABASE_SERVICE_ROLE_KEY=sb_secret_J7n1igQHaVSKn35OrMe93A_p-_FEBvH  ← Server-side only
```

### Build
- Framework: Next.js 15.5.18
- Build time: ~1m 39s
- TypeScript: ✅ (exit code 0)
- Deploy triggers: push a main en GitHub

### Servidores de Supabase
- Project: `qyvokpribmbrosafntqa`
- Region: No especificada (supabase.co default)
- Storage bucket: `ej_product_images` (público)

---

##对比 Resumen VPS vs Vercel

| | VPS (viejo) | Vercel (nuevo) |
|---|---|---|
| Disponibilidad | Caídas frecuentes | 99.9% uptime garantía |
| Velocidad | 1 servidor | CDN global, 80+ ubicaciones |
| Mantenimiento | Manual, riesgoso | Automático por git |
| Escalabilidad | Fija (recursos limitados) | Auto-scaling |
| Costo base | $20-50/mes (servidor compartido) | **$0** |
| Costo variable | N/A | $0 (dentro de límites gratis) |
| Imágenes | Servidas desde VPS | Servidas desde Supabase |
| Admin panel | Dependía de .env.local en VPS | Variables en Vercel Dashboard |
| Despliegue | ssh + docker build + restart | git push = deploy automático |
| Riesgo operacional | Alto (punto único de falla) | **Bajo** |

---

## Próximos Pasos (Opcional)

1. **Vencer el DNS en Max Domain** — Confirmar que `tiendaelviajero.com.py` apunta correctamente a Vercel y no al VPS viejo
2. **Descomisionar el contenedor viejo** — `elviajero_web` y `elviajero-web-1` en el VPS ya no sirven para nada, se pueden detener
3. **Pipeline de staging** — Configurar ambiente staging en Vercel para probar cambios antes de producción
4. **Monitoreo** — Conectar Vercel Analytics para ver tráfico real

---

*Documento creado: 2026-05-25*
*Ai-Whisperers — Servicio de El Viajero*
