"use client"

import { useState, useRef } from "react"

interface ImageUploadProps {
  onSuccess: (optimizedUrl: string, originalUrl: string) => void
  onCancel: () => void
}

/**
 * Enhanced image upload with auto WebP optimization toggle
 */
export default function ImageUpload({ onSuccess, onCancel }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [autoOptimize, setAutoOptimize] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate image type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes JPEG, PNG o WebP')
      return
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen es demasiado grande (máximo 10MB)')
      return
    }

    setIsUploading(true)
    setUploadProgress(10)

    try {
      // 1. Upload original image first
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error('Error al subir imagen')
      }

      const uploadData = await uploadRes.json()
      const originalUrl = uploadData.url

      // 2. If auto-optimize is enabled, call optimization API
      if (autoOptimize) {
        setUploadProgress(50)
        console.log('[ImageUpload] Calling optimization API for:', originalUrl)

        const optimizeRes = await fetch('/api/optimize-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: originalUrl }),
        })

        if (!optimizeRes.ok) {
          throw new Error('Error al optimizar imagen')
        }

        const optimizeData = await optimizeRes.json()
        const optimizedUrl = optimizeData.optimized

        setUploadProgress(100)
        console.log('[ImageUpload] Optimization complete:', optimizedUrl)

        // 3. Call success callback with both URLs
        onSuccess(optimizedUrl, originalUrl)
      } else {
        // No optimization - return original URL for both
        setUploadProgress(100)
        onSuccess(originalUrl, originalUrl)
      }
    } catch (error) {
      console.error('[ImageUpload] Error:', error)
      alert(error instanceof Error ? error.message : 'Error al subir imagen')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      {/* Auto-optimize toggle */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={autoOptimize}
            onChange={(e) => setAutoOptimize(e.target.checked)}
            className="h-4 w-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 dark:text-emerald-500"
          />
          <span>Auto-optimizar a WebP al subir</span>
        </label>
        <div className="text-xs text-gray-500">
          Activa: Reduce tamaño automáticamente a ~80KB
        </div>
      </div>

      {/* File input */}
      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-gray-900
            file:mr-4 file:text-gray-500 focus:file:emerald-600 focus:ring-emerald-500
            dark:file:bg-gray-700 dark:text-gray-200 dark:file:emerald-500 dark:focus:ring-emerald-500"
        />

        {isUploading && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {autoOptimize ? 'Optimizando...' : 'Subiendo...'}
              </span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadProgress >= 50}
              className="mt-4 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 Optimización Automática de Imágenes
        </h3>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li>• Convierte imágenes a WebP (~80KB, calidad 80%)</li>
          <li>• Redimensiona a máximo 800px de ancho</li>
          <li>• Procesa automáticamente al subir desde el panel de admin</li>
          <li>• Compatible con JPEG, PNG y WebP (originales)</li>
          <li>• Puedes desactivar para subir sin optimizar</li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50"
        >
          {isUploading ? 'Procesando...' : 'Seleccionar Imagen'}
        </button>
        <button
          onClick={onCancel}
          disabled={isUploading}
          className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
