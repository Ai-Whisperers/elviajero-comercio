# El Viajero - Architecture Refactor Plan

**Goals:**
1. Auto WebP conversion for user uploads
2. Remove all JSON data files - use Supabase only
3. All data editing through admin pages (write to Supabase)

---

## 1. AUTO WEBP CONVERSION FOR USER UPLOADS

### Current State
- Admin has image upload (`ImageUpload` component)
- Uploads go to Supabase storage bucket (`ej_product_images`)
- Images are stored as-is (no optimization)

### Solution: Add sharp.js for on-the-fly WebP conversion

#### Option A: Backend API Route (RECOMMENDED)
Create `/app/api/optimize-image/route.ts` that:
1. Accepts image upload (multipart/form-data)
2. Downloads from Supabase Storage
3. Processes with sharp: resize to max-width 800px, convert to WebP, quality 80
4. Uploads optimized version back to Supabase
5. Returns both URLs (original + optimized)

**Pros:**
- Works for existing images in Supabase
- Admin upload remains simple (just upload, optimization happens automatically)
- Can batch-optimize all existing product images

**Implementation:**
```typescript
// app/api/optimize-image/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { imageUrl } = await req.json()
  if (!imageUrl) return NextResponse.json({ error: "imageUrl required" }, { status: 400 })

  // 1. Download image from Supabase
  const { data: fileData } = await supabase
    .storage
    .from('ej_product_images')
    .download(imageUrl)

  if (!fileData) {
    return NextResponse.json({ error: "Image not found in storage" }, { status: 404 })
  }

  const imageBuffer = Buffer.from(fileData)

  // 2. Optimize with sharp
  const optimized = await sharp(imageBuffer)
    .resize({ width: 800, withoutEnlargement: true }) // Max 800px width
    .webp({ quality: 80 })
    .toBuffer()

  // 3. Upload optimized version
  const filename = `${Date.now()}_optimized.webp`
  const { data: uploadData } = await supabase
    .storage
    .from('ej_product_images')
    .upload(filename, optimized, {
      contentType: 'image/webp',
      upsert: true
    })

  if (!uploadData) {
    return NextResponse.json({ error: "Failed to upload optimized image" }, { status: 500 })
  }

  // 4. Return both URLs
  return NextResponse.json({
    original: imageUrl,
    optimized: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${filename}`
  })
}
```

#### Option B: Client-side optimization
Add `next.config.js` image optimization:
```javascript
// next.config.js
const { withContentlayer } = require("@contentlayer/image-next")

module.exports = withContentlayer({
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
})
```

**RECOMMENDATION:** Use Option A (API route) because:
- We can batch-optimize existing images
- Next.js image optimization requires re-build on config change
- API route gives us control over quality settings
- Can add progressive loading support later

### Files to Modify
1. **Create:** `app/api/optimize-image/route.ts`
2. **Create:** `app/api/batch-optimize-images/route.ts` - optimize all existing product images
3. **Modify:** `components/admin/image-upload.tsx` - add "Auto-optimizar a WebP" toggle
4. **Modify:** `package.json` - add sharp dependency

**Estimated Effort:** 3-4 hours

---

## 2. REMOVE JSON DATA FILES

### Current Problem
```typescript
// components/pages/tienda-content.tsx lines 22-28
import content from "@/content/es.json"
const c = content as any
const s = c.store || {}
const bc = c.breadcrumbs || {}
const cat = c.home?.productCatalog || {}
const cats = c.home?.productCatalog?.categories || []
const staticProducts: StoreProduct[] = cat.products || []

// Line 118
const allProducts = dbProducts.length > 0 ? dbProducts : staticProducts
```

**Issues:**
- Dual data source creates confusion
- Silent fallback means wrong products shown if Supabase has error
- Admin edits go to Supabase, but tienda page reads from JSON
- No error handling when Supabase fails

### Solution: Supabase-Only Architecture

#### Step 1: Remove JSON import from tienda-content.tsx
**File:** `components/pages/tienda-content.tsx`
**Changes:**
```diff
- import content from "@/content/es.json"
- const c = content as any
- const s = c.store || {}
- const bc = c.breadcrumbs || {}
- const cat = c.home?.productCatalog || {}
- const cats = c.home?.productCatalog?.categories || []
- const staticProducts: StoreProduct[] = cat.products || []

