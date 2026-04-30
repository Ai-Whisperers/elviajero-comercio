"use client"
import { useEffect } from "react"
import { useToast } from "@/components/toast"

export function CartToastListener() {
  const { toast } = useToast()
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      toast(detail.message, detail.type as any)
    }
    window.addEventListener("cart-toast", handler)
    return () => window.removeEventListener("cart-toast", handler)
  }, [toast])
  return null
}
