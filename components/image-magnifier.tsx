
"use client"
import { useRef, useState } from "react"
import Image from "next/image"

export function ImageMagnifier({ src, alt }: { src: string; alt: string }) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPos({ x, y })
  }

  return (
    <div
      ref={ref}
      className="relative aspect-square overflow-hidden rounded-2xl border border-border bg-surface cursor-crosshair"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMouse}
    >
      <Image src={src} alt={alt} fill className="object-contain p-8" priority />
      {show && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `url(${src}) no-repeat`,
            backgroundSize: "250%",
            backgroundPosition: `${pos.x}% ${pos.y}%`,
          }}
        />
      )}
    </div>
  )
}
