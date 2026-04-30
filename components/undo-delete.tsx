
"use client"
import { useEffect, useRef } from "react"
import { useToast } from "@/components/toast"

export function UndoDeleteProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const undoFn = useRef<(() => void) | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail.type === "info" && detail.undo) {
        undoFn.current = detail.undo
        setTimeout(() => { undoFn.current = null }, 5000)
      }
    }
    window.addEventListener("cart-toast", handler)
    return () => window.removeEventListener("cart-toast", handler)
  }, [])

  return <>{children}</>
}
