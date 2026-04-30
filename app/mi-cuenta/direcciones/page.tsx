"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"

const emptyAddr = { label: "", name: "", street: "", city: "", state: "", zip: "", phone: "", isDefault: false }

function AddressesForm() {
  const { addresses, addAddress, updateAddress, removeAddress } = useAuth()
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyAddr)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.street || !form.city) { setError("Completá la dirección y ciudad"); return }
    setSaving(true)
    if (editing) {
      const r = await updateAddress(editing, form)
      if (!r.ok) setError(r.error || "Error")
    } else {
      const r = await addAddress(form)
      if (!r.ok) setError(r.error || "Error")
    }
    setSaving(false)
    if (!error) { setShowForm(false); setEditing(null); setForm(emptyAddr) }
  }

  const startEdit = (addr: any) => {
    setForm({ label: addr.label, name: addr.name, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, phone: addr.phone, isDefault: addr.isDefault })
    setEditing(addr.id)
    setShowForm(true)
  }

  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/mi-cuenta" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">Mis Direcciones</h1>
            </div>
            <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyAddr); setError("") }}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              {showForm ? "Cancelar" : "+ Nueva"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSave} className="mb-8 rounded-xl border border-border bg-surface p-5 space-y-3">
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={form.label} onChange={e => setForm({...form, label: e.target.value})} placeholder="Etiqueta (Casa, Trabajo...)" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nombre del destinatario" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <input value={form.street} onChange={e => setForm({...form, street: e.target.value})} placeholder="Calle, número, barrio" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Ciudad" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                <input value={form.state} onChange={e => setForm({...form, state: e.target.value})} placeholder="Departamento" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
                <input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} placeholder="Código postal" className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Teléfono de contacto" className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} className="rounded" />
                Dirección principal
              </label>
              <button type="submit" disabled={saving} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Guardando..." : editing ? "Actualizar dirección" : "Guardar dirección"}
              </button>
            </form>
          )}

          {addresses.length === 0 && !showForm ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <div className="text-5xl mb-4">📍</div>
              <p className="font-medium text-foreground">No tenés direcciones guardadas</p>
              <p className="mt-1 text-sm text-muted-foreground">Agregá una dirección para recibir tus pedidos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{addr.label || "Dirección"}</span>
                        {addr.isDefault && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Principal</span>}
                      </div>
                      <p className="mt-1 text-sm text-foreground">{addr.street}</p>
                      <p className="text-xs text-muted-foreground">{addr.city}{addr.state ? `, ${addr.state}` : ""}{addr.zip ? ` · CP ${addr.zip}` : ""}</p>
                      {addr.phone && <p className="text-xs text-muted-foreground">📞 {addr.phone}</p>}
                      {addr.name && <p className="text-xs text-muted-foreground">Att: {addr.name}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(addr)} className="text-xs text-primary hover:underline">Editar</button>
                      <button onClick={() => removeAddress(addr.id)} className="text-xs text-destructive hover:underline">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function AddressesPage() {
  return (
    <AuthProvider>
      <AddressesForm />
    </AuthProvider>
  )
}
