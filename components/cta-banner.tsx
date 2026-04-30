export function CTABanner({ title, subtitle, buttonText, buttonHref }: {
  title: string; subtitle?: string; buttonText?: string; buttonHref?: string
}) {
  return (
    <section className="relative overflow-hidden py-16"
      style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)' }}>
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.5) 0%, transparent 50%)' }} />
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold text-white">{title}</h2>
        {subtitle && <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">{subtitle}</p>}
        {buttonText && buttonHref && (
          <a href={buttonHref} className="inline-block rounded-lg bg-white px-8 py-4 font-semibold text-secondary transition-all hover:scale-105">
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
