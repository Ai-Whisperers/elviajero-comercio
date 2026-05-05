import { NextResponse } from "next/server"
import { getAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = getAdminClient()
  const [usersRes, prodsRes, ordersRes] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("ej_products").select("*", { count: "exact", head: true }),
    supabase.from("ej_orders").select("total, status, created_at").order("created_at", { ascending: false }),
  ])

  const parse = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
  const ords = ordersRes.data ?? []
  const totalRevenue = ords.reduce((s, o) => s + parse(o.total), 0)
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()
  const monthOrds = ords.filter((o: any) => o.created_at >= monthAgo)
  const monthRevenue = monthOrds.reduce((s, o) => s + parse(o.total), 0)

  return NextResponse.json({
    users: usersRes.count ?? 0,
    products: prodsRes.count ?? 0,
    orders: ords.length,
    revenue: totalRevenue,
    monthOrders: monthOrds.length,
    monthRevenue,
    recentOrders: ords.slice(0, 5),
  })
}
