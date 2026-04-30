import content from "@/content/es.json"
import Link from "next/link"

const c = content as any
const f = c.footer || {}

export function Footer() {
  const cols = f.columns || []
  return (
    <footer className="bg-secondary py-12 text-secondary-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {cols.map((col:any,i:number) => (
            <div key={i}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">{col.title}</h4>
              <div className="flex flex-col gap-2 text-sm">
                {(col.links||[]).map((lnk:any,j:number) => (
                  <Link key={j} href={lnk.href} className="text-white/80 hover:text-white">{lnk.label}</Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/70">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm">
              {f.address && <p className="text-white/70">{f.address}</p>}
              {f.phone && <p className="text-white/70">{f.phone}</p>}
              {f.hours && <p className="text-white/70 text-xs">{f.hours}</p>}
              <a href={`https://wa.me/${(f.phone||"").replace(/[\s\+]/g,"")}`} target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white">WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/50">© {new Date().getFullYear()} {c.businessName}. Todos los derechos reservados.</div>
      </div>
    </footer>
  )
}
