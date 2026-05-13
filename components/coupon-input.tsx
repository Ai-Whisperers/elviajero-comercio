"use client"
import { useState, useEffect } from "react"
import { createClient } from "@ai-whisperers/auth/supabase/client"
import content from "@/content/es.json"

const c = content as any
const couponConfig = c.coupons || {}
const staticCoupons: any[] = couponConfig.list || []

export function CouponInput({ subtotal, onDiscount }: { subtotal: number; onDiscount: (amount: number, code: string) => void }) {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<{ text: string; type: string } | null>(null)
  const [dbCoupons, setDbCoupons] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from("ej_promo_codes").select("*").then(({ data }) => {
      if (data) setDbCoupons(data)
    })
  }, [])

  const allCoupons = [
    ...staticCoupons,
    ...dbCoupons.map(dbc => ({
      code: dbc.code,
      type: dbc.type === "percentage" ? "percent" : dbc.type === "fixed" ? "fixed" : "percent",
      value: dbc.value,
      minPurchase: dbc.min_purchase ?? 0,
      description: dbc.description || dbc.title || "",
      active: dbc.active !== false,
      maxUses: dbc.max_uses ?? 100,
    })),
  ]

  const apply = () => {
    const cpn = allCoupons.find((c: any) => c.code.toUpperCase() === code.toUpperCase() && c.active !== false)
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
    else if (cpn.type === "fixed") discount = cpn.value
    setMessage({ text: `✅ Cupón aplicado: ${cpn.description || cpn.code}`, type: "success" })
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
