"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (res.ok) router.push("/mi-cuenta")
    else setError(res.error || "Error al iniciar sesión")
  }

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Iniciar Sesión</h1>
            <p className="mt-2 text-sm text-muted-foreground">Accedé a tu cuenta de El Viajero</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="tu@email.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50">
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            <Link href="/recuperar" className="text-muted-foreground hover:text-primary">¿Olvidaste tu contraseña?</Link>
          </p>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">Crear cuenta</Link>
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

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
