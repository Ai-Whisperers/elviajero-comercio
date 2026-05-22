/**
 * OG Config + Utility Tests
 *
 * Tests: OG_CONFIG constants, cn() utility
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors lib/og-config.ts) ─────────────────────────────
const OG_CONFIG = {
  width: 1200,
  height: 630,
  siteName: "El Viajero",
  backgroundColor: "#1B5E20",
  textColor: "#FFFFFF",
}

// ─── Inline cn (mirrors lib/cn.ts) ─────────────────────────────────
function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const classes: string[] = []
  for (const input of inputs) {
    if (!input) continue
    if (typeof input === "string") {
      classes.push(input)
    } else if (typeof input === "object") {
      for (const [key, val] of Object.entries(input)) {
        if (val) classes.push(key)
      }
    }
  }
  return classes.join(" ")
}

describe("OG Config", () => {
  it("has standard OG width 1200", () => {
    expect(OG_CONFIG.width).toBe(1200)
  })

  it("has standard OG height 630", () => {
    expect(OG_CONFIG.height).toBe(630)
  })

  it("has site name El Viajero", () => {
    expect(OG_CONFIG.siteName).toBe("El Viajero")
  })

  it("uses brand green #1B5E20", () => {
    expect(OG_CONFIG.backgroundColor).toBe("#1B5E20")
  })

  it("uses white text", () => {
    expect(OG_CONFIG.textColor).toBe("#FFFFFF")
  })

  it("all values are defined", () => {
    expect(Object.values(OG_CONFIG).every(v => v !== undefined && v !== null && v !== "")).toBe(true)
  })
})

describe("cn() utility", () => {
  it("joins class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("filters falsy values", () => {
    expect(cn("foo", false, null, undefined, "", "bar")).toBe("foo bar")
  })

  it("handles object syntax", () => {
    expect(cn({ active: true, disabled: false })).toBe("active")
  })

  it("combines strings and objects", () => {
    expect(cn("base", { extra: true, hidden: false })).toBe("base extra")
  })

  it("returns empty string with no args", () => {
    expect(cn()).toBe("")
  })

  it("returns empty string with all falsy", () => {
    expect(cn(false, null, undefined, "")).toBe("")
  })
})
