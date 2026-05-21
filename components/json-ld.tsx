
"use client"
import content from "@/content/es.json"

const c = content as any
const allProducts = c.home?.productCatalog?.products || []

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export function ProductJsonLd({ productName }: { productName: string }) {
  const product = allProducts.find((p: any) => p.name === productName)
  if (!product) return null

  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || "",
    "image": product.imageUrl || "",
    "brand": { "@type": "Brand", "name": product.brand || "El Viajero" },
    "offers": {
      "@type": "Offer",
      "price": parseGs(product.price).toString(),
      "priceCurrency": "PYG",
      "priceValidUntil": new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": "https://tiendaelviajero.com.py/producto/" + slugify(product.name),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": "https://tiendaelviajero.com.py" + item.url,
    })),
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
