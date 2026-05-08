/**
 * Structured data helper functions for Schema.org JSON-LD.
 * These are pure functions — use them in server components or page metadata.
 */

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface ProductOffer {
  name: string
  description?: string
  image?: string
  brand?: string
  price: number
  priceCurrency?: string
  priceValidUntil?: string
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "Discontinued"
  sku?: string
  url?: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ReviewData {
  author: string
  datePublished?: string
  description?: string
  reviewRating: number
  bestRating?: number
  worstRating?: number
  productName?: string
  productUrl?: string
}

const SITE_URL = "https://el-viajero.paragu-ai.com"

/**
 * Product schema — use on product detail pages.
 */
export function ProductSchema(offer: ProductOffer) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.name,
    description: offer.description || undefined,
    image: offer.image || undefined,
    sku: offer.sku || undefined,
    brand: offer.brand
      ? { "@type": "Brand", name: offer.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      price: offer.price,
      priceCurrency: offer.priceCurrency || "PYG",
      priceValidUntil: offer.priceValidUntil || undefined,
      availability: `https://schema.org/${offer.availability || "InStock"}`,
      url: offer.url || `${SITE_URL}/producto/${offer.name.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")}`,
    },
  }
}

/**
 * BreadcrumbList schema — use on category, product, and blog pages.
 */
export function BreadcrumbListSchema(items: BreadcrumbItem[]) {
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

/**
 * FAQPage schema — use on the FAQ page or product FAQ sections.
 */
export function FAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

/**
 * Review schema — use on product pages with customer reviews.
 * Can be embedded inside a Product schema or standalone.
 */
export function ReviewSchema(review: ReviewData) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    datePublished: review.datePublished || new Date().toISOString().split("T")[0],
    description: review.description || undefined,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewRating,
      bestRating: review.bestRating || 5,
      worstRating: review.worstRating || 1,
    },
    itemReviewed: review.productName
      ? {
          "@type": "Product",
          name: review.productName,
          url: review.productUrl || undefined,
        }
      : undefined,
  }
}
