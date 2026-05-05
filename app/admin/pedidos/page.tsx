"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  PageHeader, SearchInput, FilterBar, SummaryBar, OrderCard,
  CardSkeleton, EmptyState, Badge,
} from "@/components/admin/ui"

const statusOptions = [
  { key: "todos", label: "Todos", icon: "📋" },
  { key: "pendiente", label: "Pendiente", icon: "🕐" },
  { key: "confirmado", label: "Confirmado", icon: "✅" },
  { key: "enviado", label: "Enviado", icon: "🚚" },
  { key: "entregado", label: "Entregado", icon: "📦" },
  { key: "cancelado", label: "Cancelado", icon: "❌" },
]

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

  const counts: Record<string, number> = {}
  statusOptions.slice(1).forEach(s => { counts[s.key] = orders.filter(o => o.status === s.key).length })

  if (!authed) return null

  const totalRevenue = orders.reduce((s, o) => {
    const n = parseInt((o.total || "0").replace(/[^0-9]/g, ""), 10) || 0
    return s + n
  }, 0)

  return (
    <>
      <PageHeader
        title="Pedidos"
        subtitle={`${orders.length} pedidos totales`}
        actions={
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por ID, producto, cliente..." />
        }
      />

      <SummaryBar
        items={[
          { label: "Total pedidos", value: String(orders.length) },
          { label: "Pendientes", value: String(counts.pendiente || 0), color: "text-yellow-400" },
          { label: "Enviados hoy", value: String(orders.filter(o => o.status === "enviado").length), color: "text-purple-400" },
          { label: "Ingresos", value: "Gs. " + (totalRevenue > 0 ? totalRevenue.toLocaleString("es-PY") : "0"), color: "text-emerald-400" },
        ]}
      />

      <div className="mb-6">
        <FilterBar options={statusOptions} active={filter} onChange={setFilter} counts={{ ...counts, todos: orders.length }} />
      </div>

      {loading ? (
        <CardSkeleton count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          title={search ? "No se encontraron pedidos" : "No hay pedidos todavía"}
          description={search ? "Probá con otros términos de búsqueda" : "Los pedidos aparecerán aquí cuando los clientes compren"}
          actions={
            <>
              <Link href="/admin/productos" className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 transition-all">
                Ver productos
              </Link>
              <Link href="/tienda" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/20">
                Ir a la tienda
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </>
          }
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {filtered.map(o => (
            <OrderCard
              key={o.id}
              order={o}
              onStatusChange={(id, s) => update(id, s)}
              onNoteToggle={(id) => { setNoteInput(id); setNoteText(o.note || "") }}
              noteInput={noteInput}
              noteText={noteText}
              onNoteChange={setNoteText}
              onNoteSave={saveNote}
              onNoteClose={() => setNoteInput(null)}
            />
          ))}
        </div>
      )}
    </>
  )
}
