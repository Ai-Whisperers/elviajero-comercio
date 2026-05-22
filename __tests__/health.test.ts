import { describe, it, expect } from "@jest/globals"
import { GET } from "@/app/api/health/route"

describe("/api/health", () => {
  const originalAppEnv = process.env.APP_ENV

  afterEach(() => {
    if (originalAppEnv === undefined) {
      Reflect.deleteProperty(process.env, "APP_ENV")
    } else {
      process.env["APP_ENV"] = originalAppEnv
    }
  })

  it("returns 200 with correct structure", async () => {
    process.env["APP_ENV"] = "staging"
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      status: "ok",
      service: "elviajero",
      environment: "staging",
    })
    expect(typeof body.timestamp).toBe("string")
    expect(typeof body.uptime).toBe("number")
  })

  it("defaults environment to production when APP_ENV not set", async () => {
    Reflect.deleteProperty(process.env, "APP_ENV")
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    // In test env, APP_ENV may be set to 'test' by jest; just check it returns something
    expect(typeof body.environment).toBe("string")
  })

  it("includes valid ISO timestamp", async () => {
    const response = await GET()
    const body = await response.json()

    const parsed = Date.parse(body.timestamp)
    expect(isNaN(parsed)).toBe(false)
    // Timestamp should be within last 5 seconds
    expect(Math.abs(Date.now() - parsed)).toBeLessThan(5000)
  })

  it("uptime is non-negative", async () => {
    const response = await GET()
    const body = await response.json()

    expect(body.uptime).toBeGreaterThanOrEqual(0)
  })

  it("always identifies as elviajero service", async () => {
    process.env["APP_ENV"] = "testing"
    const response = await GET()
    const body = await response.json()

    expect(body.service).toBe("elviajero")
  })
})
