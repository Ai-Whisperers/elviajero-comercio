"use client"
import { CurrencyProvider } from "@/lib/currency"
import { CartProvider } from "@ai-whisperers/commerce/cart/cart-context"
import { ToastProvider } from "@/components/toast"
import { ContentProvider } from "@/lib/content-provider"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <ToastProvider>
          <ContentProvider>
            {children}
          </ContentProvider>
        </ToastProvider>
      </CartProvider>
    </CurrencyProvider>
  )
}
