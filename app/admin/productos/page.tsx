"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminProducts() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<any>({})
  const [showNew, setShowNew] = useState(false)
  const [newForm, setNewForm] = useState<any>({})

  useEffect(() => {
    if (!authed) return
    supabase.from("products").select("*").order("name").then(({ data }) => {
      if (data) setItems(data)
    })
  }, [authed, supabase])

  const save = async () => {
    if (editing === null) return
    const item = items[editing]
    const { error } = await supabase.from("products").update(form).eq("id", item.id)
    if (!error) {
      items[editing] = { ...item, ...form }
      setItems([...items])
      setEditing(null)
    }
  }

  const add = async () => {
    if (!newForm.name) return
    const { data, error } = await supabase.from("products").insert([newForm]).select()
    if (!error && data) {
      setItems([...items, ...data])
      setShowNew(false)
      setNewForm({})
    }
  }

  const remove = async (id: string) => {
    await supabase.from("products").delete().eq("id", id)
    setItems(items.filter(p => p.id !== id))
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Productos ({items.length})</h1>
        <button onClick={() => setShowNew(!showNew)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">{showNew ? "Cancelar" : "+ Nuevo"}</button>
      </div>

      {showNew && (
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={newForm.name || ""} onChange={e => setNewForm({...newForm, name: e.target.value})} placeholder="Nombre" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={newForm.price || ""} onChange={e => setNewForm({...newForm, price: e.target.value})} placeholder="Precio (Gs.)" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={newForm.category || ""} onChange={e => setNewForm({...newForm, category: e.target.value})} placeholder="Categoría" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input type="number" value={newForm.stock ?? 0} onChange={e => setNewForm({...newForm, stock: parseInt(e.target.value) || 0})} placeholder="Stock" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
          </div>
          <button onClick={add} className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500">Guardar</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">Nombre</th><th className="px-4 py-3 text-gray-400">Precio</th><th className="px-4 py-3 text-gray-400">Stock</th><th className="px-4 py-3 text-gray-400">Cat.</th><th className="px-4 py-3 text-gray-400">Acción</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((p, i) => (
              <tr key={p.id || i} className="text-white hover:bg-gray-800/50">
                {editing === i ? (
                  <>
                    <td className="px-4 py-2"><input value={form.name || p.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2"><input value={form.price || p.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2"><input type="number" value={form.stock ?? p.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} className="w-20 rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2"><input value={form.category || p.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" /></td>
                    <td className="px-4 py-2 flex gap-2"><button onClick={save} className="text-xs text-green-400 hover:underline">Guardar</button><button onClick={() => setEditing(null)} className="text-xs text-gray-500 hover:underline">Cancelar</button></td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">{p.price}</td>
                    <td className="px-4 py-3"><span className={`${(p.stock || 0) > 5 ? "text-green-400" : (p.stock || 0) > 0 ? "text-yellow-400" : "text-red-400"}`}>{p.stock ?? 0}</span></td>
                    <td className="px-4 py-3 text-gray-400">{p.category}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => { setForm({name: p.name, price: p.price, stock: p.stock, category: p.category}); setEditing(i) }} className="text-xs text-blue-400 hover:underline">Editar</button>
                      <button onClick={() => remove(p.id)} className="text-xs text-red-400 hover:underline">Eliminar</button>
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
