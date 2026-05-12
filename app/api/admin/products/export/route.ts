import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(req.url)
  const format = searchParams.get("format") || "csv"
  const category = searchParams.get("category") || ""

  let query = supabase.from("ej_products").select("*").order("name")
  if (category) query = query.eq("category", category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.length) return NextResponse.json({ error: "No hay productos" }, { status: 404 })

  // CSV header
  const headers = [
    "id", "name", "slug", "category", "price", "price_before", "cost_price",
    "description", "brand", "specs", "stock", "weight", "image_url",
    "is_new", "featured", "created_at"
  ]

  const rows = data.map((p: any) =>
    headers.map(h => {
      const val = p[h] ?? ""
      const str = String(val)
      // Escape CSV: wrap in quotes if contains comma, quote, or newline
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(",")
  )

  const csv = [headers.join(","), ...rows].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="elviajero-productos-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
