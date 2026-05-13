# Reunión Cliente — 13 Mayo 2026

**Asistentes:** Omar (cliente/tío), Milagros/Mila, Kirian/Killian, Sonia, Valentina, Iván (vos)
**Formato:** Presencial, ~2 horas
**Propósito:** Demo del sitio, revisión de logo/imágenes, configuración de dominio, próxima features

---

## 1. Domain & DNS — Resuelto en la reunión

**Problema:** El cliente compró solo el dominio en MaxiDominio, sin hosting. Sin panel DNS, no se puede apuntar el dominio `tiendaelviajero.com.py` al VPS.

**Solución ejecutada:**
- Tu IA (Hermes) analizó el email de confirmación de MaxiDominio + screenshots del cliente
- Generó documento de configuración DNS completo: MaxiDominio → Cloudflare → Hostinger VPS
- El cliente respondió al email de MaxiDominio con los nameservers, CC incluido
- Ticket de soporte creado, esperando respuesta



**Arquitectura final:**
```
MaxiDominio (nameservers) → Cloudflare (DNS/proxy) → VPS Hostinger (Brasil) → Traefik → Docker Swarm → elviajero_web
```

---

## 2. Logo & Branding — Feedback y Decisiones

### Feedback del cliente
- Logos generados con Gemini/NanoBanana están **"demasiado cargados"**
- Quiere **minimalista** — "el texto nomás y el eslogan"
- **"una imagen nomás también sin texto"** pero después dijo "tiene que decir sí o sí El Viajero"
- Debe funcionar en **corte circular** (WhatsApp, redes sociales)
- Que sea **Paraguay auténtico** — no montañas con nieve yanqui, sino cerros paraguayos, árboles nativos, paisaje local
- El eslogan: "Equipamientos Aventura" (más corto que versiones anteriores)
- Mencionaron que el logo que eligieron parece "insignia de scout" pero les gustó

### Pendiente: Otra sesión de trabajo
Logo e imágenes de productos son para **otra sesión**. Los clientes tienen que proveer:
- Fotos reales de productos (o al menos autorizar stock photos)
- Fuente/material para el logo (fotos de viajes, ideas, referencias)

Nosotros procesamos todo con IA (Gemini, NanoBanana, Antigravity) en una sesión dedicada más adelante.

---

## 3. Site Changes — Solicitadas por el Cliente

### Prioridad Alta (antes del lanzamiento)

#### 3.1 WhatsApp Checkout Directo
Cada producto debe tener **AMBAS** opciones:
- **"Agregar al carrito"** — para múltiples productos
- **"Consultar por WhatsApp"** — botón directo que abre WhatsApp con el producto preseleccionado

Flujo: Producto → Consultar WhatsApp → mensaje prefabricado con producto, precio → cliente responde → cierra trato

#### 3.2 Carrito → Checkout por WhatsApp
En el carrito/compras, agregar botón **"Checkout por WhatsApp"** que envía lista completa:
- Productos, cantidades, subtotales, total
- Datos del cliente (nombre, teléfono, ciudad, RUC opcional)
- Mensaje formateado y limpio

Esto llega al WhatsApp Business del cliente. Él confirma y cierra el trato manualmente.

#### 3.3 Sistema de Pedidos en Admin
- Cuando un cliente hace checkout por WhatsApp, se crea una **orden pendiente** en el panel admin
- El cliente (Omar/Milagros) puede marcar: **Confirmado / Cancelado / Enviado / Pagado**
- Al confirmar, descuenta automáticamente del stock
- Dashboard de reportes: ventas del mes, productos más vendidos, etc.

#### 3.4 Carrusel de Kits / Promos (sección nueva)
- Sección debajo del hero, encima de "Nuevos Productos"
- **Carrusel manual** (solo avanza con clic en flechas, NO auto-rotación)
- Para mostrar: kits (Semana Santa, pesca, camping, explorador), combos, promociones
- Cada slide: imagen + nombre + precio → clic abre detalle del kit o manda a WhatsApp
- El cliente decide el contenido desde admin

### Prioridad Media

#### 3.5 Catálogo ~130 productos
- Cliente tiene productos reales y fotos
- Bulk import desde Excel/Google Sheets
- AI puede ayudar con descripciones, renombrar imágenes, etc.

#### 3.6 Logo editable desde admin
Que el logo del sitio se pueda cambiar desde el panel de admin (para cuando tengan el definitivo)

#### 3.7 Carrusel Hero editable
- Texto editable desde admin ✅ (ya funciona)
- **Imágenes editables desde admin** — poder subir/cambiar las imágenes del carrusel principal

#### 3.8 Blog con contenido real
- Reemplazar los posts actuales (hechos por IA/bullshit) con **historias reales del cliente**
- Cliente graba audio de sus viajes → vos transcribís → IA escribe post → se publica
- Cada post con mapa de ruta y productos relacionados al final

### Prioridad Baja / Post-Lanzamiento

#### 3.9 Mapas de rutas/destinos
- Mapa interactivo con spots de pesca, camping, destinos turísticos paraguayos
- Cada spot con lista de productos recomendados
- Potencial de marketing: "secret spots" para pescadores

