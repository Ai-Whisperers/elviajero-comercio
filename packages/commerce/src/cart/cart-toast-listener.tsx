"use client"
import { useEffect } from "react"
import { toast } from "sonner"

export function CartToastListener() {
  
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      console.log("Toast:", detail.message, detail.type)
    }
    window.addEventListener("cart-toast", handler)
    return () => window.removeEventListener("cart-toast", handler)
  }, [toast])
  return null
}
