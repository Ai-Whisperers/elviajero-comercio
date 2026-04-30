
"use client"
import { useState } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes("@")) return
    setStatus("loading")
    try {
      const res = await fetch("/api/subscribe", { method: "POST", body: new URLSearchParams({ email }) })
      setStatus(res.ok || res.redirected ? "success" : "error")
    } catch { setStatus("error") }
  }

  if (status === "success") return (
    <div className="rounded-xl bg-success/10 p-4 text-center">
      <p className="text-sm font-medium text-success">✅ ¡Gracias por suscribirte!</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-3">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
        className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white" />
      <button type="submit" disabled={status === "loading"}
        className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50">
        {status === "loading" ? "..." : "Suscribirse"}
      </button>
    </form>
  )
}
