# Guía: Conexión del Dominio del Cliente — El Viajero

**Cliente:** El Viajero (camping/pesca)
**Dominio comprado:** www.tiendaelviajero.com.py
**Registrador actual:** Max Domain
**AuthCode (EPP):** BC-373950
**Nuestro registrador destino:** Cloudflare

---

## Opción A — Fix Temporal (DNS directo, recomendado para hoy)

El sitio funciona en minutos sin transferir el dominio. Después hacemos la transferencia con calma.

### Lo que debe hacer el cliente en Max Domain:

1. **Entrar al panel** de Max Domain (donde compró el dominio)
2. **Ir a DNS / Zona DNS**
3. **Agregar estos registros:**

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | @ | 72.61.44.159 |
| A | www | 72.61.44.159 |

4. **Guardar.** Los cambios tardan de 5 minutos a 24h en propagarse.

### Lo que hago yo (Erebus) después:

1. Actualizo Traefik para aceptar `tiendaelviajero.com.py`
2. Actualizo el .env con `NEXT_PUBLIC_BASE_URL`
3. Re-deployeo el stack
4. Verifico SSL automático (Let's Encrypt)
5. Te aviso cuando el sitio responda

---

## Opción B — Transferencia a Cloudflare (definitiva, 5-7 días)

Todo centralizado con el resto de nuestros dominios. Después podemos editar DNS, deployar, etc. fácil.

### Lo que debe hacer el cliente en Max Domain:

1. **Desbloquear el dominio para transferencia**
   - Ir al panel de Max Domain
   - Buscar "Transfer Lock" o "Registrar Lock" → desactivar
   - Si hay que pedir por soporte, pedir que desbloqueen

2. **Verificar datos de contacto WHOIS**
   - El email del titular debe ser correcto
   - Cloudflare va a mandar un link de confirmación a ese email

3. **Confirmar que el AuthCode está activo**
   - El código `BC-373950` vence a los 10 días si no se usa
   - Si vence, pedir uno nuevo en Max Domain

4. **Estar atento al email**
   - Cloudflare manda un mail con link para autorizar la transferencia
   - Hay que hacer clic dentro de 5 días o se cancela

### Lo que hago yo (Erebus):

1. Inicio la transferencia entrante en Cloudflare usando el AuthCode
2. Cloudflare renueva el dominio por 1 año (~$8-10, se cobra automático)
3. En 5-7 días el dominio aparece en el panel de Cloudflare
4. Configuro los DNS automáticamente
5. Conecto con Traefik + deploy del sitio
6. Te confirmo cuando está todo andando

**Después de la transferencia**, podemos editar DNS, deployar updates, todo desde nuestro panel sin depender del cliente.

---

## Checklist para mandar al cliente (copiar y pegar)

```
🌟 Hola! Recibí el código de autorización (BC-373950).

Para que el sitio www.tiendaelviajero.com.py funcione lo antes posible, necesito que hagas esto en Max Domain:

1. Entrá a tu panel de Max Domain
2. Andá a Zona DNS
3. Agregá estos 2 registros A:
   - @ → 72.61.44.159
   - www → 72.61.44.159
4. Guardá los cambios

Eso es todo de tu parte por ahora! Cuando esté listo te aviso y ves el sitio andando en tu dominio.

Después coordinamos para transferir el dominio a nuestro manejo y no depender más de Max Domain.

Cualquier duda avisame 👍
```

---

## Notas técnicas (para nosotros)

### Archivos a modificar cuando esté el dominio activo:

**1. docker-compose.yml** — línea 32, agregar el nuevo dominio:
```
traefik.http.routers.viajero.rule=Host(`viajero.paragu-ai.com`) || Host(`el-viajero.paragu-ai.com`) || Host(`www.tiendaelviajero.com.py`) || Host(`tiendaelviajero.com.py`)
```

**2. .env** — agregar o actualizar:
```
NEXT_PUBLIC_BASE_URL=https://www.tiendaelviajero.com.py
```

### Deploy:
```bash
cd /root/elviajero
npm run build
docker build -t elviajero:prod .
docker stack deploy -c docker-compose.yml elviajero --with-registry-auth
```

### Verificación:
- `curl -I https://www.tiendaelviajero.com.py` → debería dar 200
- SSL se genera solo con Let's Encrypt (Traefik)
