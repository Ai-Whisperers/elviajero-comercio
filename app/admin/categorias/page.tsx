
"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminCategories() {
  const { authed } = useAdminAuth()
  const [cats, setCats] = useState<string[]>([])
  const [newCat, setNewCat] = useState("")

  useEffect(() => {
    if (!authed) return
    try {
      const saved = localStorage.getItem("viajero_admin_categories")
      setCats(saved ? JSON.parse(saved) : [])
    } catch {}
  }, [authed])

  const add = () => {
    if (!newCat.trim() || cats.includes(newCat.trim())) return
    const updated = [...cats, newCat.trim()]
    localStorage.setItem("viajero_admin_categories", JSON.stringify(updated))
    setCats(updated)
    setNewCat("")
  }

  const remove = (cat: string) => {
    const updated = cats.filter(c => c !== cat)
    localStorage.setItem("viajero_admin_categories", JSON.stringify(updated))
    setCats(updated)
  }

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Categorías ({cats.length})</h1>
      <div className="mb-6 flex gap-3">
        <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nueva categoría" className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none focus:border-green-500" />
        <button onClick={add} className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-500">Agregar</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {cats.map(cat => (
          <div key={cat} className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300">
            {cat}
            <button onClick={() => remove(cat)} className="text-gray-500 hover:text-red-400">x</button>
          </div>
        ))}
      </div>
    </>
  )
}
