"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState, useRef } from "react"

export default function AdminImport() {
  const { authed } = useAdminAuth()
  const [result, setResult] = useState("")
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<any[] | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setResult("")
    const reader = new FileReader()
    reader.onload = async () => {
      const text = reader.result as string
      const lines = text.split("\n").filter(Boolean)
      if (lines.length < 2) { setResult("Archivo vacío"); setImporting(false); return }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
      const products = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || "" })
        return obj
      })

      setPreview(products)

      // Batch import: send all at once
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      })
      if (!res.ok) {
        const err = await res.json()
        setResult("Error: " + (err.error || "desconocido"))
      } else {
        const data = await res.json()
        setResult(`✅ ${data.count || products.length} productos importados correctamente.`)
      }
      setImporting(false)
    }
    reader.readAsText(file)
  }

  const downloadTemplate = () => {
    const csv = "name,price,stock,category,brand,description\nEjemplo Tienda,Gs. 150.000,10, Camping,MarcaX,Descripción del producto\nProducto 2,Gs. 85.000,5,Pesca,MarcaY,Segunda línea"
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "plantilla_importar.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) return null

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Importar productos (CSV)</h1>
        <button onClick={downloadTemplate}
          className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white transition-all">
          Descargar plantilla
        </button>
      </div>
      <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <p className="text-sm text-zinc-400 mb-4">Columnas: <code className="text-zinc-200">name, price, stock, category, brand, description</code></p>
        <input type="file" accept=".csv" onChange={handleFile} disabled={importing}
          className="text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-500 disabled:opacity-50" />
        {importing && <p className="mt-4 text-sm text-amber-400">Importando...</p>}
        {result && <p className="mt-4 text-sm" dangerouslySetInnerHTML={{ __html: result }} />}
      </div>

      {preview && preview.length > 0 && (
        <div className="rounded-xl border border-zinc-800/60 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/50 text-left">
              <tr>
                {Object.keys(preview[0]).map(k => (
                  <th key={k} className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {preview.map((p, i) => (
                <tr key={i} className="text-zinc-300">
                  {Object.values(p).map((v: any, j) => (
                    <td key={j} className="px-4 py-3 text-sm">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
