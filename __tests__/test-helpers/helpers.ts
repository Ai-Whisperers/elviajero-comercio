/**
 * Test Helpers — reusable test utilities, matchers, and mock builders.
 */

// ─── localStorage Mock ───────────────────────────────────────────────
/**
 * Creates a clean localStorage mock for tests.
 * Call in beforeEach, or use localStorageSetup() for automatic lifecycle.
 */
export function createLocalStorageMock(): Storage {
  const store: Record<string, string> = {}
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value }),
    removeItem: jest.fn((key: string) => { delete store[key] }),
    clear: jest.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
    get length() { return Object.keys(store).length },
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
  }
}

/** Auto-setup localStorage mock with beforeAll/afterAll */
export function localStorageSetup() {
  let original: typeof localStorage
  beforeAll(() => {
    original = globalThis.localStorage
    Object.defineProperty(globalThis, "localStorage", { value: createLocalStorageMock(), writable: true })
  })
  afterAll(() => {
    Object.defineProperty(globalThis, "localStorage", { value: original, writable: true })
  })
  return {
    /** Clear all localStorage data between tests */
    clearBetweenTests() {
      afterEach(() => { globalThis.localStorage.clear() })
    },
  }
}

// ─── NextRequest Builder ─────────────────────────────────────────────
/**
 * Build a NextRequest-like object for testing API routes.
 * Uses plain objects instead of importing Next.js to avoid env issues.
 *
 * Usage:
 *   const req = buildRequest("/api/checkout", {
 *     method: "POST",
 *     body: { items: [], total: 500000 },
 *     headers: { authorization: "Bearer token" },
 *   })
 */
export function buildRequest(
  url: string,
  options?: {
    method?: string
    body?: Record<string, unknown>
    headers?: Record<string, string>
  }
) {
  const init: any = {
    method: options?.method || "GET",
    headers: options?.headers || {},
    url: new URL(url, "https://tiendaelviajero.com.py").toString(),
  }
  if (options?.body) {
    init.body = JSON.stringify(options.body)
    if (!init.headers["Content-Type"]) {
      init.headers["Content-Type"] = "application/json"
    }
  }
  return init
}

// ─── Supabase Mock Builder ───────────────────────────────────────────
/**
 * Build a fluent Supabase mock that handles the chained query API.
 *
 * Usage:
 *   const mock = supabaseMock()
 *   mock.forTable("ej_products").select().resolve([{ id: 1, name: "Test" }])
 *
 *   // In your test:
 *   jest.mock("@ai-whisperers/auth/supabase/admin", () => ({
 *     createAdminClient: () => mock.client,
 *   }))
 */
export function supabaseMock() {
  const tables: Record<string, any> = {}
  const chains: any[] = []

  function buildChain(tableName: string) {
    const chain: Record<string, any> = {
      _table: tableName,
      _filters: {} as Record<string, any>,
      _result: null as any,
      _error: null as any,
      _method: "",
      _data: null as any,
      _orderField: "",
      _orderAsc: true,
      _limitCount: undefined as number | undefined,
    }

    const queryMethods = ["select", "insert", "update", "delete", "upsert"] as const
    queryMethods.forEach(method => {
      chain[method] = jest.fn((...args: any[]) => {
        chain._method = method
        return proxy
      })
    })

    const filterMethods = ["eq", "neq", "gt", "gte", "lt", "lte", "in", "contains", "like", "ilike", "is", "single", "maybeSingle"] as const
    filterMethods.forEach(method => {
      chain[method] = jest.fn((...args: any[]) => {
        chain._filters[method] = args
        return proxy
      })
    })

    chain.order = jest.fn((field: string, opts?: { ascending?: boolean }) => {
      chain._orderField = field
      chain._orderAsc = opts?.ascending ?? true
      return proxy
    })

    chain.limit = jest.fn((count: number) => {
      chain._limitCount = count
      return proxy
    })

    // Terminal — resolve with data
    chain.resolve = (data: any) => {
      chain._result = { data, error: null }
      return proxy
    }

    // Terminal — resolve with error
    chain.resolveError = (message: string) => {
      chain._result = { data: null, error: { message } }
      return proxy
    }

    // The proxy is what makes chaining work — it returns itself for any property access
    // but delegates to the chain object
    const handler: ProxyHandler<object> = {
      get(target, prop) {
        if (typeof prop === "symbol") return (target as any)[prop]
        if (prop === "then") return undefined // prevent Promise resolution
        if (prop in chain) return chain[prop as string]
        return jest.fn(() => proxy) // catch-all for unmocked methods
      },
    }
    const proxy = new Proxy({}, handler)

    chains.push(chain)
    return chain
  }

  const client = {
    from: jest.fn((tableName: string) => {
      if (!tables[tableName]) {
        tables[tableName] = buildChain(tableName)
      }
      // Return a proxy that delegates to the chain
      return tables[tableName]
    }),
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      updateUser: jest.fn(),
      admin: {
        listUsers: jest.fn(),
        updateUserById: jest.fn(),
      },
    },
    rpc: jest.fn(),
  }

  return {
    client,
    chains,
    /** Get the chain for a specific table to set up its mock responses */
    forTable(tableName: string) {
      if (!tables[tableName]) {
        tables[tableName] = buildChain(tableName)
      }
      return tables[tableName]
    },
    /** Make all table queries resolve with { data, error: null } */
    resolveAll(data: any) {
      chains.forEach(c => {
        if (!c._result) c.resolve(data)
      })
    },
  }
}

