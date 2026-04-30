
"use client"
export function AdminImageUpload({ currentImage, onImageChange }: { currentImage?: string; onImageChange: (url: string) => void }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-gray-800">
        {currentImage ? <img src={currentImage} alt="" className="h-full w-full object-contain p-1" /> : <span className="text-2xl text-gray-600">📷</span>}
      </div>
      <label className="cursor-pointer rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 hover:text-white transition-all">
        Subir imagen
        <input type="file" accept="image/*" className="hidden" onChange={e => {
          const file = e.target.files?.[0]
          if (!file) return
          const reader = new FileReader()
          reader.onload = () => onImageChange(reader.result as string)
          reader.readAsDataURL(file)
        }} />
      </label>
    </div>
  )
}
