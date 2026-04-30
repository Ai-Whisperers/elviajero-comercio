"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import { useState } from "react"

export default function DireccionesPage() {
  const [dirs, setDirs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newDir, setNewDir] = useState({ name: "", phone: "", address: "", city: "", notes: "" })

  const addDir = (e: React.FormEvent) => {
    e.preventDefault()
    const updated = [...dirs, { ...newDir, id: Date.now().toString() }]
    setDirs(updated)
    localStorage.setItem("viajero-addresses", JSON.stringify(updated))
    setShowForm(false)
    setNewDir({ name: "", phone: "", address: "", city: "", notes: "" })
  }

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Mi Cuenta", href: "/mi-cuenta" }, { label: "Direcciones" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Mis Direcciones</h1>
            <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {showForm ? "Cancelar" : "+ Agregar"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={addDir} className="mb-8 rounded-xl border border-border bg-surface p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Nombre" value={newDir.name} onChange={e => setNewDir({...newDir, name: e.target.value})} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                <input required type="tel" placeholder="WhatsApp" value={newDir.phone} onChange={e => setNewDir({...newDir, phone: e.target.value})} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                <input required placeholder="Dirección" value={newDir.address} onChange={e => setNewDir({...newDir, address: e.target.value})} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                <input required placeholder="Ciudad" value={newDir.city} onChange={e => setNewDir({...newDir, city: e.target.value})} className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <textarea placeholder="Referencias (opcional)" value={newDir.notes} onChange={e => setNewDir({...newDir, notes: e.target.value})} rows={2} className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              <button type="submit" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Guardar</button>
            </form>
          )}

          {dirs.length === 0 && !showForm && (
            <div className="py-20 text-center">
              <span className="text-5xl block mb-4">📍</span>
              <p className="text-muted-foreground">No tenés direcciones guardadas.</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {dirs.map((d, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <p className="font-semibold text-foreground">{d.name}</p>
                <p className="text-sm text-muted-foreground">{d.phone}</p>
                <p className="text-sm text-muted-foreground">{d.address}</p>
                <p className="text-sm text-muted-foreground">{d.city}</p>
                {d.notes && <p className="text-xs text-muted-foreground mt-1">{d.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
