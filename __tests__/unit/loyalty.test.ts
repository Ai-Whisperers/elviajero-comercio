/**
 * Loyalty program tests — pure functions, no mocks needed.
 *
 * Tests: tier calculation, referral codes, constants
 */
import { describe, it, expect } from "@jest/globals"

const LOYALTY_POINTS_PER_GS = 0.01
const LOYALTY_GS_PER_POINT = 50

interface LoyaltyTier { name: string; minPoints: number; multiplier: number; color: string }

const TIERS: LoyaltyTier[] = [
  { name: "Bronce", minPoints: 0, multiplier: 1, color: "#CD7F32" },
  { name: "Plata", minPoints: 1000, multiplier: 1.2, color: "#C0C0C0" },
  { name: "Oro", minPoints: 5000, multiplier: 1.5, color: "#FFD700" },
  { name: "Platino", minPoints: 20000, multiplier: 2, color: "#E5E4E2" },
]

function referralCode(userId: string): string {
  return "VIAJERO-" + userId.slice(0, 6).toUpperCase()
}

function getTierForPoints(total: number): LoyaltyTier {
  return [...TIERS].reverse().find(t => total >= t.minPoints) || TIERS[0]
}

function calculatePoints(orderTotal: number): number {
  return Math.floor(orderTotal * LOYALTY_POINTS_PER_GS)
}

describe("Loyalty Program", () => {
  describe("TIERS", () => {
    it("starts with Bronce at 0 points", () => {
      expect(TIERS[0].name).toBe("Bronce")
      expect(TIERS[0].minPoints).toBe(0)
    })

    it("tiers are in ascending point order", () => {
      for (let i = 1; i < TIERS.length; i++) {
        expect(TIERS[i].minPoints).toBeGreaterThan(TIERS[i - 1].minPoints)
      }
    })

    it("multipliers increase with tier", () => {
      for (let i = 1; i < TIERS.length; i++) {
        expect(TIERS[i].multiplier).toBeGreaterThan(TIERS[i - 1].multiplier)
      }
    })

    it("each tier has required fields", () => {
      TIERS.forEach(tier => {
        expect(tier.name).toBeTruthy()
        expect(tier.minPoints).toBeGreaterThanOrEqual(0)
        expect(tier.multiplier).toBeGreaterThan(0)
        expect(tier.color).toMatch(/^#[0-9a-fA-F]{6}$/)
      })
    })
  })

  describe("getTierForPoints", () => {
    it("0 points → Bronce", () => {
      expect(getTierForPoints(0).name).toBe("Bronce")
    })

    it("999 points → Bronce", () => {
      expect(getTierForPoints(999).name).toBe("Bronce")
    })

    it("1000 points → Plata", () => {
      expect(getTierForPoints(1000).name).toBe("Plata")
    })

    it("4999 points → Plata", () => {
      expect(getTierForPoints(4999).name).toBe("Plata")
    })

    it("5000 points → Oro", () => {
      expect(getTierForPoints(5000).name).toBe("Oro")
    })

    it("19999 points → Oro", () => {
      expect(getTierForPoints(19999).name).toBe("Oro")
    })

    it("20000 points → Platino", () => {
      expect(getTierForPoints(20000).name).toBe("Platino")
    })

    it("100000 points → Platino", () => {
      expect(getTierForPoints(100000).name).toBe("Platino")
    })
  })

  describe("calculatePoints", () => {
    it("Gs. 100.000 → 1000 points", () => {
      expect(calculatePoints(100000)).toBe(1000)
    })

    it("Gs. 350.000 → 3500 points", () => {
      expect(calculatePoints(350000)).toBe(3500)
    })

    it("Gs. 0 → 0 points", () => {
      expect(calculatePoints(0)).toBe(0)
    })

    it("Gs. 50 → 0 points (floors to 0)", () => {
      expect(calculatePoints(50)).toBe(0)
    })

    it("Gs. 99 → 0 points (floors)", () => {
      expect(calculatePoints(99)).toBe(0)
    })

    it("Gs. 100 → 1 point", () => {
      expect(calculatePoints(100)).toBe(1)
    })

    it("Gs. 1.000.000 → 10000 points", () => {
      expect(calculatePoints(1000000)).toBe(10000)
    })
  })

  describe("referralCode", () => {
    it("generates VIAJERO- prefix code", () => {
      expect(referralCode("abc123def")).toMatch(/^VIAJERO-/)
    })

    it("uses first 6 chars of userId uppercase", () => {
      expect(referralCode("abc123def")).toBe("VIAJERO-ABC123")
    })

    it("handles short userId", () => {
      expect(referralCode("ab")).toBe("VIAJERO-AB")
    })

    it("handles userId with special chars", () => {
      const code = referralCode("user-123-456")
      expect(code).toBe("VIAJERO-USER-1")
    })

    it("is deterministic", () => {
      expect(referralCode("test123")).toBe(referralCode("test123"))
    })
  })
})
