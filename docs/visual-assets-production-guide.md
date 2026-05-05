# El Viajero — Complete Visual Assets Production Guide

## Purpose
This document lists every image we should generate to complete the site visually. The client uses placeholder images until they provide real photos. Each entry includes exact path, usage location, dimensions, and a detailed AI image generation prompt.

---

## GROUP 1: PRODUCT IMAGES (25 items)

**Status: ✅ ALL DONE** — `public/images/marketing/products/*.png` (34 product images already generated and wired)

---

## GROUP 2: HERO / MARKETING LANDSCAPES (10 items)

**Status: ✅ ALL DONE** — 5 hero carousel slides, tienda-hero-bg, contact-hero-storefront, exit-intent-promo, 3 promo images, 7 category cards, 2 blog cats, 6 blog posts

---

## GROUP 3: CATEGORY HERO BACKGROUNDS (6 items)

**Status: NEEDED** — These replace emoji on category pages (`app/categoria/*/page.tsx`)

Each image goes behind the hero section heading. The category page currently shows emoji text instead of a rich visual.

### 3.1 — Camping Hero
- **Path:** `public/images/marketing/hero-camping.png`
- **Size:** 1920x600
- **Usage:** `app/categoria/camping/page.tsx` → overlay bg at 20% opacity
- **Prompt:**
  ```
  Wide panoramic landscape photograph of a camping setup at dawn in a South American forest. A khaki tent with a warm glow inside, camping chairs around a cold fire pit, mist rising from the ground. Tall trees with vines, tropical vegetation. Soft golden morning light filtering through the canopy. High detail, photorealistic, warm earthy tones (green, brown, amber). No people. 16:9 aspect ratio, 1920x600, suitable for a hero background overlay at 20% opacity.
  ```

### 3.2 — Pesca Hero
- **Path:** `public/images/marketing/hero-pesca.png`
- **Size:** 1920x600
- **Usage:** `app/categoria/pesca/page.tsx` → overlay bg
- **Prompt:**
  ```
  Wide panoramic photograph of a calm river at sunset in Paraguay. A wooden fishing pier extending into still water, fishing rod resting on a stand, ripples on the surface reflecting orange and pink sky. Palm trees silhouetted on the far bank. A tackle box and bucket visible on the pier. Photorealistic, warm golden hour tones with deep blue water. No people. 16:9 aspect ratio, 1920x600, suitable for hero background overlay at 20% opacity.
  ```

### 3.3 — Acc. Personales (Outdoor) Hero
- **Path:** `public/images/marketing/hero-outdoor.png`
- **Size:** 1920x600
- **Usage:** `app/categoria/accesorios/page.tsx` → overlay bg
- **Prompt:**
  ```
  Wide panoramic photograph of outdoor adventure gear laid out on a wooden picnic table at a campsite. A 60L hiking backpack open, hiking boots, compass, multi-tool knife, water bottle, headlamp, map. Dappled sunlight through tree leaves above. Forest background out of focus. Photorealistic, natural lighting, earth tones. No people. 16:9 aspect ratio, 1920x600, suitable for hero background overlay at 20% opacity.
  ```

### 3.4 — Automóviles Hero
- **Path:** `public/images/marketing/hero-autos.png`
- **Size:** 1920x600
- **Usage:** `app/categoria/autos/page.tsx` → overlay bg
- **Prompt:**
  ```
  Wide panoramic photograph of a car dashboard and windshield view looking out at a dusty Paraguayan road stretching to the horizon. Sunlight, open countryside, blue sky with white clouds. A dashcam mounted on the windshield, car accessories visible — phone mount, USB charger, sunglasses. Warm afternoon light. Photorealistic, bright tones. No people visible. 16:9 aspect ratio, 1920x600, suitable for hero background overlay at 20% opacity.
  ```

### 3.5 — Motos Hero
- **Path:** `public/images/marketing/hero-motos.png`
- **Size:** 1920x600
- **Usage:** `app/categoria/motos/page.tsx` → overlay bg
- **Prompt:**
  ```
  Wide panoramic photograph of an off-road motorcycle parked on a dirt trail in the Paraguayan countryside. A helmet resting on the seat, gloves on the handlebar. Green hills and blue sky in the background, golden afternoon light. Dusty trail leading into the distance. Photorealistic, warm tones with deep blue sky. No people. 16:9 aspect ratio, 1920x600, suitable for hero background overlay at 20% opacity.
  ```

