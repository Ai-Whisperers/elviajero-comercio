"use client"
import { useAuth } from "@ai-whisperers/auth/auth-context"
import { formatCurrency } from "@/lib/site-config"

export interface ShippingZone {
  id: string
  name: string
  fee: number
  freeFrom: number
}

export const SHIPPING_ZONES: ShippingZone[] = [
  { id: "asu", name: "Asunción", fee: 15000, freeFrom: 300000 },
  { id: "central", name: "Área Metropolitana", fee: 25000, freeFrom: 400000 },
  { id: "interior", name: "Interior del país", fee: 40000, freeFrom: 500000 },
  { id: "pickup", name: "Retiro en tienda", fee: 0, freeFrom: 0 },
]

interface ShippingStepProps {
  shippingZone: string
  onChangeZone: (id: string) => void
  selectedAddress: string
  onChangeAddress: (id: string) => void
  addressForm: { street: string; city: string; phone: string }
  onChangeAddressForm: (form: { street: string; city: string; phone: string }) => void
  total: number
  onBack: () => void
  onNext: () => void
}

export function ShippingStep({
  shippingZone,
  onChangeZone,
  selectedAddress,
  onChangeAddress,
  addressForm,
  onChangeAddressForm,
  total,
  onBack,
  onNext,
}: ShippingStepProps) {
  const { addresses } = useAuth()
  const zone = SHIPPING_ZONES.find(z => z.id === shippingZone)!

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Envío</h2>

      <div className="space-y-3 mb-6">
        {SHIPPING_ZONES.map((z) => (
          <label
            key={z.id}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
              shippingZone === z.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="zone"
                checked={shippingZone === z.id}
                onChange={() => onChangeZone(z.id)}
                className="text-primary"
              />
              <div>
                <p className="font-medium text-foreground">{z.name}</p>
                {z.fee > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {total >= z.freeFrom ? '¡Envío gratis!' : formatCurrency(z.fee)}
                    {total < z.freeFrom && ` (gratis desde ${formatCurrency(z.freeFrom)})`}
                  </p>
                )}
                {z.id === "pickup" && (
                  <p className="text-xs text-muted-foreground">Coronel Felipe Toledo, Mariano Roque Alonso</p>
                )}
              </div>
            </div>
            <span className="text-sm font-bold text-foreground">
              {z.fee === 0 ? 'Gratis' : formatCurrency(z.fee)}
            </span>
          </label>
        ))}
      </div>

      {shippingZone !== "pickup" && (
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Dirección de entrega</h3>
          {addresses.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {addresses.map((a: any) => (
                <button
                  key={a.id}
                  onClick={() => onChangeAddress(a.id)}
                  className={`rounded-lg border px-3 py-2 text-xs transition-all ${
                    selectedAddress === a.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {a.label || a.street}
                </button>
              ))}
            </div>
          )}
          <input
            type="text"
            value={addressForm.street}
            onChange={e => onChangeAddressForm({ ...addressForm, street: e.target.value })}
            placeholder="Calle y número"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          />
          <input
            type="text"
            value={addressForm.city}
            onChange={e => onChangeAddressForm({ ...addressForm, city: e.target.value })}
            placeholder="Ciudad"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          />
          <input
            type="tel"
            value={addressForm.phone}
            onChange={e => onChangeAddressForm({ ...addressForm, phone: e.target.value })}
            placeholder="Teléfono de contacto"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          />
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-light"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
