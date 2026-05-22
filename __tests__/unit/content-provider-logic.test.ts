/**
 * Content Provider Logic Tests — deepMerge, deepGet pure functions.
 *
 * Extracted from lib/content-provider.tsx — no React dependency.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Pure functions (mirrors lib/content-provider.tsx) ──────────────

function deepGet(obj: any, path: string): any {
  const parts = path.split(".")
  let cur = obj
  for (const p of parts) {
    if (cur?.[p] === undefined || cur?.[p] === null) return undefined
    cur = cur[p]
  }
  return cur
}

function deepMerge(defaults: any, overrides: any): any {
  if (typeof defaults !== "object" || defaults === null) return overrides ?? defaults
  if (typeof overrides !== "object" || overrides === null) return overrides ?? defaults
  if (Array.isArray(defaults) || Array.isArray(overrides)) return overrides ?? defaults

  const result: any = { ...defaults }
  for (const key of Object.keys(overrides)) {
    if (key in defaults) {
      result[key] = deepMerge(defaults[key], overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Content Provider Logic", () => {
  describe("deepGet", () => {
    const obj = {
      home: { title: "Bienvenido", sections: { hero: { text: "Aventura" } } },
      footer: { text: "El Viajero" },
      items: [1, 2, 3],
    }

    it("gets top-level value", () => {
      expect(deepGet(obj, "footer")).toEqual({ text: "El Viajero" })
    })

    it("gets nested value", () => {
      expect(deepGet(obj, "home.title")).toBe("Bienvenido")
    })

    it("gets deeply nested value", () => {
      expect(deepGet(obj, "home.sections.hero.text")).toBe("Aventura")
    })

    it("returns undefined for missing key", () => {
      expect(deepGet(obj, "nonexistent")).toBeUndefined()
    })

    it("returns undefined for missing nested path", () => {
      expect(deepGet(obj, "home.sections.missing")).toBeUndefined()
    })

    it("returns undefined for null in path", () => {
      expect(deepGet({ a: null }, "a.b")).toBeUndefined()
    })

    it("returns array by path", () => {
      expect(deepGet(obj, "items")).toEqual([1, 2, 3])
    })

    it("returns undefined for empty object", () => {
      expect(deepGet({}, "anything")).toBeUndefined()
    })

    it("handles single-level path", () => {
      expect(deepGet({ x: 42 }, "x")).toBe(42)
    })
  })

  describe("deepMerge", () => {
    it("merges flat objects", () => {
      const result = deepMerge({ a: 1, b: 2 }, { b: 3 })
      expect(result).toEqual({ a: 1, b: 3 })
    })

    it("merges nested objects recursively", () => {
      const result = deepMerge(
        { home: { title: "Old", subtitle: "Keep" } },
        { home: { title: "New" } }
      )
      expect(result).toEqual({ home: { title: "New", subtitle: "Keep" } })
    })

    it("adds new keys from overrides", () => {
      const result = deepMerge({ a: 1 }, { b: 2 })
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it("keeps defaults when no override", () => {
      const result = deepMerge({ a: 1, b: 2 }, {})
      expect(result).toEqual({ a: 1, b: 2 })
    })

    it("empty overrides returns defaults unchanged", () => {
      const defaults = { x: "keep" }
      const result = deepMerge(defaults, {})
      expect(result).toEqual(defaults)
    })

    it("empty defaults with overrides returns overrides", () => {
      expect(deepMerge({}, { a: 1 })).toEqual({ a: 1 })
    })

    it("both empty returns empty", () => {
      expect(deepMerge({}, {})).toEqual({})
    })

    it("overrides array with array (no merge)", () => {
      const result = deepMerge({ items: [1, 2] }, { items: [3, 4] })
      expect(result.items).toEqual([3, 4])
    })

    it("null overrides nullish default", () => {
      const result = deepMerge({ a: null }, { a: "value" })
      expect(result.a).toBe("value")
    })

    it("handles 3-level deep merge", () => {
      const result = deepMerge(
        { a: { b: { c: 1, d: 2 } } },
        { a: { b: { c: 99 } } }
      )
      expect(result.a.b.c).toBe(99)
      expect(result.a.b.d).toBe(2)
    })

    it("does not mutate defaults", () => {
      const defaults = { a: { b: 1 } }
      deepMerge(defaults, { a: { b: 2 } })
      expect(defaults.a.b).toBe(1)
    })

    it("handles non-null primitive override", () => {
      expect(deepMerge({ a: "old" }, { a: "new" })).toEqual({ a: "new" })
    })

    it("override with null preserves default (null is not a merge target)", () => {
      const result = deepMerge({ a: { b: 1 } }, { a: null })
      // typeof null === "object" but null check catches it → returns defaults
      expect(result.a).toEqual({ b: 1 })
    })

    it("preserves keys only in defaults", () => {
      const result = deepMerge(
        { home: { title: "A", subtitle: "B", kitsCarousel: [{ name: "X" }] } },
        { home: { title: "C" } }
      )
      expect(result.home.kitsCarousel).toEqual([{ name: "X" }])
    })
  })
})
