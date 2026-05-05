"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

function DashboardContent() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 })

  useEffect(() => {
    if (!authed) return
    async function load() {
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
      const { data: ords } = await supabase.from("ej_orders").select("total, status, created_at")
      const parse = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
      const totalRevenue = (ords || []).reduce((s, o) => s + parse(o.total), 0)
      setStats({ users: userCount || 0, orders: ords?.length || 0, revenue: totalRevenue })
    }
    load()
  }, [authed, supabase])

  const format = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Usuarios", value: stats.users.toString(), color: "text-blue-400" },
          { label: "Pedidos", value: stats.orders.toString(), color: "text-green-400" },
          { label: "Ingresos", value: format(stats.revenue), color: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default function AdminPage() { return <AdminShell><DashboardContent /></AdminShell> }
