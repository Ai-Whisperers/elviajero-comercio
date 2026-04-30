"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import Link from "next/link"

export default function AdminPage() {
  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Admin" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Panel de Administración</h1>
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/admin/pedidos" className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="text-4xl block mb-3">📦</span>
              <h3 className="font-semibold text-foreground">Pedidos</h3>
              <p className="text-xs text-muted-foreground mt-1">Gestionar pedidos entrantes</p>
            </Link>
            <div className="rounded-xl border border-border bg-muted p-6 text-center opacity-50">
              <span className="text-4xl block mb-3">📊</span>
              <h3 className="font-semibold text-foreground">Reportes</h3>
              <p className="text-xs text-muted-foreground mt-1">Próximamente</p>
            </div>
            <div className="rounded-xl border border-border bg-muted p-6 text-center opacity-50">
              <span className="text-4xl block mb-3">🏷️</span>
              <h3 className="font-semibold text-foreground">Productos</h3>
              <p className="text-xs text-muted-foreground mt-1">Próximamente</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
