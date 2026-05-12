/**
 * Simple markdown renderer for legal page content.
 * No dangerouslySetInnerHTML — parses inline and outputs React elements.
 */
export function renderLegalLines(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim()

    if (trimmed.startsWith("# ")) {
      return <h1 key={i} className="text-3xl font-bold text-foreground mb-6">{trimmed.replace("# ", "")}</h1>
    }
    if (trimmed.startsWith("## ")) {
      return <h2 key={i} className="mt-8 text-xl font-semibold text-foreground mb-3">{trimmed.replace("## ", "")}</h2>
    }
    if (trimmed.startsWith("### ")) {
      return <h3 key={i} className="mt-6 text-lg font-semibold text-foreground mb-2">{trimmed.replace("### ", "")}</h3>
    }
    if (trimmed.startsWith("- ")) {
      return <li key={i} className="ml-4 list-disc text-sm text-muted-foreground">{renderInline(trimmed.replace("- ", ""))}</li>
    }
    if (trimmed === "") {
      return <div key={i} className="h-3" />
    }
    return <p key={i} className="mt-1 text-sm text-muted-foreground">{renderInline(trimmed)}</p>
  })
}

/** Render **bold** inline without dangerouslySetInnerHTML */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /\*\*(.+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(<strong key={key++}>{match[1]}</strong>)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length > 0 ? parts : [text]
}
