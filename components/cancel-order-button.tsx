
"use client"
import { useState } from "react"
import { useAuth } from "@ai-whisperers/auth/auth-context"

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const { orders } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [reason, setReason] = useState("")
  const [done, setDone] = useState(false)

  const cancel = () => {
    if (!orderId) return
    const users = JSON.parse(localStorage.getItem("viajero_users") || "[]")
    for (const u of users) {
      const ords = JSON.parse(localStorage.getItem("viajero_orders_" + u.id) || "[]")
      const idx = ords.findIndex((o: any) => o.id === orderId)
      if (idx >= 0) {
        ords[idx].status = "cancelado"
        ords[idx].cancelReason = reason
        ords[idx].cancelledAt = new Date().toISOString()
        localStorage.setItem("viajero_orders_" + u.id, JSON.stringify(ords))
        setDone(true)
        break
      }
    }
  }

  if (done) return <p className="text-sm text-success">Cancelación solicitada</p>

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="text-xs text-destructive hover:underline">Cancelar pedido</button>
      {showForm && (
        <div className="mt-2 space-y-2">
          <select value={reason} onChange={e => setReason(e.target.value)} className="w-full rounded-lg border border-input bg-surface px-3 py-2 text-xs">
            <option value="">Seleccioná un motivo</option>
            <option value="cambio_de_opinion">Cambié de opinión</option>
            <option value="encontre_mejor_precio">Encontré mejor precio</option>
            <option value="demora_entrega">Demora en la entrega</option>
            <option value="producto_no_deseado">No necesito el producto</option>
            <option value="otro">Otro</option>
          </select>
          <button onClick={cancel} disabled={!reason} className="w-full rounded-lg bg-destructive py-2 text-xs font-semibold text-white hover:bg-destructive/90 disabled:opacity-50">Confirmar cancelación</button>
        </div>
      )}
    </div>
  )
}
