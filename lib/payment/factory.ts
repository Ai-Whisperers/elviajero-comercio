// Payment gateway factory — single route handler for all gateways

export interface PaymentRequest {
  order: { id: string; [key: string]: any }
  total: number
  items?: any[]
  customer?: { email?: string; name?: string; [key: string]: any }
  [key: string]: any
}

export interface GatewayResult {
  ok: boolean
  sandbox?: boolean
  redirectUrl?: string
  url?: string
  error?: any
}

export interface GatewayAdapter {
  name: string
  processPayment: (req: PaymentRequest) => Promise<GatewayResult>
}

const registry = new Map<string, GatewayAdapter>()

export function registerGateway(adapter: GatewayAdapter) {
  registry.set(adapter.name, adapter)
}

export function getGateway(name: string): GatewayAdapter | undefined {
  return registry.get(name)
}

export function getRegisteredGateways(): string[] {
  return Array.from(registry.keys())
}
