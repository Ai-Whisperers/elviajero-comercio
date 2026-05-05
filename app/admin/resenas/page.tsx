"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminReviews() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [reviews, setReviews] = useState<any[]>([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    if (!authed) return
    supabase.from("ej_reviews").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setReviews(data)
    })
  }, [authed, supabase])

  const remove = async (id: string) => {
    await supabase.from("ej_reviews").delete().eq("id", id)
    setReviews(reviews.filter(r => r.id !== id))
  }

  const filtered = filter ? reviews.filter(r => r.product_name === filter) : reviews
  const productNames = [...new Set(reviews.map(r => r.product_name))]

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Reseñas ({reviews.length})</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-3 py-1 text-xs font-medium ${!filter ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400"}`}>Todas</button>
        {productNames.map(n => (
          <button key={n} onClick={() => setFilter(n)} className={`rounded-full px-3 py-1 text-xs font-medium ${filter === n ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400"}`}>{n}</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-400 text-sm">{Array.from({ length: 5 }).map((_, i) => <span key={i}>{i < r.rating ? "★" : "☆"}</span>)}</div>
                <span className="text-sm font-medium text-white">{r.user_name}</span>
                <span className="text-xs text-gray-500">{r.created_at ? new Date(r.created_at).toLocaleDateString("es") : ""}</span>
              </div>
              <button onClick={() => remove(r.id)} className="text-xs text-red-400 hover:underline">Eliminar</button>
            </div>
            <p className="text-sm text-gray-300">{r.text}</p>
            <p className="mt-1 text-xs text-gray-500">Producto: {r.product_name}</p>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-500">Sin reseñas</div>}
      </div>
    </>
  )
}
