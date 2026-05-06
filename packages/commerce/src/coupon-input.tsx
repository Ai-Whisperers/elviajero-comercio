"use client"
import { useState } from "react"
// Content provided by consumer app

const c = {} as any
const couponConfig = c.coupons || {}
const coupons = couponConfig.list || []

export function CouponInput({ subtotal, onDiscount }: { subtotal: number; onDiscount: (amount: number, code: string) => void }) {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null)

  const apply = () => {
    const cpn = coupons.find((c: any) => c.code.toUpperCase() === code.toUpperCase() && c.active)
    if (!cpn) {
      setMessage({ text: "Código inválido o expirado", type: "error" })
      return
    }
    if (subtotal < cpn.minPurchase) {
      setMessage({ text: `Mínimo de compra: Gs. ${cpn.minPurchase.toLocaleString("es-PY")}`, type: "error" })
      return
    }
    let discount = 0
    if (cpn.type === "percent") discount = Math.round(subtotal * cpn.value / 100)
    else if (cpn.type === "free_shipping") discount = 0 // handled in delivery
    setMessage({ text: `✅ Cupón aplicado: ${cpn.description}`, type: "success" })
    onDiscount(discount, code.toUpperCase())
  }

  if (!couponConfig.enabled) return null

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold text-foreground mb-2">¿Tenés un cupón?</h3>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground uppercase outline-none focus:border-ring"
        />
        <button onClick={apply} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Aplicar
        </button>
      </div>
      {message && <p className={`mt-2 text-xs ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>{message.text}</p>}
    </div>
  )
}