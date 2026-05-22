import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from("ej_products")
    .select("id, name, slug, price, price_before, image_url, brand, category, stock, is_new, featured")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Load subcategories from ej_site_config (site-specific key)
  // Gracefully handle missing config — return empty, callers handle fallback
  const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "elviajero"
  const LIVE_KEY = `content_overrides_${SITE_KEY}`

  const { data: configData } = await supabase
    .from("ej_site_config")
    .select("key, value")
    .eq("key", LIVE_KEY)
    .maybeSingle()

  let subcategories: Record<string, any[]> = {}
  if (configData?.value && typeof configData.value === "object") {
    const val = configData.value as any
    if (val.productCatalog?.subcategories) {
      subcategories = val.productCatalog.subcategories
    }
  }

  // Build categories array from the subcategories keys + any static category list
  // Fallback: extract category names from the product data itself (allCategories)
  const { data: allProducts } = await supabase
    .from("ej_products")
    .select("category")
    .order("category")

  const catNames = [...new Set((allProducts || []).map((p: any) => p.category).filter(Boolean))].sort()

  let categories: Array<{ id: string; name: string; subcategories: Array<{ id: string; name: string; slug: string }> }> = []
  for (const name of catNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "")
    categories.push({
      id: slug,
      name,
      subcategories: (subcategories[slug] || []).map((s: any) => ({
        id: s.slug || slugify(s.name),
        name: s.name,
        slug: s.slug || slugify(s.name),
      })),
    })
  }

  function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
  }

  const newArrivals = products?.filter((p: any) => p.is_new) || []
  const featured = products?.filter((p: any) => p.featured) || []
  const bestSellers = products?.filter((p: any) => p.stock > 0).slice(0, 8) || []
  const allBrands = [...new Set(products?.map((p: any) => p.brand).filter((b: any) => b && b.trim()) || [])]

  return NextResponse.json({ products, newArrivals, featured, bestSellers, brands: allBrands, categories })
}