# AUDIT: Code Quality & Architecture (Items 600-699)

> TypeScript usage, component design, error handling, data flow, build configuration.
> Status: 🟡 Functional but messy. `any` casts everywhere, no error boundaries, duplicate content.

## 600-609: TypeScript Quality

- [ ] 600 EVERY page uses `const c = content as any` — defeats TypeScript
- [ ] 601 Create proper type definitions for content/es.json structure
- [ ] 602 Create CartItem type exists in lib/cart-context.tsx ✅
- [ ] 603 Type `any` also used in map functions: `(f: any, i: number) =>`
- [ ] 604 Replace all `as any` with proper typed interfaces
- [ ] 605 Functions like parseGs are duplicated across components (page.tsx, tienda.tsx, modal)
- [ ] 606 Extract parseGs into shared utility in lib/
- [ ] 607 Create `lib/types.ts` with all content schema types
- [ ] 608 Create `lib/content.ts` with typed content accessor functions
- [ ] 609 No tsconfig strict mode violations — check `strict: true`

## 610-619: Component Architecture

- [ ] 610 page.tsx is 200+ lines — too large for a single component
- [ ] 611 Extract HeroSection into components/hero-section.tsx
- [ ] 612 Extract StatsCounter into components/stats-counter.tsx
- [ ] 613 Extract FeaturesGrid into components/features-grid.tsx
- [ ] 614 Extract TestimonialsSection into components/testimonials-section.tsx
- [ ] 615 Extract NewsletterForm into components/newsletter-form.tsx
- [ ] 616 Extract CtaBanner into components/cta-banner.tsx
- [ ] 617 Extract SeasonalOffersGrid into components/seasonal-offers.tsx
- [ ] 618 WhatsAppFloat is duplicated in page.tsx AND has its own component file
- [ ] 619 Remove the WhatsAppFloat function from page.tsx — use the component

## 620-629: State Management

- [ ] 620 Cart state uses React Context — adequate for current needs ✅
- [ ] 621 Cart context has redundant `loaded` flag — simplify
- [ ] 622 No error handling for localStorage (quota exceeded, private browsing)
- [ ] 623 Cart items array can grow unbounded — add max item limit
- [ ] 624 No cart total maximum check (someone adding 999 items)
- [ ] 625 Auth state uses localStorage directly — should use context
- [ ] 626 No auth state persistence across pages (page reload loses session?)
- [ ] 627 Create AuthContext to wrap session management
- [ ] 628 No loading state in auth pages (immediate redirect)
- [ ] 629 No error boundaries anywhere — any crash breaks the whole page

## 630-639: Data Duplication

- [ ] 630 Product catalog is DUPLICATED in home.productCatalog AND productos.productCatalog
- [ ] 631 Both copies must be kept in sync — high maintenance burden
- [ ] 632 Home product catalog has imageUrl + priceBefore, productos copy doesn't
- [ ] 633 Productos copy has shorter descriptions — inconsistent
- [ ] 634 Solution: keep one source of truth, reference from both
- [ ] 635 Home page imports from home.productCatalog — tienda page also imports from same
- [ ] 636 productos/page.tsx only uses categories from home.productCatalog — inconsistent
- [ ] 637 Footer address hardcoded in content AND in footer.tsx — redundant
- [ ] 638 Contact info duplicated across home.contact, contacto.info, and footer
- [ ] 639 WhatsApp number appears in 7 different places in content/es.json

## 640-649: Routing & Pages

- [ ] 640 next.config.ts redirect `/s/:path*` to `/` — breaks all PAB integration paths
- [ ] 641 app/blog/[slug]/page.tsx uses `params: Promise<{ slug: string }>` — correct Next 15 pattern ✅
- [ ] 642 but `export default async function BlogPost` is correct ✅
- [ ] 643 app/sitemap.ts uses `base = "https://viajero.paragu-ai.com"` — WRONG DOMAIN
- [ ] 644 Change to `https://el-viajero.paragu-ai.com`
- [ ] 645 /productos page only shows category cards — thin content
- [ ] 646 /productos could be merged or redirected to /tienda#category
- [ ] 647 /privacidad and /terminos have no sidebar navigation
- [ ] 648 404 page is styled correctly ✅ but no back button keyboard support
- [ ] 649 404 page doesn't include Header/Footer

