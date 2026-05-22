# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Smoke tests — key pages load without errors >> product page renders without React #310
- Location: e2e/smoke.spec.ts:18:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  ["Error: Minified React error #310; visit https://react.dev/errors/310 for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    at ao (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:52411)
    at Object.aq [as useMemo] (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:59614)
    at t.useMemo (https://tiendaelviajero.com.py/_next/static/chunks/1255-b28ea36bf0cdbd65.js:1:21375)
    at M (https://tiendaelviajero.com.py/_next/static/chunks/app/producto/%5Bslug%5D/page-b4358f4e727ec9f8.js:1:13790)
    at l9 (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:51125)
    at o_ (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:70985)
    at oq (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:82015)
    at ik (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:114677)
    at https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:114522
    at ib (https://tiendaelviajero.com.py/_next/static/chunks/4bd1b696-f785427dddbba9fb.js:1:114530)"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "El Viajero" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "El Viajero" [ref=e6]
      - navigation [ref=e7]:
        - link "Inicio" [ref=e8] [cursor=pointer]:
          - /url: /
        - link "Tienda" [ref=e9] [cursor=pointer]:
          - /url: /tienda
        - link "Blog" [ref=e10] [cursor=pointer]:
          - /url: /blog
        - link "Nosotros" [ref=e11] [cursor=pointer]:
          - /url: /nosotros
        - link "Ofertas" [ref=e12] [cursor=pointer]:
          - /url: /promociones
        - link "FAQ" [ref=e13] [cursor=pointer]:
          - /url: /faq
        - link "Contacto" [ref=e14] [cursor=pointer]:
          - /url: /contacto
      - generic [ref=e15]:
        - button "Buscar" [ref=e16]:
          - img [ref=e17]
        - generic [ref=e19]:
          - button "ES" [ref=e20]
          - button "EN" [ref=e21]
          - button "GN" [ref=e22]
        - button "Modo oscuro" [ref=e23]:
          - img [ref=e24]
        - link "Ingresar" [ref=e26] [cursor=pointer]:
          - /url: /login
        - button "Carrito" [ref=e27]:
          - img [ref=e28]
  - generic [ref=e30]:
    - generic [ref=e31]: ⚠️
    - heading "Error del servidor" [level=1] [ref=e32]
    - paragraph [ref=e33]: Algo salió mal. Intentalo de nuevo o volvé al inicio.
    - generic [ref=e34]:
      - button "Intentar de nuevo" [ref=e35]
      - link "Volver al inicio" [ref=e36] [cursor=pointer]:
        - /url: /
  - contentinfo [ref=e37]:
    - generic [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]: 📍
          - generic [ref=e43]: Coronel Felipe Toledo, Barrio La Concordia (detrás de Mariam Lubricantes), Mariano Roque Alonso
        - generic [ref=e44]:
          - generic [ref=e45]: 📞
          - generic [ref=e46]: +595 984 009751
        - generic [ref=e47]:
          - generic [ref=e48]: 🕐
          - generic [ref=e49]: Lun-Vie 08:00-19:00 | Sáb 08:00-17:00 | Dom 09:00-13:00
      - generic [ref=e50]:
        - generic [ref=e51]:
          - heading "El Viajero" [level=4] [ref=e52]
          - generic [ref=e53]:
            - link "Inicio" [ref=e54] [cursor=pointer]:
              - /url: /
            - link "Tienda" [ref=e55] [cursor=pointer]:
              - /url: /tienda
            - link "Blog" [ref=e56] [cursor=pointer]:
              - /url: /blog
            - link "Nosotros" [ref=e57] [cursor=pointer]:
              - /url: /nosotros
            - link "Contacto" [ref=e58] [cursor=pointer]:
              - /url: /contacto
        - generic [ref=e59]:
          - heading "Ayuda" [level=4] [ref=e60]
          - generic [ref=e61]:
            - link "FAQ" [ref=e62] [cursor=pointer]:
              - /url: /faq?q=faq
            - link "Envios" [ref=e63] [cursor=pointer]:
              - /url: /faq#envios
            - link "Cambios y devoluciones" [ref=e64] [cursor=pointer]:
              - /url: /faq#cambios
            - link "Medios de pago" [ref=e65] [cursor=pointer]:
              - /url: /faq#medios-de-pago
        - generic [ref=e66]:
          - heading "Legales" [level=4] [ref=e67]
          - generic [ref=e68]:
            - link "Privacidad" [ref=e69] [cursor=pointer]:
              - /url: /privacidad
            - link "Terminos" [ref=e70] [cursor=pointer]:
              - /url: /terminos
        - generic [ref=e71]:
          - heading "Seguinos" [level=4] [ref=e72]
          - generic [ref=e73]:
            - link "Instagram" [ref=e74] [cursor=pointer]:
              - /url: https://instagram.com/elviajero_py
              - img [ref=e75]
            - link "Facebook" [ref=e77] [cursor=pointer]:
              - /url: https://facebook.com/elviajeropy
              - img [ref=e78]
            - link "TikTok" [ref=e80] [cursor=pointer]:
              - /url: https://tiktok.com/@elviajero_py
              - img [ref=e81]
            - link "YouTube" [ref=e83] [cursor=pointer]:
              - /url: https://youtube.com/@elviajero_py
              - img [ref=e84]
      - generic [ref=e86]:
        - paragraph [ref=e87]: Medios de pago
        - generic [ref=e88]:
          - generic [ref=e89]: Visa
          - generic [ref=e90]: Mastercard
          - generic [ref=e91]: Mercado Pago
          - generic [ref=e92]: Pagopar
          - generic [ref=e93]: Bancard
          - generic [ref=e94]: Efectivo
          - generic [ref=e95]: Transferencia
      - generic [ref=e96]: © 2026 El Viajero. Todos los derechos reservados.
  - generic [ref=e98]:
    - paragraph [ref=e99]:
      - text: Usamos cookies para mejorar tu experiencia. Al continuar, aceptás nuestra Política de Privacidad.
      - link "Más información" [ref=e100] [cursor=pointer]:
        - /url: /privacidad
    - button "Aceptar" [ref=e101]
  - link "Contactar por WhatsApp" [ref=e102] [cursor=pointer]:
    - /url: https://wa.me/595984009751?text=Hola!%20Quisiera%20informacion%20sobre%20productos%20de%20El%20Viajero
    - img [ref=e103]
  - alert [ref=e108]
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test"
  2   | 
  3   | const BASE = process.env.E2E_BASE_URL || "https://tiendaelviajero.com.py"
  4   | 
  5   | test.describe("Smoke tests — key pages load without errors", () => {
  6   |   test("homepage loads with products section", async ({ page }) => {
  7   |     const res = await page.goto(BASE)
  8   |     expect(res!.status()).toBe(200)
  9   |     // Should have page content (Next.js 15 renders __next or body content)
  10  |     await page.waitForLoadState("networkidle")
  11  |     const body = await page.locator("body").innerHTML()
  12  |     // Should contain some product-related content
  13  |     expect(body.length).toBeGreaterThan(1000)
  14  |     // No React error overlay
  15  |     expect(body).not.toContain("Minified React error")
  16  |   })
  17  | 
  18  |   test("product page renders without React #310", async ({ page }) => {
  19  |     const errors: string[] = []
  20  |     page.on("console", msg => {
  21  |       if (msg.type() === "error") errors.push(msg.text())
  22  |     })
  23  | 
  24  |     const res = await page.goto(`${BASE}/producto/bolsa-de-dormir-camuflayado`)
  25  |     expect(res!.status()).toBe(200)
  26  |     await page.waitForLoadState("networkidle")
  27  |     // Wait a bit for client-side hydration
  28  |     await page.waitForTimeout(3000)
  29  | 
  30  |     // Page should have content (title at minimum)
  31  |     const title = await page.title()
  32  |     expect(title).toContain("El Viajero")
  33  | 
  34  |     // No React #310 error in console
  35  |     const reactErrors = errors.filter(e => e.includes("Minified React error #310") || e.includes("Maximum update depth"))
> 36  |     expect(reactErrors).toHaveLength(0)
      |                         ^ Error: expect(received).toHaveLength(expected)
  37  | 
  38  |     // No critical React errors at all
  39  |     const criticalErrors = errors.filter(e => e.includes("Minified React error") && !e.includes("#418"))
  40  |     expect(criticalErrors).toHaveLength(0)
  41  |   })
  42  | 
  43  |   test("tienda page shows product grid", async ({ page }) => {
  44  |     const res = await page.goto(`${BASE}/tienda`)
  45  |     expect(res!.status()).toBe(200)
  46  |     await page.waitForLoadState("networkidle")
  47  |     // Should have product links
  48  |     const links = page.locator("a[href*='/producto/']")
  49  |     const count = await links.count()
  50  |     expect(count).toBeGreaterThan(5)
  51  |   })
  52  | 
  53  |   test("contact page loads", async ({ page }) => {
  54  |     const res = await page.goto(`${BASE}/contacto`)
  55  |     expect(res!.status()).toBe(200)
  56  |   })
  57  | 
  58  |   test("health API returns ok", async ({ page }) => {
  59  |     const res = await page.goto(`${BASE}/api/health`)
  60  |     expect(res!.status()).toBe(200)
  61  |     const body = await res!.json()
  62  |     expect(body.status).toBe("ok")
  63  |     expect(body.service).toBe("elviajero")
  64  |   })
  65  | 
  66  |   test("home API returns products", async ({ page }) => {
  67  |     const res = await page.goto(`${BASE}/api/home`)
  68  |     expect(res!.status()).toBe(200)
  69  |     const body = await res!.json()
  70  |     expect(body.products.length).toBeGreaterThan(10)
  71  |   })
  72  | 
  73  |   test("non-existent product shows 404 UI", async ({ page }) => {
  74  |     const res = await page.goto(`${BASE}/producto/este-producto-no-existe-xyz123`)
  75  |     expect(res!.status()).toBe(200)
  76  |     await page.waitForLoadState("networkidle")
  77  |     const content = await page.locator("body").innerHTML()
  78  |     const hasNotFound = content.includes("no encontr") || content.includes("No encontrado") || content.includes("404") || content.includes("Volver al inicio")
  79  |     expect(hasNotFound).toBe(true)
  80  |   })
  81  | })
  82  | 
  83  | test.describe("Security", () => {
  84  |   test("pages have basic security headers", async ({ request }) => {
  85  |     const res = await request.get(`${BASE}/`)
  86  |     const headers = res.headers()
  87  |     expect(headers["x-content-type-options"]).toBeDefined()
  88  |   })
  89  | })
  90  | 
  91  | test.describe("Navigation", () => {
  92  |   test("homepage has product links", async ({ page }) => {
  93  |     await page.goto(BASE)
  94  |     await page.waitForLoadState("networkidle")
  95  |     // Just verify links exist in the DOM (don't need to click)
  96  |     const links = page.locator("a[href*='/producto/']")
  97  |     await expect(links.first()).toBeAttached({ timeout: 15_000 })
  98  |     const count = await links.count()
  99  |     expect(count).toBeGreaterThan(0)
  100 |   })
  101 | })
  102 | 
```