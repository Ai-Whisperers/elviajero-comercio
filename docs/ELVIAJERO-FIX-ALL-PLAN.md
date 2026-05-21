# El Viajero -- Full Fix & Implementation Plan

> Generated from comprehensive analysis of all client feedback, codebase state, and docs.
> Date: 2026-05-21
> Status: IN PROGRESS

---

## PHASE 1: Critical Fixes (cart, layout, broken features) ~30 min

### 1.1 Move CartSidebar + Header to root layout
- **Problem:** CartSidebar only renders on homepage. Cart icon in Header doesn't work on other pages because `onCartClick` prop is never passed.
- **Fix:** Create a `SiteShell` component that wraps Header + CartSidebar + Footer + CookieConsent + WhatsAppFloat. Use it in root layout so every page gets cart functionality.
- **Files:** NEW `components/site-shell.tsx`, MODIFY `app/layout.tsx`, CLEAN `app/page.tsx`

### 1.2 Fix stats in es.json
- **Problem:** Stats say "200+ Productos" and "+100 Clientes" but only 34 products exist and no customer system is live.
- **Fix:** Set honest values: "35+ Productos", "5 Categorias", "Paraguay", remove fake customer count.
- **Files:** `content/es.json`

### 1.3 Verify kit images exist on disk
- **Problem:** kitsCarousel references images that may not exist.
- **Fix:** Check all kit image paths. Replace missing ones with fallbacks or remove the reference.
- **Files:** `content/es.json`, check `public/images/marketing/`

---

## PHASE 2: WhatsApp Buttons on ALL Product Surfaces ~20 min

### 2.1 Verify product-card.tsx WhatsApp button
- **Status:** Already has WhatsApp button (lines 172-184). VERIFIED WORKING.

### 2.2 Verify product-content.tsx WhatsApp button
- **Status:** Already has "Comprar por WhatsApp" button (lines 462-477). VERIFIED WORKING.

### 2.3 Verify tienda-content.tsx WhatsApp on cards
- **Status:** product-card.tsx is used in tienda, so cards already have WA buttons.
- **Action:** Confirm `whatsapp directo` mention in tienda-content is wired up. Just verify.

---

## PHASE 3: Doc Cleanup & Consistency ~20 min

### 3.1 Standardize client name
- **Problem:** "Osmar" in PITCH and some docs, "Omar" in meeting notes and others.
- **Fix:** Standardize to "Omar" everywhere (meeting notes used Omar, client introduced as Omar).

### 3.2 Update STATUS.md
- **Problem:** Dated May 8, references old URL and commit.
- **Fix:** Rewrite with current state reflecting all implemented features.

### 3.3 Fix founded year in code
- **Problem:** About section may still say "2018" but business started ~2025.
- **Fix:** Check es.json about section, update any "2018" references.

### 3.4 Clean social handles
- **Problem:** Multiple different handle patterns across files.
- **Fix:** Standardize to `@elviajero_py` everywhere. Remove fake `@email.com` references.

### 3.5 Update source-of-truth.md
- **Problem:** Dated April 30, missing May 13 meeting outcomes.
- **Fix:** Add confirmed WhatsApp number, meeting decisions, current domain status.

---

## PHASE 4: Build Verification & Deploy ~15 min

### 4.1 Run typecheck
- **Action:** `npm run typecheck` -- fix any errors

### 4.2 Run tests
- **Action:** `npm run test:ci` -- fix any failures

### 4.3 Run build
- **Action:** `npm run build` -- fix any errors

### 4.4 Commit and push
- **Action:** Commit all changes with descriptive message, push to origin/main

---

## PHASE 5: Missing Features Assessment ~10 min

### 5.1 Document what's still missing (client-blocking)
- Hero images admin-editable (F6) -- NOT DONE
- Bulk product import (F10) -- NOT DONE
- Real product photos (client dependency)
- Payment gateway (client dependency)
- Real blog content (client dependency)

### 5.2 Document what's done but needs verification
- WhatsApp checkout from cart -- component exists, verify flow
- Admin order management -- page exists, verify status transitions
- WhatsApp float button -- exists, verify on all pages
- Search autocomplete -- exists, verify works
- Cookie consent -- exists, verify

---

## ERRORS LOG
| Error | Phase | Resolution |
|-------|-------|------------|
| (tracking during execution) | | |
