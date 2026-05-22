/**
 * SEO Schema.org Tests — structured data generation (pure functions).
 */
import { describe, it, expect } from "@jest/globals"

// ─── Inline (mirrors lib/seo/schemas.ts) ───────────────────────────
const SITE_URL = "https://tiendaelviajero.com.py"

interface ProductOffer {
  name: string
  description?: string
  image?: string
  brand?: string
  price: number
  priceCurrency?: string
  availability?: string
  sku?: string
  url?: string
}

function ProductSchema(offer: ProductOffer) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.name,
    brand: offer.brand ? { "@type": "Brand", name: offer.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: offer.price,
      priceCurrency: offer.priceCurrency || "PYG",
      availability: `https://schema.org/${offer.availability || "InStock"}`,
      url: offer.url || `${SITE_URL}/producto/${offer.name.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")}`,
    },
  }
}

function BreadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  }
}

function FAQSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }
}

function ReviewSchema(review: { author: string; reviewRating: number; productName?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewRating,
      bestRating: 5,
      worstRating: 1,
    },
    itemReviewed: review.productName ? { "@type": "Product", name: review.productName } : undefined,
  }
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("SEO Schemas", () => {
  describe("ProductSchema", () => {
    it("generates valid Product schema", () => {
      const schema = ProductSchema({ name: "Carpa 4P", price: 850000 })
      expect(schema["@type"]).toBe("Product")
      expect(schema.name).toBe("Carpa 4P")
    })

    it("defaults to PYG currency", () => {
      const schema = ProductSchema({ name: "Test", price: 100 })
      expect(schema.offers.priceCurrency).toBe("PYG")
    })

    it("defaults to InStock availability", () => {
      const schema = ProductSchema({ name: "Test", price: 100 })
      expect(schema.offers.availability).toContain("InStock")
    })

    it("includes brand when provided", () => {
      const schema = ProductSchema({ name: "Test", price: 100, brand: "Coleman" })
      expect(schema.brand!.name).toBe("Coleman")
    })

    it("omits brand when not provided", () => {
      const schema = ProductSchema({ name: "Test", price: 100 })
      expect(schema.brand).toBeUndefined()
    })

    it("generates URL from product name slug", () => {
      const schema = ProductSchema({ name: "Carpa 4P", price: 100 })
      expect(schema.offers.url).toContain("tiendaelviajero.com.py")
    })

    it("uses custom URL when provided", () => {
      const schema = ProductSchema({ name: "Test", price: 100, url: "https://custom.com/p" })
      expect(schema.offers.url).toBe("https://custom.com/p")
    })

    it("sets OutOfStock availability", () => {
      const schema = ProductSchema({ name: "Test", price: 100, availability: "OutOfStock" })
      expect(schema.offers.availability).toContain("OutOfStock")
    })

    it("always has schema.org context", () => {
      const schema = ProductSchema({ name: "Test", price: 0 })
      expect(schema["@context"]).toBe("https://schema.org")
    })
  })

  describe("BreadcrumbListSchema", () => {
    it("generates correct positions", () => {
      const schema = BreadcrumbListSchema([
        { name: "Home", url: "/" },
        { name: "Tienda", url: "/tienda" },
      ])
      expect(schema.itemListElement[0].position).toBe(1)
      expect(schema.itemListElement[1].position).toBe(2)
    })

    it("prepends site URL to relative paths", () => {
      const schema = BreadcrumbListSchema([{ name: "Home", url: "/" }])
      expect(schema.itemListElement[0].item).toBe("https://tiendaelviajero.com.py/")
    })

    it("keeps absolute URLs unchanged", () => {
      const schema = BreadcrumbListSchema([{ name: "Ext", url: "https://other.com" }])
      expect(schema.itemListElement[0].item).toBe("https://other.com")
    })

    it("returns BreadcrumbList type", () => {
      const schema = BreadcrumbListSchema([])
      expect(schema["@type"]).toBe("BreadcrumbList")
    })
  })

  describe("FAQSchema", () => {
    it("generates Question/Answer pairs", () => {
      const schema = FAQSchema([
        { question: "¿Cómo comprar?", answer: "Por WhatsApp" },
      ])
      expect(schema.mainEntity[0]["@type"]).toBe("Question")
      expect(schema.mainEntity[0].name).toBe("¿Cómo comprar?")
      expect(schema.mainEntity[0].acceptedAnswer.text).toBe("Por WhatsApp")
    })

    it("handles multiple items", () => {
      const items = [
        { question: "Q1", answer: "A1" },
        { question: "Q2", answer: "A2" },
        { question: "Q3", answer: "A3" },
      ]
      const schema = FAQSchema(items)
      expect(schema.mainEntity).toHaveLength(3)
    })

    it("returns FAQPage type", () => {
      expect(FAQSchema([])["@type"]).toBe("FAQPage")
    })
  })

  describe("ReviewSchema", () => {
    it("generates valid Review with rating", () => {
      const schema = ReviewSchema({ author: "Omar", reviewRating: 5 })
      expect(schema["@type"]).toBe("Review")
      expect(schema.reviewRating.ratingValue).toBe(5)
    })

    it("includes product reference when provided", () => {
      const schema = ReviewSchema({ author: "Omar", reviewRating: 4, productName: "Carpa" })
      expect(schema.itemReviewed!.name).toBe("Carpa")
    })

    it("omits product reference when not provided", () => {
      const schema = ReviewSchema({ author: "Omar", reviewRating: 3 })
      expect(schema.itemReviewed).toBeFalsy()
    })

    it("rating defaults: best 5, worst 1", () => {
      const schema = ReviewSchema({ author: "Test", reviewRating: 4 })
      expect(schema.reviewRating.bestRating).toBe(5)
      expect(schema.reviewRating.worstRating).toBe(1)
    })

    it("author is Person type", () => {
      const schema = ReviewSchema({ author: "Ana", reviewRating: 5 })
      expect(schema.author["@type"]).toBe("Person")
      expect(schema.author.name).toBe("Ana")
    })
  })
})
