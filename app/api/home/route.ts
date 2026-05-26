import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  const { data: products, error } = await supabase
    .from("ej_products")
    .select("id, name, slug, price, price_before, image_url, brand, category, subcategory, stock, is_new, featured")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Load categories directly from ej_categories table
  const [categoriesData, productsData] = await Promise.all([
    supabase.from("ej_categories")
      .select("id, name, slug, description, image_url, order_index, active")
      .eq("active", true)
      .order("order_index", { ascending: true }),
    supabase.from("ej_products")
      .select("id, name, slug, price, price_before, image_url, brand, category, subcategory, stock, is_new, featured")
      .order("created_at", { ascending: false }),
  ])

  const products = productsData.data || []
  const allProductsData = productsData.data || []

  // Load subcategories from ej_subcategories table
  const { data: allSubcategories } = await supabase
    .from("ej_subcategories")
    .select("id, name, slug, category_id, order_index")
    .eq("active", true)
    .order("order_index", { ascending: true })

  // Build subcategory map by category_id
  const subMap: Record<string, any[]> = {}
  for (const sub of allSubcategories || []) {
    if (!subMap[sub.category_id]) subMap[sub.category_id] = []
    subMap[sub.category_id].push(sub)
  }

  // Categories from ej_categories (structured with subcategories)
  const categories = (categoriesData.data || []).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug || nameToSlug(cat.name),
    subcategories: (subMap[cat.id] || []).map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug || nameToSlug(s.name),
    })),
  }))

  // Cat names for any legacy code that still expects string arrays
  const catNames = [...new Set(products.map((p: any) => p.category).filter(Boolean))].sort()
  // Fallback categories from product data (if ej_categories is empty)
  if (categories.length === 0 && catNames.length > 0) {
    categories.push(...catNames.map(name => ({
      id: nameToSlug(name),
      name,
      slug: nameToSlug(name),
      subcategories: [],
    })))
  }

  function nameToSlug(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
  }

  function slugify(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
  }

  const newArrivals = products?.filter((p: any) => p.is_new) || []
  const featured = products?.filter((p: any) => p.featured) || []
  const bestSellers = products?.filter((p: any) => p.stock > 0).slice(0, 8) || []
  const allBrands = [...new Set(products?.map((p: any) => p.brand).filter((b: any) => b && b.trim()) || [])]

  return NextResponse.json({ products, newArrivals, featured, bestSellers, brands: allBrands, categories })
}