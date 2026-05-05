# Admin Features — What El Viajero's Owner Will Love

Researched from: Shopify Admin, WooCommerce, MercadoLibre, MercadoShops, Pagopar dashboard, Bancard VPOS, SIFEN Paraguay, and LatAm e-commerce operations.

---

## P0 — CRITICAL: Needs are real daily pain points

### 1. New Order WhatsApp Notification
**What:** When a customer places an order, admin gets an instant WhatsApp message with order details.
**Why they'll love it:** Paraguay runs on WhatsApp. Owner checks WhatsApp 50x/day, email 2x/day. Without this, orders sit for hours unnoticed.
**Time:** 2h (Evolution API already on VPS, lib/whatsapp.ts already written)
**Reference:** Evolution API webhook → sendText to admin number

### 2. Order Status WhatsApp to Customer
**What:** When admin changes order status (confirmado → enviado → entregado), customer gets a WhatsApp update.
**Why they'll love it:** Customers constantly message "ya salio mi pedido?". This eliminates those messages. Admin saves 10+ replies/day.
**Time:** 1h (lib/whatsapp.ts notifyStatusChange already written)
**Reference:** Every Paraguayan e-commerce does this

### 3. Low Stock WhatsApp Alert
**What:** When any product stock drops below threshold (e.g., 3 units), admin gets WhatsApp alert.
**Why they'll love it:** Owner runs a physical store + online. Stockouts lose sales. This prevents them.
**Time:** 2h (query ej_products WHERE stock < threshold, cron job)
**Reference:** Shopify low stock alerts

### 4. Packing Slip / Invoice Print
**What:** Button on order detail page that opens a printable packing slip with customer address, items, order notes. Also generates a PDF invoice with RUC data for Paraguayan tax compliance.
**Why they'll love it:** Owner currently writes packing slips by hand or copies from screen to paper. This saves 2-3 minutes per order. With 5-10 orders/day, that's 15-30 minutes daily.
**Time:** 3h
**Reference:** SIFEN Paraguay factura electrónica format

### 5. Abandoned Cart Recovery
**What:** When a customer adds items to cart but doesn't complete checkout within 1 hour, admin can send a WhatsApp reminder. Automated or one-click.
**Why they'll love it:** 70% of carts are abandoned. A WhatsApp reminder recovers 10-20% of those. This is free money.
**Time:** 3h (ej_abandoned_carts table exists, needs cron job + WhatsApp integration)
**Reference:** Shopify abandoned cart recovery

### 6. Dashboard Daily Sales Briefing
**What:** Every morning at 8am, admin receives a WhatsApp message: "Yesterday: Gs. 450,000 in sales, 3 orders. Top product: Carpa 4 Personas. Low stock: Bolsa de Dormir (2 remaining)."
**Why they'll love it:** Owner checks performance daily. A daily briefing means they don't need to log into the admin panel. It's like having a store manager.
**Time:** 2h (cron job → query DB → send WhatsApp)
**Reference:** Shopify daily digest email

---

## P1 — HIGH: Big time savers, daily use

### 7. Bulk Price Update
**What:** Select multiple products → set new price or percentage increase/decrease. E.g., "Increase all Camping products by 10%" or "Set all products with stock > 10 to Gs. 50,000".
**Why they'll love it:** Currently must edit each product individually. For 34 products that's tedious. For 200+ products it's impossible.
**Time:** 3h
**Reference:** WooCommerce bulk edit

### 8. Order Notes System
**What:** Internal notes per order visible to admin team. "Cliente llamó para cambiar dirección", "Enviar con Mensajería Rapid".
**Why they'll love it:** Reduces miscommunication between owner and staff. Currently information lives in WhatsApp chats and gets lost.
**Time:** 2h (add note column to ej_orders, simple UI)
**Reference:** Shopify order notes

### 9. Stock Movement Log
**What:** Every stock change logged with timestamp and reason: "Initial stock (seeded)", "Order ORD-A1B2C3 reduced stock by 2", "Manual adjustment by admin".
**Why they'll love it:** When inventory doesn't match physical count, admin can see exactly what happened and when.
**Time:** 3h (ej_stock_movements table + trigger on ej_orders insert)
**Reference:** Any POS system inventory log

### 10. Quick Product Duplicate
**What:** "Duplicate product" button that copies all fields. Admin just changes the name and price.
**Why they'll love it:** Products are similar (e.g., different sizes of same tent). Creating from scratch each time is slow.
**Time:** 1h
**Reference:** Shopify duplicate product

### 11. Sales by Period with Export
**What:** Dashboard date range picker, shows revenue by day/week/month, export to CSV/PDF. Compare periods (this month vs last month).
**Why they'll love it:** Admin needs to know "how did we do this month?" for taxes, planning, and motivation. Currently 0s on dashboard.
**Time:** 3h
**Reference:** WooCommerce analytics

