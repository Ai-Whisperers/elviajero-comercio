# Visual assets inventory & image-generation prompts — El Viajero

**Purpose:** Inventory where images appear, **prioritize production**, and ship **production-grade prompts** (structured + copy-paste) for AI or agency workflows.

**Brand (canonical UI):** Forest green `#1B5E20`, accent `#E65100`, secondary `#37474F`, `#FAFAFA` / white. **Inter** in UI — images stay **text-free**. Voice: practical, adventurous, Paraguayan retail context.

---

## Prioritized production roadmap

Do work in this order. **SKU truth beats AI gloss** everywhere the customer decides to buy.

| Tier | Priority | What | Why | Primary method |
|------|----------|------|-----|----------------|
| **P0** | Do first | **Real product photography** (every live SKU angles + packshot-safe) | Conversion, trust, fewer returns | Camera or supplier-licensed shots — **not** generative substitutes for branded gear |
| **P0** | Do first | **Home hero carousel** (3 strong stills minimum) | First impression + overlay text | Lifestyle AI **or** licensed stock **or** commissioned shoot |
| **P1** | Next | **`/productos` category heroes** (7× 16∶9) | Weakest page today (letter-only cards) | AI or shoot — high leverage |
| **P1** | Next | **`/promociones` cards** (3×) aligned to real bundles | CTR to WhatsApp / checkout | AI composite of **generic** gear or photo flat-lay |
| **P2** | Then | **Blog category + post heroes** (4 + 6) | SEO/social/share consistency | AI or owned — replace Unsplash dependence |
| **P2** | Then | **`/tienda` optional hero banner** | Brand depth above fold | Same style token as carousel |
| **P3** | When ready | OG refresh, **checkout/auth side panel**, exit-intent illustration | Conversion micro-lifts | AI within brand shell |
| **P4** | Do not defer ethics | **`/nosotros` portrait** | Trust | **Real photo of owner** — **skip AI face** |

**Defer / exclude from AI:** Payment network marks (official assets only), Maps, **`manifest` icons** (export PNG from vector logo in Figma/Inkscape — more reliable than raster gen).

---

## Consistency anchor (paste once per session)

Reuse this block so batches match across days and models:

```
STYLE_ANCHOR: ElViajero_PY_v1 — premium outdoor retail, Paraguay-adjacent, warm natural light, documentary realism bias, shallow depth of field, unbranded generic equipment only, forest green dominant cast in shadows with controlled orange only in sunsets or accents, subjects sharp, skies clean enough for headline overlay zone (upper third or left third breathing room). No typography in frame. Full-frame DSLR look, ~35mm lens for heroes, ~85mm macro feel for hero products.

PALETTE_BIND: shadows lean #1B2E22 / midtones natural skin + foliage / highlights warm not neon / occasional #E65100 rim only.

CAMERA_BIAS: ƒ2.8–ƒ5.6 portraits and lifestyle, ƒ8–ƒ11 product table, ISO low, tripod-stable product shots, zero motion blur unless water intent.
```

---

## 1. How the site consumes images today

| Source | Where used |
|--------|------------|
| `public/images/**/*.svg` | Logo, favicon, OG, hero fallbacks, category motifs, flat product illustrations |
| `content/es.json` | Hero carousel, promos, blog — many **remote Unsplash URLs** |
| Maps iframe | `/` locator — embed, not generated |
| Inline SVG | Payment marks on home footer |

**Gap:** `manifest.json` → `icon-192.png`, `icon-512.png` **missing from repo** — export from SVG.

---

## 2. Page surfaces → visuals (quick reference)

| Route | Highest-impact visuals | Prompt pack |
|-------|------------------------|-------------|
| **`/`** | Hero carousel, product rails thumbs | **P0** carousel A′; **SKU** photos not E′ if avoidable |
| **`/tienda`** | SKU grid, category header wash | B′ optional background refresh; SKU real |
| **`/producto/[slug]`** | Gallery 3–5 angles | **Photos** — AI only generic placeholder |
| **`/productos`** | 7 category hero cards | **B′** (was weakest page) |
| **`/categoria/*`** | Matches tienda + SVG wash | B′ or keep SVG + photo grid |
| **`/comparar`** | Thumbs | SKU |
| **`/promociones`** | 3 card heroes | **D′** |
| **`/blog`**, **`/blog/...`** | Category + post covers | **C′** |
| **`/nosotros`** | Owner portrait | **Camera** — not generative |
| **`/contacto`** | Optional storefront | Commission / phone |
| Checkout / auth | Side panel lifestyle | P3 single shared asset from A′ tone |
| **PWA `manifest`** | `icon-192.png`, `icon-512.png` | **PNG export** from logo (not AI) |