- const allProducts = dbProducts.length > 0 ? dbProducts : staticProducts
+ const allProducts = dbProducts
```

**Keep:**
- Category loading from Supabase (already queries `ej_categories` table)
- Store config loading (if still needed)

#### Step 2: Search for other JSON imports
```bash
grep -rn "from.*content/es.json\\|import.*content/es.json\\|require.*content/es.json" /root/elviajero/src --include='*.tsx,*.ts'
```

Expected files to check:
- `app/page.tsx` - homepage stats
- `components/header.tsx` - nav items
- `components/footer.tsx` - footer links
- Any other components using static content

#### Step 3: Deprecate JSON files (keep for backup)
```bash
mkdir -p /root/elviajero/content/deprecated
mv /root/elviajero/content/es.json /root/elviajero/content/deprecated/es.json.backup
mv /root/elviajero/content/gn.json /root/elviajero/content/deprecated/gn.json.backup
mv /root/elviajero/content/en.json /root/elviajero/content/deprecated/en.json.backup
```

**DO NOT DELETE YET** - Keep for backup until Supabase migration is verified working.

#### Step 4: Update admin to write to Supabase only
**Status:** ✅ ALREADY DONE
- Admin API routes (`/api/admin/products`, `/api/admin/categories`, etc.) already write to Supabase
- No changes needed

**Estimated Effort:** 2-3 hours

---

## 3. ALL DATA EDITING THROUGH ADMIN PAGES

### Current State
✅ **ALREADY DONE** - Admin panel already writes to Supabase:
- Products: `/api/admin/products` - CRUD operations on `ej_products` table
- Categories: `/api/admin/categories` - CRUD on `ej_categories` table
- Orders: `/api/admin/orders` - Read status from `ej_orders` table
- Content: Admin content pages edit various config (stored in DB)

### No Changes Needed
Admin is already Supabase-first. After removing JSON imports, all content will flow:
1. User edits in Admin → writes to Supabase
2. Client queries Supabase → displays data
3. No more dual source confusion

---

## EXECUTION PLAN

### Phase 1: WebP Auto-Conversion (3-4h)
1. Add `sharp` dependency to package.json
   ```bash
   cd /root/elviajero
   npm install sharp
   ```
2. Create `app/api/optimize-image/route.ts` with sharp optimization logic
3. Create `app/api/batch-optimize-images/route.ts` to optimize all existing product images
4. Modify `components/admin/image-upload.tsx` to add auto-optimize toggle
5. Test: upload image → verify it converts to WebP

### Phase 2: Remove JSON Imports (2-3h)
1. Search for all JSON imports in codebase
2. Remove from tienda-content.tsx
3. Remove from app/page.tsx (homepage stats)
4. Remove from components/header.tsx, footer.tsx
5. Test: reload tienda page → verify it loads from Supabase only
6. Move JSON files to deprecated folder (backup, don't delete)
7. Deploy and verify live site works

### Phase 3: Verify & Cleanup (1h)
1. Test all pages load correctly with Supabase-only data
2. Verify admin can edit products/categories
3. Check error handling works when Supabase is down
4. Delete deprecated JSON files (after 1 week of stable operation)

---

## FILES TO MODIFY

| File | Change | Priority |
|-------|---------|----------|
| `package.json` | Add `sharp` dependency | P1 |
| `app/api/optimize-image/route.ts` | **CREATE** - Auto WebP conversion | P1 |
| `app/api/batch-optimize-images/route.ts` | **CREATE** - Batch optimize existing | P1 |
| `components/admin/image-upload.tsx` | Add auto-optimize toggle | P1 |
| `components/pages/tienda-content.tsx` | Remove JSON import, remove fallback | P2 |
| `app/page.tsx` | Remove JSON import for stats | P2 |
| `components/header.tsx` | Remove JSON import if exists | P2 |
| Search all src files | Remove any remaining JSON imports | P2 |

---

## BACKUP PLAN

Before deleting JSON files:
```bash
# Backup existing JSON files
mkdir -p /root/elviajero/content/deprecated
cp /root/elviajero/content/*.json /root/elviajero/content/deprecated/

# Keep for 1 week, then delete
find /root/elviajero/content/deprecated -name "*.json" -mtime +7 -delete
```

---

## TESTING CHECKLIST

After deployment:

- [ ] Upload test image → verify WebP URL returned
- [ ] Check batch optimization reduces image sizes
- [ ] Reload tienda page → verify all products load from Supabase
- [ ] Reload homepage → verify stats load from Supabase (or update logic)
- [ ] Navigate to product page → verify metadata displays
- [ ] Add product in admin → verify it appears on tienda
- [ ] Edit product in admin → verify changes reflect on tienda
- [ ] Check admin dashboard stats query `ej_products` table

---

## RISKS & MITIGATION

| Risk | Impact | Mitigation |
|-------|----------|------------|
| Sharp processing on slow VPS | Images take time to optimize | Add loading state, process in background |
| Existing Supabase images unchanged | Old images still large | Batch optimize all existing on deploy |
| Supabase downtime during migration | Site breaks if DB is down | Add proper error handling, show user-friendly message |
| Admin writes to DB but client reads nothing | Race condition if DB slow | Add loading states, optimistic UI updates |

---

## ESTIMATED TOTAL EFFORT

| Phase | Effort |
|--------|---------|
| Phase 1: WebP auto-conversion | 3-4h |
| Phase 2: Remove JSON imports | 2-3h |
| Phase 3: Verify & cleanup | 1h |
| **TOTAL** | **6-8 hours** |

---

*Generated: 2026-05-19*
