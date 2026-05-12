// Admin UI configuration — badge styles, status mappings, etc.

export interface BadgeStyleConfig {
  [key: string]: string
}

export const BADGE_STYLES: BadgeStyleConfig = {
  pendiente: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmado: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  enviado: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  entregado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelado: "bg-red-500/10 text-red-400 border-red-500/20",
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  admin: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  customer: "bg-zinc-800 text-zinc-400 border-zinc-700/50",
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
}

export const DEFAULT_BADGE_STYLE = "bg-zinc-800 text-zinc-400 border-zinc-700/50"

export const STATUS_ICONS: Record<string, string> = {
  pendiente: "🕐",
  confirmado: "✅",
  enviado: "🚚",
  entregado: "📦",
  cancelado: "❌",
}

export const STATUS_OPTIONS = [
  { key: "pendiente", label: "Pendiente", icon: "🕐" },
  { key: "confirmado", label: "Confirmado", icon: "✅" },
  { key: "enviado", label: "Enviado", icon: "🚚" },
  { key: "entregado", label: "Entregado", icon: "📦" },
  { key: "cancelado", label: "Cancelado", icon: "❌" },
]
