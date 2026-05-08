"use client"

import Script from "next/script"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""

export function AnalyticsProvider() {
  const pathname = usePathname()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    const gtag = (...args: unknown[]) => {
      const w = window as unknown as { dataLayer?: unknown[] }
      w.dataLayer = w.dataLayer || []
      w.dataLayer.push(args)
    }
    gtag("js", new Date())
    gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}

// Re-export tracking helpers for convenience
export function trackEvent(event: string, data?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined") {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void }
      w.gtag?.("event", event, data)
    }
  } catch {
    // silently fail
  }
}

export function trackWhatsAppClick(label?: string) {
  trackEvent("whatsapp_click", { event_label: label || "whatsapp_contact" })
}

export function trackAddToCart(productName: string, price: number, quantity: number) {
  trackEvent("add_to_cart", {
    currency: "PYG",
    items: [{ item_name: productName, price, quantity }],
  })
}

export function trackBeginCheckout(total: number) {
  trackEvent("begin_checkout", { currency: "PYG", value: total })
}

export function trackPurchase(order: { id: string; total: number; items: { name: string; price: number; quantity: number }[] }) {
  trackEvent("purchase", {
    transaction_id: order.id,
    value: order.total,
    currency: "PYG",
    items: order.items.map((i) => ({ item_id: i.name, item_name: i.name, price: i.price, quantity: i.quantity })),
  })
}
