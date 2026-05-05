# El Viajero — Client profile, brand, and market context

**Purpose:** Single reference for who the client is, what they sell, how they want to sound and look, and how they sit in the Paraguayan outdoor retail market.  
**Audience:** Product, design, content, and engineering working on this repository.  
**Last updated:** 2026-05-05

**Related internal docs:** `docs/source-of-truth.md` (owner answers — highest priority for business facts), `docs/brand-guide.md` (visual/voice for the site), `docs/client-onboarding.md` (launch checklist for missing operational data), `docs/research.md` and `docs/competition-dossier.md` (market and competitor research).

---

## 1. Executive summary

**El Viajero** is a **Paraguayan retail business** focused on **outdoor, camping, fishing, and related gear**, extending into **auto/moto accessories** and **farm/field (campo) tools**. The owner runs a **small, high-touch operation** (documented as solo operator) serving **B2C** customers who value **variety, quality, personal advice, and fast delivery**.

The **digital product** in this repo is a **Next.js storefront** positioned for **WhatsApp-led sales** and **online catalog/checkout**, with **Supabase** for auth and dynamic data, and **Spanish-first** content with optional EN/GN in content files.

**Public web research note:** A quick independent search (2026-05) did not surface a distinct third-party directory profile specifically under the name “El Viajero” for this address; **operational truth should continue to come from the owner and `docs/source-of-truth.md`**, not from search snippets.

---

## 2. Business identity (canonical vs. legacy copy)

Use **`docs/source-of-truth.md`** for **confirmed owner responses**. Older marketing scaffolding (and some research tables) still carry **demo placeholders**; treat those as **non-canonical unless reconciled**.

| Topic | Canonical (owner / source-of-truth) | Also appears in codebase/docs (verify or replace) |
|--------|-------------------------------------|-----------------------------------------------------|
| **Trading name** | El Viajero | Same |
| **Location** | Mariano Roque Alonso — **Coronel Felipe Toledo**, barrio La Concordia; landmark near Mariam Lubricantes | Older research rows used Av. Mariscal López (placeholder) |
| **Founded** | **~2025** (“less than 1 year” as of source-of-truth date) | `brand-guide`/early copy sometimes implied **2018** — treat as **outdated** unless the owner reaffirms |
| **Legal / tax** | RUC: contribuyente general (IVA completo) — details in source-of-truth | — |
| **Team size** | Solo owner | — |
| **Domain intent** | Wants **`tiendaelviajero.com.py`** (no domain at start of engagement per source-of-truth) | Deploy/staging URLs may differ |
| **Email** | Did not exist at questionnaire time; expectation of **domain email** (e.g. info@…) | `brand-guide` lists example `info@tiendaelviajero.com.py` as target |
| **WhatsApp / phone** | Confirmed channel; **exact number “TBD”** in source-of-truth — must match live site/env | Places may still show placeholders or masked digits |
| **Social handles** | Owner indicated active FB/IG/TikTok/YouTube; questionnaire referenced **`@elviajerocomerc.io`** patterns | **`brand-guide`** lists **`@elviajero_py` / `elviajeropy` / TikTok `@elviajero_py`** — **resolve with client** single set of canonical handles |

**Action for the team:** Keep a short “canonical contacts” section in CRM or env docs (not necessarily in git) once the owner confirms WhatsApp and socials.

---

## 3. Offer: categories, inventory, pricing

### 3.1 Category emphasis (by sales volume, per owner)

