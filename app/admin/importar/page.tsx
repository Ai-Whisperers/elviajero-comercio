"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState } from "react"
import { PageHeader, EmptyState } from "@/components/admin/ui"

export default function AdminImport() {
  const { authed } = useAdminAuth()
  const [result, setResult] = useState("")
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<any[] | null>(null)
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setResult("")
    const reader = new FileReader()
    reader.onload = async () => {
      const text = reader.result as string
      const lines = text.split("\n").filter(Boolean)
      if (lines.length < 2) { setResult("Archivo vacío o con menos de 2 líneas"); setImporting(false); return }
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
      setPreviewHeaders(headers)
      const products = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || "" })
        return obj
      })
      setPreview(products)

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
        setResult("✅ " + (data.count || products.length) + " productos importados correctamente.")
      }
      setImporting(false)
    }
    reader.readAsText(file)
  }

  const downloadTemplate = () => {
    const csv = "name,price,stock,category,brand,description\nEjemplo Tienda,Gs. 150.000,10,Camping,MarcaX,Descripción del producto\nProducto 2,Gs. 85.000,5,Pesca,MarcaY,Segunda línea"
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "plantilla_importar.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  if (!authed) return null

  return (
    <>
      <PageHeader
        title="Importar productos (CSV)"
        subtitle="Importá productos masivamente desde un archivo CSV"
        actions={
          <button onClick={downloadTemplate}
            className="rounded-lg border border-zinc-700/60 px-3 py-1.5 text-xs text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
            Descargar plantilla
          </button>
        }
      />

      <div className="mb-6 rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5">
        <p className="text-sm text-zinc-400 mb-4">Columnas requeridas: <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-emerald-400 text-xs">name, price, stock, category, brand, description</code></p>
        <input type="file" accept=".csv" onChange={handleFile} disabled={importing}
          className="text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-500 disabled:opacity-50" />
        {importing && (
          <div className="mt-4 flex items-center gap-2 text-sm text-amber-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            Importando...
          </div>
        )}
        {result && (
          <p className={"mt-4 text-sm " + (result.startsWith("✅") ? "text-emerald-400" : "text-red-400")}>{result}</p>
        )}
      </div>

      {preview && preview.length > 0 ? (
        <div className="rounded-xl border border-zinc-800/60 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800/60 bg-zinc-900/50 text-left">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">#</th>
                {previewHeaders.map(k => (
                  <th key={k} className="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {preview.map((p, i) => (
                <tr key={i} className="text-zinc-300 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-zinc-500">{i + 1}</td>
                  {previewHeaders.map(k => (
                    <td key={k} className="px-4 py-3 text-sm">{p[k] || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !result && !importing ? (
        <EmptyState
          icon={
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          }
          title="Seleccioná un archivo CSV"
          description="Descargá la plantilla, completá los datos y subilo para importar productos"
        />
      ) : null}
    </>
  )
}
