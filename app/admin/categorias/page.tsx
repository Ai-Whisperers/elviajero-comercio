"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminCategories() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [cats, setCats] = useState<any[]>([])
  const [newCat, setNewCat] = useState("")

  useEffect(() => {
    if (!authed) return
    supabase.from("ej_categories").select("*").order("name").then(({ data }) => {
      if (data) setCats(data)
    })
  }, [authed, supabase])

  const add = async () => {
    if (!newCat.trim()) return
    const { data, error } = await supabase.from("ej_categories").insert({ name: newCat.trim() }).select().single()
    if (!error && data) {
      setCats([...cats, data])
      setNewCat("")
    }
  }

  const remove = async (id: string) => {
    await supabase.from("ej_categories").delete().eq("id", id)
    setCats(cats.filter(c => c.id !== id))
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
          <div key={cat.id} className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300">
            {cat.name}
            <button onClick={() => remove(cat.id)} className="text-gray-500 hover:text-red-400">x</button>
          </div>
        ))}
      </div>
    </>
  )
}
