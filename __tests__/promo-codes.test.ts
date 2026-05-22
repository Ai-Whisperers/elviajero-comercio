import { describe, it, expect } from "@jest/globals"
import { validatePromo, applyPromo, getPromoCodes } from "@/lib/promo-codes"

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

describe("Promo Codes — validation", () => {
  beforeEach(() => localStorage.clear())

  it("accepts BIENVENIDO10 with sufficient cart", () => {
    const r = validatePromo("BIENVENIDO10", 200000)
    expect(r.ok).toBe(true)
    expect(r.promo?.value).toBe(10)
    expect(r.promo?.type).toBe("percentage")
  })

  it("accepts case-insensitive codes", () => {
    expect(validatePromo("bienvenido10", 200000).ok).toBe(true)
    expect(validatePromo("Bienvenido10", 200000).ok).toBe(true)
  })

  it("rejects invalid promo code", () => {
    const r = validatePromo("INVALID", 200000)
    expect(r.ok).toBe(false)
    expect(r.error).toBeTruthy()
  })

  it("rejects when cart below minimum", () => {
    const r = validatePromo("BIENVENIDO10", 50000)
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/mínimo/i)
  })

  it("accepts ENVIOGRATIS for high-value carts", () => {
    const r = validatePromo("ENVIOGRATIS", 600000)
    expect(r.ok).toBe(true)
    expect(r.promo?.type).toBe("fixed")
    expect(r.promo?.value).toBe(15000)
  })

  it("rejects ENVIOGRATIS below minimum", () => {
    expect(validatePromo("ENVIOGRATIS", 400000).ok).toBe(false)
  })
})

describe("Promo Codes — application", () => {
  it("applies percentage discount", () => {
    expect(applyPromo(200000, { type: "percentage", value: 10 } as any)).toBe(180000)
  })

  it("applies fixed discount", () => {
    expect(applyPromo(500000, { type: "fixed", value: 15000 } as any)).toBe(485000)
  })

  it("fixed discount cannot go below zero", () => {
    expect(applyPromo(10000, { type: "fixed", value: 50000 } as any)).toBe(0)
  })

  it("25% discount", () => {
    expect(applyPromo(400000, { type: "percentage", value: 25 } as any)).toBe(300000)
  })
})

describe("Promo Codes — defaults", () => {
  beforeEach(() => localStorage.clear())

  it("returns default promos when none saved", () => {
    const codes = getPromoCodes()
    expect(codes.length).toBeGreaterThanOrEqual(2)
    expect(codes.find(c => c.code === "BIENVENIDO10")).toBeDefined()
    expect(codes.find(c => c.code === "ENVIOGRATIS")).toBeDefined()
  })

  it("persists defaults to localStorage", () => {
    getPromoCodes()
    const saved = localStorage.getItem("ej_promos")
    expect(saved).toBeTruthy()
    expect(JSON.parse(saved!).length).toBeGreaterThanOrEqual(2)
  })
})