---

## 3. Local asset reference (`public/images`)

Unchanged tree: brand SVGs; `categories/*.svg`; **30 named** `/images/productos/*.svg` — use as SKU naming checklist alongside admin.

---

## 4. Export specs

| Asset | Size | Aspect | Role |
|-------|------|--------|------|
| Home carousel | 1920×1080 min | 16∶9 | Keep subject out of extreme edges (crop-safe) |
| Category / blog / promo card | 1600×900 or 1200×675 | 16∶9 | One clear focal cluster |
| OG | 1200×630 | 1.91∶1 | Clear center safe for crop |
| SKU (e-commerce) | 2048 square or 1700×2100 | 1∶1 or 4∶5 | #F5F5F7 sweep, seamless |
| PWA | 192, 512 | 1∶1 | **Vector export**, not AI |

Format: WebP preferred + JPEG fallback for photos; PNG where alpha.

---

## 5. Ethics (non-negotiable)

1. **Branded SKU** → real photo or rights-cleared supplier art. Never AI-hallucinate a fake Coleman/Shimano/Stanley facsimile for PDP.
2. **Owner likeness** → camera only.
3. **Lifestyle AI** → generic tents/rods/tools only; anonymized people; **no counterfeit boxes**.
4. **Places** → do not falsely label UNESCO or named reserves unless accurate.

---

## 6. Master prompt — global (system / prefix)

Paste **before** any pack-specific line:

```
GLOBAL_BRIEF — Client: fictional outdoor retailer “El Viajero” Paraguay archetype — mid-market sincere shop (not elite fashion, not paramilitary tactical brand).

RENDER: ultra photorealistic commercial photography, editorial outdoor retail, cinematic natural color grade, restrained contrast, invisible noise.

FORBIDDEN_IN_FRAME: any words, logos, watermark, QR, currency, readable UI, recognizable third-party trademarks, mutated limbs, duplicated fishing rods, tents with physics-defying poles, CGI plastic sheen.

OUTPUT: crisp full resolution sRGB JPG description target (export WebP downstream). No borders.
NEGATIVE_SEMANTICS: blurry, jpeg-artifacts, oversharpen halo, teal-orange zombie grade, vignette overdose, cluttered foreground scrap, bikini-only beach glam unrelated to fishing, snakes macro, hunters with firearms, dystopian skies, fisheye city, collage, sticker aesthetic, miniature toy look.
```

---

## 7. Improved pack prompts — P0 carousel (Pack A′)

**Count:** Minimum **3**, ideal **5** — **1920×1080**, 16∶9.

For each shot, use structure:
**SHOT_ID | SUBJECT | ENVIRONMENT | LIGHT | CAMERA | COMPOSITION_OVERRIDE**

### A1 — Río familia / camping

```
PACK_A1_FAMILY_RIVER • SUBJECT mid-distance two adults plus one tween pitching muted olive dome tent beside calm riparian sand • ENVIRONMENT braided river, lapacho-class trees blurred background, Paraguay-ish subtropical read without signage • LIGHT late afternoon directional sun 5800K softened by thin haze, warm bounce from sand • CAMERA full-frame DSLR 35mm equivalent ƒ4 subject group sharp background gentle bokeh • COMPOSITION foreground negative space UR third for eventual Spanish headline, tent incomplete “in progress storytelling” friction authentic • STYLE_ANCHOR + GLOBAL_BRIEF
```

One-line alt (Midjourney/compact):

```
Photoreal editorial: family pitching unbranded green dome tent riverbank Paraguay subtropical golden hour,sand foreground clear for text overlay 35mm f4 DSLR natural color --ar 16:9
```

### A2 — Pesca esperanzada

```
PACK_A2_FISH_BANK • SINGLE adult fisher hip-deep NOT sexualized stance optional wading cropped mid-thigh calm tea-colored water • GRAPHIC rod arc mid cast soft splash • LIGHT sunrise low mist 15 min post dawn • CAMERA 85mm equivalent ƒ2.8 isolate subject from reeds • MOOD anticipation concentrate • STYLE_ANCHOR + GLOBAL_BRIEF
```

One-line alt:

```
Documentary fisherman casting at misty inland river sunrise,unbranded tackle, hopeful calm, telephoto isolation 85mm f2.8 --ar 16:9
```

