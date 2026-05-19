"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"
import { AlertTriangle, Package, TrendingDown, ArrowRight } from "lucide-react"

export default function StockAlertsPage() {
  const { authed } = useAdminAuth()
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/stock-alerts")
      .then(r => r.json())
      .then(data => {
        setAlerts(data.alerts || [])
        setLoading(false)
      })
  }, [authed])

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Alertas de Stock"
        subtitle={`${alerts.length} productos bajo su umbral`}
      />

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={<span className="text-2xl">✅</span>}
          title="Stock saludable"
          description="Todos los productos están por encima de sus umbrales mínimos"
        />
      ) : (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
                <tr>
                  <th className="w-[450px] px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Producto</th>
                  <th className="w-[150px] px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categoría</th>
                  <th className="w-[140px] px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Stock actual</th>
                  <th className="w-[140px] px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Umbral</th>
                  <th className="w-[150px] px-5 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Estado</th>
                  <th className="w-[120px] px-5 py-4 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {alerts.map((a) => {
                  const threshold = a.stock_alert_threshold ?? 5
                  const stock = a.stock ?? 0
                  const percentage = Math.max(0, (stock / threshold) * 100)
                  const isCritical = stock === 0
                  const isWarning = stock > 0 && stock < threshold
                  const severity = isCritical ? 'critical' : isWarning ? 'warning' : 'ok'

                  return (
                    <tr key={a.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          {a.image_url ? (
                            <div className="flex-shrink-0">
                              <img src={a.image_url} alt="" className="w-12 h-12 rounded-xl object-cover ring-1 ring-black/20" />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-800/50 flex items-center justify-center ring-1 ring-black/20">
                              <Package className="w-5 h-5 text-zinc-600" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white text-base leading-tight">{a.name}</div>
                            {a.brand && <div className="text-xs text-zinc-500 mt-1">{a.brand}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-zinc-400">
                          {a.category || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold tabular-nums ${
                            isCritical ? 'text-red-400' :
                            isWarning ? 'text-amber-400' :
                            'text-emerald-400'
                          }`}>
                            {stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="inline-flex items-center rounded-lg bg-zinc-800/80 px-3 py-1.5 text-xs font-semibold text-zinc-300">
                            {threshold}
                            <span className="ml-1.5 text-zinc-500">unidades</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isCritical ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/30 border border-red-800/40">
                              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-red-400">Crítico</div>
                                <div className="text-[10px] text-red-500/70">Sin stock</div>
                              </div>
                            </div>
                          ) : isWarning ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-800/40">
                              <TrendingDown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                              <div>
                                <div className="text-xs font-semibold text-amber-400">Bajo</div>
                                <div className="text-[10px] text-amber-500/70">{Math.round(percentage)}% del umbral</div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-900/30 border border-emerald-800/40">
                              <Package className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <div className="text-xs font-semibold text-emerald-400">OK</div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={`/admin/productos?edit=${a.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/20"
                        >
                          Gestionar
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
