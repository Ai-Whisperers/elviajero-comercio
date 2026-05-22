import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from("ej_products")
    .select("id, name, slug, price, price_before, image_url, brand, category, stock, is_new, featured")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Load subcategories from ej_site_config
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

  // Also load category metadata (icons, descriptions, etc) from site_config
  const { data: catData } = await supabase
    .from("ej_site_config")
    .select("key, value")
    .eq("key", "home")
    .maybeSingle()

  let categories: Array<{ id: string; name: string; subcategories: Array<{ id: string; name: string; slug: string }> }> = []
  if (catData?.value && typeof catData.value === "object") {
    const val = catData.value as any
    if (val.productCatalog?.categories && Array.isArray(val.productCatalog.categories)) {
      // categories is a string[] but we need subcategory info from the subcategories map
      categories = (val.productCatalog.categories as string[]).map((name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "")
        return {
          id: slug,
          name,
          subcategories: (subcategories[slug] || []).map((s: any) => ({
            id: s.slug || s.name?.toLowerCase().replace(/[^a-z0-9]+/g, "") || "",
            name: s.name,
            slug: s.slug || s.name?.toLowerCase().replace(/[^a-z0-9]+/g, "") || "",
          })),
        }
      })
    }
  }

  const newArrivals = products?.filter((p: any) => p.is_new) || []
  const featured = products?.filter((p: any) => p.featured) || []
  const bestSellers = products?.filter((p: any) => p.stock > 0).slice(0, 8) || []
  const allBrands = [...new Set(products?.map((p: any) => p.brand).filter((b: any) => b && b.trim()) || [])]

  return NextResponse.json({ products, newArrivals, featured, bestSellers, brands: allBrands, categories })
}