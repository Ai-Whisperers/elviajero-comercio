"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState } from "@/components/admin/ui"

export default function DeliveryZonesPage() {
  const { authed } = useAdminAuth()
  const [zones, setZones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: "", cities: "", cost: "", min_order: "", free_threshold: "" })

  useEffect(() => {
    if (!authed) return
    loadZones()
  }, [authed])

  const loadZones = () => {
    setLoading(true)
    fetch("/api/admin/delivery-zones")
      .then(r => r.json())
      .then(data => { setZones(Array.isArray(data) ? data : []); setLoading(false) })
  }

  const save = async () => {
    const cities = form.cities.split(",").map(c => c.trim()).filter(Boolean)
    const body = { name: form.name, cities, cost: form.cost, min_order: form.min_order || "0", free_threshold: form.free_threshold || "" }
    const res = await fetch("/api/admin/delivery-zones", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { ...body, id: editing.id } : body),
    })
    if (res.ok) { setShowForm(false); setEditing(null); setForm({ name: "", cities: "", cost: "", min_order: "", free_threshold: "" }); loadZones() }
  }

  const remove = async (id: string) => {
    if (!confirm("¿Eliminar esta zona?")) return
    await fetch(`/api/admin/delivery-zones?id=${id}`, { method: "DELETE" })
    loadZones()
  }

  const edit = (z: any) => {
    setEditing(z)
    setForm({ name: z.name, cities: (z.cities || []).join(", "), cost: z.cost, min_order: z.min_order || "", free_threshold: z.free_threshold || "" })
    setShowForm(true)
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Zonas de Delivery"
        subtitle={`${zones.length} zonas configuradas`}
        actions={
          <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: "", cities: "", cost: "", min_order: "", free_threshold: "" }) }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            {showForm ? "Cancelar" : "+ Nueva zona"}
          </button>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{editing ? "Editar zona" : "Nueva zona"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Nombre de la zona</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ej: Asunción Central" className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Ciudades (separadas por coma)</label>
              <input value={form.cities} onChange={e => setForm({...form, cities: e.target.value})} placeholder="Asunción, Lambaré, San Lorenzo" className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Costo de envío (Gs.)</label>
              <input value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} placeholder="25000" className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Envío gratis desde (Gs.)</label>
              <input value={form.free_threshold} onChange={e => setForm({...form, free_threshold: e.target.value})} placeholder="300000" className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Guardar</button>
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-700/60 px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-zinc-800/50" />)}
        </div>
      ) : zones.length === 0 ? (
        <EmptyState icon={<span className="text-2xl">🛣️</span>} title="Sin zonas configuradas" description="Creá tu primera zona de delivery para mostrar costos en el checkout" />
      ) : (
        <div className="grid gap-3">
          {zones.map(z => (
            <div key={z.id} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{z.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5">{z.cities?.join(", ")}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Envío: <span className="text-emerald-400">Gs. {z.cost}</span>
                  {z.free_threshold ? ` · Gratis desde Gs. ${z.free_threshold}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => edit(z)} className="text-xs text-zinc-400 hover:text-white px-2 py-1">Editar</button>
                <button onClick={() => remove(z.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
