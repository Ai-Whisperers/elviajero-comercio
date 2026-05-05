# El Viajero — User Lifecycle Flows Implementation Plan

## Current State
- Registration: captures name, email, phone (stored in profiles table via Supabase Auth metadata)
- Login: email/password, Google, Facebook
- Profile: phone displayed, can edit name/phone (via update-profile API)
- Addresses: full CRUD via `/api/addresses`, page at `/mi-cuenta/direcciones`
- Checkout: saves to ej_orders, redirects to WhatsApp or checkout API
- Cart recovery: basic API endpoint exists (`/api/cart-recovery`) — saves to abandoned_carts
- WhatsApp notifications: `lib/whatsapp.ts` has `notifyNewOrder()` + `notifyStatusChange()` — points to Evolution API
- No post-purchase flow (review requests, delivery tracking)
- No abandoned cart detection + follow-up
- No review collection after delivery

## Phase A: Registration Data Capture
- [x] Phone captured at signup
- [ ] Address collection wizard after first login
- [ ] Profile edit: phone, name

## Phase B: Order Status WhatsApp Notifications
- [ ] When admin updates order status → WhatsApp to customer
- [ ] Statuses: confirmado, enviado, entregado, cancelado
- [ ] Need customer phone in ej_orders (currently stored in addresses table)

## Phase C: Post-Purchase Flows
- [ ] Review request via WhatsApp 3 days after delivery
- [ ] Delivery tracking link
- [ ] Coupon for next purchase after delivery

## Phase D: Abandoned Cart Recovery
- [ ] Detect cart abandonment (user leaves checkout)
- [ ] Send WhatsApp reminder after 1 hour
- [ ] Send 2nd reminder after 24 hours with discount
- [ ] Mark as recovered when they order
