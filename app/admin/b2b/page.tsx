"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useEffect } from "react"

export default function AdminB2B() {
  const { authed } = useAdminAuth()
  const [customers, setCustomers] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ businessName: "", contactName: "", email: "", phone: "", ruc: "", creditLimit: 0, paymentTerms: "contado" })

  useEffect(() => {
    if (!authed) return
    load()
  }, [authed])

  const load = async () => {
    const res = await fetch("/api/admin/b2b")
    if (res.ok) setCustomers(await res.json())
  }

  const add = async () => {
    await fetch("/api/admin/b2b", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ business_name: form.businessName, contact_name: form.contactName, email: form.email, phone: form.phone, ruc: form.ruc, credit_limit: form.creditLimit, payment_terms: form.paymentTerms }) })
    setShowForm(false)
    setForm({ businessName: "", contactName: "", email: "", phone: "", ruc: "", creditLimit: 0, paymentTerms: "contado" })
    load()
  }

  const toggleStatus = async (id: string, current: string) => {
    await fetch("/api/admin/b2b", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: current === "active" ? "suspended" : "active" }) })
    load()
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Clientes Mayoristas ({customers.length})</h1>
        <button onClick={() => setShowForm(!showForm)} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500">{showForm ? "Cancelar" : "+ Nuevo"}</button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-800 bg-gray-900 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} placeholder="Nombre del negocio" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={form.contactName} onChange={e => setForm({...form, contactName: e.target.value})} placeholder="Nombre del contacto" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="Teléfono" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input value={form.ruc} onChange={e => setForm({...form, ruc: e.target.value})} placeholder="RUC" className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <input type="number" value={form.creditLimit} onChange={e => setForm({...form, creditLimit: parseInt(e.target.value) || 0})} placeholder="Límite de crédito Gs." className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700" />
            <select value={form.paymentTerms} onChange={e => setForm({...form, paymentTerms: e.target.value})} className="rounded bg-gray-800 px-2 py-1 text-sm text-white border border-gray-700">
              <option value="contado">Contado</option>
              <option value="15dias">15 días</option>
              <option value="30dias">30 días</option>
              <option value="60dias">60 días</option>
            </select>
          </div>
          <button onClick={add} className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-500">Guardar</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-800 bg-gray-900 text-left">
            <tr><th className="px-4 py-3 text-gray-400">Negocio</th><th className="px-4 py-3 text-gray-400">Contacto</th><th className="px-4 py-3 text-gray-400">RUC</th><th className="px-4 py-3 text-gray-400">Crédito</th><th className="px-4 py-3 text-gray-400">Plazo</th><th className="px-4 py-3 text-gray-400">Estado</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {customers.map((c: any) => (
              <tr key={c.id} className="text-white hover:bg-gray-800/50">
                <td className="px-4 py-3">{c.business_name}</td>
                <td className="px-4 py-3">{c.contact_name}<br /><span className="text-xs text-gray-500">{c.email}</span></td>
                <td className="px-4 py-3 text-gray-400">{c.ruc || "—"}</td>
                <td className="px-4 py-3">Gs. {(c.credit_limit || 0).toLocaleString("es-PY")}</td>
                <td className="px-4 py-3 text-gray-400">{c.payment_terms}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleStatus(c.id, c.status)}
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.status === "active" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                    {c.status === "active" ? "Activo" : "Suspendido"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
