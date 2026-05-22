/** Pure-function mirrors of lib/content-provider.tsx helpers for testing */

export function deepMerge(defaults: any, overrides: any): any {
  if (typeof defaults !== "object" || defaults === null) return overrides ?? defaults
  if (typeof overrides !== "object" || overrides === null) return overrides ?? defaults
  if (Array.isArray(defaults) || Array.isArray(overrides)) return overrides ?? defaults

  const result: any = { ...defaults }
  for (const key of Object.keys(overrides)) {
    if (key in defaults) {
      result[key] = deepMerge(defaults[key], overrides[key])
    } else {
      result[key] = overrides[key]
    }
  }
  return result
}

export function deepGet(obj: any, path: string): any {
  const parts = path.split(".")
  let cur = obj
  for (const p of parts) {
    if (cur?.[p] === undefined || cur?.[p] === null) return undefined
    cur = cur[p]
  }
  return cur
}
