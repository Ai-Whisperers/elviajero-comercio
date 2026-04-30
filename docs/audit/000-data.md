# AUDIT: Data & Configuration (Items 000-099)

> Core business data, site.json, content/es.json accuracy.
> Status: 🟡 Many fields still have placeholders or are inconsistent.

## 000-009: Business Identity

- [ ] 000 Rename `businessName` from "El Viajero Comercio" to "El Viajero" in content/es.json
- [ ] 001 Rename `siteName` from "El Viajero Comercio" to "El Viajero" in content/es.json
- [ ] 002 Rename `navigation.businessName` from "El Viajero Comercio" to "El Viajero"
- [ ] 003 Update site.json `title` to "El Viajero" (not "El Viajero Comercio")
- [ ] 004 Change `description` in site.json to avoid redundant "Comercio"
- [ ] 005 Fix `site.json` `domain` from null to actual domain once purchased
- [ ] 006 Remove hardcoded "595981234567" placeholder WhatsApp from content/es.json
- [ ] 007 Replace ALL "[PENDIENTE: WhatsApp]" with real WhatsApp Business number
- [ ] 008 Replace ALL "[PENDIENTE: teléfono]" with real phone number
- [ ] 009 Replace ALL "[PENDIENTE: email]" with actual email once domain is set up

## 010-019: Location & Address

- [ ] 010 Verify address "Coronel Felipe Toledo" is complete — needs house number
- [ ] 011 Add cross street / reference to the address string (detrás de Mariam Lubricantes)
- [ ] 012 Fix googleMapsUrl to point to exact pin of the store
- [ ] 013 Add WhatsApp location share link alongside Google Maps
- [ ] 014 Add Waze link as alternative navigation option
- [ ] 015 Add storefront photo to the location data (so contact page shows it)
- [ ] 016 Strip "Asunción" from any remaining SEO descriptions that still mention it
- [ ] 017 Verify "Mariano Roque Alonso" is consistently spelled (no "Mariano Roque" alone)
- [ ] 018 Add "Central" department consistently in all location references
- [ ] 019 Add neighborhood "La Concordia" to the address label in faq

## 020-029: Hours of Operation

- [ ] 020 Replace ALL "[PENDIENTE: horarios]" with real hours in content/es.json
- [ ] 021 Replace ALL "[PENDIENTE: horarios]" with real hours in site.json
- [ ] 022 Add hours to home.contact.hours field
- [ ] 023 Add hours to contacto.info.hours field
- [ ] 024 Add hours to footer.hours field
- [ ] 025 Add hours to faq Q2 answer
- [ ] 026 Verify hours format is consistent across all locations
- [ ] 027 Add holiday schedule / special hours field (feriados)
- [ ] 028 Add "Horario continuado" annotation if they don't close for siesta
- [ ] 029 Consider adding a "Cerrado" display component when current time is outside hours

## 030-039: Contact & Social

- [ ] 030 Replace ALL "[PENDIENTE: @real_instagram]" with real Instagram handle
- [ ] 031 Replace ALL "[PENDIENTE: facebook_page]" with real Facebook page URL
- [ ] 032 Replace ALL "[PENDIENTE: @real_tiktok]" with real TikTok handle
- [ ] 033 Replace ALL "[PENDIENTE: @real_youtube]" with real YouTube channel
- [ ] 034 Add social media icon links in footer (Instagram, FB, TikTok, YouTube)
- [ ] 035 Add social media icon links in header (or header CTA area)
- [ ] 036 Add Instagram embed / feed section on homepage (optional)
- [ ] 037 Add TikTok embed / feed section on homepage (optional)
- [ ] 038 Add WhatsApp Business profile link (wa.me link with correct number)
- [ ] 039 Add WhatsApp click-to-chat CTAs on every product page

## 040-049: Delivery Configuration