// ─── Fetch Mock ──────────────────────────────────────────────────────
/**
 * Mock global fetch with typed response builder.
 *
 * Usage:
 *   const fetchMock = createFetchMock()
 *   fetchMock.mockResponse("/api/home", { products: [], brands: [] })
 *   fetchMock.mockResponse("/api/health", { status: "ok" })
 */
export function createFetchMock() {
  const responses = new Map<string, any>()
  const calls: { url: string; init?: RequestInit }[] = []

  const mock = jest.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const urlStr = typeof url === "string" ? url : url.toString()
    calls.push({ url: urlStr, init })

    // Find matching response (exact match or partial match)
    const match = Array.from(responses.entries()).find(([pattern]) =>
      urlStr === pattern || urlStr.includes(pattern)
    )

    if (match) {
      const body = match[1]
      return {
        ok: true,
        status: 200,
        json: async () => body,
        text: async () => JSON.stringify(body),
        headers: new Headers({ "Content-Type": "application/json" }),
      }
    }

    return {
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
      text: async () => "Not found",
      headers: new Headers(),
    }
  })

  return {
    fn: mock,
    /** Register a response for a URL pattern */
    mockResponse(urlPattern: string, body: any) {
      responses.set(urlPattern, body)
    },
    /** Register an error response */
    mockError(urlPattern: string, status: number, error: string) {
      responses.set(urlPattern, { error, status })
      // Override the mock for this pattern
      const origFn = mock.getMockImplementation()!
      mock.mockImplementation(async (url: string | URL | Request, init?: RequestInit) => {
        const urlStr = typeof url === "string" ? url : url.toString()
        calls.push({ url: urlStr, init })
        if (urlStr.includes(urlPattern)) {
          return {
            ok: false,
            status,
            json: async () => ({ error }),
            text: async () => error,
            headers: new Headers(),
          }
        }
        return origFn(url, init)
      })
    },
    /** Get all recorded calls */
    getCalls() { return calls },
    /** Get the last call */
    getLastCall() { return calls[calls.length - 1] },
    /** Reset all state */
    reset() {
      responses.clear()
      calls.length = 0
      mock.mockClear()
    },
  }
}

// ─── Custom Assertions ───────────────────────────────────────────────
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidGs(): R
      toHaveProducts(count: number): R
    }
  }
}

/** "Gs. 180.000" format assertion */
expect.extend({
  toBeValidGs(received: string) {
    const pass = /^Gs\.\s[\d.]+$/.test(received)
    return {
      pass,
      message: () => `expected "${received}" to be a valid Guaraní format (e.g. "Gs. 180.000")`,
    }
  },
  toHaveProducts(received: any, expectedCount: number) {
    const count = received?.products?.length ?? 0
    return {
      pass: count === expectedCount,
      message: () => `expected ${expectedCount} products, got ${count}`,
    }
  },
})
