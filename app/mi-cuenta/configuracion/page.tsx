"use client"
export const dynamic = "force-dynamic"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"

function SettingsForm() {
  const { user, updateProfile, changePassword } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const r = await updateProfile({ name, phone })
    setMsg(r.ok ? "Guardado" : r.error || "Error")
    setSaving(false)
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const r = await changePassword(currentPass, newPass)
    setMsg(r.ok ? "Contraseña actualizada" : r.error || "Error")
    setSaving(false)
  }

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
            <p className="mt-2 text-sm text-muted-foreground">Administrá tu cuenta</p>
          </div>
          {msg && <div className="mb-4 rounded-lg bg-primary/10 p-3 text-sm text-primary text-center">{msg}</div>}
          <form onSubmit={handleProfile} className="mb-8 space-y-4 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" />
            </div>
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
          <form onSubmit={handlePassword} className="space-y-4 rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">Cambiar contraseña</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Contraseña actual</label>
              <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nueva contraseña</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" />
            </div>
            <button type="submit" disabled={saving} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
              {saving ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/mi-cuenta" className="text-sm text-primary hover:underline">← Volver a mi cuenta</Link>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function SettingsPage() {
  return (
    <AuthProvider>
      <SettingsForm />
    </AuthProvider>
  )
}
