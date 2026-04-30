export interface ValidationResult {
  ok: boolean
  errors: Record<string, string>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PY_PHONE_RE = /^(0\d{2,3}\s?\d{3}\s?\d{3,4}|\+595\s?\d{2,3}\s?\d{3}\s?\d{3,4})$/

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "El email es requerido"
  if (!EMAIL_RE.test(email)) return "Email inv\u00e1lido"
  return null
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return "El tel\u00e9fono es requerido"
  return null
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return "M\u00ednimo 6 caracteres"
  return null
}

export function validateRequired(value: string, field: string): string | null {
  if (!value.trim()) return field + " es requerido"
  return null
}
