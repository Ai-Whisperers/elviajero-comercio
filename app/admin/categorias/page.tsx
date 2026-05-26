"use client"
import { adminFetch } from "@/lib/admin-fetch"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, EmptyState, StatsGridSkeleton } from "@/components/admin/ui"

function slugify(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
}

function CategoryRow({ cat, onDelete, onUpdate }: { cat: any; onDelete: (id: string) => void; onUpdate: (cat: any) => void }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(cat.name)
  const [slug, setSlug] = useState(cat.slug || "")
  const [orderIndex, setOrderIndex] = useState(cat.order_index ?? 99)
  const [active, setActive] = useState(cat.active !== false)

  const handleSave = async () => {
    const updates = { id: cat.id, name, slug: slug || slugify(name), order_index: Number(orderIndex), active }
    const res = await adminFetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const data = await res.json()
      onUpdate(data.category)
      setEditing(false)
    }
  }

  const handleCancel = () => {
    setName(cat.name)
    setSlug(cat.slug || "")
    setOrderIndex(cat.order_index ?? 99)
    setActive(cat.active !== false)
    setEditing(false)
  }

  if (editing) {
    return (
      <tr className="border-zinc-700/50 bg-zinc-800/80">
        <td className="px-3 py-2">
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-sm text-white" />
        </td>
        <td className="px-3 py-2">
          <input value={slug} onChange={e => setSlug(e.target.value)}
            className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-sm text-zinc-400" />
        </td>
        <td className="px-3 py-2">
          <input type="number" value={orderIndex} onChange={e => setOrderIndex(Number(e.target.value))}
            className="w-20 rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-sm text-white" />
        </td>
        <td className="px-3 py-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)}
              className="rounded border-zinc-600 bg-zinc-900" />
            <span className="text-xs text-zinc-400">{active ? "Activo" : "Inactivo"}</span>
          </label>
        </td>
        <td className="px-3 py-2 text-right">
          <button onClick={handleSave} className="mr-2 rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500">Guardar</button>
          <button onClick={handleCancel} className="rounded bg-zinc-600 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-500">Cancelar</button>
        </td>
      </tr>
    )
  }

  return (
    <tr className="border-zinc-700/50 hover:bg-zinc-800/40">
      <td className="px-3 py-2">
        <span className="font-medium text-white">{cat.name}</span>
        {cat.description && <p className="text-xs text-zinc-500 truncate max-w-[200px]">{cat.description}</p>}
      </td>
      <td className="px-3 py-2">
        <span className="text-xs font-mono text-zinc-400">{cat.slug || slugify(cat.name)}</span>
      </td>
      <td className="px-3 py-2">
        <span className="text-sm text-zinc-400">{cat.order_index ?? 99}</span>
      </td>
      <td className="px-3 py-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cat.active !== false ? "bg-emerald-900/50 text-emerald-400" : "bg-zinc-700/50 text-zinc-500"}`}>
          {cat.active !== false ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-1">
          <button onClick={() => setEditing(true)} className="rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-700 hover:text-white">Editar</button>
          <button onClick={() => onDelete(cat.id)} className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-red-900/40 hover:text-red-400">Eliminar</button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminCategories() {
  const { authed } = useAdminAuth()
  const [cats, setCats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // New category form
  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [newOrder, setNewOrder] = useState(99)

  // Subcategory modal
  const [selectedCat, setSelectedCat] = useState<any>(null)
  const [subcats, setSubcats] = useState<any[]>([])
  const [newSubName, setNewSubName] = useState("")
  const [showSubcats, setShowSubcats] = useState(false)

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    adminFetch("/api/categories").then(r => r.json()).then(data => {
      if (data.categories) setCats(data.categories)
      else if (Array.isArray(data)) setCats(data)
      setLoading(false)
    })
  }, [authed])

  const handleAdd = async () => {
    if (!newName.trim()) return
    const res = await adminFetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName.trim(),
        slug: newSlug || slugify(newName.trim()),
        order_index: Number(newOrder),
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setCats([...cats, data.category])
      setNewName("")
      setNewSlug("")
      setNewOrder(99)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría?")) return
    const res = await adminFetch("/api/categories?id=" + id, { method: "DELETE" })
    if (res.ok) setCats(cats.filter(c => c.id !== id))
  }

  const handleUpdate = (updated: any) => {
    setCats(cats.map(c => c.id === updated.id ? updated : c))
  }

  // Subcategory management
  const openSubcats = async (cat: any) => {
    setSelectedCat(cat)
    // Fetch subcats for this category
    const res = await adminFetch("/api/categories")
    if (res.ok) {
      const data = await res.json()
      const fullCat = (data.categories || data).find((c: any) => c.id === cat.id)
      setSubcats(fullCat?.subcategories || [])
    }
    setShowSubcats(true)
  }

  const handleAddSubcat = async () => {
    if (!newSubName.trim() || !selectedCat) return
    const res = await adminFetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newSubName.trim(),
        slug: slugify(newSubName.trim()),
        category_id: selectedCat.id,
        order_index: 99,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      setSubcats([...subcats, data.category])
      setNewSubName("")
    }
  }

  const handleDeleteSubcat = async (subcatId: string) => {
    const res = await adminFetch(`/api/categories?subcatId=${subcatId}`, { method: "DELETE" })
    if (res.ok) setSubcats(subcats.filter(s => s.id !== subcatId))
  }

  if (!authed) return null

  return (
    <>
      <PageHeader title={`Categorías (${cats.length})`} />

      {/* Add new category */}
      <div className="mb-6 rounded-xl border border-zinc-700/60 bg-zinc-800/40 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-300">Agregar categoría</h3>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Nombre</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nombre de categoría"
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Slug (opcional)</label>
            <input value={newSlug} onChange={e => setNewSlug(e.target.value)} placeholder="auto-generado"
              className="rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-500">Orden</label>
            <input type="number" value={newOrder} onChange={e => setNewOrder(Number(e.target.value))}
              className="w-20 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
          </div>
          <button onClick={handleAdd} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            Agregar
          </button>
        </div>
      </div>

      {/* Categories table */}
      {loading ? (
        <StatsGridSkeleton count={4} />
      ) : cats.length === 0 ? (
        <EmptyState
          icon={<svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          title="Sin categorías todavía"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-700/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700/50 bg-zinc-800/60">
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400">Nombre</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400">Slug</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400">Orden</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-zinc-400">Estado</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-zinc-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => (
                <CategoryRow key={cat.id} cat={cat} onDelete={handleDelete} onUpdate={handleUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Subcategory modal */}
      {showSubcats && selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-700/60 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Subcategorías: {selectedCat.name}</h3>
              <button onClick={() => setShowSubcats(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <div className="mb-4 flex gap-2">
              <input value={newSubName} onChange={e => setNewSubName(e.target.value)} placeholder="Nueva subcategoría"
                className="flex-1 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/50" />
              <button onClick={handleAddSubcat} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Agregar</button>
            </div>
            {subcats.length === 0 ? (
              <p className="text-sm text-zinc-500">Sin subcategorías todavía.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subcats.map(sub => (
                  <div key={sub.id} className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-800 px-4 py-2 text-sm text-zinc-300">
                    <span>{sub.name}</span>
                    <button onClick={() => handleDeleteSubcat(sub.id)} className="text-zinc-500 hover:text-red-400 text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}