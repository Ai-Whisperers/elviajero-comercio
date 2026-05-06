"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import content from "@/content/es.json"

const c = content as any
const ga = c.analytics?.ga4 || {}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    if (!ga.enabled || !ga.measurementId || ga.measurementId === "G-XXXXXXXX") return

    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga.measurementId}`
    script.async = true
    document.head.appendChild(script)

    const w = window as any
    w.dataLayer = w.dataLayer || []
    const gtag = (...args: any[]) => { w.dataLayer.push(args) }
    gtag("js", new Date())
    gtag("config", ga.measurementId)
    gtag("event", "page_view", { page_path: pathname })

    w.gtag = gtag
  }, [pathname, ga.enabled, ga.measurementId])

  return <>{children}</>
}

export function trackWhatsAppClick(label?: string) {
  const w = typeof window !== "undefined" ? (window as any) : null
  if (w?.gtag) {
    w.gtag("event", "whatsapp_click", { event_label: label || "whatsapp_contact" })
  }
}

export function trackAddToCart(productName: string, price: number, quantity: number) {
  const w = typeof window !== "undefined" ? (window as any) : null
  if (w?.gtag) {
    w.gtag("event", "add_to_cart", {
      currency: "PYG",
      items: [{ item_name: productName, price, quantity }]
    })
  }
}

export function trackBeginCheckout(total: number) {
  const w = typeof window !== "undefined" ? (window as any) : null
  if (w?.gtag) {
    w.gtag("event", "begin_checkout", { currency: "PYG", value: total })
  }
}
