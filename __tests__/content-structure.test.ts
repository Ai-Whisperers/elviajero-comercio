import { describe, it, expect } from "@jest/globals"

describe("Content es.json — structure", () => {
  let content: any

  beforeAll(() => {
    content = require("@/content/es.json")
  })

  it("has required top-level keys", () => {
    expect(content.siteName).toBeDefined()
    expect(content.businessName).toBeDefined()
    expect(content.tagline).toBeDefined()
  })

  it("has hero section inside home", () => {
    expect(content.home).toBeDefined()
    expect(content.home.hero).toBeDefined()
    expect(content.home.hero.headline).toBeDefined()
    expect(content.home.heroCarousel).toBeDefined()
    expect(content.home.heroCarousel.enabled).toBe(true)
    expect(Array.isArray(content.home.heroCarousel.slides)).toBe(true)
    expect(content.home.heroCarousel.slides.length).toBeGreaterThan(0)
  })

  it("has whatsapp configuration", () => {
    expect(content.whatsapp).toBeDefined()
    expect(content.whatsapp.businessNumber).toBeDefined()
    expect(content.whatsapp.businessNumber).toMatch(/595/)
  })

  it("has branding section", () => {
    expect(content.branding).toBeDefined()
    expect(content.branding.logoUrl).toBeDefined()
    expect(content.branding.faviconUrl).toBeDefined()
  })

  it("has store labels", () => {
    expect(content.store).toBeDefined()
    expect(content.store.addToCart).toBeDefined()
    expect(content.store.soldOut).toBeDefined()
  })

  it("has UI labels", () => {
    expect(content.ui).toBeDefined()
    expect(content.ui.search).toBeDefined()
  })

  it("has productos section", () => {
    expect(content.productos).toBeDefined()
    expect(content.productos.hero).toBeDefined()
  })

  it("all hero carousel slides have image and title", () => {
    for (const slide of content.home.heroCarousel.slides) {
      expect(slide.image).toBeDefined()
      expect(slide.title).toBeDefined()
    }
  })

  it("has contact section as contacto", () => {
    expect(content.contacto).toBeDefined()
  })

  it("has faq section with items array", () => {
    expect(content.faq).toBeDefined()
    expect(Array.isArray(content.faq.items)).toBe(true)
    expect(content.faq.items.length).toBeGreaterThan(0)
  })

  it("branding URLs are valid paths", () => {
    const { logoUrl, faviconUrl } = content.branding
    expect(logoUrl).toMatch(/^\//)
    expect(faviconUrl).toMatch(/^\//)
  })

  it("has navigation items", () => {
    expect(content.navigation).toBeDefined()
    expect(Array.isArray(content.navigation.items)).toBe(true)
    expect(content.navigation.items.length).toBeGreaterThan(0)
  })

  it("has footer section", () => {
    expect(content.footer).toBeDefined()
  })
})
