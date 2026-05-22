/**
 * Supabase Mock — comprehensive mock for testing API routes that use Supabase.
 *
 * Usage:
 *   jest.mock("@ai-whisperers/auth/supabase/server", () => ({ createClient: mockCreateClient }))
 *   jest.mock("@ai-whisperers/auth/supabase/admin", () => ({ createAdminClient: mockCreateAdminClient }))
 *   setMockSupabaseData("ej_products", [{ id: "1", name: "Carpa" }])
 *
 * The mock supports: select, insert, update, delete, upsert, eq, single, range, order, limit, maybeSingle
 */
import { jest } from "@jest/globals"

// ─── Query Builder Mock ───────────────────────────────────────────
class MockQueryBuilder {
  private _table: string
  private _filters: Record<string, any> = {}
  private _data: any[] = []
  private _error: any = null
  private _single = false
  private _maybeSingle = false
  private _rangeFrom = -1
  private _rangeTo = -1
  private _orderField = ""
  private _orderAsc = true
  private _limitCount = -1
  private _countMode = false
  private _headOnly = false
  private _onConflict = ""

  constructor(table: string) {
    this._table = table
    this._refreshData()
  }

  private _refreshData() {
    const store = getMockDataStore()
    this._data = store[this._table] ? [...store[this._table]] : []
    this._error = store[`${this._table}_error`] || null
  }

  select(columns?: string, opts?: any) {
    if (opts?.count === "exact") this._countMode = true
    if (opts?.head) this._headOnly = true
    return this
  }

  insert(rows: any) {
    const store = getMockDataStore()
    const arr = Array.isArray(rows) ? rows : [rows]
    if (!store[this._table]) store[this._table] = []
    for (const row of arr) {
      if (this._onConflict) {
        const conflictKey = Object.keys(row)[0]
        const idx = store[this._table].findIndex((r: any) => r[conflictKey] === row[conflictKey])
        if (idx >= 0) { store[this._table][idx] = { ...store[this._table][idx], ...row }; continue }
      }
      store[this._table].push({ ...row })
    }
    this._refreshData()
    return this
  }

  update(fields: any) {
    const store = getMockDataStore()
    if (!store[this._table]) store[this._table] = []
    store[this._table] = store[this._table].map((row: any) => {
      let match = true
      for (const [k, v] of Object.entries(this._filters)) {
        if (row[k] !== v) { match = false; break }
      }
      return match ? { ...row, ...fields } : row
    })
    this._refreshData()
    return this
  }

  delete() {
    const store = getMockDataStore()
    if (!store[this._table]) store[this._table] = []
    store[this._table] = store[this._table].filter((row: any) => {
      for (const [k, v] of Object.entries(this._filters)) {
        if (row[k] === v) return false
      }
      return true
    })
    this._refreshData()
    return this
  }

  upsert(row: any, opts?: any) {
    if (opts?.onConflict) this._onConflict = opts.onConflict
    return this.insert(row)
  }

  eq(column: string, value: any) {
    this._filters[column] = value
    return this
  }

  single() {
    this._single = true
    return this
  }

  maybeSingle() {
    this._maybeSingle = true
    return this
  }

  range(from: number, to: number) {
    this._rangeFrom = from
    this._rangeTo = to
    return this
  }

  order(field: string, opts?: any) {
    this._orderField = field
    this._orderAsc = opts?.ascending !== false
    return this
  }

  limit(n: number) {
    this._limitCount = n
    return this
  }

  gte(column: string, value: any) {
    // Simple filter: keep rows where column >= value
    this._refreshData()
    this._data = this._data.filter((row: any) => row[column] >= value)
    return this
  }

  lt(column: string, value: any) {
    this._refreshData()
    this._data = this._data.filter((row: any) => row[column] < value)
    return this
  }

  // Execute the chain and return result
  async then(resolve: Function, reject?: Function) {
    const result = this._execute()
    resolve(result)
  }

  private _execute() {
    this._refreshData()

    // Apply filters
    let filtered = [...this._data]
    for (const [k, v] of Object.entries(this._filters)) {
      filtered = filtered.filter((row: any) => row[k] === v)
    }

    // Apply order
    if (this._orderField) {
      filtered.sort((a: any, b: any) => {
        const va = a[this._orderField], vb = b[this._orderField]
        const cmp = va < vb ? -1 : va > vb ? 1 : 0
        return this._orderAsc ? cmp : -cmp
      })
    }

    // Count
    const count = filtered.length

    // Apply range
    if (this._rangeFrom >= 0) {
      filtered = filtered.slice(this._rangeFrom, this._rangeTo + 1)
    }

    // Apply limit
    if (this._limitCount > 0) {
      filtered = filtered.slice(0, this._limitCount)
    }

    if (this._headOnly) {
      return { data: [], error: this._error, count }
    }

    if (this._single) {
      return { data: filtered[0] || null, error: filtered.length === 0 ? { message: "Not found", code: "PGRST116" } : this._error }
    }

    if (this._maybeSingle) {
      return { data: filtered[0] || null, error: this._error }
    }

    return { data: filtered, error: this._error, count: this._countMode ? count : undefined }
  }
}

// ─── Storage Mock ──────────────────────────────────────────────────
class MockStorage {
  private _files: Record<string, { data: string; contentType: string }> = {}

  from(bucket: string) {
    return {
      upload: jest.fn(async (path: string, file: any) => ({ data: { path }, error: null })),
      getPublicUrl: (path: string) => ({ data: { publicUrl: `https://storage.example.com/${bucket}/${path}` } }),
    }
  }
}

// ─── Data Store ────────────────────────────────────────────────────
const _dataStore: Record<string, any> = {}

export function getMockDataStore() {
  return _dataStore
}

export function setMockSupabaseData(table: string, rows: any[]) {
  _dataStore[table] = [...rows]
}

export function setMockSupabaseError(table: string, message: string) {
  ;(_dataStore as any)[`${table}_error`] = { message, code: "23505" }
}

export function clearMockSupabaseData() {
  for (const k of Object.keys(_dataStore)) delete _dataStore[k]
}

// ─── Client Factories ──────────────────────────────────────────────
function createMockClient() {
  const storage = new MockStorage()
  return {
    from: (table: string) => new MockQueryBuilder(table),
    storage: () => storage,
    auth: {
      getSession: jest.fn(async () => ({ data: { session: null } })),
      getUser: jest.fn(async () => ({ data: { user: null }, error: null })),
    },
  }
}

export const mockCreateClient = jest.fn(() => Promise.resolve(createMockClient()))
export const mockCreateAdminClient = jest.fn(() => createMockClient())

// ─── Auth Mock ─────────────────────────────────────────────────────
export function mockRequireAdmin(req: any) {
  const authHeader = req?.headers?.get?.("authorization") || ""
  if (authHeader.startsWith("Bearer ") && authHeader.length > 10) {
    return { error: null }
  }
  return { error: { status: 401, message: "Unauthorized" } }
}
