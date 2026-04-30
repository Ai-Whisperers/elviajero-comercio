
import dynamic from "next/dynamic"

export const DynamicCartSidebar = dynamic(() => import("@/components/cart-sidebar").then(m => ({ default: m.CartSidebar })), {
  ssr: false,
  loading: () => <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />,
})

export const DynamicProductModal = dynamic(() => import("@/components/product-modal").then(m => ({ default: m.ProductModal })), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-xl bg-muted" />,
})

export const DynamicSearchAutocomplete = dynamic(() => import("@/components/search-autocomplete").then(m => ({ default: m.SearchAutocomplete })), {
  ssr: false,
  loading: () => <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />,
})
