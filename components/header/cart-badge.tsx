"use client"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"

export function CartBadge({ onClick }: { onClick?: () => void }) {
  const { itemCount } = useCart()
  return (
    <button onClick={onClick} className="relative p-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors" aria-label="Carrito">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  )
}