### A3 — Ruta + carga útil auto

```
PACK_A3_TRUCK_ROUTE • PROFILE white/gray nondescript pickup cab cropped no emblem legible dusty red-earth route vanishing horizon • ROOF BOX soft bags drybag orange accent piece only roof rack silhouette • DRIVER anonymous • LIGHT high sun dust motes backlight controlled flare • CAMERA 70mm roadside tracking still frame ƒ8 • STYLE_ANCHOR + GLOBAL_BRIEF
```

### A4 — Interior tienda cercana (warm local)

```
PACK_A4_SHOP_ROW • MEDIUM aisle shallow dof stacked shelves coolers headlamps carabiners blurred price tags illegible blobs only • SINGLE warm pendant practical store light 4200K + window fill • CAMERA 35mm ƒ2.8 handheld micro-tilt humane • MOOD approachable hardware not supermarket fluorescent • STYLE_ANCHOR + GLOBAL_BRIEF
```

### A5 — Epic trail wide

```
PACK_A5_LAND_WIDE • Tiny hiker crest ridgeline red lateritic soil corridor dry forest mosaic NO landmark signage • CLOUDS sculpted but natural • GOLDEN side light long shadows • CAMERA 24mm ƒ11 landscape tripod • SCALE awe human 5% frame height LR third • STYLE_ANCHOR + GLOBAL_BRIEF
```

**QA before accept:** Faces plausible? Tent geometry sound? Horizon level? Enough clean sky/third for UI overlay? Downscale preview to ~960 px wide — focal subject still obvious?

---

## 8. Pack B′ — Category heroes (P1) — `/productos`

**Seven files** — target **1600×900**, 16∶9, **consistent left-weighted vignette toward #1B5E20 transparency** subtle (designer overlay optional).

| ID | Filename hint | Prompt kernel |
|----|----------------|---------------|
| B1 camping | `categoria-camping.webp` | Morning fog low carpa silhouette + LED lantern point bokeh amber not neon + dew grass macro hint |
| B2 pesca | `categoria-pesca.webp` | Rod diagonal frame split water surface tension ring + submerged lure sparkle abstract |
| B3 playa | `categoria-playa-pesca.webp` | Low angle beach muted chair mesh cooler closed hat hanging no liquor + soft polarizer sky |
| B4 accesorios | `categoria-accesorios.webp` | Expedition flat lay machete sheath closed compass binocular lens cap monochrome earth + single orange cord accent |
| B5 autos | `categoria-automoviles.webp` | Cabin interior anonymity steering wheel blurred brand mount suction cup puck generic DVR shape black lump no screen UI |
| B6 motos | `categoria-motos.webp` | Matte helmet gloves crossed seat leather scuff honest urban wall texture golden hour |
| B7 campo | `categoria-campo.webp` | Galvanized trough edge rust honest hand shovel wooden handle vertical soil furrow morning side light |

Each full prompt = `GLOBAL_BRIEF + STYLE_ANCHOR + Bx kernel + NEGATIVE_PACK (§12)`.

---

## 9. Pack D′ — Promotions (P1)

**1600×900**, story-selling **clear single offer cluster**.

**D1 Kit camping:** “Three-object rule” — **one tent + two rolled mummy bags + one pad** on weathered wood deck outdoor table, orange micro ribbon loop **not** gift-wrapped candy aesthetic, sun cross-light.

**D2 Combo pesca:** Rod case **open** showing foam slots, small tackle box ajar generic lures grid, **odd number** of lures (3 or 5) prevents symmetry uncanny.

**D3 Envío gratis:** Craft kraft box closed paper tape, **stylized map graphic faded into table surface** (no MercadoLibre colors), small generic GPS pin wood stamp — **no carrier logos**.

---

## 10. Pack C′ — Blog (P2)

**Categories (4) + posts (6)** — **1600×900**. Tone: **slightly imperfect** real — micro dust on tent floor, slight asymmetry, **not** catalogue sterile.

**C-cat-1 Camping:** Wide shot half-pitched dome guy lines tension real mistake leaf stuck seam OK.

**C-cat-2 Pesca:** Over-shoulder lure tie macro hands adult.

**C-cat-3 Aventura:** Red-earth trail cyclist silhouette far — faceless helmet.

**C-cat-4 Mantenimiento:** Workbench tent zipper coil silicone tube soft window north light workshop.

Post heroes map 1∶1 slugs already in repo intent:

