"use client"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, any>) => void
    dataLayer: any[]
  }
}

interface GA4Config {
  enabled?: boolean
  measurementId?: string
}

export function AnalyticsProvider({ 
  children, 
  ga4 = {} 
}: { 
  children: React.ReactNode
  ga4?: GA4Config 
}) {
  const pathname = usePathname()

  useEffect(() => {
    if (!ga4.enabled || !ga4.measurementId || ga4.measurementId === "G-XXXXXXXX") return

    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4.measurementId}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    const gtag = (...args: any[]) => { (window.dataLayer as any[]).push(args) }
    gtag("js", new Date())
    gtag("config", ga4.measurementId)
    gtag("event", "page_view", { page_path: pathname })

    window.gtag = gtag
  }, [pathname, ga4.enabled, ga4.measurementId])

  return <>{children}</>
}

export function trackWhatsAppClick(label?: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "whatsapp_click", { event_label: label || "whatsapp_contact" })
  }
}

export function trackAddToCart(productName: string, price: number, quantity: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "add_to_cart", {
      currency: "PYG",
      items: [{ item_name: productName, price, quantity }]
    })
  }
}

export function trackBeginCheckout(total: number) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "begin_checkout", { currency: "PYG", value: total })
  }
}
