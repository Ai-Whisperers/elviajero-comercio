import { validatePromo, getPromoCodes } from "@/lib/promo-codes"

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, "localStorage", { value: localStorageMock })

describe("Promo Codes", () => {
  beforeEach(() => localStorage.clear())

  it("should validate BIENVENIDO10 promo code", () => {
    const result = validatePromo("BIENVENIDO10", 200000)
    expect(result.ok).toBe(true)
    expect(result.promo?.value).toBe(10)
  })

  it("should reject invalid promo code", () => {
    const result = validatePromo("INVALID", 200000)
    expect(result.ok).toBe(false)
  })

  it("should reject promo when cart total is below minimum", () => {
    const result = validatePromo("BIENVENIDO10", 50000)
    expect(result.ok).toBe(false)
  })
})
