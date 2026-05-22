/**
 * Wishlist + Recently Viewed Logic Tests — pure functions, no React.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Pure wishlist toggle logic (mirrors lib/wishlist.ts) ──────────
function wishlistToggle(prev: string[], name: string): string[] {
  return prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
}

function recentlyViewedAdd(prev: string[], name: string, max = 8): string[] {
  return [name, ...prev.filter((n) => n !== name)].slice(0, max)
}

describe("Wishlist Logic", () => {
  describe("wishlistToggle", () => {
    it("adds item not in list", () => {
      expect(wishlistToggle([], "Carpa")).toEqual(["Carpa"])
    })

    it("removes item already in list", () => {
      expect(wishlistToggle(["Carpa", "Linterna"], "Carpa")).toEqual(["Linterna"])
    })

    it("toggles: add then remove returns to original", () => {
      const step1 = wishlistToggle([], "Carpa")
      const step2 = wishlistToggle(step1, "Carpa")
      expect(step2).toEqual([])
    })

    it("does not mutate original", () => {
      const original = ["A"]
      wishlistToggle(original, "B")
      expect(original).toEqual(["A"])
    })

    it("handles empty list", () => {
      expect(wishlistToggle([], "X")).toEqual(["X"])
    })

    it("handles removing from single-item list", () => {
      expect(wishlistToggle(["Only"], "Only")).toEqual([])
    })
  })

  describe("recentlyViewedAdd", () => {
    it("adds new item to front", () => {
      expect(recentlyViewedAdd(["B", "C"], "A")).toEqual(["A", "B", "C"])
    })

    it("moves existing item to front (dedup)", () => {
      expect(recentlyViewedAdd(["A", "B", "C"], "B")).toEqual(["B", "A", "C"])
    })

    it("caps at max items", () => {
      const items = ["1", "2", "3", "4", "5", "6", "7", "8"]
      expect(recentlyViewedAdd(items, "new")).toHaveLength(8)
      expect(recentlyViewedAdd(items, "new")[0]).toBe("new")
    })

    it("default max is 8", () => {
      const items = Array.from({ length: 10 }, (_, i) => String(i))
      const result = recentlyViewedAdd(items, "new")
      expect(result).toHaveLength(8)
    })

    it("handles empty list", () => {
      expect(recentlyViewedAdd([], "X")).toEqual(["X"])
    })

    it("custom max works", () => {
      expect(recentlyViewedAdd(["A"], "B", 3)).toHaveLength(2)
    })
  })
})
