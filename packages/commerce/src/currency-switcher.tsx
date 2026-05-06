"use client"
import { useState } from "react"
import type { CurrencyCode } from "./types"

const CURRENCIES: CurrencyCode[] = ["PYG", "USD"]

const SYMBOLS: Record<CurrencyCode, string> = {
  PYG: "₲",
  USD: "$"
}

export function CurrencySwitcher() {
  const [currency, setCurrency] = useState<CurrencyCode>("PYG")

  const toggle = () => {
    const next = CURRENCIES[(CURRENCIES.indexOf(currency) + 1) % CURRENCIES.length]
    setCurrency(next)
    localStorage.setItem("currency", next)
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border px-3 py-1 text-sm font-medium transition-colors hover:bg-muted"
      aria-label="Cambiar moneda"
    >
      {SYMBOLS[currency]}
    </button>
  )
}
