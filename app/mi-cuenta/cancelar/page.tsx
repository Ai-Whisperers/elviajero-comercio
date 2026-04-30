
"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

function CancelForm() {
  const { orders, user } = useAuth()
  const router = useRouter()
  const [selected, setSelected] = useState("")
  const [reason, setReason] = useState("")
  const [done, setDone] = useState(false)

  const activeOrders = orders.filter(o => o.status === "pendiente" || o.status === "confirmado")

  const submit = () => {
    if (!selected) return
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const u = users.find((x: any) => x.id === user?.id)
    if (!u) return
    const ords = JSON.parse(localStorage.getItem("viajero_orders_" + u.id) || "[]")
    const idx = ords.findIndex((o: any) => o.id === selected)
    if (idx >= 0) {
      ords[idx].status = "cancelado"
      ords[idx].cancelReason = reason
      localStorage.setItem("viajero_orders_" + u.id, JSON.stringify(ords))
      setDone(true)
    }
  }

  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-2xl px-4">
          <Link href="/mi-cuenta" className="text-sm text-muted-foreground hover:text-foreground">&larr; Mi cuenta</Link>
          <h1 className="mt-2 mb-6 text-2xl font-bold text-foreground">Solicitar cancelación</h1>
          {done ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold text-foreground mb-2">Cancelación solicitada</h2>
              <p className="text-muted-foreground mb-6">Te contactaremos para confirmar.</p>
              <Link href="/mi-cuenta/pedidos" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground">Ver pedidos</Link>
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted-foreground">No tenés pedidos activos para cancelar</div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-surface p-5">
                <h2 className="mb-3 text-sm font-semibold text-foreground">Seleccioná el pedido</h2>
                {activeOrders.map((o) => (
                  <label key={o.id} className={"flex cursor-pointer items-center gap-3 rounded-lg border p-3 mb-2 " + (selected === o.id ? "border-primary bg-primary/5" : "border-border")}>
                    <input type="radio" name="order" value={o.id} checked={selected === o.id} onChange={() => setSelected(o.id)} />
                    <div className="text-sm"><p className="font-medium text-foreground">#{o.id.slice(0, 8)}</p><p className="text-muted-foreground">{new Date(o.date).toLocaleDateString("es")} · {o.total}</p></div>
                  </label>
                ))}
              </div>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Motivo (opcional)" className="w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring resize-none" />
              <button onClick={submit} disabled={!selected} className="w-full rounded-lg bg-destructive py-3 font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50">Solicitar cancelación</button>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function CancelPage() { return <AuthProvider><CancelForm /></AuthProvider> }
