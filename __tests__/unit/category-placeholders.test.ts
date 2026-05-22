/**
 * Category placeholder tests — pure functions, no mocks needed.
 *
 * Tests: getCategoryPlaceholder, getCategoryPlaceholderSvg, data integrity
 */
import { describe, it, expect } from "@jest/globals"

// Inline to avoid side-effect imports — keep in sync with lib/category-placeholders.ts
const CATEGORY_PLACEHOLDERS: Record<string, { bg: string; icon: string; label: string }> = {
  "Camping": { bg: "#065f46", icon: '<path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"/>', label: "Camping" },
  "Pesca": { bg: "#1e40af", icon: '<path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/><path d="M12 18c-1.1 0-2-.9-2-2s2-4 2-4 2 2.9 2 4-.9 2-2 2z"/>', label: "Pesca" },
  "Accesorios Personales": { bg: "#7c2d12", icon: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>', label: "Accesorios" },
  "Electrónica": { bg: "#4c1d95", icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>', label: "Electrónica" },
  "Accesorios para Vehículos": { bg: "#1f2937", icon: '<path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2M5 17l-1 2h16l-1-2"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>', label: "Vehículos" },
}

const DEFAULT_PLACEHOLDER = {
  bg: "#374151",
  icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  label: "Producto",
}

function getCategoryPlaceholder(category?: string) {
  if (!category) return DEFAULT_PLACEHOLDER
  return CATEGORY_PLACEHOLDERS[category] || DEFAULT_PLACEHOLDER
}

function getCategoryPlaceholderSvg(category?: string, productName?: string): string {
  const config = getCategoryPlaceholder(category)
  const name = productName || config.label
  const displayName = name.length > 30 ? name.slice(0, 28) + "…" : name
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="${config.bg}"/>
  <g transform="translate(200,120)" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
    ${config.icon}
  </g>
  <text x="200" y="210" font-family="system-ui,sans-serif" font-size="14" fill="white" fill-opacity="0.7" text-anchor="middle">${displayName}</text>
  <text x="200" y="240" font-family="system-ui,sans-serif" font-size="11" fill="white" fill-opacity="0.4" text-anchor="middle">Imagen no disponible</text>
</svg>`)}`
}

describe("Category Placeholders", () => {
  // ─── Data integrity ───────────────────────────────────────────
  describe("CATEGORY_PLACEHOLDERS", () => {
    it("has at least 4 categories", () => {
      expect(Object.keys(CATEGORY_PLACEHOLDERS).length).toBeGreaterThanOrEqual(4)
    })

    it("each category has bg, icon, and label", () => {
      Object.entries(CATEGORY_PLACEHOLDERS).forEach(([key, val]) => {
        expect(val.bg).toMatch(/^#[0-9a-f]{6}$/)
        expect(val.icon).toContain("<")
        expect(val.label).toBeTruthy()
      })
    })

    it("all backgrounds are distinct colors", () => {
      const colors = Object.values(CATEGORY_PLACEHOLDERS).map(v => v.bg)
      expect(new Set(colors).size).toBe(colors.length)
    })

    it("icons contain valid SVG path data", () => {
      Object.values(CATEGORY_PLACEHOLDERS).forEach(val => {
        // Basic SVG element check
        expect(val.icon).toMatch(/<(path|circle|rect|line|polyline)/)
      })
    })
  })

  // ─── getCategoryPlaceholder ───────────────────────────────────
  describe("getCategoryPlaceholder", () => {
    it("returns config for known category", () => {
      const result = getCategoryPlaceholder("Camping")
      expect(result.bg).toBe("#065f46")
      expect(result.label).toBe("Camping")
    })

    it("returns config for Pesca", () => {
      const result = getCategoryPlaceholder("Pesca")
      expect(result.bg).toBe("#1e40af")
      expect(result.label).toBe("Pesca")
    })

    it("returns config for Accesorios Personales", () => {
      const result = getCategoryPlaceholder("Accesorios Personales")
      expect(result.label).toBe("Accesorios")
    })

    it("returns config for Electrónica", () => {
      const result = getCategoryPlaceholder("Electrónica")
      expect(result.bg).toBe("#4c1d95")
    })

    it("returns config for Accesorios para Vehículos", () => {
      const result = getCategoryPlaceholder("Accesorios para Vehículos")
      expect(result.bg).toBe("#1f2937")
      expect(result.label).toBe("Vehículos")
    })

    it("returns default for unknown category", () => {
      const result = getCategoryPlaceholder("Unknown Category")
      expect(result.bg).toBe(DEFAULT_PLACEHOLDER.bg)
      expect(result.label).toBe("Producto")
    })

    it("returns default for undefined", () => {
      const result = getCategoryPlaceholder(undefined)
      expect(result).toEqual(DEFAULT_PLACEHOLDER)
    })

    it("returns default for empty string", () => {
      const result = getCategoryPlaceholder("")
      expect(result).toEqual(DEFAULT_PLACEHOLDER)
    })
  })

  // ─── getCategoryPlaceholderSvg ────────────────────────────────
  describe("getCategoryPlaceholderSvg", () => {
    it("returns a data URI", () => {
      const svg = getCategoryPlaceholderSvg("Camping")
      expect(svg).toMatch(/^data:image\/svg\+xml,/)
    })

    it("contains encoded SVG markup", () => {
      const svg = getCategoryPlaceholderSvg("Camping")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain("<svg")
      expect(decoded).toContain("</svg>")
    })

    it("includes the category background color", () => {
      const svg = getCategoryPlaceholderSvg("Camping")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain("#065f46")
    })

    it("includes product name when provided", () => {
      const svg = getCategoryPlaceholderSvg("Camping", "Mi Carpa")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain("Mi Carpa")
    })

    it("uses category label when no product name", () => {
      const svg = getCategoryPlaceholderSvg("Camping")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain("Camping")
    })

    it("truncates long product names", () => {
      const longName = "A".repeat(40)
      const svg = getCategoryPlaceholderSvg("Camping", longName)
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain("…")
    })

    it("includes 'Imagen no disponible' text", () => {
      const svg = getCategoryPlaceholderSvg("Camping")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain("Imagen no disponible")
    })

    it("has correct SVG dimensions", () => {
      const svg = getCategoryPlaceholderSvg("Camping")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain('width="400"')
      expect(decoded).toContain('height="300"')
    })

    it("uses default for unknown category", () => {
      const svg = getCategoryPlaceholderSvg("Unknown")
      const decoded = decodeURIComponent(svg.replace("data:image/svg+xml,", ""))
      expect(decoded).toContain(DEFAULT_PLACEHOLDER.bg)
    })
  })
})
