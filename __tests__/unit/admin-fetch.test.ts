/**
 * Admin fetch wrapper tests — localStorage mock + fetch mock.
 *
 * Tests: adminFetch, adminHeaders — JWT injection logic
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach, jest } from "@jest/globals"
import { createLocalStorageMock } from "../test-helpers/helpers"

// Inline to avoid side-effect imports
function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
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

function adminHeaders(): Record<string, string> {
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

describe("Admin Fetch", () => {
  let storage: Storage
  let originalFetch: typeof globalThis.fetch

  beforeAll(() => {
    storage = createLocalStorageMock()
    Object.defineProperty(globalThis, "localStorage", { value: storage, writable: true })
    originalFetch = globalThis.fetch
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
  })

  beforeEach(() => {
    storage.clear()
    jest.restoreAllMocks()
  })

  describe("adminHeaders", () => {
    it("includes Content-Type by default", () => {
      const headers = adminHeaders()
      expect(headers["Content-Type"]).toBe("application/json")
    })

    it("includes Bearer token when session exists", () => {
      storage.setItem("elviajero_admin_session", JSON.stringify({ access_token: "test-jwt" }))
      const headers = adminHeaders()
      expect(headers["Authorization"]).toBe("Bearer test-jwt")
    })

    it("handles plain string token", () => {
      storage.setItem("elviajero_admin_session", JSON.stringify("plain-token"))
      const headers = adminHeaders()
      expect(headers["Authorization"]).toBe("Bearer plain-token")
    })

    it("omits Authorization when no session", () => {
      const headers = adminHeaders()
      expect(headers["Authorization"]).toBeUndefined()
    })

    it("omits Authorization when token is empty", () => {
      storage.setItem("elviajero_admin_session", JSON.stringify({ access_token: "" }))
      const headers = adminHeaders()
      expect(headers["Authorization"]).toBeUndefined()
    })

    it("handles corrupted localStorage data gracefully", () => {
      storage.setItem("elviajero_admin_session", "not-valid-json{{{")
      const headers = adminHeaders()
      expect(headers["Content-Type"]).toBe("application/json")
      expect(headers["Authorization"]).toBeUndefined()
    })
  })

  describe("adminFetch", () => {
    it("calls fetch with the provided URL", async () => {
      globalThis.fetch = jest.fn(async () => ({ ok: true })) as any
      await adminFetch("/api/admin/content")
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/admin/content",
        expect.anything()
      )
    })

    it("sets Content-Type when body is provided", async () => {
      globalThis.fetch = jest.fn(async () => ({ ok: true })) as any
      await adminFetch("/api/admin/content", {
        method: "POST",
        body: JSON.stringify({ key: "value" }),
      })
      const call = (globalThis.fetch as jest.Mock).mock.calls[0]
      const init = call[1] as RequestInit
      const headers = init.headers as Headers
      expect(headers.get("Content-Type")).toBe("application/json")
    })

    it("injects Authorization header from session", async () => {
      storage.setItem("elviajero_admin_session", JSON.stringify({ access_token: "jwt-123" }))
      globalThis.fetch = jest.fn(async () => ({ ok: true })) as any
      await adminFetch("/api/admin/content")
      const call = (globalThis.fetch as jest.Mock).mock.calls[0]
      const init = call[1] as RequestInit
      const headers = init.headers as Headers
      expect(headers.get("Authorization")).toBe("Bearer jwt-123")
    })

    it("does not inject Authorization when no session", async () => {
      globalThis.fetch = jest.fn(async () => ({ ok: true })) as any
      await adminFetch("/api/admin/content")
      const call = (globalThis.fetch as jest.Mock).mock.calls[0]
      const init = call[1] as RequestInit
      const headers = init.headers as Headers
      expect(headers.get("Authorization")).toBeNull()
    })

    it("preserves custom headers", async () => {
      globalThis.fetch = jest.fn(async () => ({ ok: true })) as any
      await adminFetch("/api/admin/content", {
        headers: { "X-Custom": "test" },
      })
      const call = (globalThis.fetch as jest.Mock).mock.calls[0]
      const init = call[1] as RequestInit
      const headers = init.headers as Headers
      expect(headers.get("X-Custom")).toBe("test")
    })

    it("handles corrupted session gracefully", async () => {
      storage.setItem("elviajero_admin_session", "bad{{{json")
      globalThis.fetch = jest.fn(async () => ({ ok: true })) as any
      await adminFetch("/api/admin/content")
      const call = (globalThis.fetch as jest.Mock).mock.calls[0]
      const init = call[1] as RequestInit
      const headers = init.headers as Headers
      expect(headers.get("Authorization")).toBeNull()
    })
  })
})
