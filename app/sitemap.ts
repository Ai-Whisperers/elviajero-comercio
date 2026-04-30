import { MetadataRoute } from "next"
import content from "@/content/es.json"

const c = content as any
const products = c.home?.productCatalog?.products || []
const base = "https://el-viajero.paragu-ai.com"

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: base + "/tienda", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: base + "/nosotros", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/contacto", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/faq", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: base + "/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: base + "/promociones", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: base + "/privacidad", lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: base + "/terminos", lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ]
  const cats = ["camping", "pesca", "accesorios", "autos", "motos", "campo"].map(c => ({
    url: base + "/categoria/" + c, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7,
  }))
  const prods = products.map((p: any) => ({
    url: base + "/producto/" + slugify(p.name), lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6,
  }))
  return [...staticPages, ...cats, ...prods]
}
