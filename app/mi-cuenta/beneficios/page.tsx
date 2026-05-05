"use client"
import { useAuth, AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

const TIERS = [
  { name: "Bronce", minPoints: 0, multiplier: 1, color: "bg-amber-700" },
  { name: "Plata", minPoints: 1000, multiplier: 1.2, color: "bg-gray-400" },
  { name: "Oro", minPoints: 5000, multiplier: 1.5, color: "bg-yellow-500" },
  { name: "Platino", minPoints: 20000, multiplier: 2, color: "bg-gray-200" },
]

function LoyaltyContent() {
  const { user } = useAuth()
  const supabase = createClient()
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from("ej_loyalty_points").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) {
        setPoints(data.reduce((s: number, r: any) => s + r.points, 0))
        setHistory(data)
      }
    })
  }, [user, supabase])

  const tier = [...TIERS].reverse().find(t => points >= t.minPoints) || TIERS[0]
  const nextTier = TIERS.find(t => t.minPoints > points)
  const pointsToNext = nextTier ? nextTier.minPoints - points : 0
  const discountValue = Math.floor(points / 50)
  const refCode = user ? "VIAJERO-" + user.id.slice(0, 6).toUpperCase() : ""

  return (
    <>
      <Header />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mis beneficios</h1>

          {!user ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="text-muted-foreground mb-4">Iniciá sesión para ver tus puntos y beneficios</p>
              <Link href="/login" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Iniciar Sesión</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Points card */}
              <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tus puntos</p>
                    <p className="text-4xl font-bold text-foreground">{points.toLocaleString("es-PY")}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tier.color} text-white font-bold`}>
                    {tier.name[0]}
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">{tier.name}</span>
                  {nextTier && <span className="text-muted-foreground">{pointsToNext} pts para {nextTier.name}</span>}
                </div>
                {nextTier && <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (points / nextTier.minPoints) * 100)}%` }} /></div>}
              </div>

              {/* Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">Gs. {discountValue.toLocaleString("es-PY")}</p>
                  <p className="text-xs text-muted-foreground mt-1">Valor en descuento</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{tier.multiplier}x</p>
                  <p className="text-xs text-muted-foreground mt-1">Multiplicador {tier.name}</p>
                </div>
              </div>

              {/* Referral */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="font-semibold text-foreground mb-2">Invitar a un amigo</h2>
                <p className="text-sm text-muted-foreground mb-3">Compartí tu código y ambos reciben 100 puntos</p>
                <div className="flex gap-2">
                  <input readOnly value={refCode} className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-mono outline-none" />
                  <button onClick={() => navigator.clipboard.writeText(refCode)} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Copiar</button>
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div>
                  <h2 className="font-semibold text-foreground mb-3">Historial</h2>
                  <div className="space-y-2">
                    {history.slice(0, 10).map((h: any, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{h.source === "order" ? "Compra" : h.source === "referral" ? "Referido" : "Bono"}</p>
                          <p className="text-xs text-muted-foreground">{h.created_at ? new Date(h.created_at).toLocaleDateString("es") : ""}</p>
                        </div>
                        <span className="text-sm font-bold text-success">+{h.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer /><CookieConsent />
    </>
  )
}

export default function LoyaltyPage() {
  return <AuthProvider><LoyaltyContent /></AuthProvider>
}
