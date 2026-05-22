/**
 * Admin-scoped fetch wrapper. Automatically injects the JWT Bearer token
 * from localStorage into every request to /api/admin/* endpoints.
 *
 * Usage: identical to fetch(), but with auth baked in.
 *   adminFetch("/api/admin/content")
 *   adminFetch("/api/admin/content", { method: "POST", body: "..." })
 */
export function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)

  // Set Content-Type if body is present and no explicit Content-Type
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  // Inject Bearer token from admin session
  try {
    const stored = localStorage.getItem("elviajero_admin_session")
    if (stored) {
      const session = JSON.parse(stored)
      const accessToken = session.access_token || session
      if (typeof accessToken === "string" && accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`)
      }
    }
  } catch {}

  return fetch(url, { ...init, headers })
}

/**
 * Returns fetch headers with admin auth token from localStorage.
 * For cases where you need to pass headers manually.
 */
export function adminHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  try {
    const stored = localStorage.getItem("elviajero_admin_session")
    if (stored) {
      const session = JSON.parse(stored)
      const accessToken = session.access_token || session
      if (typeof accessToken === "string") headers["Authorization"] = `Bearer ${accessToken}`
    }
  } catch {}
  return headers
}