#### 3.10 Consultoría de Viajes
- CTA "Planificá tu viaje con nosotros" → WhatsApp
- Cliente da consejos, recomienda productos, genera venta indirecta
- Posible servicio separado (cobro por consultoría)

#### 3.11 Cuentas de Usuario + Fidelidad
- Opcional, no obligatorio para comprar
- Primera compra con cuenta: 10% descr. o delivery gratis
- Puntos de fidelidad para futuras compras

#### 3.12 PagoPar / Bancard
- Botones visibles pero no funcionales hasta que cliente obtenga credenciales
- Por ahora: solo alias bancario + comprobante

---

## 4. Business Strategy — Lo que el cliente nos enseñó

El cliente (Omar) nos dio una masterclass de ventas:

### Pricing recomendado
| Tier | Producto | Precio estimado |
|------|----------|-----------------|
| Básico | Landing page / blog simple | ~500.000 Gs |
| Standard | Catálogo + WhatsApp ordering | ~2-3 millones Gs |
| Premium | E-commerce completo + IA + admin | $200-500+/mes |

### Estrategia
- **"Vos no tenés que buscar al cliente, el cliente te tiene que buscar a vos"** — publicidad pagada en redes
- **"La gente en Paraguay piensa que las páginas web son carísimas"** — mostrar precios desde
- **Oferta para estudiantes** de la Facultad de Economía: página con blog por ~150.000 Gs
- **Campaña política 2026** — concejales necesitan página web urgente
- **Vender SOLUCIONES, no páginas web** — el cliente no compra código, compra más ventas

### Target por industria (verticales)
- Gimnasios (Rocío — 3 sucursales, lideresa sola, quiere IA)
- Peluquerías, clínicas de uñas
- Restaurantes, pizzerías
- Profesionales (recetarios, dietas, videos de ejercicio)

---

## 5. Nuevos Leads / Oportunidades

| Lead | Descripción | Próximo paso |
|------|-------------|--------------|
| **Rocío (gimnasio)** | 3 sucursales, quiere vender videos de ejercicio + dietas online. Sin marido, ella sola maneja todo. Paga premium. | Kirian le muestra la plantilla de gimnasio |
| **Tía/Valentina** | Recetarios para Hotmart. Quiere automatizar escaneo → transcripción → imágenes → PDF lindo | Mostrarle Antigravity workflow |
| **Cliente anterior (Rural Estudio)** | Vendían cursos agropecuarios internacionalmente. Quieren volver con plataforma tipo Udemy. | Post-lanzamiento El Viajero |

---

## 6. AI Tools Onboarding — Lo que les mostramos

### Google Antigravity (gratis)
- IA en su computadora que entiende todos sus archivos
- Puede procesar Excel, imágenes, PDFs
- Transcribe audios, renombra archivos, genera descripciones

### Cursor
- Similar a Antigravity pero más potente
- Entiende el código del proyecto completo

### Gemini + NanoBanana
- Ya los usan para generar imágenes de productos
- Cliente entiende que "la imagen tiene que hablar por sí sola"

### Tu agente Hermes (deep tech)
- Corre en VPS en Brasil (Hostinger)
- Modelo DeepSeek, conectado a WhatsApp, admin panel, y base de datos
- Puede hacer cambios en el sitio por mensaje de WhatsApp
- Cliente alucinó cuando viste que responde llamadas con IA

---

## 7. Work Items — Priorizados

### 🔥 Hacer ahora (previo a que responda MaxiDominio)

1. **Fix admin panel** — "un fla roto" después de cambios de la mañana. Price editing demo funcionó, algo se rompió.
2. **WhatsApp direct button** — "Consultar por WhatsApp" en cada producto
3. **Checkout WhatsApp** — mensaje prefabricado con detalle de orden
4. **Cambiar placeholder WhatsApp number** — al número real del cliente (cuando lo tenga)
5. **Kits carrusel** — nueva sección manual-advance debajo del hero

### 📋 Cuando responda MaxiDominio
6. Verificar que `tiendaelviajero.com.py` apunta correctamente
7. SSL cert via Cloudflare


### 📝 Esta semana
9. Registrar la marca (preparar documento con especificaciones)
10. Logo + imágenes → sesión separada cuando cliente provea material
11. Grabar audios de viajes → transcribir → blog posts
12. Configurar WhatsApp Business número real

### 💡 Nuevas oportunidades
13. Contactar a Rocío (gimnasio) con template
14. Configurar Antigravity para Valentina (recetarios)
15. Preparar plan de precios y publicidad para redes

---

## 8. Arquitectura Técnica (Compartida con el Cliente)

```
[MaxiDominio] → nameservers → [Cloudflare] → proxy → [Hostinger VPS - Brasil]
                                                                  |
                                                             [Traefik]
                                                                  |
                                                    [Docker Swarm - 2 réplicas]
                                                                  |
                                                    [Next.js + Supabase + Tailwind]
                                                                  |
                                                    [Hermes IA Agent - DeepSeek]
                                                             WhatsApp / Admin
```

- VPS en Brasil para latencia óptima en Sudamérica
- Cloudflare para SSL, caching, DDoS protection
- Traefik para reverse proxy + auto SSL
- Docker Swarm para alta disponibilidad (2 réplicas)
- Supabase para auth + base de datos + RLS
- Hermes (DeepSeek) como cerebro IA integrado

---
