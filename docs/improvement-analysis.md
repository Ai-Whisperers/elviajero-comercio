# El Viajero — Complete Improvement Analysis (400+ Items)

## A. CUSTOMER EXPERIENCE (100 items)

### Homepage & First Impression
1. Hero carousel slides are slow to load (3 background images load simultaneously)
2. No real product photos — all SVG placeholders, kills trust
3. Hero CTA text doesn't change per slide (always "Ver Ofertas")
4. No countdown timers for promotions (urgency)
5. Featured products grid has no "Add to Cart" button — only links to tienda
6. Stats section shows 0s because JSON data is imported at build time with placeholder values
7. No social proof live feed ("Juan from Asuncion just bought a Carpa 4 Personas")
8. Featured testimonials are static — can't add new ones without code change
9. No store hours status indicator ("Abierto ahora / Cerrado")
10. No Google Maps embed with street view, just a basic iframe
11. No "WhatsApp available" indicator with online/offline status
12. Contact info in footer uses placeholder phone numbers
13. No popup for new visitors (welcome offer, newsletter)
14. Exit-intent popup exists but no discount incentive
15. Recently viewed products component exists but uses localStorage only
16. No category hero images — all categories use the first-letter avatar
17. No "Bestsellers" badge on products
18. No "Low Stock" warning badges
19. No "New Arrival" badge animation
20. No wishlist count indicator in header

### Product Browsing
21. Tienda page loads all 34 products at once — no pagination beyond page 1
22. No product filtering by brand (brands exist in JSON but no filter UI)
23. No product filtering by price range
24. No product sorting (price low/high, newest, name)
25. No grid/list view toggle
26. No quick-view modal on hover
27. Products have no SKU visible to customers
28. No product comparison feature (page /comparar exists but is empty)
29. No "Complete the look" or "Frequently bought together" suggestions
30. Bundle deals (Kit Camping Completo) in promo bar but no dedicated bundle UI
31. No category landing pages with rich content
32. Blog posts have no related products linking
33. No stock availability indicator on tienda grid
34. No "Only X left" urgency messaging
35. No back-in-stock notification form on product cards

### Product Detail Page
36. Product images are SVGs — customers can't zoom or see real photos
37. No image gallery with multiple angles
38. No 360-degree product view
39. No video demonstrations of products
40. No size/weight specifications in a clear table
41. No materials/materials care information
42. No warranty information displayed
43. No customer Q&A section ("Preguntas y Respuestas")
44. Review submission requires login — should allow guest reviews with WhatsApp verification
45. No "Verified Purchase" badge on reviews
46. No photo/video upload in reviews
47. Review helpfulness voting ("Le fue util a X personas")
48. No related products section ("Clientes tambien compraron")
49. No "Viewing X people right now" social proof
50. No WhatsApp share button (only generic share)
51. No "Ask about this product" WhatsApp CTA per product
52. Product description is basic text — no rich formatting, bullets, or tables
53. No delivery estimate per product (weight-based?)
54. No installment calculator ("6 cuotas de Gs. X")
55. No save-for-later option in cart

### WhatsApp Integration
56. WhatsApp CTA button always shows same message — no product context
57. No WhatsApp order tracking ("Your order status via WhatsApp")
58. No WhatsApp broadcast for promotions (requires Evolution API)
59. No WhatsApp cart recovery (abandoned cart → WhatsApp reminder)
60. No click-to-WhatsApp ads integration
61. No WhatsApp chat widget with typing indicator
62. No WhatsApp quick replies for shipping/payments
63. No WhatsApp order confirmation with image of products
64. No share-via-WhatsApp button on every page
65. No "Send me the catalog via WhatsApp" button

### Trust & Social Proof
66. No trust badges (secure payment, verified store)
67. No "As seen on Instagram" social feed
68. No customer photos section ("Compartinos tu aventura")
69. No loyalty/rewards program
70. No referral program ("Invita a un amigo y obtene 10% off")
71. No money-back guarantee badge
72. No "Since 2018" timeline/achievement display
73. No real address verification (Google Street View of storefront)
74. No RUC/invoice information for businesses
75. No "Empresa Paraguaya" badge
76. No SSL certificate visual indicator
77. No privacy/GDPR cookie consent needs Paraguay-specific update
78. No "Hecho en Paraguay" product tags when applicable

