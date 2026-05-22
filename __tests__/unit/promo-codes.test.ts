/**
 * Promo Code Logic Tests — pure functions, localStorage mock.
 *
 * Tests: validatePromo, applyPromo, promo code data integrity
 */
import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import { createLocalStorageMock } from "../test-helpers/helpers"

// ─── Inline promo logic (mirrors lib/promo-codes.ts) ──────────────
interface PromoCode {
  code: string
  type: "percentage" | "fixed"
  value: number
  minPurchase: number
  maxUses: number
  usedCount: number
  expiresAt: number | null
}

const DEFAULT_PROMOS: PromoCode[] = [
  { code: "BIENVENIDO10", type: "percentage", value: 10, minPurchase: 100000, maxUses: 100, usedCount: 0, expiresAt: null },
  { code: "ENVIOGRATIS", type: "fixed", value: 15000, minPurchase: 500000, maxUses: 50, usedCount: 0, expiresAt: null },
]

function validatePromo(code: string, cartTotal: number, promos: PromoCode[]): { ok: boolean; error?: string; promo?: PromoCode } {
  const p = promos.find((x) => x.code.toUpperCase() === code.toUpperCase())
  if (!p) return { ok: false, error: "Código inválido" }
  if (p.expiresAt && p.expiresAt < Date.now()) return { ok: false, error: "Código expirado" }
  if (p.usedCount >= p.maxUses) return { ok: false, error: "Código agotado" }
  if (cartTotal < p.minPurchase) return { ok: false, error: `Mínimo Gs. ${p.minPurchase.toLocaleString("es-PY")}` }
  return { ok: true, promo: p }
}

