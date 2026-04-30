"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
    if (res.ok) router.push("/mi-cuenta")
    else setError(res.error || "Error al registrarse")
  }

  const strength = getStrength(password)

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Crear Cuenta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Unite a El Viajero</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Nombre completo</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="Juan Pérez" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Teléfono</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="0981 123 456" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="Mínimo 6 caracteres" />
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${strength.color} transition-all`} style={{ width: `${strength.pct}%` }} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Fortaleza: {strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Confirmar contraseña</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6}
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="Repetí la contraseña" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">Iniciar sesión</Link>
          </p>
          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary">← Volver a la tienda</Link>
          </div>
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
