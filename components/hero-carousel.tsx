"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useContent } from "@/lib/content-provider"
import Link from "next/link"

export function HeroCarousel() {
  const { get } = useContent()
  const carousel = get("home.heroCarousel") || {}
  const slides: any[] = carousel.slides || []
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startAuto = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (slides.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length)
    }, carousel.interval || 5000)
  }, [slides.length, carousel.interval])

  const goTo = useCallback((index: number) => {
    setCurrent(index)
    startAuto()
  }, [startAuto])

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length)
    startAuto()
  }, [slides.length, startAuto])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length)
    startAuto()
  }, [slides.length, startAuto])

  useEffect(() => {
    startAuto()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [startAuto])

  if (slides.length === 0) return null

  const slide = slides[current]

  return (
    <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* All slides stacked with opacity transition */}
      {slides.map((s: any, i: number) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${s.image || s.bgImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      {/* Text content */}
      <div className="relative z-10 flex h-full items-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {slide.headline || slide.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-200 sm:text-xl">
            {slide.subheadline || slide.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {slide.ctaPrimaryText && (
              <Link
                href={slide.ctaPrimaryHref || "#"}
                className="rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
              >
                {slide.ctaPrimaryText}
              </Link>
            )}
            {slide.ctaSecondaryText && (
              <Link
                href={slide.ctaSecondaryHref || "#"}
                className="rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                {slide.ctaSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-all z-20"
            aria-label="Anterior"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 transition-all z-20"
            aria-label="Siguiente"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "bg-emerald-400 w-6" : "bg-white/50 hover:bg-white/80 w-2"}`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
