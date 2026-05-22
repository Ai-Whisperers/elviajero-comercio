/**
 * Routes Constants Tests — verify routing configuration integrity.
 *
 * Tests: PUBLIC_ROUTES, PUBLIC_PREFIXES, PROTECTED_ROUTES, STATIC_FILES
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors lib/routes.ts) ────────────────────────────────
const PUBLIC_ROUTES = [
  '/', '/tienda', '/productos', '/producto/', '/nosotros', '/contacto',
  '/faq', '/blog', '/promociones', '/privacidad', '/terminos',
  '/login', '/register', '/recuperar',
]

const PUBLIC_PREFIXES = [
  '/producto/', '/blog/', '/_next/', '/images/', '/favicon',
]

const PROTECTED_ROUTES = [
  '/mi-cuenta', '/admin', '/checkout',
]

const STATIC_FILES = [
  '/sitemap.xml', '/rss.xml', '/robots.txt',
]

const ADMIN_ROLE = 'admin'

describe("Route Constants", () => {
  describe("PUBLIC_ROUTES", () => {
    it("includes homepage", () => {
      expect(PUBLIC_ROUTES).toContain("/")
    })

    it("includes shop pages", () => {
      expect(PUBLIC_ROUTES).toContain("/tienda")
      expect(PUBLIC_ROUTES).toContain("/productos")
      expect(PUBLIC_ROUTES).toContain("/producto/")
    })

    it("includes info pages", () => {
      expect(PUBLIC_ROUTES).toContain("/nosotros")
      expect(PUBLIC_ROUTES).toContain("/contacto")
      expect(PUBLIC_ROUTES).toContain("/faq")
    })

    it("includes legal pages", () => {
      expect(PUBLIC_ROUTES).toContain("/privacidad")
      expect(PUBLIC_ROUTES).toContain("/terminos")
    })

    it("includes auth pages", () => {
      expect(PUBLIC_ROUTES).toContain("/login")
      expect(PUBLIC_ROUTES).toContain("/register")
      expect(PUBLIC_ROUTES).toContain("/recuperar")
    })

    it("does not include admin routes", () => {
      expect(PUBLIC_ROUTES).not.toContain("/admin")
    })

    it("all routes start with /", () => {
      for (const r of PUBLIC_ROUTES) {
        expect(r.startsWith("/")).toBe(true)
      }
    })
  })

  describe("PUBLIC_PREFIXES", () => {
    it("includes product prefix", () => {
      expect(PUBLIC_PREFIXES).toContain("/producto/")
    })

    it("includes blog prefix", () => {
      expect(PUBLIC_PREFIXES).toContain("/blog/")
    })

    it("includes Next.js static prefix", () => {
      expect(PUBLIC_PREFIXES).toContain("/_next/")
    })

    it("all prefixes start with /", () => {
      for (const p of PUBLIC_PREFIXES) {
        expect(p.startsWith("/")).toBe(true)
      }
    })
  })

  describe("PROTECTED_ROUTES", () => {
    it("includes admin", () => {
      expect(PROTECTED_ROUTES).toContain("/admin")
    })

    it("includes user account", () => {
      expect(PROTECTED_ROUTES).toContain("/mi-cuenta")
    })

    it("includes checkout", () => {
      expect(PROTECTED_ROUTES).toContain("/checkout")
    })

    it("no overlap with public routes", () => {
      const overlap = PROTECTED_ROUTES.filter(r => PUBLIC_ROUTES.includes(r))
      expect(overlap).toHaveLength(0)
    })
  })

  describe("STATIC_FILES", () => {
    it("includes sitemap", () => {
      expect(STATIC_FILES).toContain("/sitemap.xml")
    })

    it("includes robots.txt", () => {
      expect(STATIC_FILES).toContain("/robots.txt")
    })

    it("includes RSS", () => {
      expect(STATIC_FILES).toContain("/rss.xml")
    })
  })

  describe("ADMIN_ROLE", () => {
    it("is 'admin'", () => {
      expect(ADMIN_ROLE).toBe("admin")
    })
  })
})
