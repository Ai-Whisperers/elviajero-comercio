"use client"
import { AdminShell } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderTimeline } from "@/components/order-timeline"
import { PackingSlip } from "@/components/packing-slip"
import { Suspense } from "react"

function OrderDetailInner() {
  const sp = useSearchParams()
  const orderId = sp.get("id") || ""
  const [order, setOrder] = useState<any>(null)
  const [showSlip, setShowSlip] = useState(false)

  useEffect(() => {
    if (!orderId) return
    fetch("/api/admin/orders?id=" + orderId).then(r => r.json()).then(data => {
      if (data) setOrder({ ...data, items: typeof data.items === "string" ? JSON.parse(data.items) : data.items })
    })
  }, [orderId])

  if (!order) return <div className="text-center py-12 text-gray-500">Cargando...</div>

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/pedidos" className="text-gray-400 hover:text-white">&larr; Volver</Link>
          <h1 className="text-xl font-bold text-white">Pedido #{orderId.slice(0, 8)}</h1>
        </div>
        <button onClick={() => setShowSlip(true)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">🧾 Comprobante</button>
      </div>

      <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
        <OrderTimeline order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-300">Detalles</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Cliente</span><span className="text-white">{order.user_id?.slice(0, 8) || "Invitado"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Fecha</span><span className="text-white">{order.created_at ? new Date(order.created_at).toLocaleDateString("es", { dateStyle: "long" }) : ""}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Pago</span><span className="text-white">{order.payment_method || "—"}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Estado</span><span className="text-white">{order.status}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="text-white font-bold">{order.total}</span></div>
            {order.address_id && <div className="flex justify-between"><span className="text-gray-500">Dirección</span><span className="text-white text-right max-w-[200px]">{order.address_id}</span></div>}
            {order.note && <div className="flex justify-between"><span className="text-gray-500">Nota</span><span className="text-white text-right max-w-[200px]">{order.note}</span></div>}
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
          <h2 className="mb-3 text-sm font-semibold text-gray-300">Artículos ({order.items?.length || 0})</h2>
          <div className="divide-y divide-gray-800">
            {(order.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div><p className="text-sm text-white">{item.name}</p><p className="text-xs text-gray-500">x{item.quantity || 1}</p></div>
                <p className="text-sm font-medium text-white">{item.price || ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showSlip && <PackingSlip order={order} onClose={() => setShowSlip(false)} />}
    </>
  )
}

export default function AdminOrderDetail() {
  return <AdminShell><Suspense fallback={<div className="text-center py-12 text-gray-500">Cargando...</div>}><OrderDetailInner /></Suspense></AdminShell>
}
