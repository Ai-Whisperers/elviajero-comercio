import { MetadataRoute } from "next"
import content from "@/content/es.json"

const c = content as any
const products = c.home?.productCatalog?.products || []
const base = "https://tiendaelviajero.com.py"

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "")
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${base}/tienda`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${base}/nosotros`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/contacto`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${base}/promociones`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/privacidad`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${base}/terminos`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ]

  // Categories
  for (const cat of ["camping", "pesca", "accesorios", "autos", "motos", "campo"]) {
    entries.push({
      url: `${base}/categoria/${cat}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  }

  // Products
  for (const p of products) {
    entries.push({
      url: `${base}/producto/${slugify(p.name)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  }

  return entries
}