## 650-659: Build & Configuration

- [ ] 650 Dockerfile HEALTHCHECK uses wget — should check actual health endpoint
- [ ] 651 Dockerfile `output: 'standalone'` — correct ✅
- [ ] 652 Next config `images.unoptimized: true` — images won't be optimized
- [ ] 653 Should remove `unoptimized` once images are hosted on CDN
- [ ] 654 No build-time environment variables defined
- [ ] 655 No lint-staged or pre-commit hooks configured
- [ ] 656 tsconfig doesn't have baseUrl configured for @/ imports
- [ ] 657 postcss.config.mjs uses @tailwindcss/postcss — correct for Tailwind 4 ✅
- [ ] 658 tailwindcss v4 has breaking changes from v3 — verify no v3 patterns
- [ ] 659 No `npm run typecheck` script (only `npm run build`)

## 660-669: Error Handling

- [ ] 660 No error boundaries at page level
- [ ] 661 Content import `content as any` means missing fields return undefined silently
- [ ] 662 Product page crashes if `c.home?.productCatalog?.products` is undefined
- [ ] 663 Features section crashes if `h.features?.items` is undefined
- [ ] 664 Testimonials section has fallback ✅ (`h.testimonials || []`)
- [ ] 665 But many fields lack optional chaining: `c.navigation.ctaHref` (no fallback)
- [ ] 666 Cart localStorage JSON.parse() wrapped in try/catch ✅
- [ ] 667 Auth localStorage read/write not wrapped in try/catch
- [ ] 668 No Sentry or error monitoring
- [ ] 669 No 500 error page (only 404)

## 670-679: CSS & Styling

- [ ] 670 globals.css uses `@import "tailwindcss"` — correct for TW4 ✅
- [ ] 671 Theme variables use `--color-*` prefix — TW4 convention ✅
- [ ] 672 But some inline styles use `var(--color-primary)` instead of Tailwind classes
- [ ] 673 Hero section has inline style: `style={{backgroundColor: "var(--color-primary)"}}`
- [ ] 674 CTA banner has inline gradient — should be theme variable
- [ ] 675 No CSS custom properties for spacing, border-radius, shadows
- [ ] 676 Accent color in tokens.json is #E65100 (orange) but globals.css is #1565C0 (blue) — MISMATCH
- [ ] 677 Fix tokens.json accent to match globals.css
- [ ] 678 No dark mode media query (site is light-only)
- [ ] 679 No print stylesheet

## 680-689: Dependencies

- [ ] 680 framer-motion is installed but NOT USED anywhere
- [ ] 681 lucide-react is installed but NOT USED — using inline SVGs instead
- [ ] 682 tailwind-merge is installed but NOT USED
- [ ] 683 clsx is installed but NOT USED
- [ ] 684 Remove unused dependencies or actually use them
- [ ] 685 Add @tailwindcss/typography for prose classes on legal pages (currently manual)
- [ ] 686 Add zod for content validation at build time
- [ ] 687 Add dotenv for environment variables
- [ ] 688 Add prettier for consistent formatting
- [ ] 689 Add eslint with next config for code quality

## 690-699: Developer Experience

- [ ] 690 No `dev` script instructions in README
- [ ] 691 No `.env.example` file
- [ ] 692 No `.nvmrc` for Node version
- [ ] 693 No Docker Compose for local development
- [ ] 694 No Makefile or task runner
- [ ] 695 CLAUDE.md exists but minimal (2 lines)
- [ ] 696 No CONTRIBUTING.md or development guide
- [ ] 697 No test files exist at all
- [ ] 698 No staging environment configured
- [ ] 699 No CI/CD pipeline (GitHub Actions)
