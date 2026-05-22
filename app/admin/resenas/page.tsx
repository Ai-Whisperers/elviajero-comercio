"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, EmptyState, TableSkeleton, Badge } from "@/components/admin/ui"

export default function AdminReviews() {
  const { authed } = useAdminAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    adminFetch("/api/admin/reviews").then(r => r.json()).then(data => { if (data) setReviews(data); setLoading(false) }).catch(() => setLoading(false))
  }, [authed])

  const remove = async (id: string) => {
    await adminFetch("/api/admin/reviews?id=" + id, { method: "DELETE" })
    setReviews(reviews.filter(r => r.id !== id))
  }

  const productNames = [...new Set(reviews.map(r => r.product_name))]
  const filtered = reviews.filter(r => {
    if (filter && r.product_name !== filter) return false
    if (search && !r.user_name?.toLowerCase().includes(search.toLowerCase()) && !r.text?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (!authed) return null

  return (
    <>
      <PageHeader
        title={"Reseñas (" + reviews.length + ")"}
        subtitle="Opiniones de clientes sobre productos"
        actions={
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o texto..." />
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${!filter ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}>
          Todas
        </button>
        {productNames.map(n => (
          <button key={n} onClick={() => setFilter(n)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${filter === n ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"}`}>
            {n}
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={1} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          title={search || filter ? "Sin resultados" : "Sin reseñas todavía"}
          description={search || filter ? "Probá con otro filtro" : "Las reseñas aparecerán cuando los clientes dejen opiniones"}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 hover:border-zinc-700/60 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5 text-amber-400 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < r.rating ? "★" : "☆"}</span>)}
                  </div>
                  <span className="text-sm font-medium text-white">{r.user_name}</span>
                  <span className="text-xs text-zinc-500">{r.created_at ? new Date(r.created_at).toLocaleDateString("es") : ""}</span>
                </div>
                <button onClick={() => remove(r.id)} className="text-xs text-red-400 hover:underline">Eliminar</button>
              </div>
              <p className="text-sm text-zinc-300">{r.text}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge status="info">{r.product_name}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
