import { CartProvider } from "@ai-whisperers/commerce/cart/cart-context"
import { ToastProvider } from "@/components/toast"
import { AuthProvider } from "@ai-whisperers/auth/auth-context"
import ProductContent from "@/components/pages/product-content"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <CartProvider>
      <ToastProvider>
        <AuthProvider>
          <ProductContent slug={slug} />
        </AuthProvider>
      </ToastProvider>
    </CartProvider>
  )
}
