import Image from "next/image"
import Link from "next/link"

export function Footer({ logo, businessName, email, whatsapp, instagram, facebook }: {
  logo?: string; businessName?: string; email?: string; whatsapp?: string
  instagram?: string; facebook?: string
}) {
  return (
    <footer className="relative border-t-2 border-secondary bg-background py-12 text-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            {logo && <Image src={logo} alt={businessName || ""} width={120} height={40} className="mb-3 h-8 w-auto" />}
            <p className="text-sm text-muted-foreground">Asunción, Paraguay</p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/85">Enlaces</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Inicio</Link>
              <Link href="/servicios" className="hover:text-foreground">Servicios</Link>
              <Link href="/portafolio" className="hover:text-foreground">Portafolio</Link>
              <Link href="/sobre" className="hover:text-foreground">Sobre</Link>
              <Link href="/contacto" className="hover:text-foreground">Contacto</Link>
              <Link href="/privacidad" className="hover:text-foreground">Privacidad</Link>
              <Link href="/terminos" className="hover:text-foreground">Términos</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/85">Contacto</h4>
            <div className="flex flex-col gap-2 text-sm">
              {email && <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground">{email}</a>}
              {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g,'')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">WhatsApp</a>}
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/85">Redes</h4>
            <div className="flex flex-col gap-2 text-sm">
              {instagram && <a href={`https://instagram.com/${instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Instagram</a>}
              {facebook && <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Facebook</a>}
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {businessName || "Dayah LitWorks"}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
