# AUDIT: E-Commerce & Cart (Items 400-499)

> Cart system, checkout flow, payment integration, product data model, order management.
> Status: 🔴 Cart exists but checkout only sends WhatsApp. No real payment integration.

## 400-409: Cart System

- [ ] 400 Cart sidebar opens/closes but has no animation
- [ ] 401 Cart sidebar close button is ✕ unicode — needs proper button styling
- [ ] 402 Cart sidebar max-height is hardcoded inline style (calc(100vh - 200px))
- [ ] 403 Cart sidebar on mobile covers full width — should show partial + backdrop
- [ ] 404 Cart items don't show product category for grouping
- [ ] 405 Cart quantity buttons are too small to tap on mobile
- [ ] 406 Cart item "Eliminar" has no confirmation dialog
- [ ] 407 Cart total formatting doesn't show cents (Gs. format)
- [ ] 408 Cart persistes in localStorage but not synced to any backend
- [ ] 409 Cart doesn't warn when adding same item multiple times (silently increments)

## 410-419: WhatsApp Checkout Flow

- [ ] 410 Cart WhatsApp checkout link has `[PENDIENTE]` phone placeholder — BROKEN
- [ ] 411 Cart checkout message needs product names and quantities clearly formatted
- [ ] 412 Cart checkout message needs total at the bottom (currently ✅)
- [ ] 413 Cart checkout should include payment method options in message
- [ ] 414 Cart checkout should include delivery preference in message
- [ ] 415 Cart checkout should include customer name (prompt before sending)
- [ ] 416 WhatsApp checkout link is always same — no session ID for tracking
- [ ] 417 No UTM parameters on WhatsApp checkout links — can't track conversions
- [ ] 418 No order confirmation after WhatsApp send
- [ ] 419 No order history — user can't see past purchases

## 420-429: Payment Integration (Missing Entirely)

- [ ] 420 NO payment gateway configured — cart only sends WhatsApp message
- [ ] 421 Integrate Pagopar (recommended for Paraguay, supports cuotas)
- [ ] 422 Integrate Bancard (already used in-store, natural extension)
- [ ] 423 Integrate Mercado Pago as alternative
- [ ] 424 Add "Pagar con tarjeta de crédito/débito" button in checkout
- [ ] 425 Add "Pagar con transferencia bancaria" option (manual confirmation)
- [ ] 426 Add "Pagar en efectivo contra entrega" option
- [ ] 427 Add payment status tracking (pending → confirmed → shipped)
- [ ] 428 Add payment confirmation screen (success / failure)
- [ ] 429 Add payment receipt email to customer

## 430-439: Product Data Model

- [ ] 430 Products have no SKU/barcode field for inventory tracking
- [ ] 431 Products have no brand field
- [ ] 432 Products have no weight/dimensions for shipping calculation
- [ ] 433 Products have no stock quantity field
- [ ] 434 Products have no categories hierarchy (only flat category string)
- [ ] 435 Products have no tags (for filtering, search)
- [ ] 436 Products have no variants (size, color, material)
- [ ] 437 Products have no related products
- [ ] 438 Products have no "bestseller" or "new" flags
- [ ] 439 Products have no date added field for sorting by newest

## 440-449: Catalog Features

- [ ] 440 No search bar — users cannot search products
- [ ] 441 No price filter (min-max slider)
- [ ] 442 No category filter on tienda page
- [ ] 443 No sorting (price asc/desc, name, newest)
- [ ] 444 No product quick-view from catalog (modal exists but not wired to click)
- [ ] 445 No "visto recientemente" section
- [ ] 446 No "productos relacionados" at bottom of product view
- [ ] 447 No stock indicator in catalog (what's in stock?)
- [ ] 448 No "comprar ahora" button (only "agregar al carrito")
- [ ] 449 Add "Comprar ahora" → go directly to checkout

## 450-459: Price Display

- [ ] 450 Price format "Gs. 450.000" is correct ✅ but verify period vs comma
- [ ] 451 PriceBefore field exists on 5 products ✅ — add to more
- [ ] 452 PriceBefore should show savings percentage (e.g. "-15%")
- [ ] 453 PriceBefore strikethrough is too subtle — use bigger, redder strike
- [ ] 454 Add USD price alongside Gs. (questionnaire says client accepts both)
- [ ] 455 Add dual currency toggle (Gs/USD) on tienda page
- [ ] 456 Add "Cuotas sin interés" badge where applicable
- [ ] 457 Add bulk pricing (2+ discount)
- [ ] 458 Add "Precio mínimo garantizado" badge
- [ ] 459 Add price history graph (for credibility)

## 460-469: User Accounts

- [ ] 460 Login page works with localStorage — no real backend
- [ ] 461 Register page saves to localStorage — no real backend
- [ ] 462 No password reset flow
- [ ] 463 No "remember me" on login
- [ ] 464 No session expiry or refresh
- [ ] 465 No user profile page (address, phone, preferences)
- [ ] 466 No order history page
- [ ] 467 No wishlist page (config says enabled but not implemented)
- [ ] 468 No address management (shipping address)
- [ ] 469 Migrate auth from localStorage to Supabase Auth or similar

## 470-479: Order Management

- [ ] 470 No order database — WhatsApp orders are untracked
- [ ] 471 No order status page for customers
- [ ] 472 No admin order management dashboard
- [ ] 473 No order confirmation email/SMS
- [ ] 474 No shipping notification to customer
- [ ] 475 No inventory deduction on order
- [ ] 476 No "out of stock" notification for customers (back-in-stock)
- [ ] 477 No abandoned cart recovery (config says enabled but no implementation)
- [ ] 478 No order minimum for free shipping logic (config says freeThresholdGs)
- [ ] 479 No tax calculation (IVA included in Paraguay)

## 480-489: Product Categories

- [ ] 480 Category "Playa y Pesca" has only 2 products — thin
- [ ] 481 Category "Acc. Personales" — "Acc." abbreviation looks unprofessional
- [ ] 482 Rename "Acc. Personales" → "Equipo Personal" or "Accesorios Outdoor"
- [ ] 483 Category "Campo" — rename "Campo y Granja" (matches questionnaire)
- [ ] 484 Category images are missing — each category should have hero image
- [ ] 485 Category page (/productos) just shows category cards with first letter
- [ ] 486 Category cards should show category image + product count
- [ ] 487 Category cards should show preview of 4 product images in grid
- [ ] 488 Add category description (short SEO text per category)
- [ ] 489 Add "Ver todos" link per category on homepage

## 490-499: Future E-Commerce Features

- [ ] 490 Add gift card / gift certificate purchasing
- [ ] 491 Add "combo/kit builder" (user selects items → makes a kit)
- [ ] 492 Add "regalos para" flow (gift finder quiz: presupuesto, persona, ocasión)
- [ ] 493 Add product reviews with photo upload
- [ ] 494 Add Q&A section per product (users ask, owner answers)
- [ ] 495 Add stock alerts (notify me when back in stock)
- [ ] 496 Add product video reviews / unboxing
- [ ] 497 Add loyalty points system (100 points = Gs. 10.000)
- [ ] 498 Add referral program (bring a friend, get Gs. 50.000 off)
- [ ] 499 Add subscription box (seasonal gear box)
