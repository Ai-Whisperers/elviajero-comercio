import Link from "next/link"

export function BlogCard({ title, excerpt, date, slug }: {
  title: string; excerpt?: string; date?: string; slug: string
}) {
  return (
    <Link href={`/blog/${slug}`} className="group block rounded-lg border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-md">
      {date && <p className="mb-2 text-xs text-muted-foreground">{date}</p>}
      <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary">{title}</h3>
      {excerpt && <p className="text-sm text-muted-foreground">{excerpt}</p>}
    </Link>
  )
}
