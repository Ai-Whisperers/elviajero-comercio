"use client"
import { formatCurrency } from "@/lib/site-config"

interface OrderItem {
  name: string
  price: number
  priceGs?: number
  quantity: number
}

interface OrderSummaryProps {
  items: OrderItem[]
  total: number
  shipping: number
  shippingZoneName: string
  grandTotal: number
}

export function OrderSummary({ items, total, shipping, shippingZoneName, grandTotal }: OrderSummaryProps) {
  return (
    <div className="rounded-lg bg-muted p-4 mb-6">
      <h3 className="font-semibold text-foreground mb-3">Resumen del pedido</h3>
      {items.map(i => (
        <div key={i.name} className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">{i.name} x{i.quantity}</span>
          <span className="text-foreground font-medium">{formatCurrency((i.priceGs ?? 0) * i.quantity)}</span>
        </div>
      ))}
      <div className="border-t border-border mt-3 pt-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío ({shippingZoneName})</span>
          <span className="text-foreground">{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mt-2">
          <span className="text-foreground">Total</span>
          <span className="text-primary">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  )
}
