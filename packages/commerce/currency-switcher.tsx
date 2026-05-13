"use client"
import { useCurrency } from "../../lib/currency"

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <button
      onClick={() => setCurrency(currency === "PYG" ? "USD" : "PYG")}
      className="px-2 py-1 text-xs font-bold rounded border border-border hover:bg-muted transition-colors text-foreground"
      aria-label="Toggle currency"
    >
      {currency}
    </button>
  )
}
