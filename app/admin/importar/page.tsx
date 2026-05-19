"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminImportRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin/productos")
  }, [router])
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-sm text-zinc-500">Redirigiendo a Productos...</p>
    </div>
  )
}
