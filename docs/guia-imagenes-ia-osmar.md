# Guía de Imágenes de Productos con IA — Tienda El Viajero

## Para: Osmar
## Tienda: tiendaelviajero.com.py

---

## 1. RESUMEN RÁPIDO

Vas a usar una herramienta de IA (ChatGPT, Ideogram, Midjourney, etc.) para generar fotos
profesionales de cada producto. Copias el prompt base, le agregás el nombre del producto,
pegás en la IA, descargás la imagen, y la subís al admin de la tienda.

**Tiempo por producto:** 2-3 minutos.
**Costo:** Gratis con ChatGPT Plus, Ideogram, o Bing Image Creator.

---

## 2. FORMATO QUE NECESITA LA TIENDA

La tienda muestra imágenes de productos en dos lugares:

| Lugar         | Tamaño ideal | Fondo           |
|---------------|-------------|-----------------|
| Grilla tienda | 800 x 600   | Blanco puro     |
| Página detalle| 800 x 800   | Blanco puro     |

**Regla de oro:** Generá siempre de **800x800 (cuadrado)**. El sistema de la tienda
lo adapta automáticamente para ambos lugares.

El fondo tiene que ser **blanco** (verde menta muy suave). Este es el color EXACTO que la 
tienda usa detrás de las imágenes de producto. Si usás blanco puro (#FFFFFF), la imagen se 
ve como un rectángulo blanco pegado sobre un fondo verde claro — se nota el borde. Con 
blanco la imagen se funde perfectamente con el fondo de la tienda y queda profesional.

No fondo de camping, no paisaje, no río, no montaña. Solo color BLANCO PURO. 
El producto tiene que verse limpio y profesional, estilo foto de catálogo.

---

## 3. EL PROMPT BASE

Copiá esto textual y solo cambiá lo que está entre llaves `{ }`:

```
Professional e-commerce product photo on a pure white background color
(very light mint green). {DESCRIPCION BREVE DEL PRODUCTO}, centered in frame,
well-lit with soft studio lighting from the upper left, subtle drop shadow
underneath. No hands, no people, no props, no text overlays, no watermarks.
The product fills 80-85% of the frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

### ¿Qué reemplazar?

Reemplazá `{DESCRIPCION BREVE DEL PRODUCTO}` con una descripción corta del producto
en inglés. Sí, en inglés — las herramientas de IA generan mejores resultados con prompts
en inglés.

---

## 4. EJEMPLOS PRÁCTICOS POR CATEGORÍA

### CATEGORÍA: CAMPING

**Productos típicos:** carpas, bolsas de dormir, mochilas, sillas plegables, linternas,
hornallas portátiles, coolers.

**Prompt base para Camping:**
```
Professional e-commerce product photo on a pure white background.
{PRODUCTO}, centered in frame, well-lit with soft studio lighting
from the upper left, subtle drop shadow underneath. No hands, no people,
no props, no text overlays. The product fills 80-85% of the frame.
Rugged outdoor adventure aesthetic, earthy green tones.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Carpa Coleman 4 personas:**
```
Professional e-commerce product photo on a pure white background.
Green 4-person dome camping tent fully pitched, centered in frame,
well-lit with soft studio lighting from the upper left, subtle drop
shadow underneath. No hands, no people, no campsite, no props.
The tent fills 80% of the frame. Rugged outdoor adventure aesthetic.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Bolsa de dormir:**
```
Professional e-commerce product photo on a pure white background.
Rolled green sleeping bag with compression straps, standing upright
and slightly angled, centered in frame, well-lit with soft studio
lighting, subtle drop shadow underneath. No hands, no people, no
props. Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Cooler:**
```
Professional e-commerce product photo on a pure white background.
Blue and white 50-quart insulated cooler box, slightly angled to show
top lid, centered in frame, well-lit with soft studio lighting,
subtle drop shadow underneath. No hands, no people, no drinks, no
props. Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

---

### CATEGORÍA: PESCA

**Productos típicos:** reels, cañas, señuelos, líneas, cajas de pesca, redes, chalecos.

**Prompt base para Pesca:**
```
Professional e-commerce product photo on a pure white background.
{PRODUCTO}, centered in frame, well-lit with soft studio lighting
from the upper left, subtle drop shadow underneath. No hands, no people,
no props, no text overlays. The product fills 80-85% of the frame.
Freshwater fishing aesthetic, silver and blue tones.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Reel Shimano:**
```
Professional e-commerce product photo on a pure white background.
Silver and black spinning fishing reel model Shimano FX 4000,
showing the spool and handle, centered in frame, well-lit with soft
studio lighting, subtle drop shadow underneath. No hands, no rod,
no water, no fish. Product fills 85% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Señuelo:**
```
Professional e-commerce product photo on a pure white background.
Colorful crankbait fishing lure with treble hooks, floating slightly
above surface with shadow below, centered in frame, well-lit with
soft studio lighting. No hands, no water, no fish.
Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Caña de pesca:**
```
Professional e-commerce product photo on a pure white background.
Two-piece telescopic fishing rod, fully extended horizontally,
dark graphite with cork handle, centered in frame, well-lit with
soft studio lighting, subtle drop shadow underneath. No hands,
no reel, no water. Product fills 75% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

---

### CATEGORÍA: ACCESORIOS PERSONALES

**Productos típicos:** navajas, botellas térmicas, gorras, lentes de sol, repelentes,
mochilas pequeñas, riñoneras.

**Prompt base para Accesorios Personales:**
```
Professional e-commerce product photo on a pure white background.
{PRODUCTO}, centered in frame, well-lit with soft studio lighting
from the upper left, subtle drop shadow underneath. No hands, no people,
no props, no text overlays. The product fills 80-85% of the frame.
Compact, functional, durable personal accessory.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Botella térmica:**
```
Professional e-commerce product photo on a pure white background.
Matte black stainless steel insulated water bottle 750ml, standing
upright with cap on, centered in frame, well-lit with soft studio
lighting, subtle drop shadow underneath. No hands, no people, no
props. Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Navaja multiusos:**
```
Professional e-commerce product photo on a pure white background.
Red Victorinox-style multi-tool pocket knife, partially open showing
3-4 tools, centered in frame, well-lit with soft studio lighting,
subtle drop shadow underneath. No hands, no people, no props.
Product fills 85% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

---

### CATEGORÍA: ELECTRÓNICA

**Productos típicos:** GPS, radios, linternas recargables, cargadores solares,
baterías portátiles, faros LED.

**Prompt base para Electrónica:**
```
Professional e-commerce product photo on a pure white background.
{PRODUCTO}, centered in frame, well-lit with soft studio lighting
from the upper left, subtle drop shadow underneath. No hands, no people,
no props, no text overlays. The product fills 80-85% of the frame.
Tech-forward with rugged outdoor durability. Subtle LED glow if
applicable.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Faro LED:**
```
Professional e-commerce product photo on a pure white background.
Black LED headlamp for outdoor use, front-facing view showing the
light panel and elastic strap, centered in frame, well-lit with soft
studio lighting, subtle drop shadow underneath. Faint warm glow
from the LED. No hands, no people, no props.
Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Cargador solar:**
```
Professional e-commerce product photo on a pure white background.
Foldable solar panel charger, unfolded showing all panels with USB
port visible, centered in frame, well-lit with soft studio lighting,
subtle drop shadow underneath. No hands, no phone, no people.
Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

---

### CATEGORÍA: ACCESORIOS PARA VEHÍCULOS

**Productos típicos:** portaequipajes, sujetadores, fundas, herramientas, compresores,
cables de arranque, ganchos de remolque.

**Prompt base para Vehículos:**
```
Professional e-commerce product photo on a pure white background.
{PRODUCTO}, centered in frame, well-lit with soft studio lighting
from the upper left, subtle drop shadow underneath. No hands, no people,
no props, no text overlays. The product fills 80-85% of the frame.
Industrial, sturdy, automotive gear. Darker shadows for metallic parts.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Compresor portátil:**
```
Professional e-commerce product photo on a pure white background.
Portable 12V tire inflator compressor with digital display and air
hose, centered in frame, well-lit with soft studio lighting, subtle
drop shadow underneath. No hands, no car, no people, no props.
Product fills 80% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

**Ejemplo — Portaequipajes:**
```
Professional e-commerce product photo on a pure white background.
Silver roof rack cross bars for SUV, shown from 3/4 angle above,
centered in frame, well-lit with soft studio lighting, subtle drop
shadow underneath. No car, no hands, no people, no props.
Product fills 75% of frame.
Clean, modern, premium outdoor retail style.
800x800 pixels, square format, JPEG with pure white background.
```

---

## 5. PASO A PASO — CÓMO GENERAR Y SUBIR CADA IMAGEN

### Paso 1: Prepará la lista de productos
Abrí el admin: https://tiendaelviajero.com.py/admin/productos
Anotá los productos que NO tienen imagen (aparecen con fondo gris y un ícono).

### Paso 2: Elegí tu herramienta de IA
Cualquiera de estas funciona:
- **ChatGPT** (chatgpt.com) — con cuenta Plus, generás imágenes con DALL-E
- **Ideogram** (ideogram.ai) — gratis, excelente para texto y productos
- **Bing Image Creator** (bing.com/create) — gratis con cuenta Microsoft
- **Midjourney** (midjourney.com) — pago, mejor calidad pero más complejo

### Paso 3: Generá la imagen
1. Copiá el prompt de la categoría correspondiente
2. Reemplazá `{PRODUCTO}` con el nombre del producto (en inglés, describiendo cómo se ve)
3. Pegá en la herramienta de IA
4. Generá la imagen
5. Si no te gusta, ajustá la descripción y volvé a generar
6. Descargá la mejor versión

### Paso 4: Subí la imagen a la tienda
1. Abrí https://tiendaelviajero.com.py/admin/productos
2. Buscá el producto en la lista
3. Clickeá el botón de editar (ícono de lápiz)
4. En el campo de imagen, subí el archivo que descargaste
5. Asegurate de que "Auto-optimizar a WebP" esté activado (viene activado por defecto)
6. Guardá los cambios

El sistema automáticamente convierte la imagen a WebP (formato optimizado para web)
y la guarda en el servidor. No necesitas hacer nada más.

---

## 6. CONSEJOS IMPORTANTES

### SIEMPRE:
- Fondo BLANCO PURO (verde menta claro) — sin excepciones
- Producto centrado, llenando 80% del frame
- Buena iluminación — la IA lo hace automático con el prompt
- Sin texto, sin logos de agua, sin marcas visibles

### NUNCA:
- No pongas personas sosteniendo el producto
- No pongas fondo de camping, pesca, naturaleza — solo blanco
- No pongas texto sobre la imagen (precio, nombre, "oferta")
- No uses fotos de internet de otros sitios (derechos de autor)
- No generes imágenes con marcas visibles (Nike, Coleman, etc.) a menos que
  sea un producto real de esa marca

### SI EL PRODUCTO TIENE MARCA:
Si el producto es de una marca conocida (Coleman, Shimano, Garmin, etc.), usá
el nombre de la marca en la descripción para que la IA genere algo parecido.
Pero no esperes que la IA replique el logo exacto — está bien así, la idea
es que el cliente vea una representación profesional del tipo de producto.

### SI LA IA GENERA ALGO RARO:
- Demasiado oscuro → agregá "bright, well-lit" al prompt
- Fondo no blanco → agregá "on pure white background" al inicio
- Producto muy chico → agregá "product fills 90% of frame"
- No parece real → cambiá "professional e-commerce product photo" por
  "professional studio photograph of"
- Tiene texto extraño → agregá "no text, no letters, no words, no watermark"

---

## 7. CHECKLIST RÁPIDO

Para cada producto:
- [ ] Elegí la categoría correcta
- [ ] Copié el prompt base de esa categoría
- [ ] Reemplacé {PRODUCTO} con descripción corta en inglés
- [ ] Generé la imagen en la herramienta de IA
- [ ] Verifiqué: fondo blanco sólido, sin texto, producto centrado
- [ ] Descargué la imagen
- [ ] Subí al admin del producto
- [ ] Verifiqué que "Auto-optimizar a WebP" esté activado
- [ ] Guardé cambios
- [ ] Verifiqué en la tienda online que se ve bien

---

## 8. COLORES DE LA MARCA (para referencia)

Si la IA te pregunta por colores o querés ajustar algo:

| Uso         | Color               | Código   |
|-------------|---------------------|----------|
| Principal   | Verde selva         | #1B5E20  |
| Acento      | Naranja             | #E65100  |
| Camping     | Verde oscuro        | #065f46  |
| Pesca       | Azul oscuro         | #1e40af  |
| Accesorios  | Marrón              | #7c2d12  |
| Electrónica | Púrpura             | #4c1d95  |
| Vehículos   | Gris oscuro         | #1f2937  |

---

Documento preparado por Ai-Whisperers para Tienda El Viajero.
Actualizado: Mayo 2026
