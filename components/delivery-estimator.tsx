
"use client"
import { useState } from "react"

const deliveryDays: Record<string, number> = {
  asuncion: 1, "mariano roque alonso": 1, lambar: 2,
  "fernando de la mora": 2, "san lorenzo": 2, luque: 2,
  capiatá: 3, "itá": 3, "villa elisa": 2,
  "ñemby": 3, limpio: 3, "san antonio": 3,
}

export function DeliveryEstimator() {
  const [city, setCity] = useState("")
  const [show, setShow] = useState(false)
  const days = deliveryDays[city.toLowerCase().trim()] || 5

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-foreground mb-2">🚚 Calcular tiempo de entrega</h3>
      <div className="flex gap-2">
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ingresá tu ciudad" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
        <button onClick={() => setShow(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Calcular</button>
      </div>
      {show && city && (
        <p className="mt-2 text-sm text-foreground">Tiempo estimado: <strong>{days} día{days > 1 ? "s" : ""} hábiles</strong></p>
      )}
    </div>
  )
}
