
"use client"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const runtime = "edge"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { OrderTimeline } from "@/components/order-timeline"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Suspense } from "react"

function OrderDetailContent() {
  const sp = useSearchParams()
  const orderId = sp.get("id") || ""
  const { orders } = useAuth()
  const order = orders.find(o => o.id === orderId)

  if (!order) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold text-foreground mb-2">Pedido no encontrado</h1>
          <Link href="/mi-cuenta/pedidos" className="text-primary hover:underline">Ver mis pedidos</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <Link href="/mi-cuenta/pedidos" className="text-muted-foreground hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Pedido #{order.id.slice(0, 8)}</h1>
          </div>

          <div className="mb-8 rounded-xl border border-border bg-surface p-6">
            <OrderTimeline order={order} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Detalles</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Fecha</span><span>{new Date(order.date).toLocaleDateString("es", { dateStyle: "long" })}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Pago</span><span>{order.paymentMethod}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold">{order.total}</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface p-5">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Artículos</h2>
              <div className="divide-y divide-border">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}

export default function OrderDetailPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Cargando...</p></div>}>
        <OrderDetailContent />
      </Suspense>
    </AuthProvider>
  )
}