### 3.6 — Campo Hero
- **Path:** `public/images/marketing/hero-campo.png`
- **Size:** 1920x600
- **Usage:** `app/categoria/campo/page.tsx` → overlay bg
- **Prompt:**
  ```
  Wide panoramic photograph of a rural Paraguayan farm field at golden hour. Fencing, grazing cattle in the distance, a rustic barn or shed. Farm equipment visible — water trough, feeding area. Green grass, blue sky with dramatic clouds, warm afternoon light filtering through. Photorealistic, natural rural tones. No people. 16:9 aspect ratio, 1920x600, suitable for hero background overlay at 20% opacity.
  ```

---

## GROUP 4: CATEGORY ICONS (6 items)

**Status: NEEDED** — These replace single-letter circles on the homepage grid (`app/page.tsx` line 239)

Each is a small square icon shown in a 64x64 circle. The site currently shows the first letter of the category name (e.g., "C" for Camping) inside a green circle.

### 4.1 — Camping Icon
- **Path:** `public/images/icons/camping.png`
- **Size:** 128x128 (displayed at 64x64)
- **Usage:** Homepage category grid
- **Prompt:**
  ```
  Simple flat vector icon of a dome tent, minimal style. Green color (#1B5E20) on transparent background. No details, just a clean silhouette. Suitable as a 64px circular icon for a category grid. SVG-like simplicity, centered.
  ```

### 4.2 — Pesca Icon
- **Path:** `public/images/icons/pesca.png`
- **Size:** 128x128
- **Prompt:**
  ```
  Simple flat vector icon of a fish, minimal style. Green color (#1B5E20) on transparent background. Clean silhouette. Suitable as a 64px circular icon for a category grid. Centered.
  ```

### 4.3 — Playa y Pesca Icon
- **Path:** `public/images/icons/playa-pesca.png`
- **Size:** 128x128
- **Prompt:**
  ```
  Simple flat vector icon of an umbrella on a beach, minimal style. Green color (#1B5E20) on transparent background. Clean silhouette. Suitable as a 64px circular icon for a category grid. Centered.
  ```

### 4.4 — Acc. Personales Icon
- **Path:** `public/images/icons/accesorios.png`
- **Size:** 128x128
- **Prompt:**
  ```
  Simple flat vector icon of a backpack, minimal style. Green color (#1B5E20) on transparent background. Clean silhouette. Suitable as a 64px circular icon for a category grid. Centered.
  ```

### 4.5 — Automóviles Icon
- **Path:** `public/images/icons/autos.png`
- **Size:** 128x128
- **Prompt:**
  ```
  Simple flat vector icon of a car, minimal style. Green color (#1B5E20) on transparent background. Clean silhouette. Suitable as a 64px circular icon for a category grid. Centered.
  ```

### 4.6 — Motos Icon
- **Path:** `public/images/icons/motos.png`
- **Size:** 128x128
- **Prompt:**
  ```
  Simple flat vector icon of a motorcycle, minimal style. Green color (#1B5E20) on transparent background. Clean silhouette. Suitable as a 64px circular icon for a category grid. Centered.
  ```

### 4.7 — Campo Icon
- **Path:** `public/images/icons/campo.png`
- **Size:** 128x128
- **Prompt:**
  ```
  Simple flat vector icon of a barn or farm silhouette, minimal style. Green color (#1B5E20) on transparent background. Clean silhouette. Suitable as a 64px circular icon for a category grid. Centered.
  ```

---

## GROUP 5: TESTIMONIAL AVATARS (4 items)

**Status: NEEDED** — Human headshots add trust to testimonials on the homepage

### 5.1 — Carlos Mendoza
- **Path:** `public/images/testimonials/avatar-carlos.png`
- **Size:** 200x200
- **Usage:** `content/es.json` testimonials (needs `"image"` field added + code change to render it)
- **Prompt:**
  ```
  Professional headshot photograph of a middle-aged Latino man, approximately 45 years old, smiling warmly. Warm brown skin, short dark hair with some grey at the temples, wearing a casual plaid shirt. Natural outdoor lighting, slightly blurred green forest background. Friendly, trustworthy expression. Photorealistic, square aspect ratio.
  ```

