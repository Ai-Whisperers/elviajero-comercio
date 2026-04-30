"use client"
import { useCurrency } from "@/lib/currency"

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setCurrency("PYG")}
        className={`flex h-6 w-7 items-center justify-center rounded text-[10px] font-bold transition-all ${
          currency === "PYG" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}>
        Gs
      </button>
      <button
        onClick={() => setCurrency("USD")}
        className={`flex h-6 w-7 items-center justify-center rounded text-[10px] font-bold transition-all ${
          currency === "USD" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}>
        $
      </button>
    </div>
  )
}
