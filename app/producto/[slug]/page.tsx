import { CartProvider } from "@/lib/cart-context"
import { ToastProvider } from "@/components/toast"
import { AuthProvider } from "@/lib/auth-context"
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
