
"use client"
export function getBulkPrice(basePrice: number, quantity: number): number {
  if (quantity >= 10) return Math.round(basePrice * 0.85)
  if (quantity >= 5) return Math.round(basePrice * 0.9)
  if (quantity >= 3) return Math.round(basePrice * 0.95)
  return basePrice
}

export function BulkPriceDisplay({ basePrice, quantity }: { basePrice: number; quantity: number }) {
  const discount = getBulkPrice(basePrice, quantity)
  const savings = basePrice - discount
  if (savings <= 0) return null
  
  return (
    <div className="rounded-lg bg-success/10 px-2 py-1 text-xs">
      <span className="font-bold text-success">Gs. {discount.toLocaleString("es-PY")}</span>
      <span className="text-muted-foreground"> (ahorras Gs. {savings.toLocaleString("es-PY")})</span>
    </div>
  )
}
