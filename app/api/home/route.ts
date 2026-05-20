import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from("ej_products")
    .select("id, name, slug, price, price_before, image_url, brand, category, stock, is_new, featured")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const newArrivals = products?.filter((p: any) => p.is_new) || []
  const featured = products?.filter((p: any) => p.featured) || []
  const bestSellers = products?.filter((p: any) => p.stock > 0).slice(0, 8) || []

  const allBrands = [...new Set(products?.map((p: any) => p.brand).filter(Boolean) || [])]

  return NextResponse.json({ products, newArrivals, featured, bestSellers, brands: allBrands })
}
