"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import Link from "next/link"

const statuses = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"]
const statusColors: Record<string, string> = {
  pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entregado: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
}
const statusIcons: Record<string, string> = {
  pendiente: "🕐",
  confirmado: "✅",
  enviado: "🚚",
  entregado: "📦",
  cancelado: "❌",
}

export default function AdminOrders() {
  const { authed } = useAdminAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState("todos")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [noteInput, setNoteInput] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/orders").then(r => r.json()).then(data => {
      if (data) setOrders(data.map((o: any) => ({ ...o, items: typeof o.items === "string" ? JSON.parse(o.items) : o.items })))
      setLoading(false)
    })
  }, [authed])

  const update = async (orderId: string, newStatus: string) => {
    setStatusUpdating(orderId)
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: orderId, status: newStatus }) })
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    setStatusUpdating(null)
  }

  const saveNote = async (orderId: string) => {
    await fetch("/api/admin/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: orderId, note: noteText }) })
    setOrders(orders.map(o => o.id === orderId ? { ...o, note: noteText } : o))
    setNoteInput(null)
  }

  const filtered = orders.filter(o => {
    if (filter !== "todos" && o.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      const items = o.items || []
      return o.id?.toLowerCase().includes(q) || items.some((i: any) => (i.name || "").toLowerCase().includes(q)) || (o.customer_name || "").toLowerCase().includes(q)
    }
    return true
  })

  const counts = {} as any
  statuses.forEach(s => { counts[s] = orders.filter(o => o.status === s).length })

  if (!authed) return null

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{orders.length} pedidos totales</p>
        </div>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por ID, producto, cliente..."
          className="w-full sm:w-80 rounded-lg border border-zinc-700/60 bg-zinc-800/50 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder-zinc-500 transition-all" />
      </div>

      {/* Status filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("todos")}
          className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${filter === "todos" ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20" : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 border border-zinc-700/50"}`}>
          Todos ({orders.length})
        </button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${filter === s ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20" : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 border border-zinc-700/50"}`}>
            {statusIcons[s]} {s} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-24 rounded-md bg-zinc-800" />
                <div className="h-3 w-32 rounded-md bg-zinc-800" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-40 rounded-md bg-zinc-800" />
                  <div className="h-4 w-20 rounded-md bg-zinc-800" />
                </div>
                <div className="h-7 w-28 rounded-lg bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-base font-semibold text-zinc-300 mb-1">
            {search ? "No se encontraron pedidos" : "No hay pedidos todavía"}
          </p>
          <p className="text-sm text-zinc-500 mb-8">
            {search ? "Probá con otros términos de búsqueda" : "Los pedidos aparecerán aquí cuando los clientes compren"}
          </p>
          <div className="flex gap-3">
            <Link href="/admin/productos" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition-all">
              Ver productos
            </Link>
            <Link href="/tienda" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/20">
              Ir a la tienda
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>
      )}

      {/* Order cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map(o => (
            <div key={o.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 hover:border-zinc-700/60 transition-all">
              {/* Card header */}
              <div className="flex items-center justify-between mb-3">
                <Link href={"/admin/pedidos/detalle?id=" + o.id} className="font-bold text-white hover:text-emerald-400 transition-colors">
                  #{o.id?.slice(0, 8)}
                </Link>
                <span className="text-xs text-zinc-500">
                  {o.created_at ? new Date(o.created_at).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" }) : ""}
                </span>
              </div>

              {/* Card body */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm text-zinc-300 truncate">{o.customer_name || "Invitado"}</span>
                    {o.customer_phone && <span className="text-xs text-zinc-500 shrink-0">({o.customer_phone})</span>}
                  </div>
                  <p className="text-xs text-zinc-500 mb-0.5">
                    {o.items?.length || 0} {o.items?.length === 1 ? "artículo" : "artículos"}
                    {o.payment_method ? ` · ${o.payment_method}` : ""}
                  </p>
                  <p className="text-sm font-bold text-white mt-1">{o.total}</p>
                </div>

                {/* Status + actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <select value={o.status} onChange={e => update(o.id, e.target.value)} disabled={statusUpdating === o.id}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-all ${statusColors[o.status] || "bg-zinc-800 text-zinc-400 border-zinc-700"} ${statusUpdating === o.id ? "opacity-50" : "cursor-pointer hover:brightness-110"}`}>
                    {statuses.map(s => <option key={s} value={s}>{statusIcons[s]} {s}</option>)}
                  </select>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setNoteInput(o.id); setNoteText(o.note || "") }} 
                      className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors" title={o.note ? `Nota: ${o.note}` : "Agregar nota"}>
                      {o.note ? "📝" : "➕"}
                    </button>
                    <Link href={"/admin/pedidos/detalle?id=" + o.id} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      Detalle →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Note input */}
              {noteInput === o.id && (
                <div className="mt-4 pt-3 border-t border-zinc-800/60">
                  <div className="flex gap-2">
                    <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Nota interna..." autoFocus
                      className="flex-1 rounded-lg bg-zinc-800/50 border border-zinc-700/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50 placeholder-zinc-600" />
                    <button onClick={() => saveNote(o.id)} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Guardar</button>
                    <button onClick={() => setNoteInput(null)} className="text-xs text-zinc-500 hover:text-zinc-200 px-1">✕</button>
                  </div>
                </div>
              )}

              {/* Save note indicator */}
              {o.note && noteInput !== o.id && (
                <div className="mt-3 pt-3 border-t border-zinc-800/60">
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <span>📝</span>
                    <span className="truncate">{o.note}</span>
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
