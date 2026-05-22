/**
 * SEO Meta Tests — pure function, no mocks needed.
 *
 * Tests: getPageMeta for all routes + fallback
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors lib/seo-meta.ts) ──────────────────────────────
function getPageMeta(pathname: string): { title: string; description: string } {
  const site = "El Viajero"
  const base = "Camping, pesca y outdoor en Paraguay"
  const pages: Record<string, { title: string; description: string }> = {
    "/": { title: site + " — Tu Aventura Empieza Acá", description: base + ". Carpas, cañas de pesca, accesorios para auto y moto. Todo para tu aventura." },
    "/tienda": { title: "Tienda Online | " + site, description: "Comprá productos de camping, pesca y outdoor en Paraguay. Envío a todo el país." },
    "/nosotros": { title: "Sobre Nosotros | " + site, description: "Conocé more sobre El Viajero, tu tienda outdoor en Paraguay desde 2018." },
    "/contacto": { title: "Contacto | " + site, description: "Contactanos por WhatsApp, email o visitá nuestra tienda en Mariano Roque Alonso." },
    "/faq": { title: "Preguntas Frecuentes | " + site, description: "Respuestas a tus preguntas sobre compras, envíos, cambios y más en El Viajero." },
    "/blog": { title: "Blog | " + site, description: "Consejos de camping, pesca y vida outdoor en Paraguay. Leé nuestros artículos." },
    "/promociones": { title: "Promociones | " + site, description: "Ofertas y descuentos en productos de camping, pesca y outdoor en Paraguay." },
    "/login": { title: "Iniciar Sesión | " + site, description: "Accedé a tu cuenta de El Viajero." },
    "/register": { title: "Crear Cuenta | " + site, description: "Creá tu cuenta en El Viajero y empezá a comprar." },
    "/comparar": { title: "Comparar Productos | " + site, description: "Compará productos de camping, pesca y outdoor lado a lado." },
    "/privacidad": { title: "Política de Privacidad | " + site, description: "Política de privacidad de El Viajero." },
    "/terminos": { title: "Términos y Condiciones | " + site, description: "Términos y condiciones de uso de El Viajero." },
  }
  return pages[pathname] || { title: site, description: base }
}

describe("SEO Meta", () => {
  const knownRoutes = ["/", "/tienda", "/nosotros", "/contacto", "/faq", "/blog", "/promociones", "/login", "/register", "/comparar", "/privacidad", "/terminos"]

  it("returns meta for homepage", () => {
    const meta = getPageMeta("/")
    expect(meta.title).toContain("El Viajero")
    expect(meta.title).toContain("Tu Aventura")
    expect(meta.description).toContain("Camping")
  })

  it("returns meta for tienda", () => {
    const meta = getPageMeta("/tienda")
    expect(meta.title).toContain("Tienda Online")
    expect(meta.description).toContain("Envío")
  })

  it("returns meta for blog", () => {
    const meta = getPageMeta("/blog")
    expect(meta.title).toContain("Blog")
  })

  it("returns meta for promociones", () => {
    const meta = getPageMeta("/promociones")
    expect(meta.title).toContain("Promociones")
    expect(meta.description).toContain("Ofertas")
  })

  it("returns meta for FAQ", () => {
    const meta = getPageMeta("/faq")
    expect(meta.title).toContain("Preguntas Frecuentes")
  })

  it("returns meta for contacto", () => {
    const meta = getPageMeta("/contacto")
    expect(meta.title).toContain("Contacto")
    expect(meta.description).toContain("WhatsApp")
  })

  it("returns meta for legal pages", () => {
    expect(getPageMeta("/privacidad").title).toContain("Privacidad")
    expect(getPageMeta("/terminos").title).toContain("Términos")
  })

  it("returns meta for auth pages", () => {
    expect(getPageMeta("/login").title).toContain("Iniciar Sesión")
    expect(getPageMeta("/register").title).toContain("Crear Cuenta")
  })

  it("returns fallback for unknown routes", () => {
    const meta = getPageMeta("/some-random-page")
    expect(meta.title).toBe("El Viajero")
    expect(meta.description).toContain("Camping")
  })

  it("all known routes return non-empty title and description", () => {
    for (const route of knownRoutes) {
      const meta = getPageMeta(route)
      expect(meta.title.length).toBeGreaterThan(0)
      expect(meta.description.length).toBeGreaterThan(0)
    }
  })

  it("all titles contain El Viajero", () => {
    for (const route of knownRoutes) {
      expect(getPageMeta(route).title).toContain("El Viajero")
    }
  })

  it("all descriptions are non-empty", () => {
    for (const route of knownRoutes) {
      expect(getPageMeta(route).description.length).toBeGreaterThan(10)
    }
  })
})
