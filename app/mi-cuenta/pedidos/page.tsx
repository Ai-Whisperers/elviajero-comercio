"use client"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const runtime = "edge"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { useState } from "react"
import Link from "next/link"
import content from "@/content/es.json"

const c = content as any

const statuses = ["todos", "pendiente", "confirmado", "enviado", "entregado", "cancelado"]

const statusLabels: Record<string, string> = {
  todos: "Todos", pendiente: "Pendiente", confirmado: "Confirmado",
  enviado: "Enviado", entregado: "Entregado", cancelado: "Cancelado",
}

function OrdersForm() {
  const { orders = [] } = useAuth()
  const [filter, setFilter] = useState("todos")

  const filtered = filter === "todos" ? orders : orders.filter(o => o.status === filter)

  return (
    <>
<section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <Link href="/mi-cuenta" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Mis Pedidos</h1>
          </div>

          {/* Status filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                  filter === s ? "bg-primary text-primary-foreground" : "bg-surface border border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}>
                {statusLabels[s]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-border bg-surface p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="font-medium text-foreground">No hay pedidos {filter !== "todos" ? statusLabels[filter].toLowerCase() : ""}</p>
              <Link href="/tienda" className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => (
                <div key={order.id} className="rounded-xl border border-border bg-surface p-5">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">#{order.id.slice(0, 8)}</span>
                      <span className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString("es", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                      order.status === "pendiente" ? "bg-warning/20 text-warning" :
                      order.status === "confirmado" ? "bg-primary/10 text-primary" :
                      order.status === "enviado" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      order.status === "entregado" ? "bg-success/10 text-success" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 py-2">
                        {item.imageUrl && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <img src={item.imageUrl} alt={item.name} className="h-8 w-8 object-contain" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground">{item.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">Pago: {order.paymentMethod}</span>
                    <span className="font-bold text-foreground">Total: {order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
</>
  )
}

export default function OrdersPage() {
  return (
    <AuthProvider>
      <OrdersForm />
    </AuthProvider>
  )
}
