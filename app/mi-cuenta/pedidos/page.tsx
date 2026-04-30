"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs, EmptyState } from "@/components/ui"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function PedidosPage() {
  const [orders] = useState<any[]>([])
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viajero-orders")
      // In future, load from API
    } catch {}
  }, [])

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Mi Cuenta", href: "/mi-cuenta" }, { label: "Mis Pedidos" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mis Pedidos</h1>
          <EmptyState icon="📦" title="Sin pedidos aún" description="Tus pedidos aparecerán acá después de tu primera compra." action={{ label: "Ir a la tienda", href: "/tienda" }} />
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
