"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderTimeline } from "@/components/order-timeline"
import { PackingSlip } from "@/components/packing-slip"
import { PageHeader, Badge } from "@/components/admin/ui"
import { Suspense } from "react"
import { Package, Truck, Save, X } from "lucide-react"

function OrderDetailInner() {
  const sp = useSearchParams()
  const orderId = sp.get("id") || ""
  const [order, setOrder] = useState<any>(null)
  const [customerName, setCustomerName] = useState<string>("")
  const [showSlip, setShowSlip] = useState(false)
  const [trackingNum, setTrackingNum] = useState("")
  const [carrier, setCarrier] = useState("")
  const [status, setStatus] = useState("")
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const notify = (type: "success" | "error", text: string) => {
    setNotification({ type, text })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    if (!orderId) return
    fetch("/api/admin/orders?id=" + orderId).then(r => r.json()).then(data => {
      if (data) {
        setOrder({ ...data, items: typeof data.items === "string" ? JSON.parse(data.items) : data.items })
        setTrackingNum(data.tracking_number || "")
        setCarrier(data.carrier || "")
        setStatus(data.status || "pendiente")
        if (data.user_id) {
          fetch("/api/admin/customers?id=" + data.user_id).then(r => r.json()).then(profile => {
            setCustomerName(profile?.full_name || profile?.name || "Invitado")
          }).catch(() => setCustomerName("Invitado"))
        } else {
          setCustomerName("Invitado")
        }
      }
    })
  }, [orderId])

  const saveTracking = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        tracking_number: trackingNum,
        carrier: carrier,
        status: status,
      })
    })
    if (res.ok) {
      notify("success", "Envío actualizado — notificación enviada al cliente")
      setOrder({ ...order, tracking_number: trackingNum, carrier, status })
    } else {
      notify("error", "Error al guardar")
    }
    setSaving(false)
  }

  if (!order) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  )

  return (
    <>
      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl border transition-all ${
          notification.type === "success"
            ? "bg-emerald-900/90 border-emerald-700/60 text-emerald-200"
            : "bg-red-900/90 border-red-700/60 text-red-200"
        }`}>
          {notification.type === "success" ? <Package className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {notification.text}
        </div>
      )}

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
        {/* Order details */}
        <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-300">Detalles</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Cliente</span>
              <span className="text-white font-medium">{customerName || "Cargando..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Teléfono</span>
              <span className="text-white">{order.customer_phone || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Email</span>
              <span className="text-white">{order.customer_email || "—"}</span>
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

        {/* Items */}
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

      {/* Fulfillment section */}
      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Truck className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-semibold text-zinc-300">Envío y fulfillment</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Estado del pedido</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
              <option value="pendiente">Pendiente</option>
              <option value="confirmado">Confirmado</option>
              <option value="procesando">Procesando</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Número de tracking</label>
            <input value={trackingNum} onChange={e => setTrackingNum(e.target.value)}
              placeholder="Ej: PY123456789"
              className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">Transportista</label>
            <select value={carrier} onChange={e => setCarrier(e.target.value)}
              className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white border border-zinc-700/60 focus:outline-none focus:border-emerald-500/50">
              <option value="">Seleccionar...</option>
              <option value="COURIER">Courier PY</option>
              <option value="EXPRESS">Express Paraguay</option>
              <option value="CORREO">Correo Paraguayo</option>
              <option value="FEDEX">FedEx</option>
              <option value="DHL">DHL</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={saveTracking} disabled={saving}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all">
              <Save className="w-3.5 h-3.5" />
              {saving ? "Guardando..." : "Guardar envío"}
            </button>
          </div>
        </div>

        {/* Show current tracking info if any */}
        {(order.tracking_number || order.carrier) && (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-zinc-800/40 px-4 py-3 text-xs">
            <Truck className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">
              {order.tracking_number && <><span className="text-zinc-500">Tracking:</span> {order.tracking_number}</>}
              {order.carrier && <><span className="text-zinc-500 ml-3">Transportista:</span> {order.carrier}</>}
            </span>
            {order.shipped_at && (
              <span className="text-zinc-600 ml-auto">
                Enviado: {new Date(order.shipped_at).toLocaleDateString("es")}
              </span>
            )}
          </div>
        )}
      </div>

      {showSlip && <PackingSlip order={order} onClose={() => setShowSlip(false)} />}
    </>
  )
}

export default function AdminOrderDetail() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      }>
        <OrderDetailInner />
      </Suspense>
  )
}
