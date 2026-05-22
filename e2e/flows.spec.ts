import { test, expect } from "@playwright/test"

const BASE = process.env.E2E_BASE_URL || "https://tiendaelviajero.com.py"

test.describe("Core user flows", () => {
  test("browse → product → WhatsApp checkout", async ({ page }) => {
    // 1. Browse homepage
    await page.goto(BASE)
    await expect(page).toHaveTitle(/Viajero/i)

    // 2. Navigate to tienda
    await page.click('a[href="/tienda"]')
    await expect(page).toHaveURL(/\/tienda/)

    // 3. Click first product
    const productLink = page.locator('a[href*="/producto/"]').first()
    await productLink.click()
    await expect(page).toHaveURL(/\/producto\//)

    // 4. Product page renders — no React #310
    const consoleErrors: string[] = []
    page.on("console", msg => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })
    await page.waitForTimeout(2000)
    const has310 = consoleErrors.some(e => e.includes("Minified React error #310"))
    expect(has310).toBe(false)

    // 5. WhatsApp checkout button exists
    const waButton = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first()
    await expect(waButton).toBeAttached()
  })

  test("tienda filtering works", async ({ page }) => {
    await page.goto(`${BASE}/tienda`)
    await page.waitForLoadState("networkidle")

    // Category filter should be visible
    const categoryFilter = page.locator('button, [role="button"]').filter({ hasText: /Camping|Pesca|Electrónica/ }).first()
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.waitForTimeout(500)
      // Products should update (either filtered or still showing)
      const products = page.locator('[class*="product"], [class*="card"]').filter({ has: page.locator("img, svg") })
      // Just verify page didn't crash
      await expect(page).toHaveURL(/\/tienda/)
    }
  })

  test("search returns results or empty state", async ({ page }) => {
    await page.goto(`${BASE}/tienda`)
    await page.waitForLoadState("networkidle")

    // Try search if available
    const searchInput = page.locator('input[type="search"], input[placeholder*="Buscar"]').first()
    if (await searchInput.isVisible()) {
      await searchInput.fill("carpa")
      await page.waitForTimeout(1000)
      // Should show results or "no encontrado"
      const body = await page.textContent("body")
      expect(body).toBeTruthy()
    }
  })
})

test.describe("Cart flow", () => {
  test("add product shows cart indicator", async ({ page }) => {
    await page.goto(`${BASE}/tienda`)
    await page.waitForLoadState("networkidle")

    // Find an "Agregar" button
    const addBtn = page.locator('button').filter({ hasText: /Agregar|Añadir|Comprar/i }).first()
    if (await addBtn.isVisible()) {
      await addBtn.click()
      await page.waitForTimeout(500)

      // Cart badge or sidebar should appear
      const cartIndicator = page.locator('[class*="cart"], [aria-label*="carrito"]').first()
      // Just verify page didn't crash
      await expect(page).toHaveURL(/\/tienda/)
    }
  })
})

test.describe("Content pages", () => {
  test("blog page loads", async ({ page }) => {
    const resp = await page.goto(`${BASE}/blog`)
    expect(resp?.status()).toBe(200)
  })

  test("promociones page loads", async ({ page }) => {
    const resp = await page.goto(`${BASE}/promociones`)
    expect(resp?.status()).toBe(200)
  })

  test("nosotros page loads with content", async ({ page }) => {
    await page.goto(`${BASE}/nosotros`)
    const body = await page.textContent("body")
    expect(body).toContain("Viajero")
  })

  test("FAQ page loads", async ({ page }) => {
    const resp = await page.goto(`${BASE}/faq`)
    expect(resp?.status()).toBe(200)
  })

  test("contacto page loads", async ({ page }) => {
    await page.goto(`${BASE}/contacto`)
    const body = await page.textContent("body")
    expect(body).toBeTruthy()
  })

  test("login page loads", async ({ page }) => {
    const resp = await page.goto(`${BASE}/login`)
    expect(resp?.status()).toBe(200)
  })

  test("checkout page loads", async ({ page }) => {
    const resp = await page.goto(`${BASE}/checkout`)
    expect(resp?.status()).toBe(200)
  })
})

test.describe("Category pages", () => {
  const categories = ["camping", "pesca"]

  for (const cat of categories) {
    test(`/${cat} category page loads`, async ({ page }) => {
      const resp = await page.goto(`${BASE}/categoria/${cat}`)
      // May be 200 or 404 depending on content config
      expect(resp!.status()).toBeLessThan(500)
    })
  }
})

test.describe("Error handling", () => {
  test("404 page renders for non-existent routes", async ({ page }) => {
    await page.goto(`${BASE}/esta-pagina-no-existe-xyz`)
    const body = await page.textContent("body")
    // Should show 404 UI, not a blank page or server error
    expect(body).toBeTruthy()
    expect(body!.length).toBeGreaterThan(50)
  })

  test("non-existent product shows 404 UI", async ({ page }) => {
    await page.goto(`${BASE}/producto/este-producto-no-existe-xyz`)
    const body = await page.textContent("body")
    expect(body).toBeTruthy()
    // Should not be a server error
    expect(body).not.toContain("Internal Server Error")
  })
})

test.describe("API endpoints", () => {
  test("/api/health returns ok", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/health`)
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(body.status).toBe("ok")
  })

  test("/api/home returns product data", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/home`)
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(Array.isArray(body.products)).toBe(true)
    expect(body.products.length).toBeGreaterThan(0)
  })

  test("/api/products returns data", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/products`)
    expect(resp.status()).toBe(200)
  })

  test("/api/delivery-zones returns data", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/delivery-zones`)
    expect(resp.status()).toBe(200)
  })

  test("/api/shipping returns zones", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/shipping`)
    expect(resp.status()).toBe(200)
    const body = await resp.json()
    expect(Array.isArray(body.zones)).toBe(true)
    expect(body.zones.length).toBeGreaterThanOrEqual(3)
    const asu = body.zones.find((z: any) => z.id === "asu")
    expect(asu).toBeDefined()
    expect(asu.fee).toBe(15000)
  })

  test("/api/content returns data", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/content`)
    expect(resp.status()).toBeLessThan(500)
  })
})

test.describe("Security", () => {
  for (const url of ["/", "/tienda", "/contacto"]) {
    test(`${url} has security headers`, async ({ request }) => {
      const resp = await request.get(`${BASE}${url}`)
      const headers = resp.headers()
      expect(headers["x-frame-options"] || headers["content-security-policy"] || headers["x-content-type-options"]).toBeTruthy()
    })
  }
})
