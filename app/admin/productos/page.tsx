"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { ImageUpload } from "@/components/admin/image-upload"

export default function AdminProducts() {
  const { authed } = useAdminAuth()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<any>({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState<any>({})
  const [showBulk, setShowBulk] = useState(false)
  const [bulkCategory, setBulkCategory] = useState("")
  const [bulkPercent, setBulkPercent] = useState(0)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const PER_PAGE = 20

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch(`/api/admin/products?page=${page}&perPage=${PER_PAGE}`).then(r => r.json()).then(res => { if (res.data) { setItems(res.data); setTotal(res.total) }; setLoading(false) })
  }, [authed, page])

  const load = () => {
    setLoading(true)
    fetch(`/api/admin/products?page=${page}&perPage=${PER_PAGE}`).then(r => r.json()).then(res => { if (res.data) { setItems(res.data); setTotal(res.total) }; setLoading(false) })
  }

  const save = async () => {
    if (editing === null) return
    const item = items[editing]
    const res = await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id, ...form }) })
    if (res.ok) { items[editing] = { ...item, ...form }; setItems([...items]); setEditing(null) }
  }

  const add = async () => {
    if (!newForm.name) return
    const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newForm) })
    if (res.ok) { const data = await res.json(); setItems([...items, data]); setShowNew(false); setNewForm({}) }
  }

  const remove = async (id: string) => {
    await fetch("/api/admin/products?id=" + id, { method: "DELETE" })
    setItems(items.filter(p => p.id !== id))
  }

  const duplicate = async (p: any) => {
    const { id, created_at, ...rest } = p
    rest.name = p.name + " (copia)"
    const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(rest) })
    if (res.ok) { const data = await res.json(); setItems([...items, data]) }
  }

  const applyBulk = async () => {
    if (!bulkCategory && !bulkPercent) return
    const target = bulkCategory ? items.filter(p => p.category === bulkCategory) : items
    for (const p of target) {
      const priceNum = parseInt((p.price || "0").replace(/[^0-9]/g, ""), 10) || 0
      const newPrice = Math.round(priceNum * (1 + bulkPercent / 100))
      await fetch("/api/admin/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, price: "Gs. " + newPrice.toLocaleString("es-PY") }) })
    }
    load()
    setShowBulk(false)
  }

  const categories = [...new Set(items.map(p => p.category).filter(Boolean))]

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Productos ({total})</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowBulk(!showBulk)} className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white">{showBulk ? "Cancelar" : "Actualización masiva"}</button>
          <button onClick={() => setShowNew(!showNew)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">{showNew ? "Cancelar" : "+ Nuevo"}</button>
        </div>
      </div>

      {showBulk && (
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Actualización masiva de precios</h3>
          <div className="flex gap-3">
            <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} className="rounded bg-gray-800 px-3 py-2 text-sm text-white border border-gray-700">
              <option value="">Todas las categorías</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" value={bulkPercent} onChange={e => setBulkPercent(parseInt(e.target.value) || 0)} placeholder="%" className="w-24 rounded bg-gray-800 px-3 py-2 text-sm text-white border border-gray-700" />
            <span className="text-sm text-gray-400 self-center">% {bulkPercent >= 0 ? "aumento" : "descuento"}</span>
            <button onClick={applyBulk} className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-500">Aplicar</button>
          </div>
        </div>
      )}

      {showNew && (
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={newForm.name || ""} onChange={e => setNewForm({...newForm, name: e.target.value})} placeholder="Nombre" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={newForm.price || ""} onChange={e => setNewForm({...newForm, price: e.target.value})} placeholder="Precio (Gs.)" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={newForm.category || ""} onChange={e => setNewForm({...newForm, category: e.target.value})} placeholder="Categoría" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input type="number" value={newForm.stock ?? 0} onChange={e => setNewForm({...newForm, stock: parseInt(e.target.value) || 0})} placeholder="Stock" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
          </div>
          <ImageUpload onUpload={(url) => setNewForm({...newForm, image_url: url})} />
          <button onClick={add} className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500">Guardar</button>
        </div>
      )}

      <div className="overflow-x-auto max-h-[70vh] rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">Img</th><th className="px-4 py-3 text-gray-400">Nombre</th><th className="px-4 py-3 text-gray-400">Precio</th><th className="px-4 py-3 text-gray-400">Stock</th><th className="px-4 py-3 text-gray-400">Cat.</th><th className="px-4 py-3 text-gray-400">Acción</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-10 w-10 rounded bg-gray-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-gray-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-gray-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-12 rounded bg-gray-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-gray-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-gray-800" /></td>
                </tr>
              ))
            ) : (
              items.map((p, i) => (
              <tr key={p.id || i} className="text-white hover:bg-gray-800/50">
                {editing === i ? (
                  <>
                    <td className="px-4 py-2"><ImageUpload onUpload={(url) => setForm({...form, image_url: url})} currentUrl={form.image_url || p.image_url} /></td>
                    <td className="px-4 py-2"><input value={form.name || p.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2"><input value={form.price || p.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2"><input type="number" value={form.stock ?? p.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} className="w-20 rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2"><input value={form.category || p.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2 flex gap-2"><button onClick={save} className="text-xs text-green-400 hover:underline">Guardar</button><button onClick={() => setEditing(null)} className="text-xs text-gray-500 hover:underline">Cancelar</button></td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      {p.image_url ? <img src={p.image_url} alt="" className="h-10 w-10 rounded border border-gray-700 object-cover" /> : <div className="h-10 w-10 rounded border border-gray-700 bg-gray-800 flex items-center justify-center text-gray-400 text-xs">—</div>}
                    </td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.price}</td>
                    <td className="px-4 py-3"><span className={`${(p.stock || 0) > 5 ? "text-green-400" : (p.stock || 0) > 0 ? "text-yellow-400" : "text-red-400"}`}>{p.stock ?? 0}</span></td>
                    <td className="px-4 py-3 text-gray-400">{p.category}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => { setForm({name: p.name, price: p.price, stock: p.stock, category: p.category}); setEditing(i) }} className="text-xs text-blue-400 hover:underline">Editar</button>
                      <button onClick={() => duplicate(p)} className="text-xs text-amber-400 hover:underline">Duplicar</button>
                      <button onClick={() => remove(p.id)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            )))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Mostrando {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, total)} de {total} productos
        </span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Anterior</button>
          <button onClick={() => setPage(p => p + 1)} disabled={page * PER_PAGE >= total}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Siguiente</button>
        </div>
      </div>
    </>
  )
}
