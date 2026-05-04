"use client"
export const dynamic = "force-dynamic"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import { useRouter } from "next/navigation"

function hash(s: string) {
  let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h = h & h }
  return "h" + Math.abs(h).toString(36)
}

function ResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return }
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const idx = users.findIndex((u: any) => u.resetToken === token)
    if (idx === -1 || users[idx].resetExpires < Date.now()) { setError("Link inválido o expirado"); return }
    users[idx].password = hash(password)
    delete users[idx].resetToken; delete users[idx].resetExpires
    localStorage.setItem("viajero_users", JSON.stringify(users))
    setDone(true)
    setTimeout(() => router.push("/login"), 2000)
  }

  if (done) return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center"><div className="text-5xl mb-4">✅</div><h1 className="text-xl font-bold">Contraseña actualizada</h1></div>
    </section>
  )

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-center text-2xl font-bold text-foreground">Nueva contraseña</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Nueva contraseña" className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} placeholder="Confirmar" className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">Restablecer</button>
          </form>
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )
}

export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <AuthProvider><ResetForm token={token} /></AuthProvider>
}
