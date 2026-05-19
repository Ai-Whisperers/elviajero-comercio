"use client"
import { useState } from "react"

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentUrl?: string
}

export function ImageUpload({ onUpload, currentUrl }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || "")

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/upload-image", { method: "POST", body: form })
    const data = await res.json()
    if (!res.ok) {
      setUploading(false)
      console.error("Upload failed:", data.error)
      return
    }
    setPreview(data.url)
    onUpload(data.url)
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
