"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

export interface CartItem {
  name: string
  price: string
  priceGs: number
  quantity: number
  imageUrl?: string
  category?: string
  priceBefore?: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (name: string) => void
  updateQuantity: (name: string, qty: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("viajero-cart")
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem("viajero-cart", JSON.stringify(items))
  }, [items, loaded])

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const exist = prev.find((i) => i.name === item.name)
      if (exist) {
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart-toast", {
          detail: { message: item.name + " (+1) en el carrito", type: "success" },
        }))
        return prev.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i))
      }
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart-toast", {
        detail: { message: item.name + " agregado al carrito", type: "success" },
      }))
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((name: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.name === name)
      const filtered = prev.filter((i) => i.name !== name)
      if (item && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("cart-toast", {
          detail: { message: item.name + " eliminado del carrito", type: "info" },
        }))
      }
      return filtered
    })
  }, [])
  const updateQuantity = useCallback(
    (name: string, qty: number) =>
      setItems((prev) => prev.map((i) => (i.name === name ? { ...i, quantity: Math.max(1, qty) } : i))),
    []
  )
  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.priceGs * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
