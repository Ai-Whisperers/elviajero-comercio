"use client"
import { useCart } from "@/lib/cart-context"

export function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart()
  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0
  return (
    <button
      disabled={product.stock === 0}
      onClick={() => addItem({ name: product.name, price: product.price, priceGs: parseGs(product.price), imageUrl: product.imageUrl, category: product.category, priceBefore: product.priceBefore })}
      className={`flex flex-1 items-center justify-center rounded-lg px-8 py-3 text-sm font-semibold transition-all ${product.stock === 0 ? "cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      {product.stock === 0 ? "Agotado" : "Agregar al carrito"}
    </button>
  )
}
