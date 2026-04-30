"use client"
import { useState } from "react"
const KEY = "viajero_avatar"
export function ProfileImageUpload() {
  const [img, setImg] = useState("")
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { const url = reader.result as string; localStorage.setItem(KEY, url); setImg(url) }
    reader.readAsDataURL(file)
  }
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted text-2xl">
        {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : '\u{1F464}'}
      </div>
      <label className="cursor-pointer rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted transition-all">
        Cambiar foto
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>
    </div>
  )
}