### Cart & Checkout
79. Cart sidebar exists but no persistent cart across sessions
80. No cart count badge on app icon (PWA)
81. No minimum order amount warning
82. No free shipping threshold progress bar
83. No coupon code entry in cart (code exists but no UI)
84. No cart note/instructions field ("Dejar en porteria")
85. No gift wrapping option
86. No estimated delivery date in cart
87. No multiple address shipping
88. No pickup in store option
89. No scheduled delivery time slots
90. No guest checkout (forces account creation)
91. No one-click checkout for returning customers
92. No order summary before final confirmation
93. No processing fee / handling fee transparency
94. No WhatsApp invoice sharing after checkout
95. No QR payment generation (Bancard QR, Pagopar QR)

### Post-Purchase
96. No order confirmation page with clear next steps
97. No order tracking portal for customers
98. No SMS order updates
99. No return label generation
100. No post-purchase email sequence ("Tips for your new camping gear")

## B. PRODUCT & CATALOG (40 items)

101. Only 34 products — catalog is thin for a real outdoor store
102. Products lack real editorias/description depth
103. No product variants (size, color, etc.) — each variant stored as separate product
104. No product attributes system (material, weight, dimensions as structured data)
105. No related accessories mapping ("Compralo con...")
106. No cross-sell rules engine
107. No seasonal collections (Verano, Invierno, Camping, Pesca)
108. No gift cards / digital products
109. No services (repair, rental, assembly)
110. No condition field (new/used/refurbished)
111. No outlet / clearance section
112. No bulk pricing for B2B
113. No price history chart
114. No manufacturer/brand pages
115. No products are coming from DB (ej_products has 34 seeded) but tienda page still uses static JSON
116. No inventory management with low stock alerts to WhatsApp
117. No barcode/QR code scanning for warehouse
118. No supplier information in admin
119. No cost price tracking (profit margin calculation)
120. No purchase order management
121. No stock transfer between locations
122. No product bundling engine (admin creates bundles with discount)
123. No auto-generated product slugs from names
124. No image alt text management for SEO
125. No product video upload
126. No 3D model support for camping gear (tents setup)
127. No size guide for clothing (if they sell outdoor apparel)
128. No color swatches for products
129. No material composition field
130. No country of origin field
131. No certifications display (ISO, safety ratings)
132. No installation/assembly instructions
133. No manuals download section
134. No product comparison specs table
135. No "You may need" accessories checklist
136. No seasonal availability flag
137. No "Pre-order" / "Coming soon" for new arrivals
138. No rental products (camping gear rental is a huge market in Paraguay)
139. No second-hand / used equipment marketplace
140. No product request form ("No encontraste lo que buscas?")

## C. SEARCH & NAVIGATION (30 items)

141. Search only searches product names — no full-text search on descriptions
142. Search shows max 5 results in autocomplete
143. No search history in autocomplete
144. No popular searches in autocomplete
145. No voice search (growing in LatAm mobile usage)
146. No search filters after results (faceted search)
147. No "No results" suggestions ("Quizas quisiste decir...")
148. No search analytics (what customers search most)
149. No typo tolerance in search
150. Navigation mega menu only works on hover — no click behavior for touch devices
151. No sticky mobile nav with quick access to cart/search/account
152. Navigation items hardcoded in JSON — admin can't update nav
153. No breadcrumbs on any page
154. No "Back to results" button on product page
155. No keyboard navigation support
156. No skip-to-content link for accessibility
157. No labeled landmarks for screen readers
158. No high-contrast mode for accessibility
159. No font size adjustment
160. No mobile bottom navigation bar (standard in LatAm e-commerce)
161. Category grid only shows first letter — no category icons
162. No category description pages (why choose Camping category?)
163. No nested subcategories in sidebar
164. No trending products section
165. No "Recently viewed" clean-all button
166. No "Jump to" links in long pages
167. No anchor links in FAQ (they exist in layout but no smooth scroll)
168. No product page tabs (Description / Specs / Reviews / Q&A)
169. No sticky add-to-cart bar on mobile product page
170. No floating WhatsApp button follows scroll correctly

