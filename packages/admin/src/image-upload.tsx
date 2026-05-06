"use client"
import { useState } from "react"
import { createClient } from "@ai-whisperers/auth/supabase/client"

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || "")
  const supabase = createClient()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split(".").pop()
    const fileName = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from("ej_images").upload(fileName, file)
    if (error) { setUploading(false); console.error(error); return }
    const { data: { publicUrl } } = supabase.storage.from("ej_images").getPublicUrl(fileName)
    setPreview(publicUrl)
    onUpload(publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex items-center gap-3">
      {preview && <img src={preview} alt="" className="h-14 w-14 rounded-lg border border-gray-700 object-cover" />}
      <label className="cursor-pointer rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 transition-colors">
        {uploading ? "Subiendo..." : "Elegir imagen"}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
    </div>
  )
}
