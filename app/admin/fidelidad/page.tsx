"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, EmptyState } from "@/components/admin/ui"

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

export default function LoyaltyPage() {
  const { authed } = useAdminAuth()
  const [config, setConfig] = useState<LoyaltyConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!authed) return
    fetch("/api/admin/loyalty")
      .then(r => r.json())
      .then(data => {
        if (data && typeof data === "object" && "enabled" in data) setConfig(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [authed])

  const save = async () => {
    await fetch("/api/admin/loyalty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateTier = (index: number, field: keyof typeof config.tiers[0], value: string | number) => {
    const tiers = [...config.tiers]
    tiers[index] = { ...tiers[index], [field]: value }
    setConfig({ ...config, tiers })
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Programa de Fidelidad"
        subtitle="Configurá puntos, niveles y beneficios"
        actions={
          <div className="flex items-center gap-3">
            {saved && <span className="text-xs text-emerald-400">✓ Guardado</span>}
            <button onClick={save} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
              Guardar configuración
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-zinc-800/50" />)}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Enable toggle */}
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                className="w-5 h-5 rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500/20"
              />
              <div>
                <h3 className="text-sm font-semibold text-white">Activar programa de fidelidad</h3>
                <p className="text-xs text-zinc-500">Los clientes acumulan puntos con cada compra</p>
              </div>
            </label>
          </div>

          {config.enabled && (
            <>
              {/* Points config */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Configuración de puntos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Pts por cada Gs. gastado</label>
                    <input
                      type="number"
                      value={config.points_per_gs}
                      onChange={e => setConfig({ ...config, points_per_gs: parseInt(e.target.value) || 1 })}
                      className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Puntos de bienvenida</label>
                    <input
                      type="number"
                      value={config.welcome_points}
                      onChange={e => setConfig({ ...config, welcome_points: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Puntos por referido</label>
                    <input
                      type="number"
                      value={config.referral_points}
                      onChange={e => setConfig({ ...config, referral_points: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs text-zinc-400 mb-1">Gs. por punto al canjear</label>
                  <input
                    type="number"
                    value={config.redemption_rate}
                    onChange={e => setConfig({ ...config, redemption_rate: parseInt(e.target.value) || 1 })}
                    className="w-32 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Ej: 100 = 1 punto canjea Gs. 100 de descuento</p>
                </div>
              </div>

              {/* Tiers */}
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Niveles / Tiers</h3>
                <div className="space-y-3">
                  {config.tiers.map((tier, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input
                        value={tier.name}
                        onChange={e => updateTier(i, "name", e.target.value)}
                        className="w-32 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                        placeholder="Nombre"
                      />
                      <input
                        type="number"
                        value={tier.min_points}
                        onChange={e => updateTier(i, "min_points", parseInt(e.target.value) || 0)}
                        className="w-28 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                        placeholder="Min puntos"
                      />
                      <input
                        type="number"
                        value={tier.discount_percent}
                        onChange={e => updateTier(i, "discount_percent", parseInt(e.target.value) || 0)}
                        className="w-24 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white"
                        placeholder="% dto"
                      />
                      <span className="text-xs text-zinc-500">% descuento automático</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
