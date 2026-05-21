"use client"
import { useAuth, AuthProvider } from "@ai-whisperers/auth/auth-context"
import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@ai-whisperers/auth/supabase/client"

interface LoyaltyConfig {
  enabled: boolean
  points_per_gs: number
  welcome_points: number
  referral_points: number
  redemption_rate: number
  tiers: { name: string; min_points: number; discount_percent: number }[]
}

const defaultConfig: LoyaltyConfig = {
  enabled: false,
  points_per_gs: 1000,
  welcome_points: 100,
  referral_points: 500,
  redemption_rate: 100,
  tiers: [
    { name: "Bronce", min_points: 0, discount_percent: 0 },
    { name: "Plata", min_points: 1000, discount_percent: 5 },
    { name: "Oro", min_points: 5000, discount_percent: 10 },
    { name: "Platino", min_points: 15000, discount_percent: 15 },
  ],
}

function LoyaltyContent() {
  const { user } = useAuth()
  const supabase = createClient()
  const [points, setPoints] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [config, setConfig] = useState<LoyaltyConfig>(defaultConfig)

  useEffect(() => {
    fetch("/api/admin/loyalty")
      .then(r => r.json())
      .then(data => { if (data && typeof data === "object" && "enabled" in data) setConfig(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!user) return
    supabase.from("ej_loyalty_points").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) {
        setPoints(data.reduce((s: number, r: any) => s + r.points, 0))
        setHistory(data)
      }
    })
  }, [user, supabase])

  const tiers = config.tiers?.length ? config.tiers : defaultConfig.tiers
  const tier = [...tiers].reverse().find(t => points >= t.min_points) || tiers[0]
  const nextTier = tiers.find(t => t.min_points > points)
  const pointsToNext = nextTier ? nextTier.min_points - points : 0
  const discountValue = Math.floor(points * (config.redemption_rate || 100) / 100)
  const refCode = user ? "VIAJERO-" + user.id.slice(0, 6).toUpperCase() : ""

  return (
    <>
<section className="bg-background py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mis beneficios</h1>

          {!user ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="text-muted-foreground mb-4">Iniciá sesión para ver tus puntos y beneficios</p>
              <Link href="/login" className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Iniciar Sesión</Link>
            </div>
          ) : !config.enabled ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <p className="text-muted-foreground mb-4">El programa de fidelidad está temporalmente desactivado.</p>
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
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-white font-bold`}>
                    {tier.name[0]}
                  </div>
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-primary font-medium">{tier.name}</span>
                  {nextTier && <span className="text-muted-foreground">{pointsToNext} pts para {nextTier.name}</span>}
                </div>
                {nextTier && <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (points / nextTier.min_points) * 100)}%` }} /></div>}
              </div>

              {/* Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">Gs. {discountValue.toLocaleString("es-PY")}</p>
                  <p className="text-xs text-muted-foreground mt-1">Valor en descuento</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{tier.discount_percent || 0}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Descuento nivel {tier.name}</p>
                </div>
              </div>

              {/* Referral */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="font-semibold text-foreground mb-2">Invitar a un amigo</h2>
                <p className="text-sm text-muted-foreground mb-3">Compartí tu código y ambos reciben {config.referral_points || 100} puntos</p>
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
</>
  )
}

export default function LoyaltyPage() {
  return <AuthProvider><LoyaltyContent /></AuthProvider>
}
