# Guía de Conexión de Dominio — El Viajero

> **Cliente:** El Viajero Comercio  
> **Dominio:** `tiendaelviajero.com.py`  
> **Registrador:** Max Domain (maxdominios.com.py)  
> **Código Auth:** `BC-373950` (no necesario — guardado para referencia)  
> **Infraestructura:** Ai-Whisperers (VPS + Cloudflare)  
> **Última actualización:** 2026-05-12

---

## Progreso

| Paso | Estado |
|------|--------|
| 1. Zona Cloudflare creada | ✅ Completado |
| 2. DNS configurado en Cloudflare | ✅ Completado |
| 3. Cliente cambia NS en Max Domain | ⏳ Pendiente (cliente) |
| 4. Propagación NS (24-48h) | ⏳ En espera |
| 5. Actualizar Traefik | ⏳ Listo para ejecutar |
| 6. Actualizar .env | ⏳ Listo para ejecutar |
| 7. Redeploy Docker | ⏳ Listo para ejecutar |
| 8. Verificar sitio | ⏳ Listo para ejecutar |

---

## 1. Estado Actual

| Recurso | Detalle |
|---------|---------|
| Sitio en staging | `https://el-viajero.paragu-ai.com` ✅ Activo |
| Sitio en staging 2 | `https://viajero.paragu-ai.com` ✅ Activo |
| Dominio propio | `tiendaelviajero.com.py` — registrado, DNS listo en Cloudflare |
| VPS | Hostinger — 72.61.44.159 |
| Proxy | Traefik + Cloudflare |
| SSL | Let's Encrypt (automático) + Cloudflare |
| Backend | Supabase (base de datos, productos, órdenes) |
| Pagos | PagoPar + Bancard + Stripe |

---

## 2. Arquitectura Final

```
Cliente → tiendaelviajero.com.py
                │
                ▼
         Cloudflare DNS
         ├─ A  @   → 72.61.44.159  ☁️ Proxy naranja
         └─ A  www → 72.61.44.159  ☁️ Proxy naranja
                │
                ▼
         VPS Ai-Whisperers (72.61.44.159)
         ├─ Traefik (HTTPS + Let's Encrypt)
         └─ Docker Swarm → elviajero_web:3000
```

---

## 3. Plan de Conexión — Cloudflare NS Delegation

### ✅ Paso 1 — Ai-Whisperers: Zona Cloudflare creada

Zona `tiendaelviajero.com.py` agregada a Cloudflare (Free Plan).

**Nameservers asignados:**

| NS | Servidor |
|----|----------|
| NS 1 | `carlane.ns.cloudflare.com` |
| NS 2 | `matias.ns.cloudflare.com` |

### ✅ Paso 2 — Ai-Whisperers: DNS configurado en Cloudflare

| Tipo | Nombre | Valor | Proxy |
|------|--------|-------|-------|
| A | `@` | `72.61.44.159` | ☁️ Proxied |
| A | `www` | `72.61.44.159` | ☁️ Proxied |

### ⏳ Paso 3 — Cliente: Cambiar nameservers en Max Domain

El cliente debe contactar a Max Domain para cambiar los nameservers.

**Por email (responder al email de confirmación del dominio):**

> *Hola, necesito cambiar los nameservers del dominio tiendaelviajero.com.py a:*
> - *NS 1: carlane.ns.cloudflare.com*
> - *NS 2: matias.ns.cloudflare.com*
> *Gracias.*

**Por teléfono:** 021 729 4040

**Panel:** https://clientes.maxdominios.com (si aplica — solo si tienen hosting)

⚠️ **NO se necesita el código BC-373950.** Ese código es para transferir el dominio a otro registrador, no para cambiar NS.

### ⏳ Paso 4 — Esperar propagación NS (24-48h)

Verificar con: https://www.whatsmydns.net/#NS/tiendaelviajero.com.py

Cuando aparezca `carlane.ns.cloudflare.com` y `matias.ns.cloudflare.com` en todos los servidores, la propagación está completa.

### ⏳ Paso 5 — Ai-Whisperers: Actualizar Traefik

