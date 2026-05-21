"use client"
import { useState, useRef, useCallback } from "react"
import { ImagePlus, Upload, X, Link, Check } from "lucide-react"

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentUrl?: string
  label?: string
  className?: string
}

export function ImageUpload({ onUpload, currentUrl, label, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentUrl || "")
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    setError("")
    setUploading(true)

    // Client-side validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Solo JPEG, PNG o WebP")
      setUploading(false)
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Máximo 10MB")
      setUploading(false)
      return
    }

    const form = new FormData()
    form.append("file", file)

    try {
      const res = await fetch("/api/upload-image", { method: "POST", body: form })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Error al subir")
        setUploading(false)
        return
      }
      setPreview(data.url)
      onUpload(data.url)
    } catch {
      setError("Error de conexión")
    }
    setUploading(false)
  }, [onUpload])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    // Reset so same file can be re-selected
    e.target.value = ""
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  const handleUrlConfirm = () => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim())
      onUpload(urlInput.trim())
      setUrlInput("")
      setShowUrlInput(false)
    }
  }

  const handleRemove = () => {
    setPreview("")
    onUpload("")
  }

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
      )}

      {/* Image Preview */}
      {preview && (
        <div className="relative mb-2 inline-block group">
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 rounded-lg border border-zinc-700 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.webp" }}
          />
          <button
            onClick={handleRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Quitar imagen"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-all text-xs
          ${dragOver
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
            : "border-zinc-600 bg-zinc-800/50 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
          }
        `}
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
            <span>Subiendo...</span>
          </>
        ) : (
          <>
            <Upload className="w-3.5 h-3.5" />
            <span>{preview ? "Reemplazar imagen" : "Subir imagen"}</span>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* URL Toggle */}
      {!preview && (
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Link className="w-3 h-3" />
          {showUrlInput ? "Ocultar URL" : "O usar URL"}
        </button>
      )}

      {/* URL Input */}
      {showUrlInput && (
        <div className="mt-1.5 flex items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleUrlConfirm() }}
            placeholder="https://ejemplo.com/imagen.webp"
            className="flex-1 rounded-lg border border-zinc-700/60 bg-zinc-800 px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={handleUrlConfirm}
            className="rounded-lg bg-emerald-600 p-1.5 text-white hover:bg-emerald-500 transition-colors"
            title="Confirmar URL"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
