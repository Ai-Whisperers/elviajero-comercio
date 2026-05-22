/**
 * Pagination Logic Tests — page number generation algorithm.
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors components/pagination.tsx) ────────────────────
function getPages(currentPage: number, totalPages: number): (number | string)[] {
  const pages: (number | string)[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible + 2) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  let start = Math.max(2, currentPage - 1)
  let end = Math.min(totalPages - 1, currentPage + 1)

  if (currentPage <= 3) { end = 4 }
  if (currentPage >= totalPages - 2) { start = totalPages - 3 }

  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push("...")

  pages.push(totalPages)
  return pages
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Pagination", () => {
  it("shows all pages when total <= 7", () => {
    expect(getPages(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPages(3, 3)).toEqual([1, 2, 3])
    expect(getPages(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it("shows ellipsis for large page sets (page 1 of 20)", () => {
    const pages = getPages(1, 20)
    expect(pages[0]).toBe(1)
    expect(pages).toContain("...")
    expect(pages[pages.length - 1]).toBe(20)
  })

  it("shows ellipsis in middle", () => {
    const pages = getPages(10, 20)
    expect(pages[0]).toBe(1)
    expect(pages).toContain("...")
    expect(pages).toContain(10)
    expect(pages[pages.length - 1]).toBe(20)
  })

  it("page 1 of 10", () => {
    const pages = getPages(1, 10)
    expect(pages[0]).toBe(1)
    expect(pages[pages.length - 1]).toBe(10)
  })

  it("last page of 10", () => {
    const pages = getPages(10, 10)
    expect(pages).toContain(10)
    expect(pages).toContain(1)
  })

  it("single page returns [1]", () => {
    expect(getPages(1, 1)).toEqual([1])
  })

  it("two pages returns [1, 2]", () => {
    expect(getPages(1, 2)).toEqual([1, 2])
  })

  it("always starts with 1", () => {
    for (const p of [1, 5, 10, 50]) {
      expect(getPages(p, 50)[0]).toBe(1)
    }
  })

  it("always ends with totalPages", () => {
    for (const p of [1, 5, 10, 50]) {
      const pages = getPages(p, 50)
      expect(pages[pages.length - 1]).toBe(50)
    }
  })

  it("contains current page", () => {
    for (const p of [1, 5, 10, 25, 50]) {
      expect(getPages(p, 50)).toContain(p)
    }
  })

  it("middle page shows neighbors", () => {
    const pages = getPages(10, 20)
    expect(pages).toContain(9)
    expect(pages).toContain(10)
    expect(pages).toContain(11)
  })

  it("no consecutive dots", () => {
    for (const p of [1, 5, 15, 50]) {
      const pages = getPages(p, 50)
      for (let i = 1; i < pages.length; i++) {
        if (pages[i] === "..." && pages[i - 1] === "...") {
          expect(false).toBe(true) // Fail if consecutive dots
        }
      }
    }
  })
})