- [ ] 040 Set `settings.delivery.freeThresholdGs` to actual free shipping threshold
- [ ] 041 Set `settings.delivery.freeThresholdLabel` with text like "Envío gratis desde Gs. X"
- [ ] 042 Verify delivery zones list includes all correct cities
- [ ] 043 Add specific delivery fee table (Gs. amounts per zone)
- [ ] 044 Add delivery estimate (same day? next day? 24-48h?)
- [ ] 045 Add express delivery option with fee
- [ ] 046 Add pickup instruction text ("Pasá por el local de Lun a Vie...")
- [ ] 047 Add delivery disclaimer for fragile/heavy items
- [ ] 048 Add "encomienda" shipping details for interior deliveries
- [ ] 049 Remove fake "expressAvailable" if they don't offer it

## 050-059: RUC & Legal

- [ ] 050 Add RUC number to site.json (from questionnaire: Contribuyente General)
- [ ] 051 Display RUC in footer (common practice in Paraguay)
- [ ] 052 Display RUC on legal pages
- [ ] 053 Add legal name "El Viajero" (no "Comercio") consistently
- [ ] 054 Add "RUC: 5.618.487-5" if that's the actual number (from questionnaire)
- [ ] 055 Add facturación options text to terminos page
- [ ] 056 Add "medios de pago con factura" section
- [ ] 057 Add "Política de facturación" to terminos page
- [ ] 058 Add "Términos de envío" as separate section (or within terminos)
- [ ] 059 Add "Política de cambios y devoluciones" as standalone section

## 060-069: `content/tokens.json` Accuracy

- [ ] 060 Fix accent color in tokens.json from #E65100 (orange) to #1565C0 (blue)
- [ ] 061 Verify tokens.json palette matches globals.css exactly
- [ ] 062 Add proper color names to palette (currently just hex values)
- [ ] 063 Add color usage documentation (which color is used where)
- [ ] 064 Add dark mode palette (they're light theme only currently)
- [ ] 065 Add font family tokens consistently (Poppins for headings, Inter for body)
- [ ] 066 Add border-radius design token
- [ ] 067 Add spacing/rhythm design tokens
- [ ] 068 Add shadow design tokens
- [ ] 069 Add transition/animation design tokens

## 070-079: `config/images.json` Accuracy

- [ ] 070 Replace ALL Unsplash URLs in images.json with real product images
- [ ] 071 Add storefront photo to images.json
- [ ] 072 Add team/owner photo to images.json
- [ ] 073 Add category hero images (camping, pesca, etc.) to images.json
- [ ] 074 Remove unused `gallery` array in images.json (not wired into any page)
- [ ] 075 Add OG image path to images.json for social sharing
- [ ] 076 Add favicon paths to images.json
- [ ] 077 Add brand logo variants to images.json (full, icon-only, white)
- [ ] 078 Add WhatsApp story / share image to images.json
- [ ] 079 Add delivery packaging / unboxing photo (trust signal)

## 080-089: Config Files Audit

- [ ] 080 Rename "El Viajero Comercio" in ALL config/pages/*.json
- [ ] 081 Remove unused config/pages/reservas.json (not wired into navigation)
- [ ] 082 Remove unused config/pages/equipo.json (not wired into navigation)
- [ ] 083 Remove unused config/pages/blog.json (content is in content/es.json)
- [ ] 084 Verify config/pages/home.json sections match what's actually rendered
- [ ] 085 Remove `config/pages/home.json` `sections` that don't exist (commerce-catalog, gallery)
- [ ] 086 Add `sitemap.xml` reference to robots.txt
- [ ] 087 Add structured data (JSON-LD) for LocalBusiness to site config
- [ ] 088 Add structured data (JSON-LD) for Store to site config
- [ ] 089 Add structured data (JSON-LD) for Product to each product

## 090-099: CRITICAL Client Data Gaps

- [ ] 090 GET real WhatsApp number from client — blocks 12 components
- [ ] 091 GET real phone number from client
- [ ] 092 GET real social handles from client
- [ ] 093 GET real hours of operation from client
- [ ] 094 GET real product photos from client
- [ ] 095 GET real logo/files from client (or confirm generated logo)
- [ ] 096 GET RUC number confirmation (5.618.487-5)
- [ ] 097 GET confirmation on delivery fee structure
- [ ] 098 GET preference for pagopar vs bancard vs both online
- [ ] 099 GET domain purchase timeline (tiendaelviajero.com.py)
