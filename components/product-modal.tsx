"use client"
import { useState } from "react"
import { useCart } from "@ai-whisperers/commerce/cart/cart-context"

interface ProductModalProps {
  product: any
  onClose: () => void
}

export function ProductModal({ product: p, onClose }: ProductModalProps) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  const parseGs = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0

  if (!p) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {p.imageUrl && (
          <img
            src={p.imageUrl}
            alt={p.name}
            className="mb-4 aspect-video w-full rounded-xl bg-muted object-cover"
          />
        )}
        <h2 className="text-2xl font-bold text-foreground">{p.name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">{p.price}</span>
          {p.priceBefore && (
            <span className="text-sm text-muted-foreground line-through">{p.priceBefore}</span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Cantidad:</span>
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm"
          >
            −
          </button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="flex h-8 w-8 items-center justify-center rounded border border-border text-sm"
          >
            +
          </button>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              for (let i = 0; i < qty; i++) {
                addItem({
                  id: p.id || p.slug || p.name,
                  productId: p.id || p.slug || p.name,
                  name: p.name,
                  price: p.price,
                  priceGs: parseGs(p.price),
                  image: p.imageUrl,
                  category: p.category,
                  priceBefore: p.priceBefore,
                })
              }
              onClose()
            }}
            className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Agregar al carrito
          </button>
          <a
            href={`https://wa.me/595981234567?text=${encodeURIComponent("Hola! Me interesa " + p.name + " (" + p.price + ")")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center rounded-lg border border-primary py-3 font-semibold text-primary transition-all hover:bg-primary/5"
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  )
}
