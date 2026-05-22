const nextJest = require("next/jest")
const createJestConfig = nextJest({ dir: "./" })
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@ai-whisperers/auth/storage-keys$": "<rootDir>/packages/auth/storage-keys.ts",
    "^@ai-whisperers/auth/supabase/(.*)$": "<rootDir>/packages/auth/supabase/$1",
    "^@ai-whisperers/auth$": "<rootDir>/packages/auth/auth-context.tsx",
    "^@ai-whisperers/commerce/cart/(.*)$": "<rootDir>/packages/commerce/cart/$1",
    "^@ai-whisperers/commerce$": "<rootDir>/packages/commerce/index.ts",
  },
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/__tests__/test-helpers", "<rootDir>/__tests__/test-utils\\.ts$", "<rootDir>/e2e/"],
}
module.exports = createJestConfig(config)
