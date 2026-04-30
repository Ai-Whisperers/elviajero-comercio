import type { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://el-viajero.paragu-ai.com"
  const blogSlugs = ["guia-elegir-carpa", "mejores-lugares-pesca-paraguay", "checklist-camping", "elegir-cana-pescar", "mantenimiento-equipo-camping", "destinos-aventura-paraguay"]
  const categorySlugs = ["camping", "pesca", "accesorios", "autos", "motos", "campo"]
  const pages = ["", "/tienda", "/productos", "/nosotros", "/contacto", "/faq", "/blog", "/promociones", "/privacidad", "/terminos"]
  const blogPages = blogSlugs.map(s => "/blog/" + s)
  const categoryPages = categorySlugs.map(s => "/categoria/" + s)
  return [...pages, ...blogPages, ...categoryPages].map(p => ({
    url: base + p,
    lastModified: new Date(),
    changeFrequency: p.startsWith("/blog") ? "monthly" as const : p === "/tienda" || p === "/promociones" ? "daily" as const : p === "" ? "weekly" as const : "weekly" as const,
    priority: p === "" ? 1 : p === "/tienda" ? 0.9 : p === "/promociones" ? 0.9 : p.startsWith("/blog") ? 0.7 : p === "/privacidad" || p === "/terminos" ? 0.3 : 0.8
  }))
}
