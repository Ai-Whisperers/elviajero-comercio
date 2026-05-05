"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminPromos() {
  const { authed } = useAdminAuth()
  const [promos, setPromos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ code: "", type: "percentage", value: 10, minPurchase: 0, maxUses: 100 })

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/promos").then(r => r.json()).then(data => { if (Array.isArray(data)) setPromos(data); setLoading(false) })
  }, [authed])

  const filtered = search ? promos.filter(p => p.code.toLowerCase().includes(search.toLowerCase())) : promos

  const add = async () => {
    const res = await fetch("/api/admin/promos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: form.code, type: form.type, value: form.value, min_purchase: form.minPurchase, max_uses: form.maxUses }) })
    if (res.ok) { const data = await res.json(); setPromos([...promos, data]); setShowForm(false); setForm({ code: "", type: "percentage", value: 10, minPurchase: 0, maxUses: 100 }) }
  }

  const remove = async (code: string) => {
    await fetch("/api/admin/promos?code=" + code, { method: "DELETE" })
    setPromos(promos.filter(p => p.code !== code))
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Códigos Promocionales ({promos.length})</h1>
        <div className="flex items-center gap-3">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar código..."
            className="w-48 rounded-lg border border-zinc-700/60 bg-zinc-800 px-4 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
          <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">{showForm ? "Cancelar" : "+ Nuevo"}</button>
        </div>
      </div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="CÓDIGO" className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white"><option value="percentage">%</option><option value="fixed">Gs. fijo</option></select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" value={form.value} onChange={e => setForm({...form, value: parseInt(e.target.value) || 0})} placeholder="Valor" className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            <input type="number" value={form.minPurchase} onChange={e => setForm({...form, minPurchase: parseInt(e.target.value) || 0})} placeholder="Compra mín." className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            <input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: parseInt(e.target.value) || 1})} placeholder="Usos máx." className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
          </div>
          <button onClick={add} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Guardar</button>
        </div>
      )}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
              <div className="h-4 w-24 rounded bg-zinc-800 mb-2" />
              <div className="h-3 w-48 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <svg className="w-12 h-12 mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          <p className="text-sm">{search ? "Sin resultados" : "Sin códigos promocionales"}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p: any) => (
            <div key={p.code} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
              <div><p className="font-bold text-white">{p.code}</p><p className="text-xs text-zinc-500">{p.type === "percentage" ? `${p.value}%` : `Gs. ${(p.value || 0).toLocaleString("es-PY")}`} · min Gs. {(p.min_purchase || 0).toLocaleString("es-PY")} · {p.used_count || 0}/{p.max_uses || 100}</p></div>
              <button onClick={() => remove(p.code)} className="text-xs text-red-400 hover:underline">Eliminar</button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
