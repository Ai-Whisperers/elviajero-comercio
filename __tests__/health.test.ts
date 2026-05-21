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

  it("returns a stable health payload with the active app environment", async () => {
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
})
