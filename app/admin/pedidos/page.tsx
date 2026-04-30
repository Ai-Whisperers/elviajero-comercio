"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      setOrders(data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    })
    fetchOrders()
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  }

  const formatGs = (n: number) => "Gs. " + (n || 0).toLocaleString("es-PY")

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Pedidos" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Gestión de Pedidos</h1>

          {loading && <p className="text-muted-foreground">Cargando pedidos...</p>}

          {!loading && orders.length === 0 && (
            <div className="py-20 text-center">
              <span className="text-5xl block mb-4">📦</span>
              <p className="text-muted-foreground">No hay pedidos todavía.</p>
              <p className="text-xs text-muted-foreground mt-1">Los pedidos aparecen acá cuando los clientes usan el checkout.</p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Cliente</th>
                    <th className="pb-3 pr-4 font-medium">Total</th>
                    <th className="pb-3 pr-4 font-medium">Estado</th>
                    <th className="pb-3 pr-4 font-medium">Fecha</th>
                    <th className="pb-3 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-border">
                      <td className="py-3 pr-4 font-mono text-xs">{order.id}</td>
                      <td className="py-3 pr-4">
                        <p className="font-medium text-foreground">{order.customer?.name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{order.customer?.phone || "—"}</p>
                      </td>
                      <td className="py-3 pr-4 font-semibold text-foreground">{formatGs(order.total)}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                          {order.status === "pending" ? "Pendiente" : order.status === "processing" ? "Procesando" : order.status === "shipped" ? "Enviado" : order.status === "delivered" ? "Entregado" : order.status}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("es")}</td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="rounded-lg border border-input bg-background px-2 py-1 text-xs outline-none"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
