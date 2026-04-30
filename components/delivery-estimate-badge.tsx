
"use client"
export function DeliveryEstimateBadge() {
  const days = [1, 2, 3, 5]
  const est = days[Math.floor(Math.random() * days.length)]
  return (
    <span className="text-[10px] text-muted-foreground">
      🚚 Entrega estimada: {est} día{est > 1 ? "s" : ""} hábil{est > 1 ? "es" : ""}
    </span>
  )
}