| Slug idea | Mood prompt add |
|-----------|----------------|
| guia-elegir-carpa | Comparative **two tents** silhouettes far background selective focus shopper hands touching fabric weave macro |
| mejores-lugares-pesca-paraguay | Map-like abstract river network bokeh aerial **generic** NOT labeled |
| checklist-camping | Flat lay obsessive grid check vibe muted earth |
| elegir-cana-pesca | exploded line fishing rod ferrules floating NOT diagram text |
| mantenimiento-equipo-camping | sponge tub tent fly draped airing porch |
| destinos-aventura-paraguay | waterfall wide long exposure silky water **anonymous** gorge |

---

## 11. Pack E′ — Catalog fallback studio (only if SKU photo missing)

Square **2048**, seamless **#F5F7F8** radial gradient faint, thin contact shadow ellipse.

**Lighting recipe (repeat verbatim):**

```
WHITE_CYCLORAMA_FALLBACK_LIGHT: overhead large octabox + twin front 45deg strip boxes low power fill ratio 3:1, polarized sheen kill on glossy black plastics, tethered tether color checker ignored but neutral gray ball hint optional remove in post description only
```

Shoot **single hero object dead center**, **minimal props** unless listed. Batch in groups → faster QC:

**E-batch-1 Shelter-sleep-chair-light:** tent packed & pitched variant **choose one per SKU name**, sleeping bag sausage, chair mesh, flashlight cylinder.

**E-batch-2 Water-fish:** telescopic rod coiled, life vest frontal, lure tray closed, landing net ellipse.

**E-batch-3 Vehicle-moto:** dashcam puck, inflator hoses coiled donut, straps rolled, extinguisher upright label area blank rubbed.

**E-batch-4 Campo:** bebedero galvanized curve, comedero partitioned, hoe head + ash handle diagonal.

Reject if: symmetrical duplicate props, hovering objects, unreadable-but-tries-to-be text on fabric.

---

## 12. Pack F′ — Brand shell (designer-assisted)

OG **1200×630:** abstract **trail curve** forming gentle **V** suggesting path + horizon band — **dense forest silhouette lower third**, **bright sky upper third headline safe** — **no words**.

Icons: **prefer vector redraw** — if AI auxiliary texture only embed inside designer file.

---

## 13. Negative prompt pack (append always)

Group for models that accept long negatives:

```
ANATOMY_FAIL: bad hands extra fingers fused fingers broken wrists cross-eye low-res faces teeth horror

GEAR_PHYSICS: melting tent pvc impossible hub floating guy lines spaghetti rods duplicate reels

COMMERCIAL_IP: nike swoosh adidas trefoil shimano wording coleman apex logo dewalt yellow trade dress luxury watch faces iphone apple logo recognizable dashboard infotainment skin

RENDER_ARTIFACTS: watermark bold signature AI telltale pastel noise soup six fingers on fish

CONTENT_AVOID: military assault rifle combat ops snake macro center venom carnival gore drunken party text overlay license plates readable document ID card

VEHICLE_TRUTH: emblem legible grille trademark headlight iconic shape duplicate Audi rings BMW kidney
NEGATIVE_SEMANTICS: (retain GLOBAL conciseness duplication OK)
```

---

## 14. Model-specific micro-syntax (optional)

| Tool | Hint |
|------|------|
| **Midjourney v6** | End: `--ar 16:9 --style raw --stylize 120`; product `--ar 1:1` |
| **Flux / SDXL** | Use `STYLE_ANCHOR` as LoRA-trigger phrase opener; CFG medium-high; hires fix OFF if plastic |
| **DALL·E 3** | Split: first message GLOBAL+SHOT, revision pass “reduce saturation 10%, widen negative space upper third” |
| **Imagen / Firefly** | Enable “commercial safe” prompts; forbid celebrity |

---

## 15. Acceptance checklist (5 seconds)

1. Exposure: highlights not blown tent fabric detail holds
2. **Overlay zone** still empty if hero
3. **Zero readable IP**
4. Hands / poles / stitching passes zoom 100%
5. Downscale thumbnail 256 wide — silhouette still communicates category

---

## 16. Implementation checklist (repo)

1. Publish marketing WebP → `public/images/marketing/` (or CDN) + update **`content/es.json`** `home.heroCarousel`, `promociones`, blog images
2. Wire **`/productos`** cards to new heroes (needs small code + JSON convention if absent)
3. Export **PNG** icons for manifest from logo
4. **Supabase** product `image_url` → real SKU priority path

---

*Document versioning: prioritized prompt refresh — aligns packs to conversion impact.*
