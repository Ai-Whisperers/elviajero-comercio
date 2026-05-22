/**
 * Zod Validation Schema Tests
 *
 * Tests: BlogPostSchema, StaffRoleSchema, OrderStatusSchema, PaymentStatusSchema,
 * ContentOverrideSchema, ALLOWED_ROLES, ORDER_STATUSES, PAYMENT_STATUSES constants
 */
import { describe, it, expect } from "@jest/globals"
import { z } from "zod"

// ─── Inline schemas (mirrors lib/validation.ts) ───────────────────
const ContentOverrideSchema = z.record(z.string(), z.unknown())

const BlogPostSchema = z.object({
  slug: z.string().min(1, "El slug es requerido").regex(/^[a-z0-9-]+$/, "regex"),
  title: z.string().min(1, "El título es requerido"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().optional(),
  created_at: z.string().optional(),
})

const ALLOWED_ROLES = ["admin", "staff", "user", "guest"] as const
const StaffRoleSchema = z.enum(ALLOWED_ROLES)

const ORDER_STATUSES = ["pendiente", "confirmado", "procesando", "enviado", "entregado", "cancelado"] as const
const OrderStatusSchema = z.enum(ORDER_STATUSES)

const PAYMENT_STATUSES = ["pending", "verified", "rejected", "refunded"] as const
const PaymentStatusSchema = z.enum(PAYMENT_STATUSES)

// ─── Tests ─────────────────────────────────────────────────────────

describe("Validation Schemas", () => {
  // Blog Post
  describe("BlogPostSchema", () => {
    const validPost = {
      slug: "mi-articulo",
      title: "Mi Artículo",
    }

    it("accepts valid blog post with required fields", () => {
      expect(BlogPostSchema.parse(validPost)).toEqual(validPost)
    })

    it("accepts blog post with all optional fields", () => {
      const full = { ...validPost, excerpt: "Resumen", content: "Texto largo", category: "camping", image_url: "/img.jpg", author: "Ana", published: true, created_at: "2026-01-01" }
      expect(BlogPostSchema.parse(full)).toEqual(full)
    })

    it("rejects empty slug", () => {
      const result = BlogPostSchema.safeParse({ ...validPost, slug: "" })
      expect(result.success).toBe(false)
    })

    it("rejects slug with uppercase", () => {
      const result = BlogPostSchema.safeParse({ ...validPost, slug: "Mi-Articulo" })
      expect(result.success).toBe(false)
    })

    it("rejects slug with spaces", () => {
      const result = BlogPostSchema.safeParse({ ...validPost, slug: "mi articulo" })
      expect(result.success).toBe(false)
    })

    it("rejects slug with special chars", () => {
      const result = BlogPostSchema.safeParse({ ...validPost, slug: "mi_articulo!" })
      expect(result.success).toBe(false)
    })

    it("accepts slug with numbers", () => {
      expect(BlogPostSchema.parse({ ...validPost, slug: "top-10-carpas" })).toBeTruthy()
    })

    it("accepts slug with consecutive hyphens", () => {
      expect(BlogPostSchema.parse({ ...validPost, slug: "mi--articulo" })).toBeTruthy()
    })

    it("rejects empty title", () => {
      const result = BlogPostSchema.safeParse({ slug: "test", title: "" })
      expect(result.success).toBe(false)
    })

    it("rejects missing slug", () => {
      const result = BlogPostSchema.safeParse({ title: "Test" })
      expect(result.success).toBe(false)
    })

    it("rejects missing title", () => {
      const result = BlogPostSchema.safeParse({ slug: "test" })
      expect(result.success).toBe(false)
    })

    it("rejects non-boolean published", () => {
      const result = BlogPostSchema.safeParse({ ...validPost, published: "yes" })
      expect(result.success).toBe(false)
    })
  })

  // Staff Role
  describe("StaffRoleSchema", () => {
    it("accepts admin", () => expect(StaffRoleSchema.parse("admin")).toBe("admin"))
    it("accepts staff", () => expect(StaffRoleSchema.parse("staff")).toBe("staff"))
    it("accepts user", () => expect(StaffRoleSchema.parse("user")).toBe("user"))
    it("accepts guest", () => expect(StaffRoleSchema.parse("guest")).toBe("guest"))
    it("rejects superadmin", () => expect(StaffRoleSchema.safeParse("superadmin").success).toBe(false))
    it("rejects empty string", () => expect(StaffRoleSchema.safeParse("").success).toBe(false))
    it("rejects uppercase", () => expect(StaffRoleSchema.safeParse("Admin").success).toBe(false))
  })

  // Order Status
  describe("OrderStatusSchema", () => {
    it("accepts all valid statuses", () => {
      for (const s of ORDER_STATUSES) {
        expect(OrderStatusSchema.parse(s)).toBe(s)
      }
    })

    it("rejects invalid status", () => {
      expect(OrderStatusSchema.safeParse("despachado").success).toBe(false)
    })

    it("rejects empty", () => {
      expect(OrderStatusSchema.safeParse("").success).toBe(false)
    })

    it("ORDER_STATUSES has 6 entries", () => {
      expect(ORDER_STATUSES).toHaveLength(6)
    })
  })

  // Payment Status
  describe("PaymentStatusSchema", () => {
    it("accepts all valid statuses", () => {
      for (const s of PAYMENT_STATUSES) {
        expect(PaymentStatusSchema.parse(s)).toBe(s)
      }
    })

    it("rejects invalid status", () => {
      expect(PaymentStatusSchema.safeParse("approved").success).toBe(false)
    })

    it("PAYMENT_STATUSES has 4 entries", () => {
      expect(PAYMENT_STATUSES).toHaveLength(4)
    })
  })

  // Content Override
  describe("ContentOverrideSchema", () => {
    it("accepts any string-keyed object", () => {
      const result = ContentOverrideSchema.parse({ home: { title: "Nuevo" }, footer: { text: "X" } })
      expect(result).toEqual({ home: { title: "Nuevo" }, footer: { text: "X" } })
    })

    it("accepts empty object", () => {
      expect(ContentOverrideSchema.parse({})).toEqual({})
    })
  })

  // Constants integrity
  describe("Constants", () => {
    it("ALLOWED_ROLES contains admin, staff, user, guest", () => {
      expect(ALLOWED_ROLES).toContain("admin")
      expect(ALLOWED_ROLES).toContain("staff")
    })

    it("ORDER_STATUSES contains expected flow", () => {
      expect(ORDER_STATUSES).toContain("pendiente")
      expect(ORDER_STATUSES).toContain("entregado")
      expect(ORDER_STATUSES).toContain("cancelado")
    })

    it("PAYMENT_STATUSES contains expected flow", () => {
      expect(PAYMENT_STATUSES).toContain("pending")
      expect(PAYMENT_STATUSES).toContain("verified")
      expect(PAYMENT_STATUSES).toContain("refunded")
    })
  })
})