## D. CHECKOUT & PAYMENTS (40 items)

171. No real payment gateway connected — Pagopar, Bancard, Stripe all in sandbox
172. Pagopar is THE payment method in Paraguay — should be priority #1
173. Bancard is the largest card processor in Paraguay
174. No Mercado Pago integration (huge in LatAm)
175. No QR payment support (Bancard QR, Pagopar QR — everyone in PY uses this)
176. No cash on delivery option (very common in Paraguay)
177. No transferencia bancaria with account details display
178. No installment calculator on product page ("6 cuotas sin interes de Gs. X")
179. No multiple currency pricing (PYG/USD toggle works but no real conversion)
180. No tax calculation (IVA 10% for Paraguay)
181. No invoice generation (factura electronica — SIFEN requirement in PY)
182. No RUC validation on checkout for businesses
183. No credit card form with Brazilian-style installment display
184. No checkout progress indicator (Pasos: 1-Carrito 2-Datos 3-Pago 4-Confirmacion)
185. No saved payment methods for returning customers
186. No one-click buy (tokenized card)
187. No split payment (multiple cards)
188. No payment confirmation via WhatsApp
189. No payment retry on failure with clear instructions
190. No coupon validation with real-time discount display
191. No free shipping threshold indicator ("Faltan Gs. 50.000 para envio gratis")
192. No shipping cost estimation before checkout
193. No address validation against Paraguay's official address database
194. No self-pickup location selector (multiple pickup points)
195. No scheduled delivery date picker
196. No "retencion en origen" for certain products
197. No marketplace/seller split payments
198. No crypto payment option (USDT growing in Paraguay)
199. No Giros/ Western Union integration
200. No payment gateway fallback chain (if Pagopar fails → Bancard → etc.)
201. No webhook handling for payment status updates
202. No payment reconciliation dashboard for admin
203. No recurring payment for subscriptions (if they offer rental or loyalty)
204. No checkout page is server-side — no SSR for checkout
205. No save cart for later feature
206. No cart recovery emails (they have the route but no actual email sending)
207. No Resend API key configured for emails
208. No email templates for order confirmation
209. No automated invoice email with PDF attachment
210. No cart abandonment analytics

## E. SHIPPING & FULFILLMENT (25 items)

211. No shipping rate calculation — all prices are "contact us for shipping"
212. No integration with Paraguayan couriers (Rapid, MAB, FrioGus, etc.)
213. No in-house delivery zone map
214. No shipping calculator based on weight/distance
215. No same-day delivery option for Asuncion metro
216. No scheduled delivery time windows
217. No curbside pickup
218. No multi-warehouse inventory (store + warehouse)
219. No shipping tracking number input in admin
220. No customer tracking portal with map
221. No delivery status WhatsApp notifications
222. No proof of delivery photo collection
223. No delivery fee by zone (Asuncion, Central, Interior)
224. No free shipping threshold management
225. No shipping rules engine (free over X, heavy items extra, etc.)
226. No shipping label generation
227. No packaging slip printing
228. No COD (cash on delivery) settlement tracking
229. No returns management system
230. No reverse logistics (pickup for returns)
231. No warehouse barcode scanning
232. No inventory forecasting
233. No low stock alerts for products near threshold
234. No stock transfer between locations
235. No external logistics API (Rapid, Cargo Plus, etc.)

## F. CUSTOMER ACCOUNT (30 items)

236. Account creation requires email confirmation (Supabase default) — no phone-only option
237. No social login is actually configured (Google/Facebook buttons visible but no OAuth creds set)
238. No passwordless login (magic link, SMS code)
239. No guest checkout — forces registration
240. Account dashboard is basic — no personalization
241. No order history with detailed timeline
242. No saved payment methods
243. No address auto-complete (Paraguayan addresses are complex, no formal street system)
244. No favorite lists with share capability
245. No recently viewed sync across devices
246. No notification preferences (WhatsApp, email, SMS)
247. No newsletter subscription preferences
248. No communication history (WhatsApp messages, emails sent)
249. No returns/refunds status in account
250. No downloadable invoices
251. No warranty registration
252. No credit/store credit balance
253. No loyalty points balance
254. No referral tracking ("Tus amigos referidos")
255. No address book with labels (Casa, Trabajo, Otro)
256. No multiple shipping addresses per order
257. No date of birth collection (for birthday promotions)
258. No size/fit profile (if they sell apparel)
259. No preferred categories/interests
260. No account deletion option (GDPR-style)
261. No data export (download my data)
262. No "Login as customer" for admin support
263. No impersonation for order troubleshooting
264. No API access for customer data
265. No wishlist sharing on social media

