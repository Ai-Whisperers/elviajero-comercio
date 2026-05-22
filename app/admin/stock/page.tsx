"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect, useCallback } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"
import { Package, ArrowUpRight, ArrowDownRight, RotateCcw, TrendingUp, Search } from "lucide-react"

const typeLabels: Record<string, { label: string; color: string }> = {
  add: { label: "Ingreso", color: "text-emerald-400" },
  remove: { label: "Retiro", color: "text-red-400" },
  adjustment: { label: "Ajuste", color: "text-amber-400" },
  sale: { label: "Venta", color: "text-blue-400" },
  return: { label: "Devolución", color: "text-purple-400" }
}

export default function AdminStock() {
  const { authed } = useAdminAuth()
  const [movements, setMovements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [productSearch, setProductSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const load = useCallback(() => {
    if (!authed) return
    setLoading(true)
    const params = new URLSearchParams()
    if (productSearch) params.set("product_id", productSearch)
    adminFetch(`/api/admin/stock-movements?${params}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMovements(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authed, productSearch])

  useEffect(() => { load() }, [load])

  if (!authed) return null

  const filtered = typeFilter
    ? movements.filter(m => m.type === typeFilter)
    : movements

  return (
    <div className="space-y-5">
      <PageHeader
        title="Movimientos de Stock"
        subtitle="Historial completo de ingresos, retiros, ajustes y devoluciones"
        actions={
          <button onClick={() => { setTypeFilter(""); setProductSearch("") }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar filtros
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setTypeFilter("")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            !typeFilter ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
          }`}>
          Todos
        </button>
        {Object.entries(typeLabels).map(([key, val]) => (
          <button key={key} onClick={() => setTypeFilter(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              typeFilter === key ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
            }`}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <TableSkeleton rows={10} cols={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Sin movimientos"
          description="Los cambios de stock aparecerán aquí cuando se registren desde la página de productos."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/30">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800/60 bg-zinc-900/80">
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Cantidad</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Stock (antes → después)</th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Referencia</th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {filtered.map((m: any) => (
                  <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${typeLabels[m.type]?.color || "text-zinc-400"}`}>
                        {m.type === "add" || m.type === "return" ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {typeLabels[m.type]?.label || m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white font-medium">{m.ej_products?.name || `Producto #${m.product_id}`}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-white">{m.quantity}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {m.stock_before} → {m.stock_after}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {m.reference || m.note || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-zinc-600">
                      {m.created_at ? new Date(m.created_at).toLocaleString("es", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      }) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
