"use client"
import Image from "next/image"
import { useState } from "react"

interface Props {
  src?: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  priority?: boolean
}

export function SafeImage({ src, alt, width = 400, height = 300, fill, className = "", containerClassName = "", priority = false }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className={"flex items-center justify-center bg-muted " + containerClassName}>
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/40">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
    )
  }

  return (
    <div className={"relative overflow-hidden " + containerClassName}>
      {!loaded && <div className="absolute inset-0 animate-shimmer bg-muted" />}
      <Image
        src={src} alt={alt}
        width={fill ? undefined : width} height={fill ? undefined : height}
        fill={fill}
        className={"transition-opacity duration-300 " + (loaded ? "opacity-100" : "opacity-0") + " " + className}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        priority={priority}
      />
    </div>
  )
}
