"use client"
import { useCart } from "../cart/cart-context"
// import { trackAddToCart } from "../analytics"
import { useState } from "react"

export function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart()
  const [alertPhone, setAlertPhone] = useState("")
  const [alertSent, setAlertSent] = useState(false)
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0

  const handleAdd = () => {
    addItem({ id: product.id || product.slug, productId: product.id || product.slug, name: product.name, price: product.price, priceGs: parseGs(product.price), image: product.imageUrl, category: product.category, priceBefore: product.priceBefore })
    // trackAddToCart(product.name, parseGs(product.price), 1)
  }

  const handleStockAlert = async () => {
    if (!alertPhone) return
    try {
      await fetch("/api/stock-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: product.name, phone: alertPhone })
      })
      setAlertSent(true)
    } catch {}
  }

  if (product.stock === 0) {
    return (
      <div className="w-full">
        <button disabled className="w-full rounded-lg bg-muted py-3 text-sm font-semibold text-muted-foreground cursor-not-allowed mb-2">
          Producto agotado
        </button>
        {!alertSent ? (
          <div className="flex gap-2">
            <input
              value={alertPhone}
              onChange={e => setAlertPhone(e.target.value)}
              placeholder="Tu WhatsApp"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs outline-none focus:border-ring"
            />
            <button onClick={handleStockAlert} className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90">
              Avisarme
            </button>
          </div>
        ) : (
          <p className="text-xs text-green-600 text-center">✅ Te avisaremos cuando vuelva a estar disponible</p>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleAdd}
      className="flex flex-1 items-center justify-center rounded-lg px-8 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      Agregar al carrito
    </button>
  )
}