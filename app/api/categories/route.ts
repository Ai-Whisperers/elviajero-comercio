// app/api/categories/route.ts — Updated Phase 2: reads from Supabase ej_categories
import { NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET() {
  const supabase = createAdminClient()

  // Get all active categories ordered by order_index
  const { data: categories, error } = await supabase
    .from("ej_categories")
    .select("id, name, slug, description, image_url, order_index, active")
    .eq("active", true)
    .order("order_index", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // For each category, get subcategories
  const { data: allSubcategories } = await supabase
    .from("ej_subcategories")
    .select("id, name, slug, category_id, order_index")
    .eq("active", true)
    .order("order_index", { ascending: true })

  // Build subcategory map
  const subMap: Record<string, any[]> = {}
  for (const sub of allSubcategories || []) {
    if (!subMap[sub.category_id]) subMap[sub.category_id] = []
    subMap[sub.category_id].push(sub)
  }

  const result = (categories || []).map(cat => ({
    ...cat,
    subcategories: subMap[cat.id] || []
  }))

  return NextResponse.json({ categories: result })
}

// Admin: create category
export async function POST(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { name, slug, description, image_url, order_index } = body

  if (!name || !slug) {
    return NextResponse.json({ error: "name and slug required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("ej_categories")
    .insert({ name, slug, description, image_url, order_index: order_index ?? 99, active: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ category: data }, { status: 201 })
}

// Admin: update category
export async function PATCH(request: Request) {
  const supabase = createAdminClient()
  const body = await request.json()
  const { id, ...updates } = body

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("ej_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ category: data })
}

// Admin: delete category (soft — set active=false)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const hard = searchParams.get("hard") === "true"

  const supabase = createAdminClient()

  if (hard) {
    const { error } = await supabase.from("ej_categories").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  } else {
    const { error } = await supabase
      .from("ej_categories")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}