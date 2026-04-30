"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"

function SettingsForm() {
  const { user, updateProfile, changePassword } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [profileMsg, setProfileMsg] = useState("")
  const [profileError, setProfileError] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)

  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [passMsg, setPassMsg] = useState("")
  const [passError, setPassError] = useState("")
  const [savingPass, setSavingPass] = useState(false)

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg("")
    setProfileError("")
    setSavingProfile(true)
    const r = await updateProfile({ name, email, phone })
    setSavingProfile(false)
    if (r.ok) setProfileMsg("Perfil actualizado")
    else setProfileError(r.error || "Error")
  }

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassMsg("")
    setPassError("")
    if (newPass !== confirmPass) { setPassError("Las contraseñas no coinciden"); return }
    if (newPass.length < 6) { setPassError("Mínimo 6 caracteres"); return }
    setSavingPass(true)
    const r = await changePassword(currentPass, newPass)
    setSavingPass(false)
    if (r.ok) { setPassMsg("Contraseña actualizada"); setCurrentPass(""); setNewPass(""); setConfirmPass("") }
    else setPassError(r.error || "Error")
  }

  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-2xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <Link href="/mi-cuenta" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          </div>

          {/* Profile */}
          <div className="mb-8 rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Mi Perfil</h2>
            <form onSubmit={handleProfile} className="space-y-4">
              {profileMsg && <div className="rounded-lg bg-success/10 p-3 text-sm text-success">{profileMsg}</div>}
              {profileError && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{profileError}</div>}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <button type="submit" disabled={savingProfile}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {savingProfile ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>

          {/* Password */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">Cambiar Contraseña</h2>
            <form onSubmit={handlePassword} className="space-y-4">
              {passMsg && <div className="rounded-lg bg-success/10 p-3 text-sm text-success">{passMsg}</div>}
              {passError && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{passError}</div>}
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Contraseña actual</label>
                <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Nueva contraseña</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Confirmar nueva contraseña</label>
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required minLength={6}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-ring" />
              </div>
              <button type="submit" disabled={savingPass}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {savingPass ? "Actualizando..." : "Cambiar contraseña"}
              </button>
            </form>
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
