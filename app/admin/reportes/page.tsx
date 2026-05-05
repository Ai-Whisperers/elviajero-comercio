"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { exportOrdersCSV } from "@/lib/export-csv"
import { useState, useEffect } from "react"

// Simple BarChart inline since the imported one might have issues
function SimpleBar({ title, data }: { title: string; data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-4">{title}</h3>
      <div className="flex items-end gap-1.5 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t bg-green-500/30 hover:bg-emerald-500/50 transition-all min-h-[4px]" style={{ height: `${(d.value / max) * 100}%` }} />
            <span className="text-[9px] text-zinc-500 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatCard({ label, value, color, sub }: { label: string; value: string; color: string; sub: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={"text-xl font-bold " + color}>{value}</p>
      <p className="text-xs text-zinc-600 mt-1">{sub}</p>
    </div>
  )
}

export default function SalesReport() {
  const { authed } = useAdminAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 30); return d.toISOString().split("T")[0]
  })
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0])

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/orders").then(r => r.json()).then(data => {
      if (data) setOrders(data.map((o: any) => ({ ...o, items: typeof o.items === "string" ? JSON.parse(o.items) : o.items, date: o.created_at || o.date })))
      setLoading(false)
    })
  }, [authed])

  const filtered = orders.filter(o => o.date >= dateFrom && o.date <= dateTo + "T23:59:59")
  const parseNum = (s: string) => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0
  const productCount: Record<string, number> = {}
  const byDay: Record<string, { total: number; count: number }> = {}

  filtered.forEach((o) => {
    const day = o.date?.split("T")[0] || ""
    if (!byDay[day]) byDay[day] = { total: 0, count: 0 }
    byDay[day].total += parseNum(o.total)
    byDay[day].count++
    ;(o.items || []).forEach((i: any) => { productCount[i.name] = (productCount[i.name] || 0) + 1 })
  })

  const dayData = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([label, v]) => ({ label: label.slice(5), value: v.total / 7400 }))
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 15)
  const totalRevenue = filtered.reduce((s, o) => s + parseNum(o.total), 0)

  if (!authed) return null

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Reportes de ventas</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{orders.length} pedidos en total · {filtered.length} en el período</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50" />
          <span className="text-zinc-600 text-xs">→</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50" />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
                <div className="h-3 w-16 rounded bg-zinc-800 mb-2" />
                <div className="h-6 w-24 rounded bg-zinc-800 mb-2" />
                <div className="h-3 w-20 rounded bg-zinc-800" />
              </div>
            ))}
          </div>
          <div className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-800/60" />
        </div>
      ) : orders.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500 rounded-xl border border-zinc-800/60 bg-zinc-900/50">
          <svg className="w-16 h-16 mb-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-base font-medium text-zinc-400 mb-1">No hay datos de ventas</p>
          <p className="text-sm text-zinc-600">Los reportes aparecerán cuando haya pedidos</p>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Ingresos" value={"Gs. " + totalRevenue.toLocaleString("es-PY")} color="text-green-400" sub={filtered.length + " pedidos"} />
            <StatCard label="En USD" value={"$" + (totalRevenue / 7400).toFixed(2)} color="text-blue-400" sub="Tasa: 7.400 PYG" />
            <StatCard label="Promedio" value={"Gs. " + (filtered.length ? Math.round(totalRevenue / filtered.length).toLocaleString("es-PY") : "0")} color="text-amber-400" sub="por pedido" />
            <StatCard label="Período" value={dateFrom + " — " + dateTo} color="text-purple-400" sub={Object.keys(byDay).length + " días con ventas"} />
          </div>

          {/* Chart */}
          {dayData.length > 0 && (
            <div className="mb-8">
              <SimpleBar title="Ingresos diarios (USD)" data={dayData} />
            </div>
          )}

          {/* Top products */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Productos más vendidos</h2>
            <button onClick={() => exportOrdersCSV(filtered)}
              className="rounded-lg border border-zinc-700/60 px-4 py-2 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-all flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Exportar CSV
            </button>
          </div>

          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500 rounded-xl border border-zinc-800/60">
              <svg className="w-10 h-10 mb-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <p className="text-sm">Sin datos de productos</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-800/60 bg-zinc-900/50 text-left">
                  <tr>
                    <th className="px-4 py-3 text-zinc-400 w-12">#</th>
                    <th className="px-4 py-3 text-zinc-400">Producto</th>
                    <th className="px-4 py-3 text-zinc-400 text-right">Veces vendido</th>
                    <th className="px-4 py-3 text-zinc-400 text-right">% de pedidos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {topProducts.map(([name, count], i) => (
                    <tr key={i} className="text-white hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? "bg-yellow-500/20 text-yellow-400" : i === 1 ? "bg-zinc-400/20 text-zinc-300" : i === 2 ? "bg-amber-700/20 text-amber-500" : "bg-zinc-800 text-zinc-500"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">{name}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold">{count}</span>
                        <span className="text-zinc-500 text-xs ml-1">uds.</span>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-400">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div className="h-full rounded-full bg-green-500/50" style={{ width: `${(count / filtered.length) * 100}%` }} />
                          </div>
                          <span className="text-xs w-10 text-right">{filtered.length > 0 ? Math.round((count / filtered.length) * 100) + "%" : "—"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  )
}
