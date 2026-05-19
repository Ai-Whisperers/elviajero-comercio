"use client"

import { useCart } from "@ai-whisperers/commerce/cart/cart-context"
import { CartEmptyState } from "@/components/ui"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { SafeImage } from "@/components/safe-image"

export function CartSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open])

  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  const formatGs = (n: number) => "Gs. " + n.toLocaleString("es-PY")

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 200)
  }

  const whatsappMsg = encodeURIComponent(
    "¡Hola! Quiero hacer un pedido:\n" +
      items.map((i) => `- ${i.name}${i.variant ? " (" + i.variant + ")" : ""} x${i.quantity}: ${formatGs((i.priceGs ?? 0) * i.quantity)}`).join("\n") +
      `\n\nTotal: ${formatGs(total)}\n\n¿Formas de pago y envío?`
  )

  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50 ${isClosing ? "pointer-events-none" : ""}`}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? "opacity-0" : "opacity-100"}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`absolute bottom-0 right-0 top-0 w-full max-w-md bg-surface shadow-2xl transition-transform duration-200 ${isClosing ? "translate-x-full" : "translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 className="text-base font-bold text-foreground">Tu carrito</h2>
            <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
              {items.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {items.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Tu carrito está vacío</p>
              <p className="mt-1 text-xs text-muted-foreground">Agregá productos para comenzar</p>
              <button
                onClick={handleClose}
                className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          )}

          {items.map((item, idx) => (
            <div
              key={item.name + (item.variant ? "::" + item.variant : "")}
              className={`flex gap-3 py-3 ${idx !== items.length - 1 ? "border-b border-border" : ""}`}
            >
              {/* Thumbnail */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.image ? (
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    containerClassName="h-full w-full"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                <p className="mt-0.5 text-sm font-bold text-primary">{formatGs((item.priceGs ?? 0) * item.quantity)}</p>

                {/* Quantity */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex items-center rounded-md border border-border bg-background">
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                    </button>
                    <span className="flex h-7 w-8 items-center justify-center text-xs font-medium tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.name)}
                    className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-surface px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
              <span className="text-lg font-bold text-foreground">{formatGs(total)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={handleClose}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ir al checkout
            </Link>

            <a
              href={`https://wa.me/595984009751?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Pedir por WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
