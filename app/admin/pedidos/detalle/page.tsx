
"use client"
import { AdminShell } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderTimeline } from "@/components/order-timeline"
import { Suspense } from "react"

function OrderDetailInner() {
  const sp = useSearchParams()
  const orderId = sp.get("id") || ""
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderId) return
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    for (const u of users) {
      const ords = JSON.parse(localStorage.getItem("viajero_orders_" + u.id) || "[]")
      const found = ords.find((o: any) => o.id === orderId)
      if (found) { setOrder({ ...found, userName: u.name }); break }
    }
  }, [orderId])

  if (!order) return <div className="text-center py-12 text-gray-500">Cargando...</div>

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/pedidos" className="text-gray-400 hover:text-white">&larr; Volver</Link>
        <h1 className="text-xl font-bold text-white">Pedido #{orderId.slice(0, 8)}</h1>
      </div>

      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <OrderTimeline order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-300">Detalles</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Cliente</span><span className="text-white">{order.userName || "Invitado"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Fecha</span><span className="text-white">{new Date(order.date).toLocaleDateString("es", { dateStyle: "long" })}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Pago</span><span className="text-white">{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="text-white font-bold">{order.total}</span></div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-300">Artículos ({order.items?.length || 0})</h2>
          <div className="divide-y divide-gray-800">
            {(order.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div><p className="text-sm text-white">{item.name}</p><p className="text-xs text-gray-500">x{item.quantity}</p></div>
                <p className="text-sm font-medium text-white">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function AdminOrderDetail() {
  return <AdminShell><Suspense fallback={<div className="text-center py-12 text-gray-500">Cargando...</div>}><OrderDetailInner /></Suspense></AdminShell>
}
