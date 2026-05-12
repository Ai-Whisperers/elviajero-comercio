"use client"
import { SearchInput } from "@/components/admin/ui"

interface Customer {
  id: string
  name?: string
  email?: string
  phone?: string
}

interface CustomerListProps {
  profiles: Customer[]
  selected: string | null
  onSelect: (id: string) => void
  search: string
  onSearchChange: (value: string) => void
  loading: boolean
}

export function CustomerList({ profiles, selected, onSelect, search, onSearchChange, loading }: CustomerListProps) {
  const filteredProfiles = search
    ? profiles.filter(p =>
        (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.email || "").toLowerCase().includes(search.toLowerCase())
      )
    : profiles

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/50 overflow-hidden">
      <div className="p-4 border-b border-zinc-800/60">
        <SearchInput value={search} onChange={onSearchChange} placeholder="Buscar cliente..." />
      </div>
      <div className="max-h-[700px] overflow-y-auto divide-y divide-zinc-800/60">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded-md bg-zinc-800 mb-2" />
                  <div className="h-3 w-48 rounded-md bg-zinc-800" />
                </div>
              </div>
            </div>
          ))
        ) : filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-zinc-500">
            <svg className="w-10 h-10 mb-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-zinc-500">{search ? "Sin resultados" : "Sin clientes"}</p>
          </div>
        ) : (
          filteredProfiles.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`w-full text-left p-4 transition-all hover:bg-zinc-800/40 ${
                selected === p.id ? "bg-emerald-600/10 border-l-2 border-emerald-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  selected === p.id ? "bg-emerald-600/20 text-emerald-400" : "bg-zinc-800 text-zinc-400"
                }`}>
                  {(p.name || "?")[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white text-sm truncate">{p.name || "Sin nombre"}</p>
                  <p className="text-xs text-zinc-500 truncate">{p.phone || p.email || "Sin contacto"}</p>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
