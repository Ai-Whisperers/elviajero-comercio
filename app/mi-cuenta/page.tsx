"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Breadcrumbs } from "@/components/ui"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function MiCuentaPage() {
  const [session, setSession] = useState<any>(null)
  useEffect(() => {
    try {
      const s = localStorage.getItem("viajero-session")
      if (s) setSession(JSON.parse(s))
    } catch {}
  }, [])

  if (!session) {
    return (
      <>
        <Header />
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Mi Cuenta" }]} />
        <section className="flex min-h-[60vh] items-center justify-center bg-background px-4">
          <div className="max-w-sm text-center">
            <span className="text-5xl mb-4 block">🔐</span>
            <h1 className="text-2xl font-bold text-foreground mb-4">Iniciá sesión</h1>
            <p className="text-sm text-muted-foreground mb-6">Necesitás estar registrado para ver tu cuenta.</p>
            <Link href="/login" className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Iniciar sesión</Link>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Mi Cuenta" }]} />
      <section className="bg-background py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">Hola, {session.name}</h1>
          <p className="text-muted-foreground mb-8">{session.email}</p>
          <div className="grid gap-6 sm:grid-cols-3">
            <Link href="/mi-cuenta/pedidos" className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="text-3xl block mb-2">📦</span>
              <h3 className="font-semibold text-foreground">Mis Pedidos</h3>
              <p className="text-xs text-muted-foreground mt-1">Historial de compras</p>
            </Link>
            <Link href="/mi-cuenta/favoritos" className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="text-3xl block mb-2">❤️</span>
              <h3 className="font-semibold text-foreground">Favoritos</h3>
              <p className="text-xs text-muted-foreground mt-1">Tus productos guardados</p>
            </Link>
            <Link href="/mi-cuenta/direcciones" className="rounded-xl border border-border bg-surface p-6 text-center transition-all hover:-translate-y-1 hover:shadow-md">
              <span className="text-3xl block mb-2">📍</span>
              <h3 className="font-semibold text-foreground">Direcciones</h3>
              <p className="text-xs text-muted-foreground mt-1">Tus datos de envío</p>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <CookieConsent />
    </>
  )
}
