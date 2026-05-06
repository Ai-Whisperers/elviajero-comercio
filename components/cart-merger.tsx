
"use client"
import { useAuth } from "@ai-whisperers/auth/auth-context"
import { useEffect, useState } from "react"

const KEY = "viajero_cart_merged"

export function CartMerger() {
  const { user } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!user || done) return
    const merged = localStorage.getItem(KEY)
    if (merged === user.id) return
    
    const guestCart = JSON.parse(localStorage.getItem("viajero-cart") || "[]")
    const userCart = JSON.parse(localStorage.getItem("viajero-cart-" + user.id) || "[]")
    
    // Merge: userCart takes priority, add guest items that don't exist
    const mergedCart = [...userCart]
    guestCart.forEach((guestItem: any) => {
      if (!mergedCart.find((i: any) => i.name === guestItem.name)) {
        mergedCart.push(guestItem)
      }
    })
    
    if (mergedCart.length > userCart.length) {
      localStorage.setItem("viajero-cart", JSON.stringify(mergedCart))
      localStorage.setItem(KEY, user.id)
      window.dispatchEvent(new CustomEvent("cart-toast", {
        detail: { message: "Carrito combinado con tu cuenta", type: "info" },
      }))
    }
    setDone(true)
  }, [user, done])

  return null
}
