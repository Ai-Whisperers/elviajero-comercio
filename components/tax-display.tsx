"use client"
export function TaxDisplay({ subtotal, taxRate = 0 }: { subtotal: number; taxRate?: number }) {
  const tax = Math.round(subtotal * taxRate)
  const total = subtotal + tax
  return (
    <div className="space-y-1 text-sm border-t border-border pt-3 mt-3">
      <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Gs. {subtotal.toLocaleString("es-PY")}</span></div>
      {tax > 0 && <div className="flex justify-between text-muted-foreground"><span>IVA ({(taxRate * 100).toFixed(0)}%)</span><span>Gs. {tax.toLocaleString("es-PY")}</span></div>}
      <div className="flex justify-between font-bold text-foreground text-base border-t border-border pt-2 mt-2"><span>Total</span><span>Gs. {total.toLocaleString("es-PY")}</span></div>
    </div>
  )
}
