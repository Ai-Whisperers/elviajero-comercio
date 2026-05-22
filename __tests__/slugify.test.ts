import { describe, it, expect } from "@jest/globals"

/**
 * Slugify function — mirrors the one used in product-card.tsx and product-content.tsx.
 * Must stay in sync with the component versions.
 */
function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü]+/g, "-")
    .replace(/-+$/, "")
}

describe("Slugify — product URL generation", () => {
  it("converts spaces to hyphens", () => {
    expect(slugify("Bolsa de dormir camuflayado")).toBe("bolsa-de-dormir-camuflayado")
  })

  it("lowercases everything", () => {
    expect(slugify("Cargador Portatil Ecopower")).toBe("cargador-portatil-ecopower")
  })

  it("preserves Spanish characters", () => {
    expect(slugify("Cantimplora con jarro")).toBe("cantimplora-con-jarro")
    expect(slugify("Artículo de camping")).toBe("artículo-de-camping")
    expect(slugify("Mochila niño")).toBe("mochila-niño")
  })

  it("handles special characters", () => {
    expect(slugify("Kit #1 Premium")).toBe("kit-1-premium")
    expect(slugify("Lampara LED (20W)")).toBe("lampara-led-20w")
  })

  it("handles single word", () => {
    expect(slugify("Linterna")).toBe("linterna")
  })

  it("handles empty string", () => {
    expect(slugify("")).toBe("")
  })

  it("handles multiple spaces", () => {
    expect(slugify("Bolsa   de    dormir")).toBe("bolsa-de-dormir")
  })

  it("does not strip trailing hyphen from accented chars", () => {
    // The regex [^a-z0-9áéíóúñü]+ replaces non-matching chars with hyphens
    // and then strips trailing hyphens only
    const result = slugify("Lámpara UV-C")
    expect(result).toBe("lámpara-uv-c")
  })
})
