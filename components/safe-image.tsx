"use client"
import Image from "next/image"
import { useState } from "react"
import { getCategoryPlaceholderSvg } from "@/lib/category-placeholders"

interface Props {
  src?: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  containerClassName?: string
  priority?: boolean
  /** Product category — used for branded placeholder when no image */
  category?: string
}

export function SafeImage({ src, alt, width = 400, height = 300, fill, className = "", containerClassName = "", priority = false, category }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  // Use category-branded placeholder when no source or image failed
  const placeholderSrc = getCategoryPlaceholderSvg(category, alt)

  if (!src || error) {
    return (
      <div className={"relative overflow-hidden " + containerClassName}>
        <Image
          src={placeholderSrc}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={className}
          priority={priority}
          unoptimized
        />
      </div>
    )
  }

  return (
    <div className={"relative overflow-hidden " + containerClassName}>
      {!loaded && (
        <div className="absolute inset-0 animate-shimmer bg-muted" />
      )}
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
