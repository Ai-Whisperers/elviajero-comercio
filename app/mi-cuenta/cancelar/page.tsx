"use client"
export const dynamic = "force-dynamic"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

function CancelContent() {
  const { user } = useAuth()
  const [reason, setReason] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch("/api/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel-request", reason }) })
    setSent(true)
  }

  if (sent) return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
        <div className="w-full max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Solicitud enviada</h1>
          <p className="mb-6 text-sm text-muted-foreground">Te contactaremos para confirmar la cancelación.</p>
          <Link href="/mi-cuenta" className="text-sm text-primary hover:underline">← Volver</Link>
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">Cancelar cuenta</h1>
            <p className="mt-2 text-sm text-muted-foreground">Esta acción no se puede deshacer</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Motivo (opcional)</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-ring resize-none" placeholder="Decinos por qué te vas..." />
            </div>
            <button type="submit" className="w-full rounded-lg bg-destructive px-4 py-3 font-semibold text-destructive-foreground hover:opacity-90">
              Cancelar mi cuenta
            </button>
            <div className="text-center">
              <Link href="/mi-cuenta" className="text-sm text-primary hover:underline">← No, volver</Link>
            </div>
          </form>
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )
}

export default function CancelPage() {
  return (
    <AuthProvider>
      <CancelContent />
    </AuthProvider>
  )
}
