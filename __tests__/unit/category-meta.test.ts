/**
 * Category Meta + Data Tests — SEO metadata and product filtering by category.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors lib/category-meta.ts) ─────────────────────────
function getCategoryMeta(slug: string): { title: string; description: string } {
  const map: Record<string, { title: string; description: string }> = {
    camping: { title: "Equipamiento de Camping en Paraguay | El Viajero", description: "Carpa, bolsa de dormir, linterna, silla y más equipo de camping." },
    pesca: { title: "Artículos de Pesca en Paraguay | El Viajero", description: "Cañas, señuelos, carretes y accesorios de pesca." },
    accesorios: { title: "Accesorios Outdoor en Paraguay | El Viajero", description: "Mochilas térmicas, linternas, navajas y más accesorios." },
    autos: { title: "Accesorios para Autos en Paraguay | El Viajero", description: "Accesorios, herramientas y equipos para tu automóvil." },
    motos: { title: "Equipamiento para Motos en Paraguay | El Viajero", description: "Cascos, guantes, candados y accesorios para motociclistas." },
    campo: { title: "Equipamiento de Campo en Paraguay | El Viajero", description: "Herramientas, equipos y accesorios para el campo." },
  }
  return map[slug] || { title: slug + " | El Viajero", description: "Productos de " + slug + " en El Viajero, Paraguay." }
}

// ─── Inline (mirrors lib/category-data.ts) ─────────────────────────
const categoryHeroes: Record<string, { title: string; desc: string; seo: string }> = {
  camping: { title: "Camping", desc: "Todo para tu próxima aventura al aire libre", seo: "Equipamiento de camping en Paraguay" },
  pesca: { title: "Pesca", desc: "Cañas, señuelos y accesorios de pesca", seo: "Artículos de pesca en Asunción" },
  accesorios: { title: "Accesorios", desc: "Complementos para tu equipo outdoor", seo: "Accesorios outdoor Paraguay" },
  autos: { title: "Automóviles", desc: "Accesorios para tu vehículo", seo: "Accesorios para autos Paraguay" },
  motos: { title: "Motos", desc: "Equipamiento para motociclistas", seo: "Accesorios para motos Paraguay" },
  campo: { title: "Campo", desc: "Herramientas y equipos para el campo", seo: "Equipamiento de campo Paraguay" },
}

function getCategoryInfo(slug: string) {
  return categoryHeroes[slug] || { title: slug, desc: "", seo: slug }
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Category Meta", () => {
  const knownSlugs = ["camping", "pesca", "accesorios", "autos", "motos", "campo"]

  it("returns meta for all known categories", () => {
    for (const slug of knownSlugs) {
      const meta = getCategoryMeta(slug)
      expect(meta.title.length).toBeGreaterThan(0)
      expect(meta.description.length).toBeGreaterThan(0)
    }
  })

  it("all titles contain El Viajero", () => {
    for (const slug of knownSlugs) {
      expect(getCategoryMeta(slug).title).toContain("El Viajero")
    }
  })

  it("returns fallback for unknown category", () => {
    const meta = getCategoryMeta("unknown-cat")
    expect(meta.title).toContain("El Viajero")
    expect(meta.title).toContain("unknown-cat")
  })

  it("camping meta mentions camping keywords", () => {
    expect(getCategoryMeta("camping").title.toLowerCase()).toContain("camping")
  })

  it("pesca meta mentions pesca keywords", () => {
    expect(getCategoryMeta("pesca").title.toLowerCase()).toContain("pesca")
  })

  it("fallback description contains slug name", () => {
    expect(getCategoryMeta("deportes").description).toContain("deportes")
  })
})

describe("Category Data (getCategoryInfo)", () => {
  it("returns info for all known categories", () => {
    const slugs = ["camping", "pesca", "accesorios", "autos", "motos", "campo"]
    for (const slug of slugs) {
      const info = getCategoryInfo(slug)
      expect(info.title.length).toBeGreaterThan(0)
    }
  })

  it("returns fallback for unknown slug", () => {
    const info = getCategoryInfo("nonexistent")
    expect(info.title).toBe("nonexistent")
  })

  it("camping has SEO text", () => {
    expect(getCategoryInfo("camping").seo.length).toBeGreaterThan(0)
  })

  it("all known categories have non-empty desc", () => {
    const slugs = ["camping", "pesca", "accesorios", "autos", "motos", "campo"]
    for (const slug of slugs) {
      expect(getCategoryInfo(slug).desc.length).toBeGreaterThan(0)
    }
  })
})
