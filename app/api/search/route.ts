import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json([])

  const supabase = createAdminClient()

  // Use Supabase text search on name + category + brand
  // Also do ILIKE fallback for partial matches
  const { data, error } = await supabase
    .from("ej_products")
    .select("id, name, slug, price, price_before, image_url, brand, category, stock")
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%,category.ilike.%${q}%`)
    .limit(8)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data || [])
}
