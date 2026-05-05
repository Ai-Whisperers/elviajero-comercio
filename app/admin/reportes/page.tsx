"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { BarChart, StatCard } from "@/components/admin/charts"
import { exportOrdersCSV } from "@/lib/export-csv"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SalesReport() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    if (!authed) return
    supabase.from("orders").select("*").order("created_at", { ascending: true }).then(({ data }) => {
      if (data) setOrders(data.map((o: any) => ({ ...o, items: typeof o.items === "string" ? JSON.parse(o.items) : o.items, date: o.created_at || o.date })))
    })
  }, [authed, supabase])

  const byMonth: Record<string, { total: number; count: number }> = {}
  const parseNum = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
  const productCount: Record<string, number> = {}

  orders.forEach((o) => {
    const month = new Date(o.date).toLocaleDateString("es", { month: "short", year: "2-digit" })
    if (!byMonth[month]) byMonth[month] = { total: 0, count: 0 }
    byMonth[month].total += parseNum(o.total)
    byMonth[month].count++
    ;(o.items || []).forEach((i: any) => { productCount[i.name] = (productCount[i.name] || 0) + 1 })
  })

  const monthData = Object.entries(byMonth).map(([label, v]) => ({ label, value: v.total / 7400 }))
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const totalRevenue = orders.reduce((s, o) => s + parseNum(o.total), 0)

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Reportes de ventas</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Ingresos totales" value={"Gs. " + totalRevenue.toLocaleString("es-PY")} color="text-green-400" sub={orders.length + " pedidos"} />
        <StatCard label="En USD" value={"$" + (totalRevenue / 7400).toFixed(2)} color="text-blue-400" sub={"Tasa: 1 USD = 7.400 PYG"} />
        <StatCard label="Promedio" value={"Gs. " + (orders.length ? Math.round(totalRevenue / orders.length).toLocaleString("es-PY") : "0")} color="text-amber-400" sub="por pedido" />
      </div>
      <div className="mb-8"><BarChart title="Ingresos mensuales (USD)" data={monthData} /></div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Productos más vendidos</h2>
        <button onClick={() => exportOrdersCSV(orders)} className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-all">Exportar CSV</button>
      </div>
      <div className="rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">Producto</th><th className="px-4 py-3 text-gray-400">Veces vendido</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {topProducts.map(([name, count], i) => (
              <tr key={i} className="text-white hover:bg-gray-800/50"><td className="px-4 py-3">{name}</td><td className="px-4 py-3">{count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
