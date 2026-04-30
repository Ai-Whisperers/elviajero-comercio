
"use client"
import { useState } from "react"
import { validateEmail, validatePhone, validateRequired } from "@/lib/validation"

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  validator?: (v: string) => string | null
  required?: boolean
}

export function ValidatedField({ label, value, onChange, type = "text", placeholder, validator, required }: FieldProps) {
  const [touched, setTouched] = useState(false)
  const error = touched && validator ? validator(value) : null

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground">{label}{required && " *"}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        className={"w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all bg-background " +
          (error ? "border-destructive focus:border-destructive" : "border-input focus:border-ring")}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
