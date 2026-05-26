// app/api/admin/init-tables/route.ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get("key")
  if (key !== "elviajero-migrate-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const results = []

  for (const table of ["ej_subcategories", "ej_content_sections", "ej_categories"]) {
    try {
      const { error } = await supabase.from(table).select("count").limit(1)
      results.push({ table, status: error ? `error: ${error.message}` : "exists" })
    } catch (e: any) {
      results.push({ table, status: `error: ${e.message}` })
    }
  }

  return NextResponse.json({ tables: results })
}

export async function POST() {
  const supabase = createAdminClient()
  const errors: string[] = []

  const subcats = [
    { name: "Linternas", slug: "linternas", category_id: "9935c30e-2a53-4621-a0d6-84bc0627b8cd" },
    { name: "Carpas", slug: "carpas", category_id: "9935c30e-2a53-4621-a0d6-84bc0627b8cd" },
    { name: "Navajas", slug: "navajas", category_id: "71d72e9b-d741-44f4-a6b5-558e3c7b1903" },
    { name: "Bolsos", slug: "bolsos", category_id: "506a6a40-23d4-4cd9-a62c-1fde967dcc6d" },
    { name: "Cañas", slug: "canas", category_id: "0f9805b1-ce5f-4d7d-9aec-bfd27093cbf5" },
    { name: "Reels", slug: "reels", category_id: "0f9805b1-ce5f-4d7d-9aec-bfd27093cbf5" },
  ]

  for (const sub of subcats) {
    try {
      const { error } = await supabase.from("ej_subcategories").upsert(sub)
      if (error) errors.push(`sub ${sub.name}: ${error.message}`)
    } catch (e: any) {
      errors.push(`sub ${sub.name}: ${e.message}`)
    }
  }

  const sections = [
    { section_key: "navbar", content: JSON.stringify({ logo: "El Viajero" }), is_published: true },
    { section_key: "footer", content: JSON.stringify({ copyright: "2024 El Viajero" }), is_published: true },
    { section_key: "home.hero", content: JSON.stringify({ title: "El Viajero", subtitle: "Tu aventura comienza aquí" }), is_published: true },
    { section_key: "productCatalog", content: JSON.stringify({ showPrice: true, currency: "Gs." }), is_published: true },
  ]

  for (const sec of sections) {
    try {
      const { error } = await supabase.from("ej_content_sections").upsert(sec)
      if (error) errors.push(`section ${sec.section_key}: ${error.message}`)
    } catch (e: any) {
      errors.push(`section ${sec.section_key}: ${e.message}`)
    }
  }

  if (errors.length) return NextResponse.json({ partial: true, errors }, { status: 207 })
  return NextResponse.json({ status: "seed complete" })
}