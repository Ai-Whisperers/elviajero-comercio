import { CartProvider } from "@/lib/cart-context"
import { ToastProvider } from "@/components/toast"
import TiendaContent from "@/components/pages/tienda-content"

export const dynamic = "force-dynamic"

export default function TiendaPage() {
  return (
    <CartProvider>
      <ToastProvider>
        <TiendaContent />
      </ToastProvider>
    </CartProvider>
  )
}
