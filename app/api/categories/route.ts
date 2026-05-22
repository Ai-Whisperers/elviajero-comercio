import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  const { data: categories, error } = await supabase
    .from("ej_categories")
    .select("id, name, icon, description")
    .order("name")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // For each category, fetch subcategories
  const { data: allSubcategories, error: subError } = await supabase
    .from("ej_subcategories")
    .select("id, name, slug, category_id")
    .order("name")

  if (subError) return NextResponse.json({ error: subError.message }, { status: 500 })

  // Build a map: category_id -> subcategories[]
  const subcategoryMap: Record<string, any[]> = {}
  for (const sub of allSubcategories || []) {
    if (!subcategoryMap[sub.category_id]) subcategoryMap[sub.category_id] = []
    subcategoryMap[sub.category_id].push({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
    })
  }

  // Attach subcategories to each category
  const result = (categories || []).map((cat: any) => ({
    ...cat,
    subcategories: subcategoryMap[cat.id] || [],
  }))

  return NextResponse.json(result)
}