1. **Camping** — carpas, catres, sillas, colchonetas, bolsas de dormir, linternas, parrillas, machetes, toldos, conservadoras, cocinas a gas, hamacas, ventiladores e inodoros portátiles, etc.
2. **Pesca** — cañas, carretes, señuelos, liñadas, plomadas, flotadores, cajas, redes, chalecos, ropa, GPS/sonar, cámaras sumergibles, sombrillas, sillas playeras, snorkel, etc.
3. **Accesorios personales / outdoor** — mochilas, cuchillos, brújulas, frontales, calzado, cantimploras, binoculares, botiquín, cargo, relojes/GPS, termos, repelentes, defensa personal, etc.
4. **Automóviles** — dashcams, escobillas, GPS, baúles, extintores, eslingas, cinchas, infladores 12V.
5. **Motos** — cascos, cámaras de acción, guantes, GPS antirrobo.
6. **Campo / granja** — herramientas agrícolas, bebederos, comederos, semillas.

### 3.2 Scale and sourcing

- **SKU count:** Owner estimate **50–200** products; many with photos (source-of-truth).
- **Origin mix:** Imported, Paraguayan, and regional (Brazil, Argentina, Chile).
- **Warranties:** Yes where customary (especially electronics), product-dependent.

### 3.3 Pricing and promotions

- **Fixed ticket prices** (label price).
- **Average ticket** highly variable: roughly **₲50k–₲150k** up to **₲1M+** (source-of-truth).
- **Merchandising goals:** Show **“precio anterior” + “precio hoy”**, **seasonal offers**, and **gift combos** (owner requirements in source-of-truth).

---

## 4. Customers and positioning

### 4.1 Target segments (owner)

- Men and women **18–30** and **30–50**
- **Families**
- **Older adults (50+)**
- **Tourists / foreigners**

### 4.2 Why customers choose them (owner)

- **Variety** (one-stop)
- **Quality**
- **Service and word of mouth**
- **Fast delivery**

### 4.3 Competitors (owner-named)

