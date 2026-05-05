"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminCategories() {
  const { authed } = useAdminAuth()
  const [cats, setCats] = useState<any[]>([])
  const [newCat, setNewCat] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/categories").then(r => r.json()).then(data => { if (Array.isArray(data)) setCats(data); setLoading(false) })
  }, [authed])

  const filtered = search ? cats.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : cats

  const add = async () => {
    if (!newCat.trim()) return
    const res = await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCat.trim() }) })
    if (res.ok) { const data = await res.json(); setCats([...cats, data]); setNewCat("") }
  }

  const remove = async (id: string) => {
    await fetch("/api/admin/categories?id=" + id, { method: "DELETE" })
    setCats(cats.filter(c => c.id !== id))
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Categorías ({cats.length})</h1>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar categoría..."
          className="w-56 rounded-lg border border-zinc-700/60 bg-zinc-800 px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
      </div>
      <div className="mb-6 flex gap-3">
        <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nueva categoría"
          className="flex-1 rounded-lg border border-zinc-700/60 bg-zinc-800 px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50" />
        <button onClick={add} className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500">Agregar</button>
      </div>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-zinc-800" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <svg className="w-12 h-12 mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <p className="text-sm">{search ? "Sin resultados" : "Sin categorías todavía"}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map(cat => (
            <div key={cat.id} className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
              {cat.name}
              <button onClick={() => remove(cat.id)} className="text-zinc-500 hover:text-red-400 text-xs">✕</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
