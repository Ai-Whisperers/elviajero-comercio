import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  // Use the JWT for anon key — this has 3 parts (header.payload.signature)
  const anonJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5dm9rcHJpYm1icm9zYWZudHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTgxNTUsImV4cCI6MjA5MTg5NDE1NX0.ww_-gt4beuTcr_HbUCv0HmuKCw-J-HWTAI441yDSXRg"
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  return createClient(url, anonJwt, {
    auth: { persistSession: false },
    global: serviceKey
      ? { headers: { Authorization: `Bearer ${serviceKey}` } }
      : {},
  })
}

export async function GET(req: NextRequest) {
  const supabase = getAdminClient()
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const perPage = parseInt(searchParams.get("perPage") || "20")
  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, error, count } = await supabase
    .from("ej_products")
    .select("*", { count: "exact" })
    .order("name")
    .range(from, to)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [], total: count ?? 0, page, perPage })
}

export async function POST(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  const { data, error } = await supabase.from("ej_products").insert(body).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function PATCH(req: NextRequest) {
  const supabase = getAdminClient()
  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { data, error } = await supabase.from("ej_products").update(updates).eq("id", id).select()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data?.[0] ?? null)
}

export async function DELETE(req: NextRequest) {
  const supabase = getAdminClient()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
  const { error } = await supabase.from("ej_products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
