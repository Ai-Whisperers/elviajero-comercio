"use client"
import { AdminShell } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderTimeline } from "@/components/order-timeline"
import { PackingSlip } from "@/components/packing-slip"
import { PageHeader, Badge } from "@/components/admin/ui"
import { Suspense } from "react"

function OrderDetailInner() {
  const sp = useSearchParams()
  const orderId = sp.get("id") || ""
  const [order, setOrder] = useState<any>(null)
  const [customerName, setCustomerName] = useState<string>("")
  const [showSlip, setShowSlip] = useState(false)

  useEffect(() => {
    if (!orderId) return
    fetch("/api/admin/orders?id=" + orderId).then(r => r.json()).then(data => {
      if (data) {
        setOrder({ ...data, items: typeof data.items === "string" ? JSON.parse(data.items) : data.items })
        // Try to get customer name from profiles table
        if (data.user_id) {
          fetch("/api/admin/customers?id=" + data.user_id).then(r => r.json()).then(profile => {
            if (profile?.full_name || profile?.name) {
              setCustomerName(profile.full_name || profile.name)
            } else {
              setCustomerName("Invitado")
            }
          }).catch(() => setCustomerName("Invitado"))
        } else {
          setCustomerName("Invitado")
        }
      }
    })
  }, [orderId])

  if (!order) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  )

  return (
    <>
      <PageHeader
        title={"Pedido #" + orderId.slice(0, 8)}
        subtitle={order.created_at ? new Date(order.created_at).toLocaleDateString("es", { dateStyle: "long" }) : ""}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/pedidos"
              className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
              ← Volver
            </Link>
            <button onClick={() => setShowSlip(true)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all">
              🧾 Comprobante
            </button>
          </div>
        }
      />

      <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
        <OrderTimeline order={order} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Detalles</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Cliente</span>
              <span className="text-white font-medium">{customerName || "Cargando..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Fecha</span>
              <span className="text-white">{order.created_at ? new Date(order.created_at).toLocaleDateString("es", { dateStyle: "long" }) : ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pago</span>
              <span className="text-white">{order.payment_method || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Estado</span>
              <Badge status={order.status}>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Total</span>
              <span className="text-white font-bold text-lg">{order.total}</span>
            </div>
            {order.address_id && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Dirección</span>
                <span className="text-white text-right max-w-[200px]">{order.address_id}</span>
              </div>
            )}
            {order.note && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Nota</span>
                <span className="text-white text-right max-w-[200px]">{order.note}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Artículos ({order.items?.length || 0})</h2>
          <div className="divide-y divide-zinc-800/60">
            {(order.items || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-white">{item.name}</p>
                  <p className="text-xs text-zinc-500">x{item.quantity || 1}</p>
                </div>
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
  return (
    <AdminShell>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      }>
        <OrderDetailInner />
      </Suspense>
    </AdminShell>
  )
}
