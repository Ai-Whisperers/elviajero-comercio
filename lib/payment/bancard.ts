import { registerGateway } from "./factory"

registerGateway({
  name: "bancard",
  processPayment: async () => {
    const orderId = Date.now().toString(36)
    return { ok: true, sandbox: true, redirectUrl: `/pedido/confirmado?id=${orderId}` }
  },
})
