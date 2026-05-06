"use client"
import { useEffect } from "react"

export function trackEvent(event: string, data?: Record<string, any>) {
  try {
    if (typeof window !== "undefined" && "gtag" in window) {
      ;(window as any).gtag?.("event", event, data)
    }
  } catch {}
}

export function AnalyticsTracker({ page }: { page: string }) {
  useEffect(() => {
    trackEvent("page_view", { page_title: document.title, page_location: window.location.href })
  }, [page])
  return null
}

export function trackViewItem(product: { id?: string; name: string; price: string; category?: string }) {
  trackEvent("view_item", {
    items: [{ item_id: product.id || product.name, item_name: product.name, price: product.price, item_category: product.category }],
  })
}

export function trackAddToCart(product: { id?: string; name: string; price: string; category?: string; quantity?: number }) {
  trackEvent("add_to_cart", {
    currency: "PYG", value: product.price,
    items: [{ item_id: product.id || product.name, item_name: product.name, price: product.price, quantity: product.quantity || 1, item_category: product.category }],
  })
}

export function trackPurchase(order: { id: string; total: string; items: any[] }) {
  trackEvent("purchase", {
    transaction_id: order.id, value: order.total, currency: "PYG",
    items: order.items.map((i: any) => ({ item_id: i.name, item_name: i.name, price: i.price, quantity: i.quantity })),
  })
}
