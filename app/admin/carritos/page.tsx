"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState, TableSkeleton } from "@/components/admin/ui"

interface AbandonedCart {
  id: string
  customer_email: string
  items: { name: string; price: string }[]
  total: string
  created_at: string
  recovered: boolean
}

export default function AbandonedCartsPage() {
  const { authed } = useAdminAuth()
  const [carts, setCarts] = useState<AbandonedCart[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/abandoned-carts")
      .then(r => r.json())
      .then(data => { setCarts(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [authed])

  const markRecovered = async (id: string) => {
    await fetch("/api/admin/abandoned-carts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, recovered: true }),
    })
    setCarts(carts.map(c => c.id === id ? { ...c, recovered: true } : c))
  }

  if (!authed) return null

  return (
    <>
      <PageHeader title="Carritos Abandonados" subtitle={`${carts.filter(c => !c.recovered).length} sin recuperar`} />

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : carts.length === 0 ? (
        <EmptyState icon={<span className="text-2xl">🛒</span>} title="Sin carritos abandonados" description="Aparecerán cuando clientes agreguen productos sin finalizar la compra" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Cliente</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Productos</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {carts.map(c => (
                <tr key={c.id} className="hover:bg-zinc-800/30">
                  <td className="px-4 py-3 text-white">{c.customer_email || "Invitado"}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {c.items?.map((i, idx) => <div key={idx}>{i.name}</div>)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{c.total}</td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">{new Date(c.created_at).toLocaleDateString("es-PY")}</td>
                  <td className="px-4 py-3">
                    {c.recovered ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Recuperado</span>
                    ) : (
                      <button onClick={() => markRecovered(c.id)} className="text-xs text-emerald-400 hover:text-emerald-300">Marcar recuperado</button>
                    )}
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
