"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"

interface ReturnRequest {
  id: string
  order_id: string
  customer_name: string
  items: { name: string; quantity: number; reason: string }[]
  status: "pending" | "approved" | "rejected" | "completed"
  type: "return" | "exchange"
  created_at: string
}

export default function ReturnsPage() {
  const { authed } = useAdminAuth()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    adminFetch("/api/admin/returns")
      .then(r => r.json())
      .then(data => { setReturns(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authed])

  const updateStatus = async (id: string, status: ReturnRequest["status"]) => {
    await adminFetch("/api/admin/returns", {
      method: "PATCH",
      body: JSON.stringify({ id, status })
    })
    setReturns(returns.map(r => r.id === id ? { ...r, status } : r))
  }

  if (!authed) return null

  return (
    <>
      <PageHeader title="Devoluciones y Cambios" subtitle={`${returns.length} solicitudes`} />

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : returns.length === 0 ? (
        <EmptyState icon={<span className="text-2xl">🔄</span>} title="Sin solicitudes" description="Las devoluciones y cambios aparecerán cuando los clientes las soliciten" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Pedido</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Tipo</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Productos</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {returns.map(r => (
                <tr key={r.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 font-mono text-zinc-400">{r.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-zinc-400">#{r.order_id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-white">{r.customer_name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${r.type === "return" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"}`}>
                      {r.type === "return" ? "Devolución" : "Cambio"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {r.items?.map((i, idx) => (
                      <div key={idx}>{i.name} x{i.quantity} — {i.reason}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value as any)}
                      className={`rounded-lg border px-2 py-1 text-xs font-medium outline-none cursor-pointer ${
                        r.status === "approved" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        r.status === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                        r.status === "completed" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="approved">Aprobado</option>
                      <option value="rejected">Rechazado</option>
                      <option value="completed">Completado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
