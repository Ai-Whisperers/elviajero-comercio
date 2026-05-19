import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const { error: authError } = await requireAdmin(req)
  if (authError) return authError
  const supabase = createAdminClient()

  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  const [usersRes, prodsRes, ordersCountRes, recentOrdersRes] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("ej_products").select("*", { count: "exact", head: true }),
    supabase.from("ej_orders").select("*", { count: "exact", head: true }),
    supabase
      .from("ej_orders")
      .select("total, status, created_at")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  const parse = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
  const monthOrds = recentOrdersRes.data ?? []
  const monthRevenue = monthOrds.reduce((s: number, o: any) => s + parse(o.total), 0)

  return NextResponse.json({
    users: usersRes.count ?? 0,
    products: prodsRes.count ?? 0,
    orders: ordersCountRes.count ?? 0,
    monthOrders: monthOrds.length,
    monthRevenueFormatted: "Gs. " + monthRevenue.toLocaleString("es-PY"),
    monthRevenue,
    recentOrders: monthOrds.slice(0, 5),
  })
}
