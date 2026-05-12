import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get("product_id") || ""

  let query = supabase
    .from("ej_stock_movements")
    .select("*, ej_products!inner(name)")
    .order("created_at", { ascending: false })
    .limit(200)

  if (productId) query = query.eq("product_id", parseInt(productId))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { product_id, type, quantity, reference, note } = body
  if (!product_id || !type || quantity === undefined) {
    return NextResponse.json({ error: "product_id, type y quantity requeridos" }, { status: 400 })
  }

  // Get current stock
  const { data: product } = await supabase
    .from("ej_products")
    .select("id, stock, name")
    .eq("id", product_id)
    .single()

  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })

  const stockBefore = product.stock || 0
  let stockAfter = stockBefore

  switch (type) {
    case "add": stockAfter = stockBefore + quantity; break
    case "remove": stockAfter = Math.max(0, stockBefore - quantity); break
    case "adjustment": stockAfter = quantity; break  // quantity = new stock value
    case "sale": stockAfter = Math.max(0, stockBefore - quantity); break
    case "return": stockAfter = stockBefore + quantity; break
  }

  // Insert movement
  const { error: movErr } = await supabase.from("ej_stock_movements").insert({
    product_id,
    type,
    quantity,
    stock_before: stockBefore,
    stock_after: stockAfter,
    reference: reference || "",
    note: note || "",
  })
  if (movErr) return NextResponse.json({ error: movErr.message }, { status: 500 })

  // Update product stock
  const { error: updErr } = await supabase
    .from("ej_products")
    .update({ stock: stockAfter, updated_at: new Date().toISOString() })
    .eq("id", product_id)

  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  // Log activity
  const typeLabels: Record<string, string> = {
    add: "Ingreso de stock",
    remove: "Retiro de stock",
    adjustment: "Ajuste de stock",
    sale: "Venta",
    return: "Devolución",
  }
  await supabase.from("ej_activity_log").insert({
    action: `stock.${type}`,
    entity_type: "product",
    entity_id: String(product_id),
    summary: `${typeLabels[type] || type}: ${product.name} (${stockBefore} → ${stockAfter})`,
    details: { type, quantity, stockBefore, stockAfter, reference, note },
  }).maybeSingle()

  return NextResponse.json({ ok: true, stock_before: stockBefore, stock_after: stockAfter })
}
