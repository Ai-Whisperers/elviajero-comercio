import { test, expect } from "@playwright/test"

const BASE = process.env.E2E_BASE_URL || "https://tiendaelviajero.com.py"

test.describe("Smoke tests — key pages load without errors", () => {
  test("homepage loads with products section", async ({ page }) => {
    const res = await page.goto(BASE)
    expect(res!.status()).toBe(200)
    // Should have page content (Next.js 15 renders __next or body content)
    await page.waitForLoadState("networkidle")
    const body = await page.locator("body").innerHTML()
    // Should contain some product-related content
    expect(body.length).toBeGreaterThan(1000)
    // No React error overlay
    expect(body).not.toContain("Minified React error")
  })

  test("product page renders without React #310", async ({ page }) => {
    const errors: string[] = []
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text())
    })

    const res = await page.goto(`${BASE}/producto/bolsa-de-dormir-camuflayado`)
    expect(res!.status()).toBe(200)
    await page.waitForLoadState("networkidle")
    // Wait a bit for client-side hydration
    await page.waitForTimeout(3000)

    // Page should have content (title at minimum)
    const title = await page.title()
    expect(title).toContain("El Viajero")

    // No React #310 error in console
    const reactErrors = errors.filter(e => e.includes("Minified React error #310") || e.includes("Maximum update depth"))
    expect(reactErrors).toHaveLength(0)

    // No critical React errors at all
    const criticalErrors = errors.filter(e => e.includes("Minified React error") && !e.includes("#418"))
    expect(criticalErrors).toHaveLength(0)
  })

  test("tienda page shows product grid", async ({ page }) => {
    const res = await page.goto(`${BASE}/tienda`)
    expect(res!.status()).toBe(200)
    await page.waitForLoadState("networkidle")
    // Should have product links
    const links = page.locator("a[href*='/producto/']")
    const count = await links.count()
    expect(count).toBeGreaterThan(5)
  })

  test("contact page loads", async ({ page }) => {
    const res = await page.goto(`${BASE}/contacto`)
    expect(res!.status()).toBe(200)
  })

  test("health API returns ok", async ({ page }) => {
    const res = await page.goto(`${BASE}/api/health`)
    expect(res!.status()).toBe(200)
    const body = await res!.json()
    expect(body.status).toBe("ok")
    expect(body.service).toBe("elviajero")
  })

  test("home API returns products", async ({ page }) => {
    const res = await page.goto(`${BASE}/api/home`)
    expect(res!.status()).toBe(200)
    const body = await res!.json()
    expect(body.products.length).toBeGreaterThan(10)
  })

  test("non-existent product shows 404 UI", async ({ page }) => {
    const res = await page.goto(`${BASE}/producto/este-producto-no-existe-xyz123`)
    expect(res!.status()).toBe(200)
    await page.waitForLoadState("networkidle")
    const content = await page.locator("body").innerHTML()
    const hasNotFound = content.includes("no encontr") || content.includes("No encontrado") || content.includes("404") || content.includes("Volver al inicio")
    expect(hasNotFound).toBe(true)
  })
})

test.describe("Security", () => {
  test("pages have basic security headers", async ({ request }) => {
    const res = await request.get(`${BASE}/`)
    const headers = res.headers()
    expect(headers["x-content-type-options"]).toBeDefined()
  })
})

test.describe("Navigation", () => {
  test("homepage has product links", async ({ page }) => {
    await page.goto(BASE)
    await page.waitForLoadState("networkidle")
    // Just verify links exist in the DOM (don't need to click)
    const links = page.locator("a[href*='/producto/']")
    await expect(links.first()).toBeAttached({ timeout: 15_000 })
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })
})
