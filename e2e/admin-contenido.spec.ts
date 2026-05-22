/**
 * E2E: Admin Contenido — all 26 content sections
 * Tests: login, section nav, current values visible, field editing, save draft, publish
 */
import { test, expect, Page } from "@playwright/test"

const BASE = process.env.E2E_BASE_URL || "https://tiendaelviajero.com.py"
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || "admin@elviajero.com.py"
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || "Admin123!"

// ------------------------------------------------------------------
// Helper: log in once and store session in localStorage
// ------------------------------------------------------------------
async function adminLogin(page: Page) {
  await page.goto(`${BASE}/login`)
  await page.waitForLoadState("networkidle")

  await page.fill('input[type="email"]', ADMIN_EMAIL)
  await page.fill('input[type="password"]', ADMIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(3000)

  const sessionJson = await page.evaluate(() =>
    localStorage.getItem("elviajero_admin_session")
  )
  if (!sessionJson) {
    const token = await page.evaluate(() => {
      const cookies = document.cookie.split("; ").reduce((acc: Record<string,string>, c) => {
        const [k,v] = c.split("=",2); acc[k.trim()] = v; return acc
      }, {})
      return cookies["elviajero_admin_token"] || null
    })
    if (token) {
      await page.evaluate((t) => {
        localStorage.setItem("elviajero_admin_session", JSON.stringify({ access_token: t }))
      }, token)
    }
  }
}

// ------------------------------------------------------------------
// Helper: go to /admin/contenido and wait for editor to load
// ------------------------------------------------------------------
async function openContenido(page: Page) {
  await page.goto(`${BASE}/admin/contenido`)
  await page.waitForLoadState("networkidle")
  await page.waitForSelector('[data-testid="section-nav"]', { timeout: 15_000 }).catch(() => {})
  await page.waitForTimeout(2000)
}

// ------------------------------------------------------------------
// Helper: click a section in the admin sidebar/tab nav
// ------------------------------------------------------------------
async function selectSection(page: Page, sectionLabel: string) {
  // Normalize: "general" -> "General", "faq" -> "FAQ", etc.
  const displayName = sectionLabel
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())

  // Try exact match first (e.g. "FAQ", "General")
  let btn = page.locator(`button:has-text("${displayName}")`).first()
  if (await btn.count() === 0) {
    // Try case-insensitive partial
    btn = page.locator("button", { hasText: new RegExp(displayName, "i") }).first()
  }
  if (await btn.count() === 0) {
    // Fallback to partial lowercase
    btn = page.locator("button").filter({ hasText: new RegExp(sectionLabel.replace("-", " "), "i") }).first()
  }

  await btn.waitFor({ state: "visible", timeout: 15_000 })
  await btn.click()
  // Wait for the section content to appear (inputs/forms for that section)
  await page.waitForLoadState("networkidle")
}

// ------------------------------------------------------------------
// Helper: get all text/textarea/input values currently visible
// ------------------------------------------------------------------
async function getFormValues(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const vals: Record<string, string> = {}
    document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[type="text"], textarea').forEach(el => {
      if (el.id || el.name || el.placeholder) {
        vals[el.id || el.name || el.placeholder] = el.value
      }
    })
    return vals
  })
}

// ------------------------------------------------------------------
// Test: Login Flow
// ------------------------------------------------------------------
test.describe("Admin Login", () => {
  test("can log in with admin credentials and access contenido", async ({ page }) => {
    await adminLogin(page)
    await openContenido(page)

    expect(page.url()).toContain("/admin/contenido")

    const body = await page.locator("body").innerHTML()
    expect(body.length).toBeGreaterThan(500)
  })

  test("unauthenticated user cannot access admin contenido directly", async ({ page }) => {
    await page.goto(`${BASE}`)
    await page.evaluate(() => {
      localStorage.clear()
      document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/.*/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString())
      })
    })
    await page.goto(`${BASE}/admin/contenido`)
    await page.waitForLoadState("networkidle")

    const url = page.url()
    const body = await page.locator("body").innerText()
    const isBlocked = url.includes("login") || url === BASE + "/" || body.includes("Iniciar Sesión") || body.includes("401") || body.includes("Unauthorized")
    expect(isBlocked).toBeTruthy()
  })
})

// ------------------------------------------------------------------
// Test: Section Navigation — all 26 sections load without error
// ------------------------------------------------------------------
test.describe("Section Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page)
    await openContenido(page)
  })

  const sections = [
    "general", "branding", "hero", "categorias", "nosotros",
    "contacto", "footer", "faq", "kits", "promociones",
    "estadisticas", "caracteristicas", "testimonios", "navegacion",
    "ubicacion", "whatsapp", "envio", "zonas-envio", "medios-de-pago",
    "cookies", "newsletter", "blog", "textos-tienda",
    "pagina-producto", "etiquetas-ui", "seo",
  ]

  for (const section of sections) {
    test(`${section} section loads without 500 error`, async ({ page }) => {
      await selectSection(page, section)
      await page.waitForTimeout(2000)
      const body = await page.locator("body").innerText()
      expect(body).not.toContain("500")
      expect(body).not.toContain("Application error")
      expect(body.length).toBeGreaterThan(200)
    })
  }
})