### 5.2 — Maria Gonzalez
- **Path:** `public/images/testimonials/avatar-maria.png`
- **Size:** 200x200
- **Prompt:**
  ```
  Professional headshot photograph of a Latina woman, approximately 35 years old, smiling. Warm olive skin, long dark hair tied back, wearing a casual white blouse. Natural outdoor lighting, blurred river or lake background. Friendly, approachable expression. Photorealistic, square aspect ratio.
  ```

### 5.3 — Luis Ramirez
- **Path:** `public/images/testimonials/avatar-luis.png`
- **Size:** 200x200
- **Prompt:**
  ```
  Professional headshot photograph of a Latino man, approximately 30 years old, confident smile. Light brown skin, short beard, short dark hair, wearing a casual denim jacket. Natural outdoor lighting, blurred camping or forest background. Adventurous, reliable look. Photorealistic, square aspect ratio.
  ```

### 5.4 — Ana Benitez
- **Path:** `public/images/testimonials/avatar-ana.png`
- **Size:** 200x200
- **Prompt:**
  ```
  Professional headshot photograph of a Latina woman, approximately 50 years old, warm genuine smile. Light brown skin with laugh lines, grey-streaked dark hair in a neat bun, wearing a colorful scarf or shawl. Natural outdoor lighting, blurred rural or garden background. Trustworthy, maternal expression. Photorealistic, square aspect ratio.
  ```

---

## GROUP 6: ABOUT PAGE IMAGES (3 items)

**Status: LOW PRIORITY** — The /nosotros page is currently text-only

### 6.1 — Storefront Photo
- **Path:** `public/images/nosotros/storefront.png`
- **Size:** 1200x800
- **Prompt:**
  ```
  Exterior photograph of a small local storefront in a Paraguayan suburb. Green storefront with sign "El Viajero Comercio". Display window showing camping and fishing equipment. Typical Mariano Roque Alonso street — single-story buildings, trees, bright sunny day. Warm and inviting. Photorealistic.
  ```

### 6.2 — Team Photo
- **Path:** `public/images/nosotros/team.png`
- **Size:** 1200x800
- **Prompt:**
  ```
  Group photograph of 3-4 friendly Latino people standing inside a small local store. They are wearing casual clothes with green aprons. Shelves behind them stocked with camping and fishing gear. Warm lighting, smiling naturally at the camera. Small retail shop atmosphere in Paraguay. Photorealistic.
  ```

### 6.3 — Store Interior
- **Path:** `public/images/nosotros/interior.png`
- **Size:** 1200x800
- **Prompt:**
  ```
  Interior photograph of a small well-organized retail store in Paraguay. Shelves neatly displaying camping equipment — tents, sleeping bags, backpacks, coolers on lower shelves. Fishing rods mounted on wall racks. Clean floor, good lighting, welcoming atmosphere. Photorealistic, wide angle lens look.
  ```

---

## GROUP 7: SOCIAL MEDIA / OG IMAGES (1 item)

**Status: ✅ DONE** — `og-viajero.svg` exists and is wired in layout.tsx

---

## Implementation Order

| Priority | Group | Items | Effort | Impact |
|----------|-------|-------|--------|--------|
| 1 | Group 4 — Category Icons | 7 small PNGs | Low | Replaces letters on homepage grid |
| 2 | Group 3 — Category Heroes | 6 wide banners | Medium | Replaces emoji on category pages |
| 3 | Group 5 — Testimonial Avatars | 4 headshots | Low | Adds trust to homepage |
| 4 | Group 6 — About Images | 3 photos | Medium | Completes /nosotros page |

**Total to generate: 20 new images** (7 icons + 6 hero banners + 4 avatars + 3 about photos)

After generation, code changes needed:
1. Category pages: replace emoji `<span>` with image background
2. Homepage grid: replace `{cat[0]}` letter with `<Image>` icon
3. Testimonials: add `"image"` field to es.json + render avatar in component
4. Nosotros page: add image sections
