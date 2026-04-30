import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
import Link from "next/link"

const c = content as any
const h = c.home || {}
const products = h.productCatalog?.products || [];
const categories = h.productCatalog?.categories || [];
const testimonials = h.testimonials || [];
const features = h.features?.items || [];
const stats = h.stats?.items || [];

export default function Home() {
  return <>
    <Header />
    {h.announcement && <div className="bg-accent py-2 text-center text-sm font-medium text-accent-foreground">{h.announcement}</div>}
    
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden" style={{backgroundColor: "var(--color-primary)"}}>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="rounded-2xl bg-white/10 p-8 backdrop-blur-md sm:p-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">{h.hero?.headline}</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">{h.hero?.subheadline}</p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={h.hero?.ctaPrimaryHref || "/tienda"} className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-semibold text-primary shadow-xs transition-all hover:bg-white/90">{h.hero?.ctaPrimaryText}</Link>
            <a href={h.hero?.ctaSecondaryHref} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center rounded-md border-2 border-white px-8 text-sm font-semibold text-white transition-all hover:bg-white/20">{h.hero?.ctaSecondaryText}</a>
          </div>
        </div>
      </div>
    </section>

    {stats.length > 0 && <section className="bg-surface py-10"><div className="mx-auto max-w-7xl px-4"><div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-4">{stats.map((s: any, i: number) => (
      <div key={i} className="text-center"><div className="text-3xl font-bold text-primary sm:text-4xl">{s.value}</div><div className="mt-1 text-sm font-medium text-muted-foreground">{s.label}</div></div>
    ))}</div></div></section>}

    {features.length > 0 && <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4"><h2 className="mb-10 text-center text-3xl font-bold text-foreground">{h.features?.title}</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{features.map((f: any, i: number) => (
      <div key={i} className="rounded-xl border border-border bg-surface p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md"><h3 className="mb-2 font-semibold text-foreground">{f.title}</h3><p className="text-xs text-muted-foreground">{f.description}</p></div>
    ))}</div></div></section>}

    {categories.length > 0 && <section className="bg-surface-light py-16"><div className="mx-auto max-w-7xl px-4"><h2 className="mb-6 text-center text-3xl font-bold text-foreground">{h.productCatalog?.title}</h2><div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">{categories.map((cat: string, i: number) => (
      <Link key={i} href={"/tienda#" + cat.toLowerCase().replace(/[^a-z]/g, "")} className="rounded-xl border border-border bg-white p-4 text-center transition-all hover:-translate-y-1 hover:shadow-md"><div className="text-sm font-semibold text-foreground">{cat}</div></Link>
    ))}</div></div></section>}

    {testimonials.length > 0 && <section className="bg-background py-16"><div className="mx-auto max-w-7xl px-4"><h2 className="mb-10 text-center text-3xl font-bold text-foreground">Lo que dicen nuestros clientes</h2><div className="grid gap-6 sm:grid-cols-2">{testimonials.map((t: any, i: number) => (
      <div key={i} className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <div className="mb-2 flex gap-1 text-accent">{Array.from({length: t.rating || 5}).map((_: any, j: number) => <span key={j}>★</span>)}</div>
        <p className="mb-3 text-muted-foreground">"{t.text}"</p>
        <p className="font-medium text-foreground">{t.name}</p>
      </div>
    ))}</div></div></section>}

    <section className="bg-primary py-16"><div className="mx-auto max-w-3xl px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold text-primary-foreground">{h.newsletter?.title || "Recibi Novedades"}</h2>
      <p className="mb-6 text-primary-foreground/80">{h.newsletter?.description}</p>
      <form action="/api/subscribe" method="POST" className="mx-auto flex max-w-md gap-3">
        <input name="email" type="email" placeholder={h.newsletter?.placeholder || "tu@email.com"} className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:border-white" required />
        <button type="submit" className="rounded-lg bg-accent px-6 py-3 font-semibold text-accent-foreground transition-all hover:bg-accent/90">{h.newsletter?.buttonText || "Suscribirse"}</button>
      </form>
    </div></section>

    {h.finalCta && <section className="relative overflow-hidden py-16" style={{background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)"}}>
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">{h.finalCta.title}</h2>
        <p className="mb-6 text-white/80">{h.finalCta.description}</p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href={h.finalCta.buttonLink} className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-accent transition-all hover:scale-105">{h.finalCta.buttonText}</a>
          {h.finalCta.secondaryText && <Link href={h.finalCta.secondaryLink || "/tienda"} className="inline-block rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white/20">{h.finalCta.secondaryText}</Link>}
        </div>
      </div>
    </section>}

    <Footer />
    <WhatsAppFloat />
  </>
}

function WhatsAppFloat() {
  const w = c.home?.contact?.whatsapp || "595981234567";
  return (
    <a href={"https://wa.me/" + w + "?text=" + encodeURIComponent(c.whatsapp?.defaultMessage || "Hola! Quiero informacion")}
      target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
      aria-label="WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/>
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/>
        <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/>
        <path d="M9.5 13.5c.5 1 1.5 1.5 2.5 1.5s2-.5 2.5-1.5"/>
      </svg>
    </a>
  );
}
