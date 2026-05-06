"use client"
import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import content from "@/content/es.json"

const c = content as any
const ga = c.analytics?.ga4 || {}

// Extend Window type
declare global {
  interface Window {
    dataLayer: any[]
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!ga.enabled || !ga.measurementId || ga.measurementId === "G-XXXXXXXX") return

    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga.measurementId}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    const gtag = (...args: any[]) => { (window.dataLayer as any[]).push(args) }
    gtag("js", new Date())
    gtag("config", ga.measurementId)
    gtag("event", "page_view", { page_path: pathname })

    window.gtag = gtag
  }, [pathname, ga.enabled, ga.measurementId])

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
