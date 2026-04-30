"use client"
import { useState, useEffect, useCallback } from "react"
import content from "@/content/es.json"
import Link from "next/link"

const c = content as any
const carousel = c.home?.heroCarousel || {}
const slides = carousel.slides || []

export function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const t = setInterval(next, carousel.interval || 6000)
    return () => clearInterval(t)
  }, [next])

  if (slides.length === 0) return null

  const slide = slides[current]

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      {slides.map((s: any, i: number) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${s.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === current ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md sm:p-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{slide.title}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{slide.subtitle}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={slide.ctaHref || "/tienda"}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-10 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-white/90 hover:scale-105"
            >
              {slide.ctaText}
            </Link>
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-all ${i === current ? "w-6 bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
