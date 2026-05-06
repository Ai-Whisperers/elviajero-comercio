"use client"
import { useCart } from "./cart-context"
// CartEmptyState provided by consumer app
// import { CartEmptyState } from "../ui"
import { useState, useEffect } from "react"
import Link from "next/link"

export function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, onClose])
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  const formatGs = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  const whatsappMsg = encodeURIComponent(
    "¡Hola! Quiero hacer un pedido:\n" +
      items.map((i) => `- ${i.name} x${i.quantity}: ${formatGs(i.priceGs! * i.quantity)}`).join("\n") +
      `\n\nTotal: ${formatGs(total)}\n\n¿Formas de pago y envío?`
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute bottom-0 right-0 top-0 w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="text-lg font-bold text-foreground">Carrito ({items.length})</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {items.length === 0 && <div className="p-4 text-center text-muted-foreground">Carrito vacío</div>}
          {items.map((item) => (
            <div key={item.name} className="mb-3 rounded-lg border border-border bg-surface p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{item.name}</p>
                  {item.priceBefore! && (
                    <p className="text-xs text-muted-foreground line-through">{item.priceBefore!}</p>
                  )}
                  <p className="text-primary font-bold">{formatGs(item.priceGs! * item.quantity)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.name)}
                  className="text-xs text-destructive hover:underline"
                >
                  Eliminar
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Cant:</span>
                <button
                  onClick={() => updateQuantity(item.name, item.quantity - 1)}
                  className="flex h-6 w-6 items-center justify-center rounded border border-border text-sm"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.name, item.quantity + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded border border-border text-sm"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-white px-4 py-4">
            <p className="mb-3 text-lg font-bold text-foreground">Total: {formatGs(total)}</p>
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Ir al checkout
            </Link>
            <button
              onClick={clearCart}
              className="mt-2 w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  )
}