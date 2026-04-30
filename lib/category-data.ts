
"use client"
import content from "@/content/es.json"
import Link from "next/link"

const c = content as any
const products = c.home?.productCatalog?.products || []

const categoryHeroes: Record<string, { title: string; desc: string; seo: string }> = {
  camping: { title: "Camping", desc: "Todo para tu próxima aventura al aire libre", seo: "Equipamiento de camping en Paraguay" },
  pesca: { title: "Pesca", desc: "Cañas, señuelos y accesorios de pesca", seo: "Artículos de pesca en Asunción" },
  accesorios: { title: "Accesorios", desc: "Complementos para tu equipo outdoor", seo: "Accesorios outdoor Paraguay" },
  autos: { title: "Automóviles", desc: "Accesorios para tu vehículo", seo: "Accesorios para autos Paraguay" },
  motos: { title: "Motos", desc: "Equipamiento para motociclistas", seo: "Accesorios para motos Paraguay" },
  campo: { title: "Campo", desc: "Herramientas y equipos para el campo", seo: "Equipamiento de campo Paraguay" },
}

export function getCategoryInfo(slug: string) {
  return categoryHeroes[slug] || { title: slug, desc: "", seo: slug }
}

export function getCategoryProducts(slug: string) {
  const catNames: Record<string, string> = {
    camping: "Camping", pesca: "Pesca", accesorios: "Accesorios",
    autos: "Automóviles", motos: "Motos", campo: "Campo",
  }
  const catName = catNames[slug] || slug
  return products.filter((p: any) => p.category === catName)
}
