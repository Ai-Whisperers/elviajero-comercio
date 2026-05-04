"use client"
export const dynamic = "force-dynamic"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"

function ForgotForm() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const found = users.find((u: any) => u.email === email)
    const token = Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    if (found) {
      found.resetToken = token
      found.resetExpires = Date.now() + 3600000
      localStorage.setItem("viajero_users", JSON.stringify(users))
    }
    localStorage.setItem("viajero_reset_link", window.location.origin + "/recuperar/" + token)
    setSent(true)
  }

  if (sent) return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="max-w-sm text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Revisá tu email</h1>
          <p className="text-muted-foreground mb-2">Si existe una cuenta, te enviamos las instrucciones.</p>
          <p className="text-xs text-muted-foreground mb-6">(Demo: link guardado en localStorage como viajero_reset_link)</p>
          <Link href="/login" className="text-sm font-semibold text-primary hover:underline">Volver</Link>
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">Recuperar contraseña</h1>
            <p className="mt-2 text-sm text-muted-foreground">Te enviamos un link para restablecerla</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com"
              className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
            <button type="submit" className="w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90">Enviar link</button>
          </form>
          <p className="mt-6 text-center text-sm"><Link href="/login" className="font-semibold text-primary hover:underline">Volver</Link></p>
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )
}

export default function ForgotPage() { return <AuthProvider><ForgotForm /></AuthProvider> }
