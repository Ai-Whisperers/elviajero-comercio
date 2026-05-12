"use client"
import { useState } from "react"
import { useAuth } from "@ai-whisperers/auth/auth-context"

interface CheckoutFormProps {
  customer: { name: string; email: string; phone: string }
  onChange: (customer: { name: string; email: string; phone: string }) => void
  onNext: () => void
}

export function CheckoutForm({ customer, onChange, onNext }: CheckoutFormProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Tus datos</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={customer.name}
          onChange={e => onChange({ ...customer, name: e.target.value })}
          placeholder="Nombre completo"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          required
        />
        <input
          type="email"
          value={customer.email}
          onChange={e => onChange({ ...customer, email: e.target.value })}
          placeholder="Email"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          required
        />
        <input
          type="tel"
          value={customer.phone}
          onChange={e => onChange({ ...customer, phone: e.target.value })}
          placeholder="Teléfono"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-ring"
          required
        />
      </div>
      <div className="mt-6 flex justify-end">
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
