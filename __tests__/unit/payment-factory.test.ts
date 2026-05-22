/**
 * Payment Gateway Factory Tests — registry pattern, adapter interface.
 */
import { describe, it, expect, beforeEach } from "@jest/globals"

// ─── Inline (mirrors lib/payment/factory.ts) ───────────────────────
interface GatewayAdapter {
  name: string
  processPayment: (req: any) => Promise<{ ok: boolean; url?: string }>
}

class PaymentFactory {
  private registry = new Map<string, GatewayAdapter>()

  register(adapter: GatewayAdapter) {
    this.registry.set(adapter.name, adapter)
  }

  get(name: string): GatewayAdapter | undefined {
    return this.registry.get(name)
  }

  list(): string[] {
    return Array.from(this.registry.keys())
  }
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Payment Gateway Factory", () => {
  let factory: PaymentFactory

  beforeEach(() => {
    factory = new PaymentFactory()
  })

  it("registers and retrieves a gateway", () => {
    const gw: GatewayAdapter = { name: "stripe", processPayment: async () => ({ ok: true }) }
    factory.register(gw)
    expect(factory.get("stripe")).toBe(gw)
  })

  it("returns undefined for unregistered gateway", () => {
    expect(factory.get("paypal")).toBeUndefined()
  })

  it("lists registered gateway names", () => {
    factory.register({ name: "stripe", processPayment: async () => ({ ok: true }) })
    factory.register({ name: "bancard", processPayment: async () => ({ ok: true }) })
    expect(factory.list()).toEqual(["stripe", "bancard"])
  })

  it("overwrites gateway with same name", () => {
    const v1: GatewayAdapter = { name: "test", processPayment: async () => ({ ok: false }) }
    const v2: GatewayAdapter = { name: "test", processPayment: async () => ({ ok: true }) }
    factory.register(v1)
    factory.register(v2)
    expect(factory.get("test")).toBe(v2)
  })

  it("lists empty when nothing registered", () => {
    expect(factory.list()).toEqual([])
  })

  it("handles multiple gateways", () => {
    for (const name of ["stripe", "bancard", "pagopar", "paypal"]) {
      factory.register({ name, processPayment: async () => ({ ok: true }) })
    }
    expect(factory.list()).toHaveLength(4)
  })
})
