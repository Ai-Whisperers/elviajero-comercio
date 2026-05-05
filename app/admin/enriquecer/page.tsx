"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminEnrich() {
  const { authed } = useAdminAuth()
  const [products, setProducts] = useState<any[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/products").then(r => r.json()).then(data => { if (data) setProducts(data) })
  }, [authed])

  const save = async (id: string) => {
    setSaving(true)
    await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...form }) })
    setProducts(products.map(p => p.id === id ? { ...p, ...form } : p))
    setEditing(null)
    setSaving(false)
  }

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-white">Enriquecer productos</h1>
      <p className="mb-6 text-sm text-zinc-400">Añadí descripciones, especificaciones, marcas y más para mejorar el SEO y la experiencia de compra.</p>

      <div className="overflow-x-auto max-h-[70vh] rounded-xl border border-zinc-800/60">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-zinc-800/60 bg-zinc-900/50 text-left">
            <tr>
              <th className="px-4 py-3 text-zinc-400 w-[200px]">Nombre</th>
              <th className="px-4 py-3 text-zinc-400">Marca</th>
              <th className="px-4 py-3 text-zinc-400">Descripción</th>
              <th className="px-4 py-3 text-zinc-400">Especificaciones</th>
              <th className="px-4 py-3 text-zinc-400">Peso</th>
              <th className="px-4 py-3 text-zinc-400 w-[60px]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {products.map((p) => (
              <tr key={p.id} className="text-white hover:bg-zinc-800/50">
                {editing === p.id ? (
                  <>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2"><input value={form.brand || ""} onChange={e => setForm({...form, brand: e.target.value})} placeholder="Marca" className="w-full rounded bg-zinc-800 px-2 py-1 text-sm border border-zinc-700/60" /></td>
                    <td className="px-4 py-2"><textarea value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} placeholder="Descripción detallada para SEO" rows={2} className="w-full rounded bg-zinc-800 px-2 py-1 text-sm border border-zinc-700/60 resize-none" /></td>
                    <td className="px-4 py-2"><input value={form.specs || ""} onChange={e => setForm({...form, specs: e.target.value})} placeholder="Ej: 200x150x100cm, 2.5kg" className="w-full rounded bg-zinc-800 px-2 py-1 text-sm border border-zinc-700/60" /></td>
                    <td className="px-4 py-2"><input value={form.weight || ""} onChange={e => setForm({...form, weight: e.target.value})} placeholder="Ej: 2.5 kg" className="w-24 rounded bg-zinc-800 px-2 py-1 text-sm border border-zinc-700/60" /></td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => save(p.id)} disabled={saving} className="text-xs text-green-400 hover:underline">Guardar</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-zinc-500 hover:underline">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-zinc-400">{p.brand || <span className="text-zinc-500 italic">sin marca</span>}</td>
                    <td className="px-4 py-3 text-zinc-400 max-w-xs truncate">{p.description || <span className="text-zinc-500 italic">sin descripción</span>}</td>
                    <td className="px-4 py-3 text-zinc-400">{p.specs || <span className="text-zinc-500 italic">—</span>}</td>
                    <td className="px-4 py-3 text-zinc-400">{p.weight || <span className="text-zinc-500 italic">—</span>}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setForm({brand: p.brand, description: p.description, specs: p.specs, weight: p.weight}); setEditing(p.id) }}
                        className="text-xs text-blue-400 hover:underline">Editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
