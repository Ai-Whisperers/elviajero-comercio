
"use client"
import { useEffect } from "react"
import { validatePromo } from "@/lib/promo-codes"

export function AutoPromo({ onValidPromo }: { onValidPromo: (code: string) => void }) {
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const code = params.get("promo")
    if (!code) return
    const result = validatePromo(code, 0)
    if (result.ok) {
      const input = document.querySelector<HTMLInputElement>("[placeholder*=\"C\u00f3digo\"]")
      if (input) { input.value = code; input.dispatchEvent(new Event("input", { bubbles: true })) }
      onValidPromo(code)
    }
  }, [onValidPromo])
  return null
}
