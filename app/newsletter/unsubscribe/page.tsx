
"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function UnsubscribePage() {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email.includes("@")) { setError("Email inválido"); return }
    try {
      const subs: string[] = JSON.parse(localStorage.getItem("viajero_subscribers") || "[]")
      const filtered = subs.filter(s => s !== email)
      localStorage.setItem("viajero_subscribers", JSON.stringify(filtered))
      setDone(true)
    } catch { setError("Error al procesar") }
  }

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center">
          {done ? (
            <>
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Te has dado de baja</h1>
              <p className="text-muted-foreground">Ya no recibirás nuestros correos.</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-foreground mb-2">Darse de baja</h1>
              <p className="text-muted-foreground mb-6">Ingresá tu email para cancelar la suscripción al newsletter.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
                <button type="submit" className="w-full rounded-lg bg-destructive py-3 font-semibold text-destructive-foreground hover:bg-destructive/90">Darse de baja</button>
              </form>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