### 12. Top Products Report
**What:** List of products sorted by units sold, revenue generated, with date range filter.
**Why they'll love it:** Answers "what should I restock?" and "what should I promote?". Data-driven decisions instead of gut feel.
**Time:** 2h
**Reference:** Shopify analytics

### 13. Customer Order History Per User
**What:** Click customer name → see all their orders, total spent, favorite categories, last order date.
**Why they'll love it:** When customer calls "I need the same as last time", admin can instantly see their history and re-order.
**Time:** 3h
**Reference:** Any CRM

### 14. Quick Order Search
**What:** Search bar in orders page that searches by order ID, customer name, phone number, or product name.
**Why they'll love it:** Customer messages "che, mi pedido #ORD-..." — admin needs to find it in seconds, not scroll.
**Time:** 2h
**Reference:** Any admin panel search

---

## P2 — MEDIUM: Nice to have, weekly use

### 15. Dashboard Real-Time Updates
**What:** Dashboard auto-refreshes every 30 seconds (or via WebSocket) without page reload. Shows new orders as they come in.
**Why they'll love it:** Owner leaves dashboard open on a tablet in the store. New orders appear instantly.
**Time:** 2h (useEffect with setInterval or Supabase realtime subscriptions)
**Reference:** Shopify dashboard

### 16. B2B Customer Self-Service Portal
**What:** Wholesale customers log in with their B2B account → see their custom pricing, place orders, view credit limit, download invoices.
**Why they'll love it:** Currently all B2B orders go through WhatsApp. Owner spends hours/day responding to wholesale customers. Self-service eliminates this.
**Time:** 8-10h
**Reference:** Any B2B e-commerce portal

### 17. Product Badge Manager
**What:** Admin can add badges to products: "NUEVO", "OFERTA", "MÁS VENDIDO", "ENVÍO GRATIS". Badges appear on product cards.
**Why they'll love it:** Merchandising drives sales. Owner wants to highlight specific products without editing JSON.
**Time:** 2h
**Reference:** Shopify badges

### 18. Category Landing Page Builder
**What:** Simple editor for category pages: add banner image, description, SEO meta tags for each category (Camping, Pesca, etc.).
**Why they'll love it:** Category pages are content-less currently (just first-letter icons). Rich category pages improve SEO and conversion.
**Time:** 4h
**Reference:** Shopify collection pages

### 19. Coupon Code Usage Stats
**What:** See how many times each promo code was used, total discount given, revenue from promo orders.
**Why they'll love it:** Owner runs promotions but has no idea if they work. This tells them ROI of each promo.
**Time:** 2h
**Reference:** WooCommerce coupon reports

### 20. Product Image Bulk Upload
**What:** Drag-and-drop multiple images → auto-assign to products by matching filename to product name/SKU.
**Why they'll love it:** Currently must upload one image per product. With 34 products and 1-3 images each, that's 34-102 individual uploads.
**Time:** 3h
**Reference:** Shopify bulk image upload

### 21. Supplier / Purchase Order Management
**What:** List of suppliers per product, create purchase orders when stock is low, track incoming stock.
**Why they'll love it:** Owner buys from multiple suppliers. Currently tracks orders in WhatsApp/notebook. This digitizes procurement.
**Time:** 5h
**Reference:** TradeGecko / Zoho Inventory

### 22. Activity Log (Audit Trail)
**What:** Log of all admin actions: who changed what, when. "Admin updated price of Carpa 4 Personas from Gs. 450,000 to Gs. 400,000 on 2026-05-01 14:32."
**Why they'll love it:** When something goes wrong ("who changed this price?"), admin can find the culprit.
**Time:** 3h (ej_audit_log table + middleware on all admin actions)
**Reference:** Shopify activity log

### 23. Multi-Store Inventory View
**What:** If they have physical store + warehouse + online, show stock levels at each location.
**Why they'll love it:** Owner sells from physical store AND online. Online shows stock=5 but physical store just sold 3. Without this, they oversell.
**Time:** 4h

---

## P3 — LOW: Cool features, occasional use

### 24. One-Click Order Fulfillment
**What:** Button that marks order as "enviado", sends WhatsApp to customer with tracking link, reduces stock, logs the action. All in one click.
**Why they'll love it:** Currently 4-5 manual steps per fulfillment. This makes it one click.
**Time:** 4h

### 25. Automated Invoice (Factura Electrónica SIFEN)
**What:** Generate SIFEN-compliant electronic invoice for every sale (required in Paraguay for businesses with RUC).
**Why they'll love it:** If the business is registered in Paraguay, SIFEN invoices are legally required. Automating this saves hours/month.
**Time:** 8-10h (needs SIFen API integration)
**Reference:** SIFEN Paraguay

### 26. WhatsApp Chat Inbox in Admin
**What:** Admin sees WhatsApp conversations from customers directly in the admin panel. Reply without switching to WhatsApp.
**Why they'll love it:** Owner manages sales + support from one screen instead of switching between admin and WhatsApp.
**Time:** 8-10h (needs Evolution API webhook → admin UI)
**Reference:** Evolution API webhook events

