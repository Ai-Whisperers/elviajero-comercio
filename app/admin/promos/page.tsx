"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, EmptyState, TableSkeleton } from "@/components/admin/ui"

export default function AdminPromos() {
  const { authed } = useAdminAuth()
  const [promos, setPromos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ code: "", type: "percentage", value: 10, minPurchase: 0, maxUses: 100, validFrom: "", validUntil: "" })

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    adminFetch("/api/admin/promos").then(r => r.json()).then(data => { if (Array.isArray(data)) setPromos(data); setLoading(false) })
  }, [authed])

  const filtered = search ? promos.filter(p => p.code.toLowerCase().includes(search.toLowerCase())) : promos

  const resetForm = () => setForm({ code: "", type: "percentage", value: 10, minPurchase: 0, maxUses: 100, validFrom: "", validUntil: "" })

  const save = async () => {
    const method = editingCode ? "PATCH" : "POST"
    const body: any = { code: form.code, type: form.type, value: form.value, min_purchase: form.minPurchase, max_uses: form.maxUses }
    if (form.validFrom) body.valid_from = form.validFrom
    if (form.validUntil) body.valid_until = form.validUntil
    if (editingCode) body.original_code = editingCode

    const res = await adminFetch("/api/admin/promos", { method, body: JSON.stringify(body) })
    if (res.ok) {
      resetForm()
      setShowForm(false)
      setEditingCode(null)
      adminFetch("/api/admin/promos").then(r => r.json()).then(data => { if (Array.isArray(data)) setPromos(data) })
    }
  }

  const remove = async (code: string) => {
    await adminFetch("/api/admin/promos?code=" + code, { method: "DELETE" })
    setPromos(promos.filter(p => p.code !== code))
  }

  const edit = async (p: any) => {
    setForm({
      code: p.code,
      type: p.type || "percentage",
      value: p.value || 10,
      minPurchase: p.min_purchase || 0,
      maxUses: p.max_uses || 100,
      validFrom: p.valid_from ? p.valid_from.slice(0, 10) : "",
      validUntil: p.valid_until ? p.valid_until.slice(0, 10) : ""
    })
    setEditingCode(p.code)
    setShowForm(true)
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title={"Códigos Promocionales (" + promos.length + ")"}
        actions={
          <div className="flex items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar código..." />
            <button onClick={() => { setShowForm(!showForm); setEditingCode(null); resetForm() }}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              {showForm ? "Cancelar" : "+ Nuevo"}
            </button>
          </div>
        }
      />
      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">{editingCode ? "Editar " + editingCode : "Nuevo código"}</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="CÓDIGO"
              className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white">
              <option value="percentage">% Descuento</option>
              <option value="fixed">Gs. fijo</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" value={form.value} onChange={e => setForm({...form, value: parseInt(e.target.value) || 0})}
              placeholder="Valor" className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            <input type="number" value={form.minPurchase} onChange={e => setForm({...form, minPurchase: parseInt(e.target.value) || 0})}
              placeholder="Compra mín. Gs." className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            <input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: parseInt(e.target.value) || 1})}
              placeholder="Usos máx." className="rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Válido desde</label>
              <input type="date" value={form.validFrom} onChange={e => setForm({...form, validFrom: e.target.value})}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Válido hasta</label>
              <input type="date" value={form.validUntil} onChange={e => setForm({...form, validUntil: e.target.value})}
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700/60 px-3 py-2 text-sm text-white" />
            </div>
          </div>
          <button onClick={save}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            {editingCode ? "Guardar cambios" : "Crear código"}
          </button>
        </div>
      )}
      {loading ? (
        <TableSkeleton rows={4} cols={1} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          }
          title={search ? "Sin resultados" : "Sin códigos promocionales"}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((p: any) => {
            const expired = p.valid_until && new Date(p.valid_until) < new Date()
            return (
              <div key={p.code} className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 hover:border-zinc-700/60 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{p.code}</p>
                    {expired && <span className="rounded-full bg-red-900/30 px-2 py-0.5 text-xs text-red-400">Expirado</span>}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {p.type === "percentage" ? `${p.value}%` : `Gs. ${(p.value || 0).toLocaleString("es-PY")}`}
                    {" · "}min Gs. {(p.min_purchase || 0).toLocaleString("es-PY")}
                    {" · "}{p.used_count || 0}/{p.max_uses || 100} usos
                    {p.valid_until && ` · hasta ${new Date(p.valid_until).toLocaleDateString("es")}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <button onClick={() => edit(p)} className="text-xs text-blue-400 hover:underline">Editar</button>
                  <button onClick={() => remove(p.code)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
