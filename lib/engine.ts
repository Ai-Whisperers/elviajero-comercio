export function resolveContent<T extends Record<string, unknown>>(
  content: Record<string, unknown>, path: string
): T | undefined {
  const parts = path.split(".")
  let current: unknown = content
  for (const key of parts) {
    if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key]
    } else { return undefined }
  }
  return current as T | undefined
}

export function fillPlaceholders(value: unknown, placeholders: Record<string, string | number>): unknown {
  if (typeof value === "string") {
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => placeholders[key]?.toString() ?? `{{${key}}}`)
  }
  if (Array.isArray(value)) return value.map(v => fillPlaceholders(v, placeholders))
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = fillPlaceholders(v, placeholders)
    return out
  }
  return value
}
