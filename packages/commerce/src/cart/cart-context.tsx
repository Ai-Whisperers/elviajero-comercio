"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { CartItem } from "../types"

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (name: string) => void
  updateQuantity: (name: string, qty: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  savedItems: CartItem[]
  saveItem: (name: string) => void
  restoreItem: (name: string) => void
  shareCart: () => string
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [savedItems, setSavedItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("viajero-cart")
      if (saved) setItems(JSON.parse(saved))
      const svd = localStorage.getItem("viajero_saved")
      if (svd) setSavedItems(JSON.parse(svd))
    } catch {}
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) localStorage.setItem("viajero-cart", JSON.stringify(items))
  }, [items, loaded])

  useEffect(() => {
    if (loaded) localStorage.setItem("viajero_saved", JSON.stringify(savedItems))
  }, [savedItems, loaded])

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const exist = prev.find((i) => i.name === item.name)
      if (exist) {
        if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart-toast", { detail: { message: item.name + " (+1) en el carrito", type: "success" } }))
        try { if (typeof window !== "undefined" && (window as any).gtag) { const p = parseInt(item.priceGs!?.toString() || "0", 10); (window as any).gtag("event", "add_to_cart", { currency: "PYG", value: p / 7400, items: [{ item_id: item.name, item_name: item.name, price: p / 7400, quantity: 1 }] }) } } catch {}
        return prev.map((i) => (i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i))
      }
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart-toast", { detail: { message: item.name + " agregado al carrito", type: "success" } }))
      try { if (typeof window !== "undefined" && (window as any).gtag) { const p = parseInt(item.priceGs!?.toString() || "0", 10); (window as any).gtag("event", "add_to_cart", { currency: "PYG", value: p / 7400, items: [{ item_id: item.name, item_name: item.name, price: p / 7400, quantity: 1 }] }) } } catch {}
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((name: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.name === name)
      const filtered = prev.filter((i) => i.name !== name)
      if (item && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent("cart-toast", { detail: { message: item.name + " eliminado del carrito", type: "info" } }))
      }
      return filtered
    })
  }, [])

  const saveItem = useCallback((name: string) => {
    const item = items.find(i => i.name === name)
    if (!item) return
    setItems(prev => prev.filter(i => i.name !== name))
    setSavedItems(prev => [...prev, item])
  }, [items])

  const restoreItem = useCallback((name: string) => {
    const item = savedItems.find(i => i.name === name)
    if (!item) return
    setSavedItems(prev => prev.filter(i => i.name !== name))
    const { quantity: _, ...rest } = item
    addItem(rest)
  }, [savedItems, addItem])

  const total = items.reduce((sum, i) => sum + i.priceGs! * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const shareCart = useCallback(() => {
    const msg = items.map(i => "\u2022 " + i.name + " x" + i.quantity + ": " + i.price).join("\n")
    const url = "https://wa.me/?text=" + encodeURIComponent("Mir\u00e1 mi carrito de El Viajero:\n\n" + msg + "\n\nTotal: Gs. " + total.toLocaleString("es-PY"))
    window.open(url, "_blank")
    return url
  }, [items, total])

  const updateQuantity = useCallback(
    (name: string, qty: number) =>
      setItems((prev) => prev.map((i) => (i.name === name ? { ...i, quantity: Math.max(1, qty) } : i))),
    []
  )
  const clearCart = useCallback(() => setItems([]), [])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount, savedItems, saveItem, restoreItem, shareCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)