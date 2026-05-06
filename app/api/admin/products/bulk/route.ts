import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

const TABLE = "ej_products"

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  try {
    const { products } = await req.json()
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Se requiere un array de productos" }, { status: 400 })
    }
    const { data, error } = await supabase.from(TABLE).insert(products).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ count: data?.length || 0, data })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
