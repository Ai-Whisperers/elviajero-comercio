"use client"
export const dynamic = "force-dynamic"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function RegisterForm() {
  const { register, loginWithGoogle, loginWithFacebook } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const getStrength = (pass: string) => {
    if (pass.length < 6) return { label: "Débil", color: "bg-destructive", pct: 25 }
    if (pass.length < 8) return { label: "Media", color: "bg-warning", pct: 50 }
    if (pass.length < 12) return { label: "Buena", color: "bg-success/70", pct: 75 }
    return { label: "Fuerte", color: "bg-success", pct: 100 }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return }
    setLoading(true)
    const res = await register(name, email, password, phone)
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
    } else setError(res.error || "Error al registrarse")
  }

  const strength = getStrength(password)

  if (success) {
    return (
      <>
        <Header />
        <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
          <div className="w-full max-w-sm text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">Registro exitoso</h1>
            <p className="mb-6 text-muted-foreground">Revisá tu email para confirmar la cuenta. Luego podés iniciar sesión.</p>
            <Link href="/login" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Iniciar Sesión</Link>
          </div>
        </section>
        <Footer />
        <CookieConsent />
      </>
    )
  }

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Crear Cuenta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Unite a El Viajero</p>
          </div>

          <div className="mb-6 flex flex-col gap-3">
            <button onClick={loginWithGoogle} className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground transition-all hover:bg-surface-light">
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Registrarse con Google
            </button>
            <button onClick={loginWithFacebook} className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-[#1877F2] px-4 py-3 text-sm font-medium text-white transition-all hover:bg-[#166fe5]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Registrarse con Facebook
            </button>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">O con email</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0981 123 456" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" required />
              {password.length > 0 && <div className="mt-1 flex items-center gap-2"><div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"><div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: `${strength.pct}%` }} /></div><span className="text-xs text-muted-foreground">{strength.label}</span></div>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Confirmar Contraseña</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repetí la contraseña" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring" required />
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">¿Ya tenés cuenta? <Link href="/login" className="text-primary font-semibold hover:underline">Iniciar Sesión</Link></p>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterForm />
    </AuthProvider>
  )
}
