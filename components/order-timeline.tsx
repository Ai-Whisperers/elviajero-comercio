"use client"
import type { Order } from "@/lib/auth-context"

const steps = [
  { key: "pendiente", label: "Pendiente", icon: "📋" },
  { key: "confirmado", label: "Confirmado", icon: "✅" },
  { key: "enviado", label: "Enviado", icon: "🚚" },
  { key: "entregado", label: "Entregado", icon: "🏠" },
]

export function OrderTimeline({ order }: { order: Order }) {
  const currentIdx = steps.findIndex((s) => s.key === order.status)
  const isCancelled = order.status === "cancelado"

  return (
    <div className="relative">
      {isCancelled ? (
        <div className="rounded-xl bg-destructive/10 p-4 text-center">
          <div className="text-3xl mb-1">❌</div>
          <p className="font-semibold text-destructive">Pedido cancelado</p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.key} className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all ${
                i <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < currentIdx ? "✓" : s.icon}
              </div>
              <span className={`mt-1 text-[10px] font-medium ${i <= currentIdx ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
      <div className="absolute top-5 left-0 right-0 -z-10 h-0.5 bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }} />
      </div>
    </div>
  )
}
