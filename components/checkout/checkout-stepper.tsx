"use client"

interface CheckoutStepperProps {
  step: number
  labels?: string[]
}

export function CheckoutStepper({ step, labels = ["Datos", "Envío", "Pago"] }: CheckoutStepperProps) {
  return (
    <div className="mb-8 flex items-center justify-center gap-4">
      {labels.map((label, idx) => {
        const s = idx + 1
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {s}
            </div>
            <span
              className={`text-sm ${
                step >= s ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
            {s < labels.length && (
              <div className={`h-0.5 w-8 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