function applyPromo(total: number, promo: PromoCode): number {
  if (promo.type === "percentage") return total - (total * promo.value) / 100
  return Math.max(0, total - promo.value)
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Promo Codes", () => {
  // ─── validatePromo ─────────────────────────────────────────────
  describe("validatePromo", () => {
    it("accepts valid promo code", () => {
      const result = validatePromo("BIENVENIDO10", 200000, DEFAULT_PROMOS)
      expect(result.ok).toBe(true)
      expect(result.promo?.code).toBe("BIENVENIDO10")
    })

    it("case-insensitive matching", () => {
      const result = validatePromo("bienvenido10", 200000, DEFAULT_PROMOS)
      expect(result.ok).toBe(true)
    })

    it("rejects invalid code", () => {
      const result = validatePromo("FAKECODE", 200000, DEFAULT_PROMOS)
      expect(result.ok).toBe(false)
      expect(result.error).toContain("inválido")
    })

    it("rejects expired code", () => {
      const promos = [{ ...DEFAULT_PROMOS[0], expiresAt: Date.now() - 1000 }]
      const result = validatePromo("BIENVENIDO10", 200000, promos)
      expect(result.ok).toBe(false)
      expect(result.error).toContain("expirado")
    })

    it("accepts non-expired code", () => {
      const promos = [{ ...DEFAULT_PROMOS[0], expiresAt: Date.now() + 100000 }]
      const result = validatePromo("BIENVENIDO10", 200000, promos)
      expect(result.ok).toBe(true)
    })

    it("accepts code with null expiry (never expires)", () => {
      const result = validatePromo("BIENVENIDO10", 200000, DEFAULT_PROMOS)
      expect(result.ok).toBe(true)
    })

    it("rejects exhausted code", () => {
      const promos = [{ ...DEFAULT_PROMOS[0], usedCount: 100, maxUses: 100 }]
      const result = validatePromo("BIENVENIDO10", 200000, promos)
      expect(result.ok).toBe(false)
      expect(result.error).toContain("agotado")
    })

    it("accepts code at max-1 uses", () => {
      const promos = [{ ...DEFAULT_PROMOS[0], usedCount: 99, maxUses: 100 }]
      const result = validatePromo("BIENVENIDO10", 200000, promos)
      expect(result.ok).toBe(true)
    })

    it("rejects if cart below minimum purchase", () => {
      const result = validatePromo("BIENVENIDO10", 50000, DEFAULT_PROMOS)
      expect(result.ok).toBe(false)
      expect(result.error).toContain("Mínimo")
    })

    it("accepts if cart exactly at minimum purchase", () => {
      const result = validatePromo("BIENVENIDO10", 100000, DEFAULT_PROMOS)
      expect(result.ok).toBe(true)
    })

    it("rejects if cart at minimum - 1", () => {
      const result = validatePromo("BIENVENIDO10", 99999, DEFAULT_PROMOS)
      expect(result.ok).toBe(false)
    })

    it("ENVIOGRATIS requires Gs. 500.000 minimum", () => {
      expect(validatePromo("ENVIOGRATIS", 499999, DEFAULT_PROMOS).ok).toBe(false)
      expect(validatePromo("ENVIOGRATIS", 500000, DEFAULT_PROMOS).ok).toBe(true)
    })

    it("error message includes formatted minimum", () => {
      const result = validatePromo("ENVIOGRATIS", 100000, DEFAULT_PROMOS)
      expect(result.error).toContain("Gs.")
      expect(result.error).toContain("500.000")
    })
  })

  // ─── applyPromo ────────────────────────────────────────────────
  describe("applyPromo", () => {
    it("applies percentage discount", () => {
      const promo: PromoCode = { code: "TEST", type: "percentage", value: 10, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(1000000, promo)).toBe(900000)
    })

    it("applies 50% discount", () => {
      const promo: PromoCode = { code: "HALF", type: "percentage", value: 50, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(800000, promo)).toBe(400000)
    })

    it("applies fixed discount", () => {
      const promo: PromoCode = { code: "SHIP", type: "fixed", value: 15000, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(500000, promo)).toBe(485000)
    })

    it("clamps to 0 (no negative totals)", () => {
      const promo: PromoCode = { code: "BIG", type: "fixed", value: 999999, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(100, promo)).toBe(0)
    })

    it("fixed discount exactly equal to total → 0", () => {
      const promo: PromoCode = { code: "EXACT", type: "fixed", value: 500000, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(500000, promo)).toBe(0)
    })

    it("0% discount returns same total", () => {
      const promo: PromoCode = { code: "ZERO", type: "percentage", value: 0, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(500000, promo)).toBe(500000)
    })

    it("0 fixed discount returns same total", () => {
      const promo: PromoCode = { code: "ZERO", type: "fixed", value: 0, minPurchase: 0, maxUses: 999, usedCount: 0, expiresAt: null }
      expect(applyPromo(500000, promo)).toBe(500000)
    })
  })

  // ─── Default data integrity ────────────────────────────────────
  describe("Default promos", () => {
    it("has BIENVENIDO10 as 10% percentage", () => {
      const p = DEFAULT_PROMOS.find(x => x.code === "BIENVENIDO10")!
      expect(p.type).toBe("percentage")
      expect(p.value).toBe(10)
    })

    it("has ENVIOGRATIS as fixed 15000", () => {
      const p = DEFAULT_PROMOS.find(x => x.code === "ENVIOGRATIS")!
      expect(p.type).toBe("fixed")
      expect(p.value).toBe(15000)
    })

    it("all default promos have positive maxUses", () => {
      for (const p of DEFAULT_PROMOS) {
        expect(p.maxUses).toBeGreaterThan(0)
      }
    })

    it("all default promos start with 0 uses", () => {
      for (const p of DEFAULT_PROMOS) {
        expect(p.usedCount).toBe(0)
      }
    })

    it("all default promos have non-negative minPurchase", () => {
      for (const p of DEFAULT_PROMOS) {
        expect(p.minPurchase).toBeGreaterThanOrEqual(0)
      }
    })
  })
})
