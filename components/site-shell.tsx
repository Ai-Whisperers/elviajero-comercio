"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { CookieConsent } from "@/components/cookie-consent"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { CartToastListener } from "@/components/cart-toast-listener"
import { NewsletterSuccess } from "@/components/ui"
import { useContent } from "@/lib/content-provider"

/**
 * Shared site shell rendered in root layout.
 * Provides Header with working cart toggle, CartSidebar, Footer, WhatsApp float,
 * CookieConsent, and global listeners on EVERY page.
 *
 * Before this, CartSidebar only lived in app/page.tsx (homepage),
 * so the cart icon in Header was dead on /tienda, /blog, /producto, etc.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false)
  const { get } = useContent()

  const whatsappPhone =
    get("home.contact.whatsapp") ||
    process.env.NEXT_PUBLIC_WHATSAPP ||
    "595984009751"

  const whatsappMessage =
    get("whatsapp.defaultMessage") || "Hola! Quiero informacion"

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <CartToastListener />
      <NewsletterSuccess />
      {children}
      <Footer />
      <CookieConsent />
      <WhatsAppFloat phone={whatsappPhone} message={whatsappMessage} />
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
