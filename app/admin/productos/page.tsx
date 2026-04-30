"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { StatCard } from "@/components/admin/charts"
import content from "@/content/es.json"

const c = content as any
const products = c.home?.productCatalog?.products || []

export default function AdminProducts() {
  const { authed } = useAdminAuth()
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<any>({})

  useEffect(() => { if (authed) {
    const saved = localStorage.getItem("viajero_admin_products")
    setItems(saved ? JSON.parse(saved) : [...products])
  }}, [authed])

  const save = () => {
    if (editing === null) return
    items[editing] = { ...items[editing], ...form }
    localStorage.setItem("viajero_admin_products", JSON.stringify(items))
    setEditing(null)
  }

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Productos ({items.length})</h1>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">Nombre</th><th className="px-4 py-3 text-gray-400">Precio</th><th className="px-4 py-3 text-gray-400">Stock</th><th className="px-4 py-3 text-gray-400">Cat.</th><th className="px-4 py-3 text-gray-400">Acción</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((p, i) => (
              <tr key={i} className="text-white hover:bg-gray-800/50">
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
                    <td className="px-4 py-3"><button onClick={() => { setForm({name: p.name, price: p.price, stock: p.stock, category: p.category}); setEditing(i) }} className="text-xs text-blue-400 hover:underline">Editar</button></td>
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
