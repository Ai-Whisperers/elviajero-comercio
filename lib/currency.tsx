"use client"
import { createContext, useContext, useState, useEffect } from "react"

type Currency = "PYG" | "USD"

// Rate: 1 USD = ~7,400 PYG (adjustable)
const RATE_PYG_PER_USD = 7400

interface CurrencyCtx {
  currency: Currency
  setCurrency: (c: Currency) => void
  formatPrice: (pygStr: string) => string
  formatDual: (pygStr: string) => { pyg: string; usd: string }
}

const CurrencyContext = createContext<CurrencyCtx>({
  currency: "PYG",
  setCurrency: () => {},
  formatPrice: (s) => s,
  formatDual: (s) => ({ pyg: s, usd: s }),
})

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCur] = useState<Currency>("PYG")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("viajero_currency") as Currency | null
      if (saved === "PYG" || saved === "USD") setCur(saved)
    } catch {}
  }, [])

  const setCurrency = (c: Currency) => {
    setCur(c)
    localStorage.setItem("viajero_currency", c)
    window.dispatchEvent(new CustomEvent("currency-change", { detail: c }))
  }

  const pygNum = (pygStr: string): number => {
    const m = pygStr.match(/[\d.,]+/)
    if (!m) return 0
    return parseInt(m[0].replace(/[.,]/g, ""), 10) || 0
  }

  const formatPrice = (pygStr: string): string => {
    const n = pygNum(pygStr)
    if (currency === "USD") {
      const usd = n / RATE_PYG_PER_USD
      return "USD " + usd.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    }
    return "Gs. " + n.toLocaleString("es-PY")
  }

  const formatDual = (pygStr: string) => {
    const n = pygNum(pygStr)
    return {
      pyg: "Gs. " + n.toLocaleString("es-PY"),
      usd: "USD " + (n / RATE_PYG_PER_USD).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 }),
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, formatDual }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
