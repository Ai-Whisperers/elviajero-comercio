#!/usr/bin/env node

const baseUrl = (process.env.QA_BASE_URL || 'https://tiendaelviajero.com.py').replace(/\/$/, '')
const email = process.env.QA_ADMIN_EMAIL
const password = process.env.QA_ADMIN_PASSWORD
const stamp = Date.now()

function assert(condition, message, details = undefined) {
  if (!condition) {
    const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : ''
    throw new Error(`${message}${suffix}`)
  }
}

async function req(path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, options)
  const text = await res.text()
  let json = null
  try { json = text ? JSON.parse(text) : null } catch {}
  return { res, text, json }
}

async function authed(path, token, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  }
  return req(path, { ...options, headers })
}

function pngFile() {
  // 1x1 transparent PNG
  const bytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=',
    'base64'
  )
  return new Blob([bytes], { type: 'image/png' })
}

async function main() {
  assert(email && password, 'QA_ADMIN_EMAIL and QA_ADMIN_PASSWORD are required')
  const checks = []

  for (const path of ['/', '/tienda', '/login', '/admin/productos']) {
    const { res } = await req(path)
    assert(res.status >= 200 && res.status < 400, `Public/page route failed: ${path}`, { status: res.status })
    checks.push(`${path}: HTTP ${res.status}`)
  }

  const login = await req('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email, password }),
  })
  assert(login.res.ok && login.json?.ok && login.json?.session?.access_token, 'Admin login failed', { status: login.res.status, body: login.json || login.text })
  const token = login.json.session.access_token
  checks.push('admin login: ok')

  const me = await authed('/api/auth', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'me' }),
  })
  assert(me.res.ok && ['admin', 'ventas', 'bodega'].includes(me.json?.user?.role), 'Admin /me failed', { status: me.res.status, body: me.json || me.text })
  checks.push(`admin role: ${me.json.user.role}`)

  const list = await authed('/api/admin/products?page=1&perPage=1', token)
  assert(list.res.ok && Array.isArray(list.json?.data) && list.json.data.length > 0, 'Product list failed', { status: list.res.status, body: list.json || list.text })
  const product = list.json.data[0]
  checks.push(`product list: ${list.json.total} total`)

  const original = {
    description: product.description || '',
    stock: Number(product.stock || 0),
    price: product.price || 'Gs. 0',
  }

  const descValue = `${original.description} [QA ${stamp}]`.trim()
  const desc = await authed('/api/admin/products', token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: product.id, description: descValue }),
  })
  assert(desc.res.ok && desc.json?.data?.description === descValue, 'Description save failed', { status: desc.res.status, body: desc.json || desc.text })
  checks.push('save description: ok')

  const stock = await authed('/api/admin/products', token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: product.id, stock: original.stock + 1 }),
  })
  assert(stock.res.ok && Number(stock.json?.data?.stock) === original.stock + 1, 'Stock save failed', { status: stock.res.status, body: stock.json || stock.text })
  checks.push('save stock: ok')

  const priceNum = parseInt(String(original.price).replace(/\D/g, ''), 10) || 10000
  const newPrice = `Gs. ${(priceNum + 1000).toLocaleString('es-PY')}`
  const price = await authed('/api/admin/products', token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: product.id, price: newPrice }),
  })
  assert(price.res.ok && price.json?.data?.price === newPrice, 'Price save/history failed', { status: price.res.status, body: price.json || price.text })
  checks.push('save price + history: ok')

  const revert = await authed('/api/admin/products', token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: product.id, description: original.description, stock: original.stock, price: original.price }),
  })
  assert(revert.res.ok, 'Product revert failed', { status: revert.res.status, body: revert.json || revert.text })
  checks.push('revert product: ok')

  const createPayload = {
    name: `QA Producto Temporal ${stamp}`,
    category: product.category || 'QA',
    price: 'Gs. 12345',
    stock: 1,
    description: 'Producto temporal generado por QA; debe eliminarse automáticamente.',
  }
  const created = await authed('/api/admin/products', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload),
  })
  assert(created.res.ok && created.json?.id, 'Product create failed', { status: created.res.status, body: created.json || created.text })
  checks.push('create product: ok')

  const deleted = await authed(`/api/admin/products?id=${created.json.id}`, token, { method: 'DELETE' })
  assert(deleted.res.ok, 'Product delete failed', { status: deleted.res.status, body: deleted.json || deleted.text })
  checks.push('delete product: ok')

  const form = new FormData()
  form.append('file', pngFile(), `qa-${stamp}.png`)
  const upload = await req('/api/upload-image', { method: 'POST', body: form })
  assert(upload.res.ok && upload.json?.url?.includes('/storage/v1/object/public/'), 'Image upload failed', { status: upload.res.status, body: upload.json || upload.text })
  checks.push('image upload: ok')

  const shop = await req('/tienda')
  assert(shop.res.ok, 'Shop page failed', { status: shop.res.status })
  assert(shop.text.includes('Comprar por WhatsApp') || shop.text.includes('Checkout por WhatsApp'), 'WhatsApp CTAs missing on shop page')
  checks.push('WhatsApp CTA: ok')

  console.log(JSON.stringify({ ok: true, baseUrl, checks }, null, 2))
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, baseUrl, error: err.message, stack: err.stack }, null, 2))
  process.exit(1)
})
