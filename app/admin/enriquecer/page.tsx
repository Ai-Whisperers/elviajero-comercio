"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, EmptyState, TableSkeleton } from "@/components/admin/ui"

export default function AdminEnrich() {
  const { authed } = useAdminAuth()
  const [products, setProducts] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [enriching, setEnriching] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch("/api/admin/products").then(r => r.json()).then(data => { if (data) setProducts(data); setLoading(false) }).catch(() => setLoading(false))
  }, [authed])

  const save = async (id: string) => {
    setSaving(true)
    await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...form }) })
    setProducts(products.map(p => p.id === id ? { ...p, ...form } : p))
    setEditing(null)
    setSaving(false)
  }

  const enrich = async (id: string, name: string) => {
    setEnriching(id)
    try {
      const res = await fetch("/api/admin/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, current: form }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.suggested_description || data.suggested_specs || data.suggested_brand || data.suggested_weight) {
          setForm({
            ...form,
            description: data.suggested_description || form.description || "",
            specs: data.suggested_specs || form.specs || "",
            brand: data.suggested_brand || form.brand || "",
            weight: data.suggested_weight || form.weight || "",
          })
        }
      }
    } catch {}
    setEnriching(null)
  }

  const filtered = search
    ? products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()))
    : products

  if (!authed) return null

  const inputCls = "w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-2 py-1 text-sm text-white outline-none focus:border-emerald-500/50"

  return (
    <>
      <PageHeader
        title="Enriquecer productos"
        subtitle="Añadí descripciones, especificaciones, marcas y más para mejorar el SEO y la experiencia de compra."
        actions={<SearchInput value={search} onChange={setSearch} placeholder="Buscar productos..." />}
      />

      {loading ? (
        <TableSkeleton rows={6} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          title={search ? "Sin resultados" : "Sin productos"}
          description={search ? "Probá con otro término" : "Importá productos primero para poder enriquecerlos"}
        />
      ) : (
        <div className="overflow-x-auto max-h-[70vh] rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 border-b border-zinc-800/60 bg-zinc-900/50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase w-[200px]">Nombre</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Marca</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Descripción</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Especificaciones</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Peso</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase w-[120px]">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((p) => (
                <tr key={p.id} className="text-white hover:bg-zinc-800/50 transition-colors">
                  {editing === p.id ? (
                    <>
                      <td className="px-4 py-2 font-medium">{p.name}</td>
                      <td className="px-4 py-2">
                        <input value={form.brand || ""} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Marca" className={inputCls} />
                      </td>
                      <td className="px-4 py-2">
                        <textarea value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})}
                          placeholder="Descripción detallada para SEO" rows={2} className={inputCls + " resize-none"} />
                      </td>
                      <td className="px-4 py-2">
                        <input value={form.specs || ""} onChange={e => setForm({...form, specs: e.target.value})}
                          placeholder="Ej: 200x150x100cm, 2.5kg" className={inputCls} />
                      </td>
                      <td className="px-4 py-2">
                        <input value={form.weight || ""} onChange={e => setForm({...form, weight: e.target.value})}
                          placeholder="Ej: 2.5 kg" className={inputCls} />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <button onClick={() => save(p.id)} disabled={saving}
                            className="text-xs text-emerald-400 hover:underline disabled:opacity-50">Guardar</button>
                          <button onClick={() => setEditing(null)}
                            className="text-xs text-zinc-500 hover:underline">Cancelar</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.brand || <span className="text-zinc-600 italic">sin marca</span>}</td>
                      <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">{p.description || <span className="text-zinc-600 italic">sin descripción</span>}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.specs || <span className="text-zinc-600 italic">—</span>}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.weight || <span className="text-zinc-600 italic">—</span>}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setForm({brand: p.brand, description: p.description, specs: p.specs, weight: p.weight}); setEditing(p.id) }}
                            className="text-xs text-blue-400 hover:underline">Editar</button>
                          <button onClick={() => enrich(p.id, p.name)} disabled={enriching === p.id}
                            className="text-xs text-purple-400 hover:underline disabled:opacity-50 disabled:cursor-wait">
                            {enriching === p.id ? "Pensando..." : "✨ IA"}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
