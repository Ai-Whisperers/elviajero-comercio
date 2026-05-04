
"use client"
export const dynamic = "force-dynamic"
import { useState } from "react"
import { AuthProvider } from "@/lib/auth-context"
import Link from "next/link"

function LookupForm() {
  const [email, setEmail] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    setSearched(true)
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    const user = users.find((u: any) => u.email === email)
    if (!user) { setOrders([]); return }
    const ords = JSON.parse(localStorage.getItem("viajero_orders_" + user.id) || "[]")
    setOrders(ords.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-foreground">Buscar pedidos</h1>
      <p className="mb-6 text-sm text-muted-foreground">Ingresá el email que usaste al comprar</p>
      <form onSubmit={search} className="mb-8 flex gap-3">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@email.com" className="flex-1 rounded-lg border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-ring" />
        <button type="submit" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Buscar</button>
      </form>
      {searched && orders.length === 0 && <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted-foreground">No se encontraron pedidos para este email</div>}
      {orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o: any) => (
            <div key={o.id} className="rounded-xl border border-border bg-surface p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">#{o.id?.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString("es", { dateStyle: "long" })} · {o.items?.length || 0} artículos</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-foreground">{o.total}</p>
                <span className={"rounded-full px-2 py-0.5 text-xs font-semibold " + (o.status === "entregado" ? "bg-success/10 text-success" : o.status === "enviado" ? "bg-blue-100 text-blue-700" : o.status === "pendiente" ? "bg-warning/20 text-warning" : "bg-muted text-muted-foreground")}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GuestLookupPage() {
  return <AuthProvider><LookupForm /></AuthProvider>
}
