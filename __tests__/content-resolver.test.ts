import { describe, it, expect } from "@jest/globals"
import { getProductWhatsappUrl, BuyNowWhatsappUrl } from "@/lib/content-resolver"

describe("Content Resolver — WhatsApp URLs", () => {
  it("generates product inquiry URL", () => {
    const url = getProductWhatsappUrl("Carpa camping", "Gs. 350.000")
    expect(url).toContain("wa.me/")
    expect(decodeURIComponent(url)).toContain("Carpa camping")
    expect(decodeURIComponent(url)).toContain("Gs. 350.000")
    expect(decodeURIComponent(url)).toContain("Quiero comprar")
  })

  it("includes product URL when provided", () => {
    const url = getProductWhatsappUrl("Carpa", "Gs. 350.000", "https://tiendaelviajero.com.py/producto/carpa")
    expect(decodeURIComponent(url)).toContain("tiendaelviajero.com.py")
  })

  it("works without product URL", () => {
    const url = getProductWhatsappUrl("Carpa", "Gs. 350.000")
    expect(decodeURIComponent(url)).not.toContain("Lo vi en:")
  })

  it("generates buy-now URL with quantity", () => {
    const url = BuyNowWhatsappUrl("Bolsa de dormir", "Gs. 180.000", 2)
    const decoded = decodeURIComponent(url)
    expect(decoded).toContain("2x")
    expect(decoded).toContain("Bolsa de dormir")
    expect(decoded).toContain("Total:")
  })

  it("calculates total correctly in buy-now", () => {
    const url = BuyNowWhatsappUrl("Test", "Gs. 100.000", 3)
    const decoded = decodeURIComponent(url)
    // 100000 * 3 = 300000
    expect(decoded).toContain("300.000")
  })
})
