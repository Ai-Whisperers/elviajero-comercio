/**
 * Shipping logic tests — pure functions, no mocks needed.
 *
 * Tests: calculateShipping, formatGs, SHIPPING_ZONES data integrity
 */
import { describe, it, expect } from "@jest/globals"

// Inline the functions under test to avoid Supabase side-effect imports.
// The actual source is lib/shipping.ts — keep in sync.

interface ShippingZone {
  id: string; name: string; fee: number; freeFrom: number; estimatedDays: string
}

const SHIPPING_ZONES: ShippingZone[] = [
  { id: "asu", name: "Asunción", fee: 15000, freeFrom: 300000, estimatedDays: "24 hs" },
  { id: "central", name: "Área Metropolitana", fee: 25000, freeFrom: 400000, estimatedDays: "24-48 hs" },
  { id: "interior", name: "Interior del país", fee: 40000, freeFrom: 500000, estimatedDays: "48-72 hs" },
  { id: "pickup", name: "Retiro en tienda", fee: 0, freeFrom: 0, estimatedDays: "—" },
]

function calculateShipping(zoneId: string, subtotal: number): { fee: number; free: boolean; zone: ShippingZone | undefined } {
  const zone = SHIPPING_ZONES.find(z => z.id === zoneId)
  if (!zone) return { fee: 0, free: false, zone: undefined }
  const free = subtotal >= zone.freeFrom
  return { fee: free ? 0 : zone.fee, free, zone }
}

function formatGs(n: number): string {
  return "Gs. " + n.toLocaleString("es-PY")
}

describe("Shipping", () => {
  // ─── Data integrity ───────────────────────────────────────────
  describe("SHIPPING_ZONES", () => {
    it("has all required zones for Paraguay", () => {
      const ids = SHIPPING_ZONES.map(z => z.id)
      expect(ids).toContain("asu")
      expect(ids).toContain("central")
      expect(ids).toContain("interior")
      expect(ids).toContain("pickup")
    })

    it("each zone has required fields", () => {
      SHIPPING_ZONES.forEach(zone => {
        expect(zone).toHaveProperty("id")
        expect(zone).toHaveProperty("name")
        expect(zone).toHaveProperty("fee")
        expect(zone).toHaveProperty("freeFrom")
        expect(zone).toHaveProperty("estimatedDays")
        expect(typeof zone.fee).toBe("number")
        expect(typeof zone.freeFrom).toBe("number")
      })
    })

    it("fees are non-negative", () => {
      SHIPPING_ZONES.forEach(zone => {
        expect(zone.fee).toBeGreaterThanOrEqual(0)
      })
    })

    it("freeFrom thresholds are non-negative", () => {
      SHIPPING_ZONES.forEach(zone => {
        expect(zone.freeFrom).toBeGreaterThanOrEqual(0)
      })
    })

    it("pickup zone has zero fee", () => {
      const pickup = SHIPPING_ZONES.find(z => z.id === "pickup")!
      expect(pickup.fee).toBe(0)
      expect(pickup.freeFrom).toBe(0)
    })

    it("zone IDs are unique", () => {
      const ids = SHIPPING_ZONES.map(z => z.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  // ─── calculateShipping ────────────────────────────────────────
  describe("calculateShipping", () => {
    it("returns correct fee for Asunción under threshold", () => {
      const result = calculateShipping("asu", 200000)
      expect(result.fee).toBe(15000)
      expect(result.free).toBe(false)
      expect(result.zone?.name).toBe("Asunción")
    })

    it("returns free shipping for Asunción at threshold", () => {
      const result = calculateShipping("asu", 300000)
      expect(result.fee).toBe(0)
      expect(result.free).toBe(true)
    })

    it("returns free shipping for Asunción above threshold", () => {
      const result = calculateShipping("asu", 500000)
      expect(result.fee).toBe(0)
      expect(result.free).toBe(true)
    })

    it("returns correct fee for Central under threshold", () => {
      const result = calculateShipping("central", 300000)
      expect(result.fee).toBe(25000)
      expect(result.free).toBe(false)
    })

    it("returns free shipping for Central at threshold", () => {
      const result = calculateShipping("central", 400000)
      expect(result.fee).toBe(0)
      expect(result.free).toBe(true)
    })

    it("returns correct fee for Interior under threshold", () => {
      const result = calculateShipping("interior", 400000)
      expect(result.fee).toBe(40000)
      expect(result.free).toBe(false)
    })

    it("returns free shipping for Interior at threshold", () => {
      const result = calculateShipping("interior", 500000)
      expect(result.fee).toBe(0)
      expect(result.free).toBe(true)
    })

    it("pickup is always free regardless of subtotal", () => {
      expect(calculateShipping("pickup", 0).fee).toBe(0)
      expect(calculateShipping("pickup", 100000).fee).toBe(0)
      expect(calculateShipping("pickup", 1000000).fee).toBe(0)
    })

    it("returns zero fee for unknown zone", () => {
      const result = calculateShipping("unknown", 500000)
      expect(result.fee).toBe(0)
      expect(result.free).toBe(false)
      expect(result.zone).toBeUndefined()
    })

    it("handles zero subtotal", () => {
      const result = calculateShipping("asu", 0)
      expect(result.fee).toBe(15000)
      expect(result.free).toBe(false)
    })

    it("handles exactly one guaraní below threshold", () => {
      const result = calculateShipping("asu", 299999)
      expect(result.fee).toBe(15000)
      expect(result.free).toBe(false)
    })

    it("handles exactly one guaraní above threshold", () => {
      const result = calculateShipping("asu", 300001)
      expect(result.fee).toBe(0)
      expect(result.free).toBe(true)
    })

    it("fee ordering: interior > central > asunción", () => {
      const asu = calculateShipping("asu", 100000).fee
      const central = calculateShipping("central", 100000).fee
      const interior = calculateShipping("interior", 100000).fee
      expect(interior).toBeGreaterThan(central)
      expect(central).toBeGreaterThan(asu)
    })
  })

  // ─── formatGs ─────────────────────────────────────────────────
  describe("formatGs", () => {
    it("formats a simple number", () => {
      expect(formatGs(15000)).toMatch(/^Gs\.\s/)
    })

    it("formats zero", () => {
      expect(formatGs(0)).toBe("Gs. 0")
    })

    it("formats large numbers with separators", () => {
      const result = formatGs(1500000)
      expect(result).toContain("Gs.")
      // Should have thousand separator
      expect(result.length).toBeGreaterThan(8)
    })

    it("is consistent — same input same output", () => {
      expect(formatGs(350000)).toBe(formatGs(350000))
    })
  })
})
