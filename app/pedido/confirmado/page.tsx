"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import Link from "next/link"

export default function ConfirmadoPage() {
  return (
    <>
      <Header />
      <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <span className="text-6xl mb-4 block">✅</span>
          <h1 className="text-3xl font-bold text-foreground mb-4">¡Pedido confirmado!</h1>
          <p className="text-muted-foreground mb-2">Gracias por tu compra. Te enviamos los detalles por WhatsApp.</p>
          <p className="text-sm text-muted-foreground mb-6">Si no recibís nuestro mensaje en 15 minutos, escribinos al +595 981 234 567</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Seguir comprando</Link>
            <Link href="/mi-cuenta/pedidos" className="inline-flex h-10 items-center justify-center rounded-lg border border-primary px-6 text-sm font-semibold text-primary hover:bg-primary/5">Ver mis pedidos</Link>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
