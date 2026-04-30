"use client"

const steps = [
  { id: "info", label: "Tus datos" },
  { id: "entrega", label: "Entrega" },
  { id: "pago", label: "Pago" },
  { id: "confirmar", label: "Confirmar" },
]

export function CheckoutStepper({ current }: { current: string }) {
  const currentIdx = steps.findIndex(s => s.id === current)
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
              i <= currentIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i < currentIdx ? "✓" : i + 1}
            </div>
            <span className={`mt-1 text-[10px] font-medium ${i <= currentIdx ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-0 left-0 h-0.5 bg-muted w-full" />
        <div className="absolute top-0 left-0 h-0.5 bg-primary transition-all" style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }} />
      </div>
    </div>
  )
}
