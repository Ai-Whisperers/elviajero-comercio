"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("viajero_exit_dismissed")) { setDismissed(true); return }
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) setShow(true)
    }
    document.addEventListener("mouseleave", handler)
    return () => document.removeEventListener("mouseleave", handler)
  }, [dismissed])

  const close = () => { setShow(false); setDismissed(true); localStorage.setItem("viajero_exit_dismissed", "true") }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={close}>
      <div className="relative max-w-sm rounded-2xl bg-surface p-8 text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={close} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">✕</button>
        <div className="relative mx-auto mb-4 h-36 w-full max-w-[280px] overflow-hidden rounded-xl">
          <Image src="/images/marketing/exit-intent-promo.png" alt="" fill className="object-cover" sizes="280px" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">¡No te vayas aún!</h2>
        <p className="text-sm text-muted-foreground mb-6">Usá el código <strong className="text-primary">BIENVENIDO10</strong> y obtené 10% de descuento en tu primera compra.</p>
        <Link href="/tienda" onClick={close} className="inline-block rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90">
          Ver ofertas
        </Link>
      </div>
    </div>
  )
}
