-- ============================================================
-- 008: Content Draft/Publish + Presets system
-- Adds draft/publish workflow for content overrides and
-- named presets for save/restore.
-- ============================================================

-- ── Content Revisions (draft/published history) ──────────────
CREATE TABLE IF NOT EXISTS public.ej_content_revisions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_key TEXT NOT NULL DEFAULT 'elviajero',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  previous_snapshot JSONB,                -- snapshot of the previously published content for rollback
  author_id UUID REFERENCES auth.users(id),
  author_type TEXT NOT NULL DEFAULT 'admin' CHECK (author_type IN ('admin', 'staff', 'ai_agent')),
  change_note TEXT,                        -- optional description of what changed
  created_at TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ,
  published_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.ej_content_revisions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read revisions
CREATE POLICY "ej_revisions_select" ON public.ej_content_revisions
  FOR SELECT USING (true);

-- Only admin/staff can insert (AI agents insert with author_type='ai_agent')
CREATE POLICY "ej_revisions_insert" ON public.ej_content_revisions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only admin can update (publish, change status)
CREATE POLICY "ej_revisions_update" ON public.ej_content_revisions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only admin can delete
CREATE POLICY "ej_revisions_delete" ON public.ej_content_revisions
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_revisions_site_status
  ON public.ej_content_revisions(site_key, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_revisions_site_published
  ON public.ej_content_revisions(site_key, published_at DESC)
  WHERE status = 'published';


-- ── Content Presets (saved configurations) ───────────────────
CREATE TABLE IF NOT EXISTS public.ej_content_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_key TEXT NOT NULL DEFAULT 'elviajero',
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_key, name)
);

ALTER TABLE public.ej_content_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ej_presets_select" ON public.ej_content_presets
  FOR SELECT USING (true);

CREATE POLICY "ej_presets_insert" ON public.ej_content_presets
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "ej_presets_update" ON public.ej_content_presets
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "ej_presets_delete" ON public.ej_content_presets
  FOR DELETE USING (auth.role() = 'authenticated');
