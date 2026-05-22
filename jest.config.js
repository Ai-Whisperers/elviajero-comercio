const nextJest = require("next/jest")
const createJestConfig = nextJest({ dir: "./" })
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@ai-whisperers/auth/storage-keys$": "<rootDir>/packages/auth/storage-keys.ts",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/__tests__/test-helpers", "<rootDir>/__tests__/test-utils\\.ts$", "<rootDir>/e2e/"],
}
module.exports = createJestConfig(config)
