import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const DB_PATH = path.join(process.cwd(), "data", "viajero.db")

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    db = new Database(DB_PATH)
    db.pragma("journal_mode = WAL")
    initTables()
  }
  return db
}

function initTables() {
  db!.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS addresses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      label TEXT DEFAULT '',
      name TEXT DEFAULT '',
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT DEFAULT '',
      zip TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      is_default INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      items TEXT NOT NULL,
      total TEXT NOT NULL,
      status TEXT DEFAULT 'pendiente',
      address_id TEXT DEFAULT '',
      payment_method TEXT DEFAULT '',
      note TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS products (
      name TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      price TEXT NOT NULL,
      price_before TEXT DEFAULT '',
      description TEXT DEFAULT '',
      brand TEXT DEFAULT '',
      specs TEXT DEFAULT '',
      stock INTEGER DEFAULT 0,
      weight TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      is_new INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_name TEXT NOT NULL,
      user_name TEXT DEFAULT 'Anónimo',
      rating INTEGER NOT NULL,
      text TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS promo_codes (
      code TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'percentage',
      value INTEGER NOT NULL,
      min_purchase INTEGER DEFAULT 0,
      max_uses INTEGER DEFAULT 100,
      used_count INTEGER DEFAULT 0,
      expires_at TEXT
    );
    CREATE TABLE IF NOT EXISTS subscribers (
      email TEXT PRIMARY KEY,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `)
}

export function migrateFromJson() {
  const d = getDb()

  // Migrate users
  try {
    const users = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "users.json"), "utf-8") || "[]")
    const insert = d.prepare("INSERT OR IGNORE INTO users (id, name, email, password, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    for (const u of users) insert.run(u.id, u.name, u.email, u.password, u.phone || "", u.createdAt || new Date().toISOString())
  } catch {}

  // Migrate promos
  try {
    const promos = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "promos.json"), "utf-8") || "[]")
    const insert = d.prepare("INSERT OR IGNORE INTO promo_codes (code, type, value, min_purchase, max_uses, used_count, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    for (const p of promos) insert.run(p.code, p.type, p.value, p.minPurchase, p.maxUses, p.usedCount, p.expiresAt)
  } catch {}

  // Migrate products from es.json
  try {
    const es = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "es.json"), "utf-8"))
    const prods = es.home?.productCatalog?.products || []
    const insert = d.prepare("INSERT OR IGNORE INTO products (name, category, price, price_before, description, brand, specs, stock, weight, image_url, is_new, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    for (const p of prods) insert.run(p.name, p.category || "", p.price || "", p.priceBefore || "", p.description || "", p.brand || "", p.specs || "", p.stock || 0, p.weight || "", p.imageUrl || "", p.isNew ? 1 : 0, p.featured ? 1 : 0)
  } catch {}

  console.log("✅ Migrated from JSON to SQLite")
}

export function migrateOrdersFromLocalStorage() {
  // This runs on client side - orders are per-user in localStorage
  // For now we keep orders in localStorage until a proper server-side sync is built
  console.log("ℹ️ Orders remain in localStorage for now")
}
