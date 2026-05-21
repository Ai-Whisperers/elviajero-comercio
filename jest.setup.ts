import "@testing-library/jest-dom"

class TestResponse {
  status: number
  private body: unknown

  constructor(body: unknown, init?: { status?: number }) {
    this.body = body
    this.status = init?.status ?? 200
  }

  static json(body: unknown, init?: { status?: number }) {
    return new TestResponse(body, init)
  }

  async json() {
    return this.body
  }
}

if (typeof globalThis.Response === "undefined") {
  Object.defineProperty(globalThis, "Response", {
    value: TestResponse,
    writable: true,
  })
}
