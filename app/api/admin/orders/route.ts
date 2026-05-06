import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

const TABLE = "ej_orders"

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (id) {
    const { data, error } = await supabase.from(TABLE).select("*").eq("id", id).single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }
  const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  
  // Save customer contact info to ej_orders for later notifications
  const orderData = {
    id: body.id,
    user_id: body.user_id || null,
    items: body.items || [],
    total: body.total || "0",
    status: body.status || "pendiente",
    address_id: body.address_id || "",
    payment_method: body.payment_method || "whatsapp",
    note: body.note || "",
    customer_name: body.customer_name || body.customer?.name || "",
    customer_phone: body.customer_phone || body.customer?.phone || "",
    customer_email: body.customer_email || body.customer?.email || "",
  }

  const { data, error } = await supabase.from(TABLE).insert(orderData).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  // Notify admin via WhatsApp
  try {
    const { notifyNewOrder } = await import("@/lib/whatsapp")
    await notifyNewOrder(data?.[0] || orderData)
  } catch (e) {
    console.error("[whatsapp] Failed to notify admin:", e)
  }

  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const supabase = createAdminClient()
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  
  const { data, error } = await supabase.from(TABLE).update(updates).eq("id", id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // If status changed AND we have customer phone, send WhatsApp notification
  if (updates.status && data?.[0]?.customer_phone) {
    try {
      const { notifyStatusChange } = await import("@/lib/whatsapp")
      await notifyStatusChange(id, data[0].customer_phone, updates.status)
    } catch (e) {
      console.error("[whatsapp] Failed to notify customer:", e)
    }
  }

  return NextResponse.json(data?.[0] ?? null)
}
