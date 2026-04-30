"use client"
import { useEffect } from "react"
import { validatePromo } from "@/lib/promo-codes"

export function PromoFromUrl({ onValidPromo }: { onValidPromo: (code: string) => void }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("promo")
    if (code) {
      const result = validatePromo(code, 999999999)
      if (result.ok) onValidPromo(code)
    }
  }, [onValidPromo])
  return null
}