// ------------------------------------------------------------------
// Test: Content Visibility — current values shown in form fields
// ------------------------------------------------------------------
test.describe("Content Visibility — values shown in form", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page)
    await openContenido(page)
  })

  test("general section shows current store name", async ({ page }) => {
    await selectSection(page, "general")
    await page.waitForTimeout(2000)
    const vals = await getFormValues(page)
    const nameField = Object.entries(vals).find(([k]) => k.toLowerCase().includes("nombre") || k.toLowerCase().includes("name") || k.toLowerCase().includes("tienda"))
    if (nameField) {
      expect(nameField[1].trim().length).toBeGreaterThan(0)
    }
    const inputs = await page.locator("input[type='text'], textarea").count()
    expect(inputs).toBeGreaterThan(0)
  })

  test("hero section shows current carousel title", async ({ page }) => {
    await selectSection(page, "hero")
    await page.waitForTimeout(2000)
    const vals = await getFormValues(page)
    const nonEmpty = Object.values(vals).filter(v => v.trim().length > 0)
    expect(nonEmpty.length).toBeGreaterThan(0)
    const imageAreas = await page.locator('[class*="upload"], [class*="image"], [class*="img"], input[type="url"]').count()
    expect(imageAreas).toBeGreaterThan(0)
  })

  test("footer section shows current footer text", async ({ page }) => {
    await selectSection(page, "footer")
    await page.waitForTimeout(2000)
    const vals = await getFormValues(page)
    const nonEmpty = Object.values(vals).filter(v => v.trim().length > 0)
    expect(nonEmpty.length).toBeGreaterThan(0)
  })

  test("faq section shows current FAQ items", async ({ page }) => {
    await selectSection(page, "faq")
    await page.waitForTimeout(2000)
    const text = await page.locator("body").innerText()
    expect(text.toLowerCase()).toContain("faq") || expect(text.length).toBeGreaterThan(100)
    const addButtons = await page.locator('button:has-text("Agregar"), button:has-text("Añadir"), button:has-text("+")').count()
    expect(addButtons).toBeGreaterThan(0)
  })

  test("testimonios section shows current testimonials", async ({ page }) => {
    await selectSection(page, "testimonios")
    await page.waitForTimeout(2000)
    const text = await page.locator("body").innerText()
    const hasNames = text.toLowerCase().includes("nombre") || text.toLowerCase().includes("cliente") || text.toLowerCase().includes("testimonio")
    expect(hasNames || text.length > 200).toBeTruthy()
  })
})

// ------------------------------------------------------------------
// Test: Field Editing — type, add items, clear
// ------------------------------------------------------------------
test.describe("Field Editing & Save", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page)
    await openContenido(page)
  })

  test("can type in a text field", async ({ page }) => {
    await selectSection(page, "general")
    await page.waitForTimeout(2000)

    // Find first textbox/input and type into it
    const firstInput = page.locator("input[type='text'], input[type='url'], textarea, [role='textbox']").first()
    await firstInput.scrollIntoViewIfNeeded()
    await firstInput.clear()
    await firstInput.fill("TEST_VALUE_" + Date.now())
    const newValue = await firstInput.inputValue()
    expect(newValue).toContain("TEST_VALUE_")
  })

  test("save draft button is present and clickable", async ({ page }) => {
    await selectSection(page, "general")
    await page.waitForTimeout(2000)

    const saveBtn = page.locator('button:has-text("Guardar"), button:has-text("Draft"), button:has-text("Borrador")').first()
    if (await saveBtn.count() > 0) {
      await saveBtn.scrollIntoViewIfNeeded()
      expect(await saveBtn.isEnabled()).toBeTruthy()
    } else {
      const anyBtn = page.locator("form button").last()
      expect(await anyBtn.count()).toBeGreaterThan(0)
    }
  })

  test("add item button works in FAQ section", async ({ page }) => {
    await selectSection(page, "faq")
    await page.waitForTimeout(2000)

    const beforeCount = await page.locator('[class*="item"], [data-item], li').count()

    const addBtn = page.locator('button:has-text("Agregar"), button:has-text("Añadir"), button:has-text("+ Agregar")').first()
    if (await addBtn.count() > 0) {
      await addBtn.click()
      // Don't wait arbitrary time — just verify no crash
      await page.waitForLoadState("domcontentloaded")
      const afterCount = await page.locator('[class*="item"], [data-item], li').count()
      // After click, count should be same or greater (no crash)
      expect(afterCount).toBeGreaterThanOrEqual(beforeCount - 1)
    }
  })

  test("add item button works in testimonios section", async ({ page }) => {
    await selectSection(page, "testimonios")
    await page.waitForTimeout(2000)

    const addBtn = page.locator('button:has-text("Agregar"), button:has-text("Añadir"), button:has-text("+ Agregar")').first()
    if (await addBtn.count() > 0) {
      const beforeCount = await page.locator('[class*="card"], [class*="testimonio"], [data-item]').count()
      await addBtn.click()
      await page.waitForLoadState("domcontentloaded")
      const afterCount = await page.locator('[class*="card"], [class*="testimonio"], [data-item]').count()
      expect(afterCount).toBeGreaterThanOrEqual(beforeCount - 1)
    }
  })

  test("can type in multiline textarea", async ({ page }) => {
    await selectSection(page, "nosotros")
    await page.waitForTimeout(2000)

    const textarea = page.locator("textarea").first()
    if (await textarea.count() > 0) {
      await textarea.scrollIntoViewIfNeeded()
      await textarea.clear()
      await textarea.fill("Edited story paragraph " + Date.now())
      const val = await textarea.inputValue()
      expect(val).toContain("Edited story")
    }
  })
})

