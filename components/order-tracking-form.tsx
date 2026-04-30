
"use client"
export function OrderTrackingForm() {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Seguí tu pedido</h3>
      <div className="flex gap-2">
        <input placeholder="Número de pedido (ej: #a1b2c3d4)" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring" />
        <a href="/pedido/buscar" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Buscar</a>
      </div>
    </div>
  )
}
