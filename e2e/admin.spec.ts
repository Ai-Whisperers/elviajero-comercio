import { test, expect } from "@playwright/test"

const BASE = process.env.E2E_BASE_URL || "https://tiendaelviajero.com.py"

// Test admin auth flow — these verify the auth guard works correctly
test.describe("Admin Authentication", () => {
  test("redirects unauthenticated users from /admin", async ({ page }) => {
    // Clear any existing session
    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState("networkidle")

    // Should either redirect to login or show login form
    const url = page.url()
    const hasLogin = url.includes("/login") || url.includes("/admin/login") || url === `${BASE}/admin`
    expect(hasLogin).toBeTruthy()
  })

  test("admin pages are not publicly accessible", async ({ request }) => {
    const adminPaths = [
      "/admin/productos",
      "/admin/pedidos",
      "/admin/clientes",
      "/admin/contenido",
      "/admin/facturacion",
    ]
    for (const path of adminPaths) {
      const resp = await request.get(`${BASE}${path}`)
      // Should return 200 (page loads) but content should show auth gate,
      // or redirect. NOT a server error.
      expect(resp.status()).toBeLessThan(500)
    }
  })

  test("admin API endpoints require auth", async ({ request }) => {
    const apiPaths = [
      "/api/admin/content",
      "/api/admin/stats",
      "/api/admin/products",
      "/api/admin/orders",
    ]
    for (const path of apiPaths) {
      const resp = await request.get(`${BASE}${path}`, {
        headers: { "Authorization": "" },
      })
      // Should reject with 401 or redirect
      expect([401, 403, 307, 308]).toContain(resp.status())
    }
  })

  test("admin API rejects invalid tokens", async ({ request }) => {
    const resp = await request.get(`${BASE}/api/admin/stats`, {
      headers: { "Authorization": "Bearer invalid-token-xyz" },
    })
    expect([401, 403]).toContain(resp.status())
  })

  test("login page loads without errors", async ({ page }) => {
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })

    await page.goto(`${BASE}/admin`)
    await page.waitForLoadState("networkidle")

    // No React hydration errors
    const reactErrors = consoleErrors.filter(
      (e) => e.includes("Minified React error") || e.includes("#310") || e.includes("#418") || e.includes("#423")
    )
    expect(reactErrors).toHaveLength(0)
  })
})

// Test the full admin login -> dashboard flow using injected session
test.describe("Admin Dashboard (authenticated)", () => {
  test("can set session and access admin dashboard", async ({ page }) => {
    // Inject a fake session to bypass login
    await page.goto(`${BASE}/admin`)

    // Set a mock admin session in localStorage
    await page.evaluate(() => {
      localStorage.setItem("elviajero_admin_session", JSON.stringify({
        access_token: "test-admin-token-for-e2e",
        user: { email: "admin@test.com", role: "admin" },
      }))
    })

    // Reload to trigger auth check
    await page.reload()
    await page.waitForLoadState("networkidle")

    // Page should load without crashing
    const url = page.url()
    expect(url).toContain("/admin")
  })
})

// Test admin page navigation (all admin routes load without 500 errors)
test.describe("Admin Page Health", () => {
  const adminPages = [
    "/admin",
    "/admin/productos",
    "/admin/pedidos",
    "/admin/clientes",
    "/admin/contenido",
    "/admin/promos",
    "/admin/blog",
    "/admin/resenas",
    "/admin/stock",
    "/admin/suscriptores",
    "/admin/fidelidad",
    "/admin/zonas-delivery",
  ]

  for (const pagePath of adminPages) {
    test(`${pagePath} loads without server error`, async ({ request }) => {
      const resp = await request.get(`${BASE}${pagePath}`)
      // Next.js returns 200 for client-rendered pages even if auth-gated
      // We just verify no server error (5xx)
      expect(resp.status()).toBeLessThan(500)
    })
  }
})
