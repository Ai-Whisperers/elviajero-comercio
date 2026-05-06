"use client"
import { useState } from "react"
// Content provided by consumer app

const c = {} as any
const zones = c.deliveryZones || []

export function DeliveryCalculator({ subtotal, onFeeChange }: { subtotal: number; onFeeChange: (fee: number) => void }) {
  const [selected, setSelected] = useState("")

  const handleChange = (zoneName: string) => {
    setSelected(zoneName)
    const zone = zones.find((z: any) => z.zone === zoneName)
    if (zone && onFeeChange) {
      const fee = zone.minForFree > 0 && subtotal >= zone.minForFree ? 0 : zone.fee
      onFeeChange(fee)
    }
  }

  if (zones.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Calcular envío</h3>
      <select
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
      >
        <option value="">Seleccioná tu zona</option>
        {zones.map((z: any) => (
          <option key={z.zone} value={z.zone}>{z.zone}</option>
        ))}
      </select>
      {selected && (() => {
        const zone = zones.find((z: any) => z.zone === selected)
        if (!zone) return null
        const isFree = zone.minForFree > 0 && subtotal >= zone.minForFree
        const fee = isFree ? 0 : zone.fee
        return (
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            <p>Costo: <span className={isFree ? "text-green-600 font-semibold" : "font-medium text-foreground"}>{isFree ? "Gratis 🎉" : `Gs. ${(fee || 0).toLocaleString("es-PY")}`}</span></p>
            {zone.minForFree > 0 && subtotal < zone.minForFree && <p>📦 Envío gratis desde Gs. {zone.minForFree.toLocaleString("es-PY")}</p>}
            <p>⏱ Entrega estimada: {zone.days}</p>
            {zone.note && <p className="text-muted-foreground/60 italic">{zone.note}</p>}
          </div>
        )
      })()}
    </div>
  )
}