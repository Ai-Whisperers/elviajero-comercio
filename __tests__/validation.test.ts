import { describe, it, expect } from "@jest/globals"
import { ContentOverrideSchema, BlogPostSchema, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/validation"

describe("Validation — Blog Post", () => {
  it("accepts valid blog post", () => {
    const r = BlogPostSchema.safeParse({
      slug: "mi-post",
      title: "Mi Post",
      excerpt: "Resumen",
      content: "Contenido largo",
      category: "camping",
      published: true,
    })
    expect(r.success).toBe(true)
  })

  it("rejects empty slug", () => {
    const r = BlogPostSchema.safeParse({ slug: "", title: "Test" })
    expect(r.success).toBe(false)
  })

  it("rejects slug with uppercase", () => {
    const r = BlogPostSchema.safeParse({ slug: "Mi-Post", title: "Test" })
    expect(r.success).toBe(false)
  })

  it("rejects slug with spaces", () => {
    const r = BlogPostSchema.safeParse({ slug: "mi post", title: "Test" })
    expect(r.success).toBe(false)
  })

  it("rejects missing title", () => {
    const r = BlogPostSchema.safeParse({ slug: "test" })
    expect(r.success).toBe(false)
  })

  it("accepts minimal valid post (slug + title)", () => {
    const r = BlogPostSchema.safeParse({ slug: "test-post", title: "Test" })
    expect(r.success).toBe(true)
  })
})

describe("Validation — Order statuses", () => {
  it("contains expected statuses", () => {
    expect(ORDER_STATUSES).toContain("pendiente")
    expect(ORDER_STATUSES).toContain("entregado")
    expect(ORDER_STATUSES).toContain("cancelado")
  })
})

describe("Validation — Payment statuses", () => {
  it("contains expected statuses", () => {
    expect(PAYMENT_STATUSES).toContain("pending")
    expect(PAYMENT_STATUSES).toContain("verified")
    expect(PAYMENT_STATUSES).toContain("rejected")
  })
})

describe("Validation — Content overrides", () => {
  it("accepts any string-keyed object", () => {
    const r = ContentOverrideSchema.safeParse({ "hero.headline": "Nuevo título" })
    expect(r.success).toBe(true)
  })

  it("accepts nested values", () => {
    const r = ContentOverrideSchema.safeParse({ "branding.logo": { url: "/logo.svg" } })
    expect(r.success).toBe(true)
  })
})
