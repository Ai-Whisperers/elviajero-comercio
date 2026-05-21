"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useContent } from "@/lib/content-provider"
import Link from "next/link"

function slideHref(slide: any) {
  return slide.href || slide.link || slide.ctaPrimaryHref || slide.ctaHref || "/tienda"
}

function slideCtaText(slide: any) {
  return slide.ctaPrimaryText || slide.ctaText || "Ir a tienda"
}

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
  const href = slideHref(slide)
  const ctaText = slideCtaText(slide)

  return (
    <div className="relative h-[52vh] min-h-[340px] w-full overflow-hidden">
      {slides.map((s: any, i: number) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
          style={{ backgroundImage: `url(${s.image || s.bgImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        </div>
      ))}

      <Link href={href} aria-label={ctaText} className="absolute inset-0 z-10" />

      <div className="pointer-events-none relative z-20 flex h-full items-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            {slide.headline || slide.title}
          </h1>
          <p className="mt-3 text-base text-zinc-200 sm:text-xl">
            {slide.subheadline || slide.subtitle}
          </p>
          <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
            <Link
              href={href}
              className="rounded-xl bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500"
            >
              {ctaText}
            </Link>
            {slide.ctaSecondaryText && (
              <Link
                href={slide.ctaSecondaryHref || "/tienda"}
                className="rounded-xl border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
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
            className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50"
            aria-label="Anterior"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white transition-all hover:bg-black/50"
            aria-label="Siguiente"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-2">
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
