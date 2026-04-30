import type { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://viajero.paragu-ai.com"
  const pages = ["", "/tienda", "/productos", "/nosotros", "/contacto", "/faq", "/blog", "/promociones", "/privacidad", "/terminos"]
  return pages.map(p => ({ url: base + p, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.8 }))
}