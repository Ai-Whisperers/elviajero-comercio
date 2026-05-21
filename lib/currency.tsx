"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { STORAGE_KEYS } from "@ai-whisperers/auth/storage-keys"
import es from "@/content/es.json"

type Currency = "PYG"
// Rate from content config, fallback to 7400
const RATE_PYG_PER_USD = (es as any)?.paymentGateway?.rate || 7400

interface CurrencyCtx {
  currency: Currency
  setCurrency: (c: Currency) => void
  formatPrice: (pygStr: string) => string
  formatDual: (pygStr: string) => { pyg: string; usd: string }
}

const CurrencyContext = createContext<CurrencyCtx>(null!)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCur] = useState<Currency>("PYG")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as Currency | null
    if (saved === "PYG") setCur(saved)
  }, [])

  const setCurrency = (_c: Currency) => {
    setCur("PYG")
    localStorage.setItem(STORAGE_KEYS.CURRENCY, "PYG")
  }

  const pygNum = (pygStr: string): number => {
    const m = pygStr.match(/[\d.,]+/)
    return m ? parseFloat(m[0].replace(/\./g, "").replace(",", ".")) : 0
  }

  const formatPrice = (pygStr: string): string => pygStr

  const formatDual = (pygStr: string) => {
    const n = pygNum(pygStr)
    return {
      pyg: `Gs. ${n.toLocaleString("es-PY")}`,
      usd: "",
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, formatDual }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider")
  return ctx
}