**Archivo:** `/opt/traefik/dynamic/apps.yml`
```yaml
viajero:
  rule: Host(`viajero.paragu-ai.com`) || Host(`el-viajero.paragu-ai.com`) || Host(`tiendaelviajero.com.py`) || Host(`www.tiendaelviajero.com.py`)
  service: elviajero_web:3000
  tls:
    certResolver: letsencryptresolver
```

**Archivo:** `/root/elviajero/docker-compose.yml` — labels de Traefik:
```yaml
labels:
  - "traefik.http.routers.viajero.rule=Host(`viajero.paragu-ai.com`) || Host(`el-viajero.paragu-ai.com`) || Host(`tiendaelviajero.com.py`) || Host(`www.tiendaelviajero.com.py`)"
```

### ⏳ Paso 6 — Ai-Whisperers: NEXT_PUBLIC_BASE_URL

**Archivo:** `/root/elviajero/.env`
```
NEXT_PUBLIC_BASE_URL=https://www.tiendaelviajero.com.py
```

### ⏳ Paso 7 — Ai-Whisperers: Redeploy

```bash
cd /root/elviajero
export $(grep -v '^#' .env | xargs)
npm run build
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --no-cache -t elviajero:prod .
docker stack deploy -c docker-compose.yml elviajero --with-registry-auth
```

### ⏳ Paso 8 — Verificar

```bash
curl -sI https://www.tiendaelviajero.com.py
# Debe devolver HTTP/2 200
```

---

## 4. Plan Alternativo (DNS directo en Max Domain)

Si el cliente prefiere no cambiar NS (más rápido pero menos control):

1. Cliente contacta a Max Domain (email o 021 729 4040)
2. Solicita agregar registros A:
   - `tiendaelviajero.com.py` → `72.61.44.159`
   - `www.tiendaelviajero.com.py` → `72.61.44.159`
3. Propagación: 5-30 minutos
4. Ai-Whisperers: Pasos 5-8 igual que arriba

⚠️ Desventaja: futuros cambios de DNS requieren contactar a Max Domain.

---

## 5. Infraestructura Técnica de Referencia

### Docker Swarm - Servicio
```
Servicio:  elviajero_web
Imagen:    elviajero:prod
Puerto:    3000 (interno)
Réplicas:  1
Red:       traefik_net (overlay)
```

### Repositorio
```
GitHub:    github.com/Ai-Whisperers/elviajero-comercio
Local:     /root/elviajero
Ramas:     main
```

### Supabase
```
Proyecto:  qyvokpribmbrosafntqa
Tablas:    products, categories, orders, customers, site_content
Filas:     ~597 en site_content, 12 productos activos
```

### Stack
```
Next.js 15 (App Router)
├─ /app          → 25+ páginas (home, tienda, blog, admin, checkout, auth, FAQ...)
├─ /content      → es.json, gn.json (Guaraní)
└─ Supabase      → productos, órdenes, clientes

Pagos: PagoPar + Bancard + Stripe
WhatsApp: Evolution API (notificaciones de pedidos)
```

---

## 6. Contactos

| Rol | Contacto |
|-----|----------|
| Max Domain soporte | 021 729 4040 |
| Max Domain panel | https://clientes.maxdominios.com |
| Ai-Whisperers | VPS 72.61.44.159 |
| Cloudflare dashboard | https://dash.cloudflare.com |
| Cloudflare NS 1 | `carlane.ns.cloudflare.com` |
| Cloudflare NS 2 | `matias.ns.cloudflare.com` |

---

## 7. Troubleshooting

| Problema | Causa probable | Solución |
|----------|---------------|----------|
| SERVFAIL en dig | NS no propagado aún | Esperar 24-48h, verificar en whatsmydns.net |
| NS incorrectos | Max Domain no aplicó el cambio | Reenviar email o llamar a 021 729 4040 |
| 502 Bad Gateway | Servicio Docker caído | `docker service ls \| grep viajero` |
| SSL error | Certificado no emitido aún | Verificar `NEXT_PUBLIC_BASE_URL` en .env |
| 404 en páginas | NEXT_PUBLIC_BASE_URL incorrecto | Debe ser `https://www.tiendaelviajero.com.py` |
| Productos no cargan | Supabase connection | Verificar SUPABASE_URL y SUPABASE_ANON_KEY en .env |
