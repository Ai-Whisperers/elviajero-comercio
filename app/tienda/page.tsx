import type { Metadata } from "next"
import { CartProvider } from "@ai-whisperers/commerce/cart/cart-context"
import { ToastProvider } from "@/components/toast"
import TiendaContent from "@/components/pages/tienda-content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tienda Online | El Viajero — Camping, Pesca y Aventura en Paraguay",
  description:
    "Comprá equipamiento para camping, pesca, accesorios para auto y moto, y más. Envíos a todo Paraguay. Pedí por WhatsApp.",
  openGraph: {
    title: "Tienda Online | El Viajero",
    description: "Equipamiento para camping, pesca y aventura en Paraguay.",
    url: "https://el-viajero.paragu-ai.com/tienda",
    type: "website",
    images: [
      {
        url: "/images/marketing/tienda-hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "El Viajero Tienda Online",
      },
    ],
  },
}

export default function TiendaPage() {
  return (
    <CartProvider>
      <ToastProvider>
        <TiendaContent />
      </ToastProvider>
    </CartProvider>
  )
}