## G. ADMIN & OPERATIONS (45 items)

266. Admin login works with Supabase session but no "remember me"
267. Admin sidebar has no collapse toggle
268. No admin dashboard shows real stats (currently 0s)
269. No sales charts by day/week/month
270. No top products report
271. No low stock report
272. No customer acquisition report (new vs returning)
273. No abandoned cart report
274. No revenue by payment method
275. No revenue by shipping zone
276. No best/worst selling categories
277. No order status management needs better UX (dropdown per order is basic)
278. No bulk order status update
279. No order printing (packing slip, invoice)
280. No order notes system for internal team
281. No customer support ticket system
282. No refund/return approval workflow
283. No product image upload in admin works (bucket exists, component written but untested)
284. No bulk price update (percentage increase/decrease)
285. No CSV import with image URLs
286. No category management from admin connects to product creation
287. No promo code usage analytics
288. No scheduled promotions (start/end date auto-activation)
289. No admin activity log
290. No multi-admin support with roles (super admin, editor, warehouse)
291. No staff accounts management
292. No commission tracking for sales staff
293. No WhatsApp integration for admin notifications (new order → WhatsApp)
294. No email notification for new orders
295. No inventory history log
296. No stock adjustment reason tracking
297. No purchase order / restock management
298. No supplier management list
299. No cost price tracking for margin calculation
300. No automatic profit margin calculation
301. No PDF catalog generation for printing
302. No B2B portal for wholesale customers (2300 clients mentioned in Superspuma context)
303. No minimum order quantity per product
304. No volume discount tiers
305. No customer group management (retail, wholesale, VIP)
306. No credit limit management for B2B
307. No admin dark mode toggle (theme selector exists but is basic)
308. No keyboard shortcuts for frequent actions
309. No mobile-responsive admin panel (fixed layout, bad on phones)
310. Admin loading states are absent — no skeleton loaders

## H. SEO & MARKETING (35 items)

