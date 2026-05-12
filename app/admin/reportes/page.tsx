"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { exportOrdersCSV } from "@/lib/export-csv"
import { useState, useEffect } from "react"
import {
  PageHeader, StatCard, EmptyState, StatsGridSkeleton,
} from "@/components/admin/ui"

function RevenueChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
      <h3 className="text-sm font-semibold text-zinc-300 mb-5">Ingresos diarios (USD)</h3>
      <div className="flex items-end gap-[3px] h-48">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-emerald-600/40 to-emerald-500/60 hover:from-emerald-500/60 hover:to-emerald-400/80 transition-all min-h-[4px] cursor-pointer"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
              <span className="text-[8px] text-zinc-600 truncate w-full text-center group-hover:text-zinc-400 transition-colors">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TopProducts({ products, total }: { products: [string, number][]; total: number }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500 rounded-xl border border-zinc-800/60">
        <svg className="w-10 h-10 mb-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <p className="text-sm text-zinc-500">Sin datos de productos</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-12">#</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Producto</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Veces vendido</th>
            <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right w-48">% de pedidos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">
          {products.map(([name, count], i) => {
            const rankStyle =
              i === 0 ? "bg-yellow-500/20 text-yellow-400" :
              i === 1 ? "bg-zinc-400/20 text-zinc-300" :
              i === 2 ? "bg-amber-700/20 text-amber-500" :
              "bg-zinc-800 text-zinc-500"
            return (
              <tr key={i} className="text-white hover:bg-zinc-800/40 transition-colors">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${rankStyle}`}>
                    {i + 1}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{name}</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-semibold">{count}</span>
                  <span className="text-zinc-500 text-xs ml-1">uds.</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500/40 to-emerald-400/60"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-400 w-10 text-right">
                      {total > 0 ? Math.round((count / total) * 100) + "%" : "—"}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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

  const dayData = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).map(([label, v]) => ({
    label: label.slice(5),
    value: v.total / 7400,
  }))
  const topProducts = Object.entries(productCount).sort((a, b) => b[1] - a[1]).slice(0, 15)
  const totalRevenue = filtered.reduce((s, o) => s + parseNum(o.total), 0)
  const daysWithSales = Object.keys(byDay).length

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Reportes de ventas"
        subtitle={`${orders.length} pedidos en total · ${filtered.length} en el período`}
        actions={
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="rounded-lg bg-zinc-800/50 border border-zinc-700/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
            />
            <span className="text-zinc-600 text-xs">→</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="rounded-lg bg-zinc-800/50 border border-zinc-700/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => exportOrdersCSV(filtered)}
              className="ml-2 rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar CSV
            </button>
          </div>
        }
      />

      {loading ? (
        <StatsGridSkeleton count={4} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          title="No hay datos de ventas"
          description="Los reportes aparecerán cuando haya pedidos"
        />
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Ingresos"
              value={"Gs. " + totalRevenue.toLocaleString("es-PY")}
              sub={filtered.length + " pedidos"}
              color="emerald"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              label="En USD"
              value={"$" + (totalRevenue / 7400).toFixed(2)}
              sub={"Tasa: 7.400 PYG"}
              color="blue"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            <StatCard
              label="Promedio por pedido"
              value={"Gs. " + (filtered.length ? Math.round(totalRevenue / filtered.length).toLocaleString("es-PY") : "0")}
              sub={"por pedido"}
              color="amber"
            />
            <StatCard
              label="Días con ventas"
              value={String(daysWithSales)}
              sub={dateFrom.slice(5) + " — " + dateTo.slice(5)}
              color="purple"
            />
          </div>

          {/* Chart */}
          {dayData.length > 0 && (
            <div className="mb-8">
              <RevenueChart data={dayData} />
            </div>
          )}

          {/* Top products */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Productos más vendidos</h2>
          </div>
          <TopProducts products={topProducts} total={filtered.length} />
        </>
      )}
    </>
  )
}
