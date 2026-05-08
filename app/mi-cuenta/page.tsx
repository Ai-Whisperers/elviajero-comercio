"use client"
export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
export const runtime = "edge"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import Link from "next/link"
import content from "@/content/es.json"

const c = content as any

function DashboardForm() {
  const { user, orders = [], addresses = [], logout } = useAuth()

  const quickActions = [
    { label: "Mis Pedidos", href: "/mi-cuenta/pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", count: orders.length },
    { label: "Direcciones", href: "/mi-cuenta/direcciones", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", count: addresses.length },
    { label: "Favoritos", href: "/mi-cuenta/favoritos", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
    { label: "Configuración", href: "/mi-cuenta/configuracion", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  ]

  return (
    <>
      <Header />
      <section className="min-h-[70vh] bg-muted/30 pb-20 pt-8">
        <div className="mx-auto max-w-5xl px-4">
          {/* User card */}
          <div className="mb-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="bg-gradient-to-r from-primary to-primary/70 px-6 py-8 text-primary-foreground">
              <h1 className="text-2xl font-bold">Hola, {user?.name?.split(" ")[0] || "Usuario"}</h1>
              <p className="mt-1 text-primary-foreground/80">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex gap-6 text-sm">
                <span className="text-muted-foreground">Tel: <span className="text-foreground">{user?.phone || "—"}</span></span>
                <span className="text-muted-foreground hidden sm:inline">Desde: <span className="text-foreground">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("es") : "—"}</span></span>
              </div>
              <button onClick={logout} className="text-sm text-destructive hover:underline">Cerrar sesión</button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((qa) => (
              <Link key={qa.label} href={qa.href}
                className="flex flex-col items-center rounded-xl border border-border bg-surface p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d={qa.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">{qa.label}</span>
                {qa.count !== undefined && (
                  <span className="mt-1 text-xs font-bold text-primary">{qa.count}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Recent orders */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Pedidos recientes</h2>
              {orders.length > 0 && (
                <Link href="/mi-cuenta/pedidos" className="text-sm font-semibold text-primary hover:underline">Ver todos</Link>
              )}
            </div>
            {orders.length === 0 ? (
              <div className="rounded-xl border border-border bg-surface p-8 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-muted-foreground">No tenés pedidos todavía</p>
                <Link href="/tienda" className="mt-3 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  Ir a la tienda
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                        📦
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">#{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(order.created_at || order.createdAt).toLocaleDateString("es")} · {(()=>{try{let i=order.items||'[]';return JSON.parse(i).length}catch{return 0}})()} artículo{(()=>{try{let i=order.items||'[]';return JSON.parse(i).length}catch{return 0}})()>1?"s":""}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{order.total}</p>
                      <span className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        order.status === "pendiente" ? "bg-warning/20 text-warning" :
                        order.status === "confirmado" ? "bg-primary/10 text-primary" :
                        order.status === "enviado" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        order.status === "entregado" ? "bg-success/10 text-success" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat phone={c.home?.contact?.whatsapp || "595981234567"} message={c.whatsapp?.defaultMessage || "Hola! Quiero informacion"} />
      <CookieConsent />
    </>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardForm />
    </AuthProvider>
  )
}
