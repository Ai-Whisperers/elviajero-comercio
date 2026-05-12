"use client"

interface PaymentMethod {
  id: string
  label: string
  desc: string
  icon: string
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "whatsapp", label: "WhatsApp / Transferencia", desc: "Te contactamos para coordinar el pago", icon: "💬" },
  { id: "pagopar", label: "Pagopar", desc: "Tarjetas de crédito/débito, transferencia, pagaré", icon: "💳" },
  { id: "bancard", label: "Bancard", desc: "Visa, Mastercard — 3, 6 y 12 cuotas", icon: "💳" },
]

interface PaymentMethodsProps {
  value: string
  onChange: (id: string) => void
}

export function PaymentMethods({ value, onChange }: PaymentMethodsProps) {
  return (
    <div className="space-y-3 mb-6">
      {PAYMENT_METHODS.map((pm) => (
        <label
          key={pm.id}
          className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
            value === pm.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              checked={value === pm.id}
              onChange={() => onChange(pm.id)}
              className="text-primary"
            />
            <div>
              <p className="font-medium text-foreground">{pm.icon} {pm.label}</p>
              <p className="text-xs text-muted-foreground">{pm.desc}</p>
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}
