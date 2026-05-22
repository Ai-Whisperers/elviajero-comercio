import { describe, it, expect } from "@jest/globals"

describe("DEBUG content load", () => {
  it("loads es.json and checks heroCarousel", () => {
    const content = require("@/content/es.json")
    console.log("content.home:", JSON.stringify(content.home, null, 2))
    console.log("content.home?.heroCarousel:", content.home?.heroCarousel)
    expect(content.home?.heroCarousel?.enabled).toBe(true)
  })
})
