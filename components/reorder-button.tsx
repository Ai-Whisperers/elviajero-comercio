
"use client"
import { useAuth } from "@ai-whisperers/auth/auth-context"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import { useRouter } from "next/navigation"

export function ReorderButton({ orderId }: { orderId: string }) {
  const { orders } = useAuth()
  const { addItem } = useCart()
  const router = useRouter()

  const reorder = () => {
    const order = orders.find(o => o.id === orderId)
    if (!order || !order.items) return
    order.items.forEach((item: any) => {
      const priceNum = parseInt(item.price.replace(/[^0-9]/g, ""), 10) || 0
      for (let i = 0; i < (item.quantity || 1); i++) {
        addItem({ id: item.id || item.name, productId: item.id || item.name, name: item.name, price: item.price, priceGs: priceNum / (item.quantity || 1), image: item.imageUrl })
      }
    })
    router.push("/checkout")
  }

  return (
    <button onClick={reorder} className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-all">
      Comprar de nuevo
    </button>
  )
}
