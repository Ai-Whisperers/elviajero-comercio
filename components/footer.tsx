"use client"
import content from "@/content/es.json"
import Link from "next/link"

const c = content as any
const f = c.footer || {}
const socialIcons: Record<string, string> = {
  instagram: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 5A3.6 3.6 0 0 0 4 10.6v2.8A3.6 3.6 0 0 0 7.6 17h2.8A3.6 3.6 0 0 0 14 13.4v-2.8A3.6 3.6 0 0 0 10.4 7H7.6Zm-.6 2a1.6 1.6 0 0 1 1.6-1.6h2.8A1.6 1.6 0 0 1 13 9v2.8a1.6 1.6 0 0 1-1.6 1.6H8.6A1.6 1.6 0 0 1 7 11.8V9Zm7.5 6.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z",
  tiktok: "M9 12a4 4 0 1 0 4 4V2h3.5A6.5 6.5 0 0 0 10 8.5V16a4 4 0 0 1-1-4Z",
  youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58Z M9.75 15.02V8.98l5.56 3.02-5.56 3.02Z"
}

export function Footer() {
  const cols = f.columns || []
  const social = f.social || []
  const payments = f.paymentMethods || []
  const contactStrip = f.contactStrip || []

  return (
    <footer className="bg-secondary py-12 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4">
        {/* Contact strip */}
        {contactStrip.length > 0 && (
          <div className="mb-10 grid gap-4 border-b border-white/20 pb-8 sm:grid-cols-3">
            {contactStrip.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Columns */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {cols.map((col: any, i: number) => (
            <div key={i}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">{col.title}</h4>
              <div className="flex flex-col gap-2 text-sm">
                {(col.links || []).map((lnk: any, j: number) => (
                  <Link key={j} href={lnk.href} className="text-white/80 hover:text-white">{lnk.label}</Link>
                ))}
              </div>
            </div>
          ))}

          {/* Social */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Seguinos</h4>
            <div className="flex gap-3">
              {social.map((s: any, i: number) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white" aria-label={s.name}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={socialIcons[s.icon] || ""}/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        {payments.length > 0 && (
          <div className="mt-10 border-t border-white/20 pt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/50">Medios de pago</p>
            <div className="flex flex-wrap gap-3">
              {payments.map((pm: any, i: number) => (
                <div key={i} className="flex items-center rounded-lg bg-white px-3 py-2 text-xs font-bold text-foreground shadow-sm">
                  {pm.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {c.businessName}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
