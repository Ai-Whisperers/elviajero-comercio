"use client"
import { useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"
import { PageHeader, SearchInput, EmptyState, TableSkeleton } from "@/components/admin/ui"

export default function AdminB2B() {
  const { authed } = useAdminAuth()
  const [customers, setCustomers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [form, setForm] = useState({ businessName: "", contactName: "", email: "", phone: "", ruc: "", creditLimit: 0, paymentTerms: "contado" })

  useEffect(() => {
    if (!authed) return
    load()
  }, [authed])

  const load = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/b2b")
    if (res.ok) setCustomers(await res.json())
    setLoading(false)
  }

  const add = async () => {
    await fetch("/api/admin/b2b", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_name: form.businessName, contact_name: form.contactName, email: form.email, phone: form.phone, ruc: form.ruc, credit_limit: form.creditLimit, payment_terms: form.paymentTerms })
    })
    setShowForm(false)
    setForm({ businessName: "", contactName: "", email: "", phone: "", ruc: "", creditLimit: 0, paymentTerms: "contado" })
    load()
  }

  const toggleStatus = async (id: string, current: string) => {
    await fetch("/api/admin/b2b", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: current === "active" ? "suspended" : "active" })
    })
    load()
  }

  const filtered = search
    ? customers.filter(c => c.business_name?.toLowerCase().includes(search.toLowerCase()) || c.contact_name?.toLowerCase().includes(search.toLowerCase()) || c.ruc?.includes(search))
    : customers

  if (!authed) return null

  const inputCls = "w-full rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500/50"

  return (
    <>
      <PageHeader
        title={"Clientes Mayoristas (" + customers.length + ")"}
        subtitle="Gestión de ventas al por mayor"
        actions={
          <div className="flex items-center gap-3">
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por negocio, contacto o RUC..." />
            <button onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-all">
              {showForm ? "Cancelar" : "+ Nuevo"}
            </button>
          </div>
        }
      />

      {showForm && (
        <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white">Nuevo cliente mayorista</h3>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} placeholder="Nombre del negocio" className={inputCls} />
            <input value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} placeholder="Nombre del contacto" className={inputCls} />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className={inputCls} />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Teléfono" className={inputCls} />
            <input value={form.ruc} onChange={e => setForm({...form, ruc: e.target.value})} placeholder="RUC" className={inputCls} />
            <input type="number" value={form.creditLimit} onChange={e => setForm({...form, creditLimit: parseInt(e.target.value) || 0})} placeholder="Límite de crédito Gs." className={inputCls} />
            <select value={form.paymentTerms} onChange={e => setForm({...form, paymentTerms: e.target.value})} className={inputCls}>
              <option value="contado">Contado</option>
              <option value="15dias">15 días</option>
              <option value="30dias">30 días</option>
              <option value="60dias">60 días</option>
            </select>
          </div>
          <button onClick={add} disabled={!form.businessName}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-all">
            Guardar
          </button>
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={4} cols={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          title={search ? "Sin resultados" : "Sin clientes mayoristas"}
          description={search ? "Probá con otro término" : "Agregá empresas para gestionar ventas al por mayor"}
          actions={!search ? <button onClick={() => setShowForm(true)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Agregar cliente</button> : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800/60">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Negocio</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Contacto</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">RUC</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Crédito</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Plazo</th>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((c: any) => (
                <tr key={c.id} className="text-white hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{c.business_name}</td>
                  <td className="px-4 py-3">{c.contact_name}<br /><span className="text-xs text-zinc-500">{c.email}</span></td>
                  <td className="px-4 py-3 text-zinc-400">{c.ruc || "—"}</td>
                  <td className="px-4 py-3">Gs. {(c.credit_limit || 0).toLocaleString("es-PY")}</td>
                  <td className="px-4 py-3 text-zinc-400">{c.payment_terms}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(c.id, c.status)}
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold transition-all ${c.status === "active" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"}`}>
                      {c.status === "active" ? "Activo" : "Suspendido"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
