"use client"
export const dynamic = "force-dynamic"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function ConfirmedContent() {
  const sp = useSearchParams()
  const orderId = sp.get("id") || ""
  const { orders } = useAuth()
  const order = orders.find(o => o.id === orderId)

  return (
    <>
      <Header />
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-4xl">
            ✅
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pedido Confirmado</h1>
          <p className="mt-2 text-muted-foreground">Gracias por tu compra. Te contactaremos por WhatsApp para coordinar la entrega.</p>
          {orderId && (
            <div className="mt-6 rounded-xl border border-border bg-surface p-4">
              <p className="text-xs text-muted-foreground">Número de pedido</p>
              <p className="text-lg font-bold text-foreground">#{orderId.slice(0, 8)}</p>
              {order && (
                <p className="mt-1 text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString("es", { dateStyle: "long" })} · {order.total}</p>
              )}
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/mi-cuenta/pedidos" className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Mis pedidos</Link>
            <Link href="/tienda" className="rounded-lg border border-border px-6 py-3 font-semibold text-foreground hover:bg-surface">Seguir comprando</Link>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function ConfirmedPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Cargando...</p></div>}>
        <ConfirmedContent />
      </Suspense>
    </AuthProvider>
  )
}