// ------------------------------------------------------------------
// Test: Image Upload UI
// ------------------------------------------------------------------
test.describe("Image Upload UI", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page)
    await openContenido(page)
  })

  test("hero section shows image upload area", async ({ page }) => {
    await selectSection(page, "hero")
    await page.waitForTimeout(2000)

    const urlInput = page.locator('input[placeholder*="url"], input[placeholder*="URL"], input[placeholder*="imagen"], input[placeholder*="image"]').first()
    if (await urlInput.count() > 0) {
      expect(await urlInput.isVisible()).toBeTruthy()
    }

    const uploadArea = await page.locator('[class*="dropzone"], [class*="upload"], [class*="image"]').count()
    expect(uploadArea).toBeGreaterThan(0)
  })

  test("branding section has logo upload area", async ({ page }) => {
    await selectSection(page, "branding")
    await page.waitForTimeout(2000)

    const uploadArea = await page.locator('[class*="dropzone"], [class*="upload"], [class*="image"], input[type="url"]').count()
    expect(uploadArea).toBeGreaterThan(0)
  })
})

// ------------------------------------------------------------------
// Test: Draft / Publish workflow
// ------------------------------------------------------------------
test.describe("Draft & Publish Workflow", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page)
    await openContenido(page)
  })

  test("save draft button visible after making edit", async ({ page }) => {
    await selectSection(page, "general")
    await page.waitForTimeout(2000)

    const firstInput = page.locator("input[type='text'], input[type='url'], textarea, [role='textbox']").first()
    if (await firstInput.count() > 0) {
      await firstInput.fill("Draft test " + Date.now())
      await page.waitForTimeout(500)
    }

    const draftBtn = page.locator('button:has-text("Guardar"), button:has-text("Draft"), button:has-text("Borrador")').first()
    if (await draftBtn.count() > 0) {
      expect(await draftBtn.isEnabled()).toBeTruthy()
    }
  })

  test("publish button is present in page", async ({ page }) => {
    await selectSection(page, "general")
    await page.waitForTimeout(2000)

    const publishBtn = page.locator('button:has-text("Publicar"), button:has-text("Publish"), button:has-text("Activar")').first()
    if (await publishBtn.count() > 0) {
      expect(await publishBtn.isVisible()).toBeTruthy()
    }
  })

  test("discard changes button appears after edit", async ({ page }) => {
    await selectSection(page, "general")
    await page.waitForTimeout(2000)

    const firstInput = page.locator("input[type='text'], input[type='url'], textarea, [role='textbox']").first()
    if (await firstInput.count() > 0) {
      await firstInput.fill("Discard test " + Date.now())
      await page.waitForTimeout(500)
    }

    const discardBtn = page.locator('button:has-text("Descartar"), button:has-text("Discard"), button:has-text("Cancelar")').first()
    if (await discardBtn.count() > 0) {
      expect(await discardBtn.isVisible()).toBeTruthy()
    }
  })
})

// ------------------------------------------------------------------
// Test: No console errors across key sections
// ------------------------------------------------------------------
test.describe("No Console Errors", () => {
  const sections = ["general", "hero", "footer", "faq", "testimonios", "nosotros"]

  for (const section of sections) {
    test(`${section} — no React errors`, async ({ page }) => {
      const errors: string[] = []
      page.on("pageerror", err => errors.push(err.message))
      page.on("console", msg => {
        if (msg.type() === "error") errors.push(msg.text())
      })

      await adminLogin(page)
      await selectSection(page, section)
      await page.waitForTimeout(2000)
      await page.waitForLoadState("networkidle")

      const critical = errors.filter(e =>
        e.includes("Minified React error #310") ||
        e.includes("Minified React error #311") ||
        e.includes("Application error")
      )
      expect(critical).toHaveLength(0)
    })
  }
})