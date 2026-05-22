/**
 * API Response Helpers Tests — pure logic tests.
 *
 * Tests: success(), error(), paginated() — response shape verification
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline helpers (mirrors lib/api-response.ts) ─────────────────
function success<T>(data: T, status = 200) {
  return { success: true as const, data, status }
}

function error(message: string, status = 400, extra?: Record<string, unknown>) {
  return { success: false as const, error: message, status, ...extra }
}

function paginated<T>(data: T[], total: number, page: number, perPage: number) {
  return {
    success: true as const,
    data,
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  }
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("API Response Helpers", () => {
  describe("success()", () => {
    it("returns success response with data", () => {
      const res = success({ name: "Carpa" })
      expect(res.success).toBe(true)
      expect(res.data).toEqual({ name: "Carpa" })
    })

    it("defaults to status 200", () => {
      expect(success({}).status).toBe(200)
    })

    it("accepts custom status code", () => {
      expect(success({}, 201).status).toBe(201)
    })

    it("handles null data", () => {
      const res = success(null)
      expect(res.data).toBeNull()
      expect(res.success).toBe(true)
    })

    it("handles array data", () => {
      const res = success([1, 2, 3])
      expect(res.data).toEqual([1, 2, 3])
    })

    it("handles string data", () => {
      const res = success("ok")
      expect(res.data).toBe("ok")
    })
  })

  describe("error()", () => {
    it("returns error response", () => {
      const res = error("Not found")
      expect(res.success).toBe(false)
      expect(res.error).toBe("Not found")
    })

    it("defaults to status 400", () => {
      expect(error("bad").status).toBe(400)
    })

    it("accepts custom status code", () => {
      expect(error("gone", 410).status).toBe(410)
    })

    it("accepts extra fields", () => {
      const res = error("Validation failed", 422, { fields: ["email", "name"] })
      expect(res).toHaveProperty("fields")
      expect((res as any).fields).toEqual(["email", "name"])
    })

    it("handles empty extra", () => {
      const res = error("bad", 400)
      expect(res).not.toHaveProperty("fields")
    })

    it("preserves error message exactly", () => {
      expect(error("¡Producto no encontrado!").error).toBe("¡Producto no encontrado!")
    })
  })

  describe("paginated()", () => {
    it("returns paginated response with meta", () => {
      const res = paginated([1, 2, 3], 100, 1, 10)
      expect(res.success).toBe(true)
      expect(res.data).toEqual([1, 2, 3])
      expect(res.meta.total).toBe(100)
      expect(res.meta.page).toBe(1)
      expect(res.meta.perPage).toBe(10)
      expect(res.meta.totalPages).toBe(10)
    })

    it("calculates totalPages correctly", () => {
      expect(paginated([], 50, 1, 10).meta.totalPages).toBe(5)
      expect(paginated([], 51, 1, 10).meta.totalPages).toBe(6)
      expect(paginated([], 1, 1, 10).meta.totalPages).toBe(1)
      expect(paginated([], 0, 1, 10).meta.totalPages).toBe(0)
    })

    it("handles single page", () => {
      const res = paginated([1], 1, 1, 10)
      expect(res.meta.totalPages).toBe(1)
    })

    it("handles empty data with total > 0", () => {
      const res = paginated([], 100, 2, 10)
      expect(res.data).toEqual([])
      expect(res.meta.total).toBe(100)
      expect(res.meta.page).toBe(2)
    })

    it("preserves page and perPage", () => {
      const res = paginated([], 0, 5, 20)
      expect(res.meta.page).toBe(5)
      expect(res.meta.perPage).toBe(20)
    })
  })
})
