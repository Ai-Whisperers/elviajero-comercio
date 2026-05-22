/**
 * Cart Context Logic Tests — tests pure cart operations without React rendering.
 *
 * Cart logic is: add (with dedup by name+variant), remove, updateQuantity,
 * total calc, itemCount calc, shareCart URL generation, save/restore.
 */
import { describe, it, expect } from "@jest/globals"

interface CartItem {
  id?: string
  name: string
  price: string
  priceGs: number
  quantity: number
  variant?: string
  imageUrl?: string
}

// ─── Pure cart logic (extracted from lib/cart-context.tsx) ──────────

function cartKey(item: { name: string; variant?: string }): string {
  return item.name + (item.variant ? "::" + item.variant : "")
}

function addItemToCart(prev: CartItem[], item: Omit<CartItem, "quantity">): CartItem[] {
  const key = cartKey(item)
  const exist = prev.find((i) => cartKey(i) === key)
  if (exist) {
    return prev.map((i) => (cartKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i))
  }
  return [...prev, { ...item, quantity: 1 }]
}

function removeItemFromCart(prev: CartItem[], name: string): CartItem[] {
  return prev.filter((i) => i.name !== name)
}

function updateItemQuantity(prev: CartItem[], name: string, qty: number): CartItem[] {
  return prev.map((i) => (i.name === name ? { ...i, quantity: Math.max(1, qty) } : i))
}

function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.priceGs * i.quantity, 0)
}

function calcItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

function buildShareCartUrl(items: CartItem[], total: number): string {
  const msg = items.map(i => "• " + i.name + (i.variant ? " (" + i.variant + ")" : "") + " x" + i.quantity + ": " + i.price).join("\n")
  return "https://wa.me/?text=" + encodeURIComponent("Mirá mi carrito de El Viajero:\n\n" + msg + "\n\nTotal: Gs. " + total.toLocaleString("es-PY"))
}

// ─── Tests ─────────────────────────────────────────────────────────

