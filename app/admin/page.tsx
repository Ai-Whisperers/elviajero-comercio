"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { BarChart, StatCard } from "@/components/admin/charts"
import { exportOrdersCSV } from "@/lib/export-csv"
import { useAutoRefresh } from "@/lib/auto-refresh"
import { useState, useEffect } from "react"

function DashboardContent() {
  const { authed } = useAdminAuth()
  const { refreshKey, refresh } = useAutoRefresh(30000)
  const [stats, setStats] = useState({ users: 0, orders: 0, revenue: 0 })
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (!authed) return
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const all: any[] = []
    users.forEach((u: any) => {
      const ords = JSON.parse(localStorage.getItem(`viajero_orders_${u.id}`) || "[]")
      all.push(...ords.map((o: any) => ({ ...o, user: u.name })))
    })
    setOrders(all.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10))
    const parse = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
    setStats({ users: users.length, orders: all.length, revenue: all.reduce((s, o) => s + parse(o.total), 0) })
  }, [authed, refreshKey])

  const format = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Dashboard</h1>
      <button onClick={refresh} className="mb-6 rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all">\u21bb Actualizar</button>
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

{orders.length > 0 && (<div className="mb-8"><BarChart title="Pedidos ultimos 7 dias" data={(()=>{const d: Record<string, number> = {};for(let i=6;i>=0;i--){const t=new Date();t.setDate(t.getDate()-i);d[t.toLocaleDateString("es",{weekday:"short"})]=0}orders.forEach((o:any)=>{const t=new Date(o.date).toLocaleDateString("es",{weekday:"short"});if(t in d)d[t]++});return Object.entries(d).map(([l,v])=>({label:l,value:v}))})()}/></div>)}
      <h2 className="mb-4 text-lg font-bold text-white">Pedidos recientes</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">ID</th><th className="px-4 py-3 text-gray-400">Usuario</th><th className="px-4 py-3 text-gray-400">Total</th><th className="px-4 py-3 text-gray-400">Estado</th><th className="px-4 py-3 text-gray-400">Fecha</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {orders.map((o) => (
              <tr key={o.id} className="text-white hover:bg-gray-800/50">
                <td className="px-4 py-3">#{o.id.slice(0, 8)}</td>
                <td className="px-4 py-3">{o.user || "Invitado"}</td>
                <td className="px-4 py-3">{o.total}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${o.status === "pendiente" ? "bg-yellow-900/30 text-yellow-400" : o.status === "confirmado" ? "bg-green-900/30 text-green-400" : o.status === "enviado" ? "bg-blue-900/30 text-blue-400" : o.status === "entregado" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>{o.status}</span></td>
                <td className="px-4 py-3 text-gray-400">{new Date(o.date).toLocaleDateString("es")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function AdminPage() { return <AdminShell><DashboardContent /></AdminShell> }
