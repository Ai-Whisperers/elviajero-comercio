import { registerGateway, PaymentRequest } from "."

registerGateway({
  name: "paypal",
  processPayment: async ({ order, total }: PaymentRequest) => {
    const orderId = order.id || Date.now().toString(36)
    return { ok: true, sandbox: true, redirectUrl: `/pedido/confirmado?id=${order.id}` }
  },
})
