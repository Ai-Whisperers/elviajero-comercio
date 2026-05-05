"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminReviews() {
  const { authed } = useAdminAuth()
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/reviews").then(r => r.json()).then(data => { if (data) setReviews(data) })
  }, [authed])

  const remove = async (id: string) => {
    await fetch("/api/admin/reviews?id=" + id, { method: "DELETE" })
    setReviews(reviews.filter(r => r.id !== id))
  }

  const filtered = filter ? reviews.filter(r => r.product_name === filter) : reviews
  const productNames = [...new Set(reviews.map(r => r.product_name))]

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-white">Reseñas ({reviews.length})</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-3 py-1 text-xs font-medium ${!filter ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400"}`}>Todas</button>
        {productNames.map(n => (
          <button key={n} onClick={() => setFilter(n)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === n ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400"}`}>{n}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-400 text-sm">{Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < r.rating ? "★" : "☆"}</span>)}</div>
                <span className="text-sm font-medium text-white">{r.user_name}</span>
                <span className="text-xs text-zinc-500">{r.created_at ? new Date(r.created_at).toLocaleDateString("es") : ""}</span>
              </div>
              <button onClick={() => remove(r.id)} className="text-xs text-red-400 hover:underline">Eliminar</button>
            </div>
            <p className="text-sm text-zinc-300">{r.text}</p>
            <p className="mt-1 text-xs text-zinc-500">Producto: {r.product_name}</p>
          </div>
        ))}
        {filtered.length === 0 && <div className="flex flex-col items-center justify-center py-16 text-zinc-500"><svg className="w-12 h-12 mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg><p className="text-sm text-zinc-500">Sin reseñas</p></div>}
      </div>
    </>
  )
}
