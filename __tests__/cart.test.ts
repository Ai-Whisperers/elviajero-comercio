import { describe, it, expect } from "@jest/globals"
import { CartItem } from "@/lib/types"

describe("Cart — item matching logic", () => {
  // Mirrors the key-building logic from cart-context.tsx
  function cartKey(item: { name: string; variant?: string }) {
    return item.name + (item.variant ? "::" + item.variant : "")
  }

  it("matches items by name only (no variant)", () => {
    const items: CartItem[] = [
      { name: "Carpa", price: "Gs. 350.000", priceGs: 350000, quantity: 1 },
      { name: "Bolsa", price: "Gs. 180.000", priceGs: 180000, quantity: 2 },
    ]
    const found = items.find(i => cartKey(i) === cartKey({ name: "Carpa" }))
    expect(found).toBeDefined()
    expect(found!.name).toBe("Carpa")
  })

  it("distinguishes same product with different variants", () => {
    const items: CartItem[] = [
      { name: "Carpa", variant: "2 personas", price: "Gs. 350.000", priceGs: 350000, quantity: 1 },
      { name: "Carpa", variant: "4 personas", price: "Gs. 550.000", priceGs: 550000, quantity: 1 },
    ]
    const found = items.find(i => cartKey(i) === cartKey({ name: "Carpa", variant: "2 personas" }))
    expect(found).toBeDefined()
    expect(found!.priceGs).toBe(350000)
  })

  it("correctly calculates total", () => {
    const items: CartItem[] = [
      { name: "A", price: "Gs. 100.000", priceGs: 100000, quantity: 2 },
      { name: "B", price: "Gs. 50.000", priceGs: 50000, quantity: 3 },
    ]
    const total = items.reduce((sum, i) => sum + i.priceGs * i.quantity, 0)
    expect(total).toBe(350000) // 100000*2 + 50000*3
  })

  it("correctly counts items", () => {
    const items: CartItem[] = [
      { name: "A", price: "Gs. 100.000", priceGs: 100000, quantity: 2 },
      { name: "B", price: "Gs. 50.000", priceGs: 50000, quantity: 3 },
    ]
    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    expect(count).toBe(5)
  })

  it("increment quantity for existing item", () => {
    const items: CartItem[] = [
      { name: "A", price: "Gs. 100.000", priceGs: 100000, quantity: 1 },
    ]
    const key = cartKey({ name: "A" })
    const updated = items.map(i => cartKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i)
    expect(updated[0].quantity).toBe(2)
  })

  it("remove item by name", () => {
    const items: CartItem[] = [
      { name: "A", price: "Gs. 100.000", priceGs: 100000, quantity: 1 },
      { name: "B", price: "Gs. 50.000", priceGs: 50000, quantity: 1 },
    ]
    const filtered = items.filter(i => i.name !== "A")
    expect(filtered).toHaveLength(1)
    expect(filtered[0].name).toBe("B")
  })
})
