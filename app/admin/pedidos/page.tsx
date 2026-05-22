"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import {
  PageHeader, SearchInput, FilterBar, SummaryBar, OrderCard,
  CardSkeleton, EmptyState
} from "@/components/admin/ui"

const statusOptions = [
  { key: "todos", label: "Todos", icon: "📋" },
  { key: "pendiente", label: "Pendiente", icon: "🕐" },
  { key: "confirmado", label: "Confirmado", icon: "✅" },
  { key: "enviado", label: "Enviado", icon: "🚚" },
  { key: "entregado", label: "Entregado", icon: "📦" },
  { key: "cancelado", label: "Cancelado", icon: "❌" },
]

const PER_PAGE = 20

export default function AdminOrders() {
  const { authed } = useAdminAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState("todos")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [noteInput, setNoteInput] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    adminFetch("/api/admin/orders").then(r => r.json()).then(json => {
      const data = Array.isArray(json) ? json : json?.data ?? []
      if (data && data.length > 0) {
        setOrders(data.map((o: any) => ({
          ...o,
          items: typeof o.items === "string" ? JSON.parse(o.items) : o.items
        })))
      }
      setLoading(false)
    })
  }, [authed])

  const updatePayment = async (orderId: string, paymentStatus: string) => {
    await adminFetch("/api/admin/orders", {
      method: "PATCH",
      body: JSON.stringify({ id: orderId, payment_status: paymentStatus, payment_confirmed_at: paymentStatus === "verified" ? new Date().toISOString() : undefined })
    })
    setOrders(orders.map(o => o.id === orderId ? { ...o, payment_status: paymentStatus } : o))
  }

  const update = async (orderId: string, newStatus: string) => {
    await adminFetch("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id: orderId, status: newStatus }) })
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
  }

  const saveNote = async (orderId: string) => {
    await adminFetch("/api/admin/orders", { method: "PATCH", body: JSON.stringify({ id: orderId, note: noteText }) })
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

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

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
        />
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {paged.map(o => (
              <OrderCard
                key={o.id}
                order={o}
                onStatusChange={(id, s) => update(id, s)}
                onPaymentStatusChange={(id, ps) => updatePayment(id, ps)}
                onNoteToggle={(id) => { setNoteInput(id); setNoteText(o.note || "") }}
                noteInput={noteInput}
                noteText={noteText}
                onNoteChange={setNoteText}
                onNoteSave={saveNote}
                onNoteClose={() => setNoteInput(null)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-zinc-500">
                Mostrando {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} de {filtered.length} pedidos
              </span>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Anterior</button>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
                  className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Siguiente</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
