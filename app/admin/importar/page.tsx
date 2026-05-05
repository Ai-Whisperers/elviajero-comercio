"use client"
import { AdminShell, useAdminAuth } from "@/components/admin/admin-layout"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function AdminImport() {
  const { authed } = useAdminAuth()
  const supabase = createClient()
  const [result, setResult] = useState("")
  const [importing, setImporting] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const text = reader.result as string
      const lines = text.split("\n").filter(Boolean)
      if (lines.length < 2) { setResult("Archivo vacío"); setImporting(false); return }
      const headers = lines[0].split(",").map(h => h.trim())
      const products = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => { obj[h] = vals[i] || "" })
        return obj
      })

      const { error } = await supabase.from("ej_products").insert(products)
      if (error) setResult("Error: " + error.message)
      else setResult(`Importados ${products.length} productos.`)
      setImporting(false)
    }
    reader.readAsText(file)
  }

  if (!authed) return null

  return (
    <>
      <h1 className="mb-6 text-xl font-bold text-white">Importar productos (CSV)</h1>
      <p className="mb-4 text-sm text-gray-400">Formato: name,price,stock,category,brand,description (una línea por producto)</p>
      <input type="file" accept=".csv" onChange={handleFile} disabled={importing} className="text-sm text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-green-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-green-500 disabled:opacity-50" />
      {importing && <p className="mt-4 text-sm text-amber-400">Importando...</p>}
      {result && <p className="mt-4 text-sm text-green-400">{result}</p>}
    </>
  )
}
