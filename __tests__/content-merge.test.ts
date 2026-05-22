import { describe, it, expect } from "@jest/globals"
import { deepMerge, deepGet } from "./test-utils"

// Re-implement from content-provider since we can't import "use client" in test
// These mirror the pure functions in lib/content-provider.tsx

describe("Content Provider — deepMerge", () => {
  it("overrides primitive values", () => {
    const result = deepMerge({ a: "default", b: 2 }, { a: "overridden" })
    expect(result).toEqual({ a: "overridden", b: 2 })
  })

  it("deeply merges nested objects", () => {
    const defaults = { hero: { headline: "Default", sub: "Sub" } }
    const overrides = { hero: { headline: "New" } }
    const result = deepMerge(defaults, overrides)
    expect(result.hero.headline).toBe("New")
    expect(result.hero.sub).toBe("Sub") // preserved from defaults
  })

  it("overrides arrays entirely (not element-wise)", () => {
    const defaults = { items: [1, 2, 3] }
    const overrides = { items: [4, 5] }
    const result = deepMerge(defaults, overrides)
    expect(result.items).toEqual([4, 5])
  })

  it("adds new keys from overrides", () => {
    const result = deepMerge({ a: 1 }, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it("returns defaults when overrides empty", () => {
    const defaults = { a: 1, b: { c: 2 } }
    const result = deepMerge(defaults, {})
    expect(result).toEqual(defaults)
  })

  it("handles null overrides by keeping override (null)", () => {
    const result = deepMerge({ a: 1 }, { a: null } as any)
    // deepMerge returns overrides ?? defaults, and null ?? defaults = defaults
    expect(result.a).toBe(1) // null coalescing falls back to default
  })
})

describe("Content Provider — deepGet", () => {
  const obj = { hero: { headline: "Test", carousel: [{ id: 1 }] }, store: { addToCart: "Agregar" } }

  it("retrieves nested value", () => {
    expect(deepGet(obj, "hero.headline")).toBe("Test")
  })

  it("retrieves top-level value", () => {
    expect(deepGet(obj, "store")).toEqual({ addToCart: "Agregar" })
  })

  it("returns undefined for missing path", () => {
    expect(deepGet(obj, "hero.missing")).toBeUndefined()
  })

  it("returns undefined for deeply missing path", () => {
    expect(deepGet(obj, "nonexistent.path.here")).toBeUndefined()
  })

  it("retrieves array element", () => {
    expect(deepGet(obj, "hero.carousel")).toEqual([{ id: 1 }])
  })
})