1. **El Mohicano** — [elmohicano.com.py](https://www.elmohicano.com.py/)
2. **Shark Black Paraguay** — [sharkblack.com.py](https://sharkblack.com.py/)

### 4.4 Differentiation (owner)

- **Better variety / surplus**
- **Better attention and advice**
- **Fast delivery**

**No B2B** focus at questionnaire time — **B2C only**.

---

## 5. Operations: hours, delivery, payments

### 5.1 Hours

- **Lunes–domingo open**; **continuous hours (no siesta)** — specific clock times **TBD** with owner (`docs/client-onboarding.md` has a grid for this).
- Fix any legacy copy that implied **closed Sundays** (called out in source-of-truth).

### 5.2 Delivery

- **Own delivery** in city.
- **National shipping** via **encomiendas**; **cost by distance / fixed tariff**; coverage **Paraguay-wide** (source-of-truth).

### 5.3 Payments

**Accepted in person / common channels (owner):**

- Cash **Gs / USD**
- Bank transfer, account deposit
- **Bancard** / credit in store
- Debit card
- **Tigo Money**

**Desired digitally:**

- Card payments via **payment gateway**
- **Cart + online payment + login/registration**, while keeping **WhatsApp** as a consultation and order channel (dual path).

**Financing:** Not at launch; installments possible later.

---

## 6. Brand: essence, voice, and visual system

### 6.1 Brand essence (owner questionnaire)

- Connection to **nature / open air** — adventure, exploration.
- Desired **tone:** **aventurero / inspirador** (e.g. “descubrí nuevos horizontes…”).
- **Visual style preference (owner):** **rústico / natural** — earth tones, organic textures.
- **Color ideas from owner:** nature **green**, **sky/water blue**, **black/graphite** for a modern rugged feel.

### 6.2 Implemented design system (live product / `docs/brand-guide.md`)

The shipped UI aligns with the **brand guide**, not the full owner palette exploration:

| Token | Hex | Typical use |
|--------|-----|-------------|
| Primary | `#1B5E20` | Buttons, headings, hero |
| Secondary | `#37474F` | Footer / nav tones |
| Accent | `#E65100` | Badges, promos, emphasis |
| Background | `#FAFAFA` | Page |
| Surface | `#FFFFFF` | Cards |
| Body text | `#1A1A2E` | Copy |

**Typography:** **Inter** (headings bold, body regular).

**Imagery:** Product and outdoor lifestyle; implementation has used **quality stock (e.g. Unsplash)** where real SKU photos were not wired — owner wants **real product photography** long term.

### 6.3 Voice & language (site)

- **Practical, friendly, informative** (`brand-guide.md`).
- **Primary Spanish**; **`content/en.json`** and **`content/gn.json`** exist for multilingual UI — align with stakeholder whether Guaraní/English are **marketing-quality** or **minimal**.

### 6.4 Tagline / slogan

- **`brand-guide` tagline:** *“Tu Aventura Empieza Acá.”*
- **Owner** had **no fixed slogan yet** — “develop together” (source-of-truth). Treat the guide tagline as **working brand line** until the client approves a final one.

### 6.5 Logo

- Owner initially **had no logo**; questionnaire expected **co-creation** (`source-of-truth`).
- **Client onboarding** references reviewing **`/images/logo.svg`** on the staging site — confirm final approval and usage rules with the client.

---

## 7. Digital goals and product fit (this repository)

From **`docs/source-of-truth.md`** (owner “must haves”), mapped to the codebase direction:

| Owner requirement | Product direction in repo |
|-------------------|---------------------------|
| Full catalog (photos, prices, categories) | Dynamic catalog + admin; content seeds and Supabase |
| Contact + hours + social | Marketing pages + JSON content; keep hours synced |
| Floating WhatsApp | Implemented pattern site-wide |
| Cart + online card payment + auth | Checkout + Supabase Auth; gateway integration as configured |
| Stock visibility | Admin + product APIs |
| One-click WhatsApp order templates | Content-driven templates (WhatsApp-first) |
| Previous vs current price, seasonal offers, combos | Promos/admin/content features (verify parity with owner expectations) |

**Explicitly “not for now” in old questionnaire:** blog, newsletter, interactive tools, loyalty — **note:** the repo still contains blog/newsletter modules; treat as **optional or cross-sell** unless the client wants them removed or hidden.

**Admin:** Owner intends to **self-manage weekly** with **full access**; interested in **visits, WhatsApp leads, top products** (source-of-truth).

---

## 8. Market landscape (research summary)

**Primary references:** `docs/competition-dossier.md`, `docs/research.md`.

- **Paraguay’s outdoor retail** mixes **specialist camping/pesca shops**, **tactical/hunting overlap**, and **general retailers** (ferretería, Nissei, Lincoln/Tramontina, TUPI, Chacomer, MercadoLibre).
- **Direct-style competitors** named in research include **Camping 44 Outdoors**, **El Mohicano**, **PescaPro**, **Shark Black**, **Chaco Outdoors**, **PC Survival Shop**, **Perfecta SAMI**, **Nativa** (CDE), etc.
- **Pricing and assortment** benchmarks in guaraníes are captured in those docs; use them for **merchandising and promo** strategy, not as claims about El Viajero’s own cost base.

**Caution:** Some tables in research copy used **synthetic storefront fields** (e.g. sample addresses, WhatsApp patterns). **Prefer `source-of-truth.md` + live owner confirmation** for anything customer-facing.

---

## 9. Open items checklist (alignment)

Use this before campaigns or launches:

1. Confirm **canonical WhatsApp** and **canonical social URLs** (handle conflicts between `brand-guide` and `source-of-truth`).
2. Confirm **founded date** for public “story” pages (currently favor **~2025** per owner unless updated).
3. Publish **verified hours** and **delivery tariffs** everywhere (schema.org, footer, WhatsApp templates).
4. Replace **placeholder** imagery with **warehouse/shelf photography** where possible.
5. Confirm **registered domain** and **branded email** go-live (`tiendaelviajero.com.py`).
6. Reconcile **owner color preferences** vs **implemented green/orange** if the client wants strict adherence to blue/graphite naturaleza.

---

*This profile does not replace legal contracts or accounting records. For RUC, contracts, and payment credentials, use client-provided official documents.*
