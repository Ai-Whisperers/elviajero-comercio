"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const statuses = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"]

export default function AdminOrders() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState("todos")

  useEffect(() => {
    if (!authed) return
    supabase.from("ej_orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setOrders(data.map((o: any) => ({ ...o, items: typeof o.items === "string" ? JSON.parse(o.items) : o.items })))
    })
  }, [authed, supabase])

  const update = async (orderId: string, newStatus: string) => {
    await supabase.from("ej_orders").update({ status: newStatus }).eq("id", orderId)
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const filtered = filter === "todos" ? orders : orders.filter(o => o.status === filter)

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Pedidos ({orders.length})</h1>
        <div className="flex gap-2">
          {["todos", ...statuses].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === s ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"}`}>{s === "todos" ? "Todos" : s}</button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">#{o.id?.slice(0, 8)}</span>
              <span className="text-xs text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString("es", { dateStyle: "long" }) : ""}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm"><p className="text-gray-400">{o.user_id?.slice(0, 8) || "Invitado"} · {o.items?.length || 0} artículos</p><p className="text-white font-bold mt-1">{o.total}</p></div>
              <select value={o.status} onChange={e => update(o.id, e.target.value)} className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-1.5 text-xs text-white">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">No hay pedidos</div>}
      </div>
    </>
  )
}
