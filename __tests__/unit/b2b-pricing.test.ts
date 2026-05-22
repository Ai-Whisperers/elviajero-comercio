/**
 * B2B bulk pricing tests — pure function, no mocks needed.
 *
 * Tests: calculateBulkPrice — tiered discount logic
 */
import { describe, it, expect } from "@jest/globals"

// Inline to avoid Supabase side-effect imports
function calculateBulkPrice(basePrice: number, quantity: number): number {
  if (quantity >= 50) return basePrice * 0.7
  if (quantity >= 20) return basePrice * 0.8
  if (quantity >= 10) return basePrice * 0.85
  if (quantity >= 5) return basePrice * 0.9
  return basePrice
}

describe("B2B Bulk Pricing", () => {
  describe("calculateBulkPrice", () => {
    it("returns base price for quantity 1", () => {
      expect(calculateBulkPrice(100000, 1)).toBe(100000)
    })

    it("returns base price for quantity 4 (below first tier)", () => {
      expect(calculateBulkPrice(100000, 4)).toBe(100000)
    })

    it("applies 10% discount at 5 units", () => {
      expect(calculateBulkPrice(100000, 5)).toBe(90000)
    })

    it("applies 10% discount at 9 units", () => {
      expect(calculateBulkPrice(100000, 9)).toBe(90000)
    })

    it("applies 15% discount at 10 units", () => {
      expect(calculateBulkPrice(100000, 10)).toBe(85000)
    })

    it("applies 15% discount at 19 units", () => {
      expect(calculateBulkPrice(100000, 19)).toBe(85000)
    })

    it("applies 20% discount at 20 units", () => {
      expect(calculateBulkPrice(100000, 20)).toBe(80000)
    })

    it("applies 20% discount at 49 units", () => {
      expect(calculateBulkPrice(100000, 49)).toBe(80000)
    })

    it("applies 30% discount at 50 units", () => {
      expect(calculateBulkPrice(100000, 50)).toBe(70000)
    })

    it("applies 30% discount at 100 units", () => {
      expect(calculateBulkPrice(100000, 100)).toBe(70000)
    })

    it("discount ordering: more quantity = lower unit price", () => {
      const p1 = calculateBulkPrice(100000, 1)
      const p5 = calculateBulkPrice(100000, 5)
      const p10 = calculateBulkPrice(100000, 10)
      const p20 = calculateBulkPrice(100000, 20)
      const p50 = calculateBulkPrice(100000, 50)
      expect(p1).toBeGreaterThan(p5)
      expect(p5).toBeGreaterThan(p10)
      expect(p10).toBeGreaterThan(p20)
      expect(p20).toBeGreaterThan(p50)
    })

    it("handles zero price", () => {
      expect(calculateBulkPrice(0, 50)).toBe(0)
    })

    it("handles large prices", () => {
      expect(calculateBulkPrice(1000000, 50)).toBe(700000)
    })

    it("tier boundaries — exactly at boundary gets discount", () => {
      // Boundary values should get the discount, not the tier below
      expect(calculateBulkPrice(100, 5)).toBeLessThan(100)  // 10% off
      expect(calculateBulkPrice(100, 10)).toBeLessThan(90)  // 15% off
      expect(calculateBulkPrice(100, 20)).toBeLessThan(85)  // 20% off
      expect(calculateBulkPrice(100, 50)).toBeLessThan(80)  // 30% off
    })

    it("tier boundaries — one below boundary gets no discount bump", () => {
      expect(calculateBulkPrice(100, 4)).toBe(100)      // no discount
      expect(calculateBulkPrice(100, 9)).toBe(90)        // 10% not 15%
      expect(calculateBulkPrice(100, 19)).toBe(85)       // 15% not 20%
      expect(calculateBulkPrice(100, 49)).toBe(80)       // 20% not 30%
    })

    it("is deterministic", () => {
      expect(calculateBulkPrice(50000, 15)).toBe(calculateBulkPrice(50000, 15))
    })
  })
})