describe("Cart Context Logic", () => {
  const baseItem = { name: "Carpa 4P", price: "Gs. 850.000", priceGs: 850000, imageUrl: "/carpa.jpg" }

  describe("addItemToCart", () => {
    it("adds new item with quantity 1", () => {
      const result = addItemToCart([], baseItem)
      expect(result).toHaveLength(1)
      expect(result[0].quantity).toBe(1)
      expect(result[0].name).toBe("Carpa 4P")
    })

    it("increments quantity for existing item (same name, no variant)", () => {
      const result = addItemToCart([{ ...baseItem, quantity: 2 }], baseItem)
      expect(result).toHaveLength(1)
      expect(result[0].quantity).toBe(3)
    })

    it("treats different variants as separate items", () => {
      const cart: CartItem[] = [{ ...baseItem, variant: "Verde", quantity: 1 }]
      const result = addItemToCart(cart, { ...baseItem, variant: "Rojo" })
      expect(result).toHaveLength(2)
    })

    it("increments quantity for same variant", () => {
      const cart: CartItem[] = [{ ...baseItem, variant: "Verde", quantity: 1 }]
      const result = addItemToCart(cart, { ...baseItem, variant: "Verde" })
      expect(result).toHaveLength(1)
      expect(result[0].quantity).toBe(2)
    })

    it("does not mutate original array", () => {
      const original: CartItem[] = []
      addItemToCart(original, baseItem)
      expect(original).toHaveLength(0)
    })

    it("handles adding to cart with multiple existing items", () => {
      const cart: CartItem[] = [
        { ...baseItem, name: "Item A", quantity: 2 },
        { ...baseItem, name: "Item B", quantity: 1 },
      ]
      const result = addItemToCart(cart, { ...baseItem, name: "Item A" })
      expect(result).toHaveLength(2)
      expect(result.find(i => i.name === "Item A")!.quantity).toBe(3)
    })
  })

  describe("removeItemFromCart", () => {
    it("removes item by name", () => {
      const cart: CartItem[] = [{ ...baseItem, quantity: 1 }, { ...baseItem, name: "Otro", quantity: 1 }]
      const result = removeItemFromCart(cart, "Carpa 4P")
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe("Otro")
    })

    it("returns empty array when removing last item", () => {
      const cart: CartItem[] = [{ ...baseItem, quantity: 1 }]
      const result = removeItemFromCart(cart, "Carpa 4P")
      expect(result).toHaveLength(0)
    })

    it("returns same cart if name not found", () => {
      const cart: CartItem[] = [{ ...baseItem, quantity: 1 }]
      const result = removeItemFromCart(cart, "NoExiste")
      expect(result).toHaveLength(1)
    })
  })

  describe("updateItemQuantity", () => {
    it("updates quantity for named item", () => {
      const cart: CartItem[] = [{ ...baseItem, quantity: 1 }]
      const result = updateItemQuantity(cart, "Carpa 4P", 5)
      expect(result[0].quantity).toBe(5)
    })

    it("clamps minimum to 1", () => {
      const cart: CartItem[] = [{ ...baseItem, quantity: 3 }]
      const result = updateItemQuantity(cart, "Carpa 4P", 0)
      expect(result[0].quantity).toBe(1)
    })

    it("clamps negative to 1", () => {
      const cart: CartItem[] = [{ ...baseItem, quantity: 3 }]
      const result = updateItemQuantity(cart, "Carpa 4P", -5)
      expect(result[0].quantity).toBe(1)
    })

    it("does not affect other items", () => {
      const cart: CartItem[] = [
        { ...baseItem, name: "A", quantity: 2 },
        { ...baseItem, name: "B", quantity: 3 },
      ]
      const result = updateItemQuantity(cart, "A", 10)
      expect(result.find(i => i.name === "B")!.quantity).toBe(3)
    })
  })

  describe("calcTotal", () => {
    it("calculates total for single item", () => {
      expect(calcTotal([{ ...baseItem, quantity: 2 }])).toBe(1700000)
    })

    it("calculates total for multiple items", () => {
      const cart: CartItem[] = [
        { ...baseItem, name: "A", priceGs: 100000, quantity: 2 },
        { ...baseItem, name: "B", priceGs: 50000, quantity: 3 },
      ]
      expect(calcTotal(cart)).toBe(350000)
    })

    it("returns 0 for empty cart", () => {
      expect(calcTotal([])).toBe(0)
    })
  })

  describe("calcItemCount", () => {
    it("counts items with quantities", () => {
      const cart: CartItem[] = [
        { ...baseItem, name: "A", quantity: 3 },
        { ...baseItem, name: "B", quantity: 2 },
      ]
      expect(calcItemCount(cart)).toBe(5)
    })

    it("returns 0 for empty cart", () => {
      expect(calcItemCount([])).toBe(0)
    })
  })

  describe("buildShareCartUrl", () => {
    it("generates WhatsApp URL", () => {
      const url = buildShareCartUrl([{ ...baseItem, quantity: 1 }], 850000)
      expect(url).toContain("wa.me")
      expect(url).toContain("El%20Viajero")
    })

    it("includes product name", () => {
      const url = buildShareCartUrl([{ ...baseItem, quantity: 1 }], 850000)
      expect(decodeURIComponent(url)).toContain("Carpa 4P")
    })

    it("includes quantity", () => {
      const url = buildShareCartUrl([{ ...baseItem, quantity: 3 }], 2550000)
      expect(decodeURIComponent(url)).toContain("x3")
    })

    it("includes total", () => {
      const url = buildShareCartUrl([{ ...baseItem, quantity: 1 }], 850000)
      expect(decodeURIComponent(url)).toContain("850.000")
    })

    it("includes variant when present", () => {
      const url = buildShareCartUrl([{ ...baseItem, variant: "Verde", quantity: 1 }], 850000)
      expect(decodeURIComponent(url)).toContain("Verde")
    })

    it("handles empty cart", () => {
      const url = buildShareCartUrl([], 0)
      expect(url).toContain("wa.me")
    })
  })

  describe("cartKey", () => {
    it("returns name only when no variant", () => {
      expect(cartKey({ name: "Test" })).toBe("Test")
    })

    it("appends variant with separator", () => {
      expect(cartKey({ name: "Test", variant: "Grande" })).toBe("Test::Grande")
    })

    it("ignores empty variant", () => {
      expect(cartKey({ name: "Test", variant: "" })).toBe("Test")
    })
  })
})