311. No GA4 configured — uses placeholder ID
312. No Google Search Console verification
313. No sitemap is not submitted to Google
314. No structured data for products (Product schema, not just Store schema)
315. No structured data for reviews (Review schema)
316. No structured data for breadcrumbs (BreadcrumbList schema)
317. No structured data for FAQ (FAQPage schema on FAQ page)
318. No Open Graph images are SVG — should be PNG/JPG (SVG not supported by WhatsApp/Instagram)
319. No Twitter cards configured (meta tags present but untested)
320. No meta descriptions for individual product pages
321. No product page slugs are generated from names but not unique
322. No canonical URLs
323. No hreflang tags for multi-language
324. No blog is static 6 posts — no blog categories, tags, or search
325. No blog has no author, comments, or sharing
326. No blog has no internal linking to products
327. No Schema.org Article markup on blog posts
328. No newsletter has no automation — manual subscriber list
329. No email marketing integration (can't send campaigns)
330. No social media feed integration (Instagram, TikTok)
331. No "Share to Instagram Stories" direct link
332. No TikTok Shop integration
333. No Facebook Shop / Marketplace listing
334. No Google Merchant Center feed
335. No price comparison site listing (Choiz, MercadoLibre)
336. No retargeting pixel implementation (Meta Pixel placeholder ID)
337. No conversion tracking
338. No UTM parameter tracking in analytics
339. No affiliate/referral program
340. No influencer gifting/collab management
341. No seasonal campaign manager (Black Friday, Cyber Monday, Navidad)
342. No A/B testing capability
343. No page speed optimization for Core Web Vitals
344. No lazy loading for below-fold images (images load eagerly)
345. No preload for critical assets (fonts, hero image)

## I. MOBILE & PERFORMANCE (20 items)

346. Mobile nav hamburger doesn't show login state — shows same icon for both states
347. No mobile bottom navigation bar (standard pattern in LatAm apps)
348. No PWA manifest is configured but no offline support
349. No service worker (the old code tried to register /sw.js but file doesn't exist)
350. No push notifications
351. No "Add to Home Screen" prompt optimization
352. Page load is ~2.5s on 3G — should be under 1.5s for e-commerce
353. Images are SVGs but could be optimized — inline SVGs would be faster
354. No image CDN (Cloudflare Images, Imgix)
355. No font-display: swap for web fonts
356. No critical CSS inlining
357. No JS bundle splitting below route level
358. Third-party scripts (GA4, Meta Pixel) block rendering when present
359. No resource hints (preload, prefetch) for key pages
360. No memo/useMemo for expensive components on product grid
361. No virtual scrolling for large product lists
362. No API response caching strategy
363. No CDN caching rules for static assets
364. No HTTP/2 server push
365. No AMP pages for mobile search

## J. SOCIAL & COMMUNITY (15 items)

366. No Instagram feed integration (has Instagram but no embedded feed)
367. No user-generated content gallery ("Comparti tu aventura El Viajero")
368. No community forum or Facebook group link
369. No loyalty program with points
370. No referral program
371. No "Customer of the month" feature
372. No blog comment system
373. No user polls/votes for next products to stock
374. No contest/giveaway management
375. No influencer collaboration portal
376. No "Compras grupales" (group buying — popular in Paraguay)
377. No live shopping / WhatsApp broadcast groups
378. No TikTok integration for product discovery
379. No "Guia de regalos" (gift guide) for special dates
380. No ambassador program for outdoor enthusiasts

## K. INTERNATIONALIZATION (10 items)

381. Currency toggle doesn't save to server — localStorage only, resets on device clear
382. Language toggle (ES/EN/GN) exists but all content is in ES — EN and GN are empty/incomplete
383. No Guarani language content worth mentioning (just a button)
384. No price formatting per locale (PYG uses different format than USD)
385. No number/date formatting per locale
386. No translated SEO meta tags per language
387. No translated product descriptions
388. No translated blog posts
389. No translated checkout (payment instructions in EN/GN)
390. No multi-currency pricing with real conversion rates

## L. ANALYTICS & INSIGHTS (10 items)

391. No Google Analytics 4 configured
392. No heatmapping (Hotjar, Microsoft Clarity)
393. No session recording for UX analysis
394. No conversion funnel tracking
395. No product performance dashboard (views, adds to cart, purchases)
396. No customer lifetime value calculation
397. No cohort analysis
398. No inventory turnover reports
399. No profit margin dashboards
400. No automated business performance reports (weekly email to owner)

## Useful Repos & References

1. **medusajs/medusa** — Open-source headless commerce. Great reference for payment/shipping architecture
2. **vendure-ecommerce/vendure** — Node.js e-commerce framework with admin UI
3. **saleor/saleor** — Python/GraphQL e-commerce. Reference for product catalog structure
4. **vercel/commerce** — Next.js commerce reference implementation
5. **shopify/hydrogen** — Shopify's headless framework for React
6. **refinedev/refine** — Enterprise admin panel framework (ant-design based)
7. **strapi/strapi** — Headless CMS for content management
8. **payloadcms/payload** — CMS that could power product content
9. **shadcn-ui/ui** — UI components for admin panel modernization
10. **calcom/cal.com** — Scheduling for pickup/delivery appointments
11. **typeform/typeform** — Customer feedback and surveys
12. **n8n-io/n8n** — Workflow automation (WhatsApp notifications, email sequences)
13. **ChatGPTNextWeb/ChatGPT-Next-Web** — WhatsApp customer service AI integration
14. **EvolutionAPI/evolution-api** — WhatsApp API (already installed on VPS)
15. **alibaba/kiwi** — Full-stack e-commerce framework
16. **paragu-ai-builder** — Our own multi-tenant builder, references for payment/storage patterns
