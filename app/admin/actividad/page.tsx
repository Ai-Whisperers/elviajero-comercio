"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"
import { Activity, Filter, RotateCcw } from "lucide-react"

const actionLabels: Record<string, string> = {
  "product.price_update": "Precio actualizado",
  "product.import_update": "Producto actualizado (importación)",
  "product.import_create": "Producto creado (importación)",
  "order.update": "Pedido actualizado",
  "stock.add": "Ingreso de stock",
  "stock.remove": "Retiro de stock",
  "stock.adjustment": "Ajuste de stock",
  "stock.sale": "Venta",
  "stock.return": "Devolución"
}

const actionIcons: Record<string, string> = {
  "product.price_update": "💰",
  "product.import_update": "📥",
  "product.import_create": "✨",
  "order.update": "📦",
  "stock.add": "📈",
  "stock.remove": "📉",
  "stock.adjustment": "⚖️",
  "stock.sale": "🛒",
  "stock.return": "↩️"
}

export default function AdminActivity() {
  const { authed } = useAdminAuth()
  const [activity, setActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("")
  const [limit, setLimit] = useState(50)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    const params = new URLSearchParams({ limit: String(limit) })
    if (filter) params.set("action", filter)
    adminFetch(`/api/admin/activity?${params}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setActivity(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authed, filter, limit])

  if (!authed) return null

  const actionTypes = [...new Set(activity.map(a => a.action))]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Actividad"
        subtitle="Registro de cambios en productos, pedidos, stock y precios"
        actions={
          <button onClick={() => { setFilter(""); setLimit(50) }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setFilter("")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            !filter ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
          }`}>
          Todos
        </button>
        {actionTypes.map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === a ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
            }`}>
            {actionIcons[a] || "•"} {actionLabels[a] || a}
          </button>
        ))}
      </div>

      {/* Activity list */}
      {loading ? (
        <TableSkeleton rows={8} cols={3} />
      ) : activity.length === 0 ? (
        <EmptyState
          icon={<Activity className="w-8 h-8" />}
          title="Sin actividad registrada"
          description="Los cambios en productos, pedidos y stock aparecerán aquí automáticamente."
        />
      ) : (
        <div className="space-y-2">
          {activity.map((a: any) => (
            <div key={a.id} className="flex items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4 hover:border-zinc-700/60 transition-all">
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 flex items-center justify-center text-sm shrink-0">
                {actionIcons[a.action] || "📋"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-white truncate">
                    {actionLabels[a.action] || a.action}
                  </p>
                  <span className="text-[10px] text-zinc-600 shrink-0">
                    {a.created_at ? new Date(a.created_at).toLocaleString("es", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    }) : ""}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{a.summary || "—"}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-zinc-600 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                    {a.entity_type}
                  </span>
                  {a.entity_id && (
                    <span className="text-[10px] text-zinc-600">ID: {a.entity_id}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {activity.length >= limit && (
            <button onClick={() => setLimit(l => l + 50)}
              className="w-full py-3 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Cargar más ({limit} mostrados)
            </button>
          )}
        </div>
      )}
    </div>
  )
}
