"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminPromos() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [promos, setPromos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: "", type: "percentage", value: 10, minPurchase: 0, maxUses: 100 })

  useEffect(() => {
    if (authed) supabase.from("ej_promo_codes").select("*").then(({ data }) => {
      if (data) setPromos(data)
    })
  }, [authed, supabase])

  const add = async () => {
    const { data, error } = await supabase.from("ej_promo_codes").insert({
      code: form.code, type: form.type, value: form.value,
      min_purchase: form.minPurchase, max_uses: form.maxUses,
    }).select().single()
    if (!error && data) {
      setPromos([...promos, data])
      setShowForm(false)
      setForm({ code: "", type: "percentage", value: 10, minPurchase: 0, maxUses: 100 })
    }
  }

  const remove = async (code: string) => {
    await supabase.from("ej_promo_codes").delete().eq("code", code)
    setPromos(promos.filter(p => p.code !== code))
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Códigos Promocionales</h1>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">{showForm ? "Cancelar" : "+ Nuevo"}</button>
      </div>
      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} placeholder="CÓDIGO" className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white" />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white"><option value="percentage">%</option><option value="fixed">Gs. fijo</option></select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input type="number" value={form.value} onChange={e => setForm({...form, value: parseInt(e.target.value) || 0})} placeholder="Valor" className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white" />
            <input type="number" value={form.minPurchase} onChange={e => setForm({...form, minPurchase: parseInt(e.target.value) || 0})} placeholder="Compra mín." className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white" />
            <input type="number" value={form.maxUses} onChange={e => setForm({...form, maxUses: parseInt(e.target.value) || 1})} placeholder="Usos máx." className="rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-sm text-white" />
          </div>
          <button onClick={add} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">Guardar</button>
        </div>
      )}
      <div className="space-y-2">
        {promos.map((p: any) => (
          <div key={p.code} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4">
            <div><p className="font-bold text-white">{p.code}</p><p className="text-xs text-gray-500">{p.type === "percentage" ? `${p.value}%` : `Gs. ${(p.value || 0).toLocaleString("es-PY")}`} · min Gs. {(p.min_purchase || 0).toLocaleString("es-PY")} · {p.used_count || 0}/{p.max_uses || 100}</p></div>
            <button onClick={() => remove(p.code)} className="text-xs text-red-400 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
    </>
  )
}
