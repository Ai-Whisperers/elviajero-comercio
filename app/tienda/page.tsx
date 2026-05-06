import { CartProvider } from "@ai-whisperers/commerce/cart/cart-context"
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
