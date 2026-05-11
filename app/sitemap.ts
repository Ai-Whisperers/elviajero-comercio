import { MetadataRoute } from "next"
import content from "@/content/es.json"

const c = content as any
const products = c.home?.productCatalog?.products || []
const base = "https://el-viajero.paragu-ai.com"
const locales = ["es", "en", "gn"]

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9áéíóúñü]+/g, "-").replace(/-+$/, "") }

function localize(path: string, locale: string): string {
  if (path === "/" || path === "") return `${base}/${locale}`
  return `${base}/${locale}${path}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  const staticRoutes = [
    { path: "", priority: 1.0, freq: "weekly" as const },
    { path: "/tienda", priority: 0.9, freq: "daily" as const },
    { path: "/nosotros", priority: 0.5, freq: "monthly" as const },
    { path: "/contacto", priority: 0.5, freq: "monthly" as const },
    { path: "/faq", priority: 0.5, freq: "monthly" as const },
    { path: "/blog", priority: 0.7, freq: "weekly" as const },
    { path: "/promociones", priority: 0.8, freq: "weekly" as const },
    { path: "/privacidad", priority: 0.2, freq: "yearly" as const },
    { path: "/terminos", priority: 0.2, freq: "yearly" as const },
  ]

  // Generate all entries x 3 locales with hreflang alternates
  for (const route of staticRoutes) {
    const localized = locales.map(l => ({ url: localize(route.path, l) }))
    // Use Spanish as default (primary)
    entries.push({
      url: localize(route.path, "es"),
      lastModified: new Date(),
      changeFrequency: route.freq,
      priority: route.priority,
      alternates: {
        languages: {
          es: localize(route.path, "es"),
          en: localize(route.path, "en"),
          gn: localize(route.path, "gn"),
        }
      }
    })
  }

  // Category pages (single locale, no alternates needed for now)
  const cats = ["camping", "pesca", "accesorios", "autos", "motos", "campo"]
  for (const cat of cats) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}/categoria/${cat}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    }
  }

  // Product pages
  for (const p of products) {
    for (const locale of locales) {
      entries.push({
        url: `${base}/${locale}/producto/${slugify(p.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    }
  }

  return entries
}
