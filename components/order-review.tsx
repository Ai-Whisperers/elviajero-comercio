"use client"
export function OrderReview({ items, total, shipping, address, payment }: { items: any[]; total: number; shipping: number; address: string; payment: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 space-y-4">
      <h3 className="font-bold text-foreground">Revisa tu pedido</h3>
      <div className="divide-y divide-border">
        {items.map((item, i) => <div key={i} className="flex justify-between py-2 text-sm"><span className="text-foreground">{item.name} x{item.quantity}</span><span className="font-medium">{item.price}</span></div>)}
      </div>
      <div className="text-sm space-y-1 border-t border-border pt-3">
        <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Gs. {(total - shipping).toLocaleString("es-PY")}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Envio</span><span>Gs. {shipping.toLocaleString("es-PY")}</span></div>
        <div className="flex justify-between font-bold text-foreground text-base pt-2"><span>Total</span><span>Gs. {total.toLocaleString("es-PY")}</span></div>
      </div>
      <div className="text-xs text-muted-foreground space-y-1"><p>Direccion: {address}</p><p>Pago: {payment}</p></div>
    </div>
  )
}
