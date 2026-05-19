import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()

  // Get products where stock <= stock_alert_threshold
  // Since Supabase REST can't compare two columns directly, we fetch
  // products with low stock and filter in JS (safe for <10k products)
  const { data: products, error } = await supabase
    .from("ej_products")
    .select("id, name, stock, stock_alert_threshold, category, image_url")
    .not("stock", "is", null)
    .lte("stock", 100) // broad filter to reduce payload
    .order("stock", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const alerts = (products || []).filter(
    (p: any) => (p.stock || 0) <= (p.stock_alert_threshold || 5)
  )

  return NextResponse.json({ alerts })
}
