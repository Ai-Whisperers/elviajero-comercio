"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import content from "@/content/es.json"
import { useState } from "react"
const c = content as any
const faqs = c.faq?.items || []
export default function FAQPage() {
  const [open, setOpen] = useState<number|null>(null)
  return (<><Header />
    <section className="bg-primary py-12 text-center text-primary-foreground"><h1 className="text-4xl font-bold">{c.faq?.hero?.headline || "FAQ"}</h1><p className="mt-2 text-primary-foreground/80">{c.faq?.hero?.subheadline}</p></section>
    <section className="bg-background py-16"><div className="mx-auto max-w-3xl px-4"><div className="flex flex-col gap-3">{faqs.map((f:any,i:number)=>(
      <div key={i} className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <button onClick={()=>setOpen(open===i?null:i)} className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-foreground transition-colors hover:bg-surface-light">{f.question}<svg className={"h-5 w-5 text-muted-foreground transition-transform "+(open===i?"rotate-180":"")} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
        {open===i && <div className="border-t border-border px-6 py-4 text-sm text-muted-foreground leading-relaxed">{f.answer}</div>}
      </div>
    ))}</div></div></section>
    <Footer />
  </>)
}