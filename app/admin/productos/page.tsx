"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect, useCallback } from "react"
import { PageHeader, SearchInput } from "@/components/admin/ui"
import { ImageUpload } from "@/components/admin/image-upload"
import { Pencil, Copy, Trash2, Search, X, Plus, Package, Upload, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"

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
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const PER_PAGE = 20

  const notify = useCallback((type: "success" | "error", text: string) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    fetch(`/api/admin/products?page=${page}&perPage=${PER_PAGE}`)
      .then(r => r.json())
      .then(res => { if (res.data) { setItems(res.data); setTotal(res.total) }; setLoading(false) })
      .catch(() => { setLoading(false); notify("error", "Error al cargar productos") })
  }, [authed, page, notify])

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/admin/products?page=${page}&perPage=${PER_PAGE}`)
      .then(r => r.json())
      .then(res => { if (res.data) { setItems(res.data); setTotal(res.total) }; setLoading(false) })
      .catch(() => { setLoading(false); notify("error", "Error al cargar productos") })
  }, [page, notify])

  const save = async () => {
    if (editing === null) return
    const item = items[editing]
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, ...form })
    })
    if (res.ok) {
      items[editing] = { ...item, ...form }
      setItems([...items])
      setEditing(null)
      notify("success", "Producto actualizado")
    } else {
      notify("error", "Error al guardar")
    }
  }

  const add = async () => {
    if (!newForm.name) return notify("error", "El nombre es obligatorio")
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newForm)
    })
    if (res.ok) {
      const data = await res.json()
      setItems([data, ...items])
      setShowNew(false)
      setNewForm({})
      notify("success", "Producto creado")
    } else {
      notify("error", "Error al crear producto")
    }
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return
    await fetch("/api/admin/products?id=" + id, { method: "DELETE" })
    setItems(items.filter(p => p.id !== id))
    notify("success", "Producto eliminado")
  }

  const duplicate = async (p: any) => {
    const { id, created_at, ...rest } = p
    rest.name = p.name + " (copia)"
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest)
    })
    if (res.ok) {
      const data = await res.json()
      setItems([data, ...items])
      notify("success", "Producto duplicado")
    } else {
      notify("error", "Error al duplicar")
    }
  }

  const applyBulk = async () => {
    if (!bulkCategory && !bulkPercent) return
    const target = bulkCategory ? items.filter(p => p.category === bulkCategory) : items
    for (const p of target) {
      const priceNum = parseInt((p.price || "0").replace(/[^0-9]/g, ""), 10) || 0
      const newPrice = Math.round(priceNum * (1 + bulkPercent / 100))
      await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, price: "Gs. " + newPrice.toLocaleString("es-PY") })
      })
    }
    load()
    setShowBulk(false)
    notify("success", `Precios actualizados (${target.length} productos)`)
  }

  const categories = [...new Set(items.map(p => p.category).filter(Boolean))].sort()
  const filtered = search
    ? items.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.brand?.toLowerCase().includes(search.toLowerCase())
      )
    : items

  if (!authed) return null

  return (
    <div className="space-y-5">
      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl border transition-all ${
          notification.type === "success"
            ? "bg-emerald-900/90 border-emerald-700/60 text-emerald-200"
            : "bg-red-900/90 border-red-700/60 text-red-200"
        }`}>
          {notification.type === "success" ? <Package className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Productos</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            {total} productos en total
            {search && ` · ${filtered.length} resultados`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowBulk(!showBulk)}
            className="rounded-lg border border-zinc-700/60 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-600 transition-all">
            {showBulk ? "Cancelar" : "Actualización masiva"}
          </button>
          <button onClick={() => setShowNew(!showNew)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-600/20">
            <Plus className="w-3.5 h-3.5" />
            {showNew ? "Cancelar" : "Nuevo producto"}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar por nombre, categoría, marca..."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 pl-9 pr-9 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Bulk price update panel */}
      {showBulk && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/70 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-400" />
            Actualización masiva de precios
          </h3>
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Categoría</label>
              <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)}
                className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
                <option value="">Todas las categorías</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Porcentaje</label>
              <div className="flex items-center gap-1">
                <input type="number" value={bulkPercent} onChange={e => setBulkPercent(parseInt(e.target.value) || 0)}
                  className="w-24 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                <span className="text-sm text-zinc-500">{bulkPercent >= 0 ? "↑ aumento" : "↓ descuento"}</span>
              </div>
            </div>
            <button onClick={applyBulk}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Aplicar</button>
          </div>
        </div>
      )}

      {/* New product form */}
      {showNew && (
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/70 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white">Nuevo producto</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input value={newForm.name || ""} onChange={e => setNewForm({...newForm, name: e.target.value})} placeholder="Nombre *"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input value={newForm.price || ""} onChange={e => setNewForm({...newForm, price: e.target.value})} placeholder="Precio (Gs.)"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input value={newForm.category || ""} onChange={e => setNewForm({...newForm, category: e.target.value})} placeholder="Categoría"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
            <input type="number" value={newForm.stock ?? 0} onChange={e => setNewForm({...newForm, stock: parseInt(e.target.value) || 0})} placeholder="Stock"
              className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div className="flex items-center gap-3">
            <ImageUpload onUpload={(url) => setNewForm({...newForm, image_url: url})} />
            <button onClick={add}
              className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Guardar producto</button>
          </div>
        </div>
      )}

      {/* Image modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="" className="max-h-[80vh] max-w-[80vw] rounded-2xl border border-zinc-700/60 shadow-2xl" />
        </div>
      )}

      {/* Products table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/30">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800/60 bg-zinc-900/80">
                <th className="w-12 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Img</th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Nombre</th>
                <th className="w-28 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Precio</th>
                <th className="w-16 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Stock</th>
                <th className="w-28 px-3 py-3 text-left text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Categoría</th>
                <th className="w-40 px-3 py-3 text-right text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-3"><div className="h-9 w-9 rounded-lg bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-48 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-10 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-800" /></td>
                    <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-zinc-800 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <Package className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">
                      {search ? "No se encontraron productos con ese filtro" : "Sin productos todavía"}
                    </p>
                    {!search && (
                      <button onClick={() => setShowNew(true)}
                        className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-all">
                        <Plus className="w-3 h-3" /> Crear primer producto
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id || i} className="group hover:bg-zinc-800/30 transition-colors">
                    {editing === i ? (
                      <>
                        <td className="px-3 py-2">
                          <ImageUpload onUpload={(url) => setForm({...form, image_url: url})} currentUrl={form.image_url || p.image_url} />
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.name || p.name} onChange={e => setForm({...form, name: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.price || p.price} onChange={e => setForm({...form, price: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" value={form.stock ?? p.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})}
                            className="w-16 rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2">
                          <input value={form.category || p.category} onChange={e => setForm({...form, category: e.target.value})}
                            className="w-full rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button onClick={save}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-all">Guardar</button>
                            <button onClick={() => setEditing(null)}
                              className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all">Cancelar</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2.5">
                          {p.image_url && !p.image_url.includes(".svg") ? (
                            <img src={p.image_url} alt=""
                              className="h-9 w-9 rounded-lg border border-zinc-700/40 object-cover cursor-pointer ring-1 ring-black/20 hover:ring-2 hover:ring-emerald-500/40 transition-all"
                              onClick={() => setPreviewImg(p.image_url)} />
                          ) : (
                            <div className="h-9 w-9 rounded-lg border border-zinc-700/40 bg-zinc-800/50 flex items-center justify-center">
                              <Package className="w-4 h-4 text-zinc-600" />
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-white text-sm leading-tight">{p.name || <span className="text-zinc-600 italic">Sin nombre</span>}</div>
                          {p.brand && <div className="text-[11px] text-zinc-500 mt-0.5">{p.brand}</div>}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold text-white text-sm">{p.price || <span className="text-zinc-600">—</span>}</span>
                          {p.price_before && (
                            <span className="block text-[10px] text-zinc-600 line-through">{p.price_before}</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                            (p.stock || 0) > 10 ? "text-emerald-400" :
                            (p.stock || 0) > 0 ? "text-amber-400" :
                            "text-red-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              (p.stock || 0) > 10 ? "bg-emerald-400" :
                              (p.stock || 0) > 0 ? "bg-amber-400" :
                              "bg-red-400"
                            }`} />
                            {p.stock ?? 0}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-block rounded-md bg-zinc-800/60 px-2 py-0.5 text-[11px] font-medium text-zinc-400">
                            {p.category || <span className="text-zinc-600">—</span>}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setForm({name: p.name, price: p.price, stock: p.stock, category: p.category, image_url: p.image_url}); setEditing(i) }}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                              title="Editar producto">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => duplicate(p)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                              title="Duplicar producto">
                              <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={() => remove(p.id)}
                              className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                              title="Eliminar producto">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {total > PER_PAGE && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 text-xs">
            {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} de {total} productos
          </span>
          <div className="inline-flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft className="w-3.5 h-3.5" /> Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(total / PER_PAGE) }, (_, i) => i + 1)
                .filter(p => p === 1 || p === Math.ceil(total / PER_PAGE) || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => (
                  <span key={p} className="inline-flex items-center">
                    {idx > 0 && arr[idx-1] !== p - 1 && <span className="px-1 text-zinc-600 text-xs">…</span>}
                    <button onClick={() => setPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                        p === page
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                      }`}>
                      {p}
                    </button>
                  </span>
                ))}
            </div>
            <button onClick={() => setPage(p => p + 1)} disabled={page * PER_PAGE >= total}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              Siguiente <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
