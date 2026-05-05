"use client"

import Link from "next/link"
import React from "react"

// ─── Stat Card ─────────────────────────────────────────
export function StatCard({
  label,
  value,
  sub,
  icon,
  color = "emerald",
}: {
  label: string
  value: string
  sub?: string
  icon?: React.ReactNode
  color?: "emerald" | "blue" | "amber" | "purple" | "red"
}) {
  const dot = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  }[color]

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4 hover:border-zinc-700/60 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        {icon && <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {sub && (
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          <p className="text-xs text-zinc-500">{sub}</p>
        </div>
      )}
    </div>
  )
}

// ─── Empty State ───────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  actions,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex items-center justify-center mb-5">
        <div className="w-8 h-8 text-zinc-600">{icon}</div>
      </div>
      <p className="text-base font-semibold text-zinc-300 mb-1">{title}</p>
      {description && <p className="text-sm text-zinc-500 mb-8 max-w-sm text-center">{description}</p>}
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  )
}

// ─── Loading Skeleton ──────────────────────────────────
export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-24 rounded-md bg-zinc-800" />
            <div className="h-3 w-32 rounded-md bg-zinc-800" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-40 rounded-md bg-zinc-800" />
              <div className="h-4 w-20 rounded-md bg-zinc-800" />
            </div>
            <div className="h-7 w-28 rounded-lg bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse space-y-2">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 flex-1 rounded-md bg-zinc-800" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-4">
          <div className="h-3 w-16 rounded-md bg-zinc-800 mb-2" />
          <div className="h-7 w-24 rounded-md bg-zinc-800 mb-2" />
          <div className="h-3 w-20 rounded-md bg-zinc-800" />
        </div>
      ))}
    </div>
  )
}

// ─── Filter Bar ────────────────────────────────────────
export function FilterBar({
  options,
  active,
  onChange,
  counts,
}: {
  options: { key: string; label: string; icon?: string }[]
  active: string
  onChange: (key: string) => void
  counts?: Record<string, number>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isActive = active === opt.key
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
              isActive
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 ring-1 ring-emerald-500/20"
                : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 border border-zinc-700/50"
            }`}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
            {counts && counts[opt.key] !== undefined && (
              <span className={`ml-1.5 ${isActive ? "text-emerald-200" : "text-zinc-500"}`}>({counts[opt.key]})</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Search Input ──────────────────────────────────────
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full sm:w-80 rounded-lg border border-zinc-700/60 bg-zinc-800/50 pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 placeholder-zinc-500 transition-all"
      />
    </div>
  )
}

// ─── Page Header ───────────────────────────────────────
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  )
}

// ─── Badge ──────────────────────────────────────────────
const badgeStyles: Record<string, string> = {
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

export function Badge({ status, children }: { status: string; children?: React.ReactNode }) {
  const style = badgeStyles[status] || "bg-zinc-800 text-zinc-400 border-zinc-700/50"
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${style}`}>
      {children || status}
    </span>
  )
}

// ─── Status Select ──────────────────────────────────────
export function StatusSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  options: { key: string; label: string; icon?: string }[]
  disabled?: boolean
}) {
  const style = badgeStyles[value] || "bg-zinc-800 text-zinc-400 border-zinc-700/50"
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium outline-none transition-all ${style} ${disabled ? "opacity-50" : "cursor-pointer hover:brightness-110"}`}
    >
      {options.map((opt) => (
        <option key={opt.key} value={opt.key}>
          {opt.icon || ""} {opt.label}
        </option>
      ))}
    </select>
  )
}

// ─── Summary Bar ────────────────────────────────────────
export function SummaryBar({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-6 py-4 mb-6">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <p className="text-xs text-zinc-500">{item.label}</p>
          <p className={`text-sm font-bold ${item.color || "text-white"}`}>{item.value}</p>
          {i < items.length - 1 && <div className="w-px h-5 bg-zinc-800/60" />}
        </div>
      ))}
    </div>
  )
}

// ─── Order Card ─────────────────────────────────────────
const statusIcons: Record<string, string> = {
  pendiente: "🕐", confirmado: "✅", enviado: "🚚", entregado: "📦", cancelado: "❌",
}

const statusOptions = [
  { key: "pendiente", label: "Pendiente", icon: "🕐" },
  { key: "confirmado", label: "Confirmado", icon: "✅" },
  { key: "enviado", label: "Enviado", icon: "🚚" },
  { key: "entregado", label: "Entregado", icon: "📦" },
  { key: "cancelado", label: "Cancelado", icon: "❌" },
]

export function OrderCard({
  order,
  onStatusChange,
  onNoteToggle,
  noteInput,
  noteText,
  onNoteChange,
  onNoteSave,
  onNoteClose,
}: {
  order: any
  onStatusChange: (id: string, status: string) => void
  onNoteToggle: (id: string) => void
  noteInput: string | null
  noteText: string
  onNoteChange: (v: string) => void
  onNoteSave: (id: string) => void
  onNoteClose: () => void
}) {
  const id = order.id?.slice(0, 8)
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 hover:border-zinc-700/60 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
            #{id?.[0] || "?"}
          </div>
          <Link href={"/admin/pedidos/detalle?id=" + order.id} className="font-bold text-white hover:text-emerald-400 transition-colors text-sm">
            #{id}
          </Link>
        </div>
        <span className="text-xs text-zinc-500">
          {order.created_at
            ? new Date(order.created_at).toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" })
            : ""}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-[9px] font-bold text-zinc-300 shrink-0">
              {(order.customer_name || "I")[0].toUpperCase()}
            </div>
            <span className="text-sm text-zinc-300 truncate">{order.customer_name || "Invitado"}</span>
            {order.customer_phone && (
              <span className="text-[10px] text-zinc-600 shrink-0">{order.customer_phone}</span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mb-0.5">
            {order.items?.length || 0} {order.items?.length === 1 ? "artículo" : "artículos"}
            {order.payment_method ? ` · ${order.payment_method}` : ""}
          </p>
          <p className="text-base font-bold text-white mt-1">{order.total}</p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusSelect
            value={order.status}
            onChange={(v) => onStatusChange(order.id, v)}
            options={statusOptions}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNoteToggle(order.id)}
              className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
              title={order.note ? `Nota: ${order.note}` : "Agregar nota"}
            >
              {order.note ? "📝" : "➕"}
            </button>
            <Link
              href={"/admin/pedidos/detalle?id=" + order.id}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Detalle
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </div>
      </div>

      {noteInput === order.id && (
        <div className="mt-4 pt-3 border-t border-zinc-800/60">
          <div className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Nota interna..."
              autoFocus
              className="flex-1 rounded-lg bg-zinc-800/50 border border-zinc-700/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/50 placeholder-zinc-600"
            />
            <button
              onClick={() => onNoteSave(order.id)}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition-all"
            >
              Guardar
            </button>
            <button onClick={onNoteClose} className="text-xs text-zinc-500 hover:text-zinc-200 px-1">
              ✕
            </button>
          </div>
        </div>
      )}

      {order.note && noteInput !== order.id && (
        <div className="mt-3 pt-3 border-t border-zinc-800/60">
          <p className="text-xs text-zinc-500 flex items-center gap-1">
            <span>📝</span>
            <span className="truncate">{order.note}</span>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Data Table ─────────────────────────────────────────
export function DataTable({
  headers,
  children,
}: {
  headers: { key: string; label: string; className?: string }[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-800/60 bg-zinc-900/80 text-left">
          <tr>
            {headers.map((h) => (
              <th key={h.key} className={`px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider ${h.className || ""}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/60">{children}</tbody>
      </table>
    </div>
  )
}
