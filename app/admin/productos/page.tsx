"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, DataTable, Badge } from "@/components/admin/ui"
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
  const [search, setSearch] = useState("")
  const [hoverImg, setHoverImg] = useState<string | null>(null)
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
  const filtered = search ? items.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  ) : items

  if (!authed) return null

  return (
    <>
      <PageHeader
        title={"Productos (" + total + ")"}
        subtitle={search ? filtered.length + " resultados" : undefined}
        actions={
          <div className="flex items-center gap-2">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1) }} placeholder="Buscar por nombre, categoría..." />
            <button onClick={() => setShowBulk(!showBulk)}
              className="rounded-lg border border-zinc-700/60 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-all">
              {showBulk ? "Cancelar" : "Actualización masiva"}
            </button>
            <button onClick={() => setShowNew(!showNew)}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">
              {showNew ? "Cancelar" : "+ Nuevo"}
            </button>
          </div>
        }
      />

      {showBulk && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Actualización masiva de precios</h3>
          <div className="flex gap-3 flex-wrap">
            <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)}
              className="rounded bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60">
              <option value="">Todas las categorías</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" value={bulkPercent} onChange={e => setBulkPercent(parseInt(e.target.value) || 0)} placeholder="%"
              className="w-24 rounded bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60" />
            <span className="text-sm text-zinc-400 self-center">{bulkPercent >= 0 ? "Aumento %" : "Descuento %"}</span>
            <button onClick={applyBulk}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500">Aplicar</button>
          </div>
        </div>
      )}

      {showNew && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={newForm.name || ""} onChange={e => setNewForm({...newForm, name: e.target.value})} placeholder="Nombre"
              className="rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" />
            <input value={newForm.price || ""} onChange={e => setNewForm({...newForm, price: e.target.value})} placeholder="Precio (Gs.)"
              className="rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" />
            <input value={newForm.category || ""} onChange={e => setNewForm({...newForm, category: e.target.value})} placeholder="Categoría"
              className="rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" />
            <input type="number" value={newForm.stock ?? 0} onChange={e => setNewForm({...newForm, stock: parseInt(e.target.value) || 0})} placeholder="Stock"
              className="rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" />
          </div>
          <ImageUpload onUpload={(url) => setNewForm({...newForm, image_url: url})} />
          <button onClick={add} className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">Guardar</button>
        </div>
      )}

      {/* Image preview tooltip */}
      {hoverImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setHoverImg(null)}>
          <img src={hoverImg} alt="" className="max-h-[80vh] max-w-[80vw] rounded-xl border border-zinc-700/60" />
        </div>
      )}

      <div className="overflow-x-auto max-h-[70vh] rounded-xl border border-zinc-800/60">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-zinc-800/60 bg-zinc-900/50 text-left">
            <tr>
              <th className="px-4 py-3 text-zinc-400 w-14">Img</th>
              <th className="px-4 py-3 text-zinc-400">Nombre</th>
              <th className="px-4 py-3 text-zinc-400">Precio</th>
              <th className="px-4 py-3 text-zinc-400">Stock</th>
              <th className="px-4 py-3 text-zinc-400">Cat.</th>
              <th className="px-4 py-3 text-zinc-400">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3"><div className="h-10 w-10 rounded bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-40 rounded bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-12 rounded bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-20 rounded bg-zinc-800" /></td>
                  <td className="px-4 py-3"><div className="h-4 w-24 rounded bg-zinc-800" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-500">
                {search ? "No se encontraron productos con ese filtro" : "Sin productos todavía"}
              </td></tr>
            ) : (
              filtered.map((p, i) => (
              <tr key={p.id || i} className="text-white hover:bg-zinc-800/50">
                {editing === i ? (
                  <>
                    <td className="px-4 py-2"><ImageUpload onUpload={(url) => setForm({...form, image_url: url})} currentUrl={form.image_url || p.image_url} /></td>
                    <td className="px-4 py-2"><input value={form.name || p.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" /></td>
                    <td className="px-4 py-2"><input value={form.price || p.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" /></td>
                    <td className="px-4 py-2"><input type="number" value={form.stock ?? p.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} className="w-20 rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" /></td>
                    <td className="px-4 py-2"><input value={form.category || p.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded bg-zinc-800 px-2 py-1 text-sm text-white border border-zinc-700/60" /></td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={save} className="text-xs text-emerald-400 hover:underline">Guardar</button>
                      <button onClick={() => setEditing(null)} className="text-xs text-zinc-500 hover:underline">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      {p.image_url && !p.image_url.includes(".svg") ? (
                        <img src={p.image_url} alt=""
                          className="h-10 w-10 rounded border border-zinc-700/60 object-cover cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all"
                          onClick={() => setHoverImg(p.image_url)} />
                      ) : (
                        <div className="h-10 w-10 rounded border border-zinc-700/60 bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">—</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.price}</td>
                    <td className="px-4 py-3">
                      <span className={((p.stock || 0) > 5 ? "text-emerald-400" : (p.stock || 0) > 0 ? "text-yellow-400" : "text-red-400")}>{p.stock ?? 0}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">{p.category}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => { setForm({name: p.name, price: p.price, stock: p.stock, category: p.category}); setEditing(i) }}
                        className="text-xs text-blue-400 hover:underline">Editar</button>
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

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-zinc-500">
          Mostrando {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, total)} de {total} productos
        </span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Anterior</button>
          <button onClick={() => setPage(p => p + 1)} disabled={page * PER_PAGE >= total}
            className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed">Siguiente</button>
        </div>
      </div>
    </>
  )
}