### 27. Customer Tags & Segmentation
**What:** Tag customers as "wholesale", "VIP", "frequent", "new". Filter orders by tag. Send targeted promos.
**Why they'll love it:** "Send 10% off to customers who haven't bought in 3 months" — targeted marketing without manual list management.
**Time:** 4h
**Reference:** Shopify customer tags

### 28. Automated Promo Campaigns
**What:** Schedule promotions in advance: "15% off Camping category from June 1-15". Auto-activates and deactivates.
**Why they'll love it:** Owner can set up next month's promos in 30 minutes instead of remembering to toggle them manually.
**Time:** 4h

### 29. Product Views Analytics
**What:** Track how many times each product page was viewed. Show "most viewed" in admin dashboard.
**Why they'll love it:** Answers "which products should I feature?" and "why is X product not selling despite lots of views?"
**Time:** 3h (simple page view counter or Google Analytics API)

### 30. WhatsApp Broadcast Tool
**What:** Select customer segment → compose message → send bulk WhatsApp to all selected customers.
**Why they'll love it:** "New camping gear arrived!" sent to all Camping category buyers. Direct marketing with zero cost.
**Time:** 5h
**Reference:** WhatsApp Business broadcast

### 31. Returns & Refunds Management
**What:** Customer requests return → admin approves → generates return label → tracks returned item → processes refund.
**Why they'll love it:** Returns are messy. This provides a clear workflow for both customer and staff.
**Time:** 5h

### 32. Gift Card Support
**What:** Admin creates/sells gift cards. Customers redeem at checkout.
**Why they'll love it:** Gift cards = free money upfront. Customers buy them for birthdays/holidays. Guaranteed returning customer.
**Time:** 4h

### 33. Cash Register Mode (POS)
**What:** Simple point-of-sale mode for the physical store. Click products → enter cash → receipt prints.
**Why they'll love it:** Owner can use the same system for in-store sales instead of a separate POS. Unified inventory.
**Time:** 6-8h

### 34. Excel Inventory Import/Export
**What:** Download current inventory as Excel. Edit prices/stock in Excel. Upload back to update all products.
**Why they'll love it:** Owner manages inventory in Excel. This bridges their existing workflow with the online system.
**Time:** 3h (xlsx library)

### 35. Cost Price & Profit Margin
**What:** Add cost price per product (hidden from customers). Dashboard shows profit margin per product and overall.
**Why they'll love it:** Owner currently calculates margins mentally. This shows exactly how much each sale earns.
**Time:** 2h

### 36. Daily Sales Report Email/WhatsApp
**What:** End-of-day summary sent automatically: total revenue, orders, top product, payment methods breakdown.
**Why they'll love it:** Owner closes the store and wants to know "how did we do today?". No need to open admin.
**Time:** 2h

### 37. Calendar View for Orders
**What:** Orders displayed on a calendar by delivery date. See at a glance how many deliveries each day.
**Why they'll love it:** Owner plans delivery routes. Seeing all deliveries on a calendar helps optimize routes.
**Time:** 3h

### 38. Product Review Moderation
**What:** Reviews require admin approval before appearing on site. Flag suspicious reviews.
**Why they'll love it:** Prevents fake reviews. Maintains trust.
**Time:** 1h

### 39. Shipping Label Generation
**What:** Print shipping label with customer address, return address, order ID. Compatible with Paraguayan couriers.
**Why they'll love it:** No more handwriting addresses on packages.
**Time:** 3h

### 40. Dark Mode for Admin
**What:** Theme toggle (already exists as "Tema" page). Not urgent but nice.
**Why they'll love it:** Already done.
**Time:** 0h ✅

---

## EXECUTION SUMMARY

| Priority | # | Features | Total Hours | Impact |
|----------|---|----------|-------------|--------|
| P0 | 6 | WhatsApp notifications, packing slips, cart recovery, daily briefing | 13h | Saves 1-2 hours/day for owner |
| P1 | 7 | Bulk edit, order notes, stock log, reports, customer history, search | 16h | Makes daily operations smooth |
| P2 | 9 | Real-time dashboard, B2B portal, badges, category pages, promo stats, audit log | 33h | Grows the business |
| P3 | 11 | One-click fulfillment, SIFEN, WhatsApp inbox, tags, campaigns, gift cards, POS | 55h | Advanced features |
| **Total** | **33** | | **~117h** | |

**Top 3 most impactful (start here):**
1. **New Order WhatsApp Notification** (P0, 2h) — order → WhatsApp. Changes how owner operates.
2. **Packing Slip Print** (P0, 3h) — saves 15-30 min/day on order prep.
3. **Abandoned Cart Recovery** (P0, 3h) — recovers 10-20% of lost sales. Free revenue.
