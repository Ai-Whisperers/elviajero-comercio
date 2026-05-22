import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@ai-whisperers/auth/supabase/admin"
import { requireAdmin } from "@/lib/auth"

const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY || "elviajero"
const LIVE_KEY = `content_overrides_${SITE_KEY}`
const DRAFT_KEY = `content_draft_${SITE_KEY}`
const SNAPSHOT_PREFIX = `content_snapshot_${SITE_KEY}_`

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")

  // ── Get draft content ──────────────────────────────────────
  if (action === "draft") {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", DRAFT_KEY)
      .single()
    return NextResponse.json(data?.value ?? null)
  }

  // ── Get live content ───────────────────────────────────────
  if (action === "live") {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", LIVE_KEY)
      .single()
    return NextResponse.json(data?.value ?? {})
  }

  // ── Get status (draft vs live comparison) ──────────────────
  if (action === "status") {
    const supabase = createAdminClient()
    const [draftRes, liveRes] = await Promise.all([
      supabase.from("ej_site_config").select("value").eq("key", DRAFT_KEY).single(),
      supabase.from("ej_site_config").select("value").eq("key", LIVE_KEY).single(),
    ])
    const draft = draftRes.data?.value ?? null
    const live = liveRes.data?.value ?? {}
    const hasDraft = draft !== null
    const draftDiffersFromLive = hasDraft && JSON.stringify(draft) !== JSON.stringify(live)
    return NextResponse.json({
      hasDraft,
      draftDiffersFromLive,
      draftUpdatedAt: null, // could add timestamps later
      liveUpdatedAt: null,
    })
  }

  // ── List snapshots ─────────────────────────────────────────
  if (action === "snapshots") {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("ej_site_config")
      .select("key, value")
      .like("key", `${SNAPSHOT_PREFIX}%`)
      .order("key", { ascending: false })
      .limit(20)
    const snapshots = (data ?? []).map((row: any) => ({
      id: row.key.replace(SNAPSHOT_PREFIX, ""),
      label: row.key.replace(SNAPSHOT_PREFIX, "").replace(/_/g, " "),
      timestamp: row.key.replace(SNAPSHOT_PREFIX, ""),
      content: row.value,
    }))
    return NextResponse.json(snapshots)
  }

  // ── Get a specific snapshot ────────────────────────────────
  if (action === "snapshot") {
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", `${SNAPSHOT_PREFIX}${id}`)
      .single()
    return NextResponse.json(data?.value ?? null)
  }

  return NextResponse.json({ error: "Unknown action. Use: draft, live, status, snapshots, snapshot" }, { status: 400 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body
  const supabase = createAdminClient()

  // ── Save draft (admin or AI can do this) ───────────────────
  if (action === "save-draft") {
    const { content } = body
    if (content === undefined) {
      return NextResponse.json({ error: "content required" }, { status: 400 })
    }
    const { error } = await supabase
      .from("ej_site_config")
      .upsert({ key: DRAFT_KEY, value: content }, { onConflict: "key" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, savedTo: "draft" })
  }

  // ── Publish: copy draft to live, snapshot previous live ────
  if (action === "publish") {
    const { error: authError } = await requireAdmin(req)
    if (authError) return authError

    // Get current draft
    const { data: draftData } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", DRAFT_KEY)
      .single()
    const draft = draftData?.value
    if (!draft) {
      return NextResponse.json({ error: "No draft to publish" }, { status: 400 })
    }

    // Snapshot current live before overwriting
    const { data: liveData } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", LIVE_KEY)
      .single()
    const currentLive = liveData?.value ?? {}

    const snapshotTs = new Date().toISOString().replace(/[:.]/g, "_")
    const snapshotKey = `${SNAPSHOT_PREFIX}${snapshotTs}`
    await supabase
      .from("ej_site_config")
      .upsert({ key: snapshotKey, value: currentLive }, { onConflict: "key" })

    // Publish draft to live
    const { error } = await supabase
      .from("ej_site_config")
      .upsert({ key: LIVE_KEY, value: draft }, { onConflict: "key" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Clear the draft
    await supabase
      .from("ej_site_config")
      .delete()
      .eq("key", DRAFT_KEY)

    return NextResponse.json({ ok: true, published: true, snapshotId: snapshotTs })
  }

  // ── Rollback: restore a snapshot to live ───────────────────
  if (action === "rollback") {
    const { error: authError } = await requireAdmin(req)
    if (authError) return authError

    const { snapshotId } = body
    if (!snapshotId) {
      return NextResponse.json({ error: "snapshotId required" }, { status: 400 })
    }

    const { data: snapData } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", `${SNAPSHOT_PREFIX}${snapshotId}`)
      .single()
    if (!snapData?.value) {
      return NextResponse.json({ error: "Snapshot not found" }, { status: 404 })
    }

    // Snapshot current live before rollback
    const { data: liveData } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", LIVE_KEY)
      .single()
    const currentLive = liveData?.value ?? {}
    const preRollbackTs = new Date().toISOString().replace(/[:.]/g, "_")
    await supabase
      .from("ej_site_config")
      .upsert({ key: `${SNAPSHOT_PREFIX}prerollback_${preRollbackTs}`, value: currentLive }, { onConflict: "key" })

    // Apply snapshot
    const { error } = await supabase
      .from("ej_site_config")
      .upsert({ key: LIVE_KEY, value: snapData.value }, { onConflict: "key" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true, rolledBackTo: snapshotId })
  }

  // ── Save preset ────────────────────────────────────────────
  if (action === "save-preset") {
    const { error: authError } = await requireAdmin(req)
    if (authError) return authError

    const { name, description, content } = body
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })
    if (content === undefined) return NextResponse.json({ error: "content required" }, { status: 400 })

    const presetKey = `preset_${name}_${SITE_KEY}`
    const presetValue = { description: description || "", content, savedAt: new Date().toISOString() }
    const { error } = await supabase
      .from("ej_site_config")
      .upsert({ key: presetKey, value: presetValue }, { onConflict: "key" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, preset: name })
  }

  // ── Load preset (applies to draft) ─────────────────────────
  if (action === "load-preset") {
    const { name } = body
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })

    const presetKey = `preset_${name}_${SITE_KEY}`
    const { data } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", presetKey)
      .single()
    if (!data?.value?.content) {
      return NextResponse.json({ error: "Preset not found" }, { status: 404 })
    }

    // Save preset content as draft
    const { error } = await supabase
      .from("ej_site_config")
      .upsert({ key: DRAFT_KEY, value: data.value.content }, { onConflict: "key" })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, loadedPreset: name, savedTo: "draft" })
  }

  // ── List presets ───────────────────────────────────────────
  if (action === "list-presets") {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from("ej_site_config")
      .select("key, value")
      .like("key", `preset_%_${SITE_KEY}`)
      .order("key")
    const presets = (data ?? []).map((row: any) => ({
      name: row.key.replace(`preset_`, "").replace(`_${SITE_KEY}`, ""),
      description: row.value?.description || "",
      savedAt: row.value?.savedAt || null,
    }))
    return NextResponse.json(presets)
  }

  // ── Delete preset ──────────────────────────────────────────
  if (action === "delete-preset") {
    const { error: authError } = await requireAdmin(req)
    if (authError) return authError

    const { name } = body
    if (!name) return NextResponse.json({ error: "name required" }, { status: 400 })

    const presetKey = `preset_${name}_${SITE_KEY}`
    const { error } = await supabase
      .from("ej_site_config")
      .delete()
      .eq("key", presetKey)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, deleted: name })
  }

  // ── Discard draft ──────────────────────────────────────────
  if (action === "discard-draft") {
    const { error } = await supabase
      .from("ej_site_config")
      .delete()
      .eq("key", DRAFT_KEY)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, discarded: true })
  }

  // ── Reset to defaults (clear all overrides) ────────────────
  if (action === "reset-to-defaults") {
    const { error: authError } = await requireAdmin(req)
    if (authError) return authError

    // Snapshot current live first
    const { data: liveData } = await supabase
      .from("ej_site_config")
      .select("value")
      .eq("key", LIVE_KEY)
      .single()
    const currentLive = liveData?.value ?? {}
    const resetTs = new Date().toISOString().replace(/[:.]/g, "_")
    await supabase
      .from("ej_site_config")
      .upsert({ key: `${SNAPSHOT_PREFIX}prereset_${resetTs}`, value: currentLive }, { onConflict: "key" })

    // Clear live overrides and draft
    await supabase.from("ej_site_config").delete().eq("key", LIVE_KEY)
    await supabase.from("ej_site_config").delete().eq("key", DRAFT_KEY)

    return NextResponse.json({ ok: true, reset: true, snapshotId: `prereset_${resetTs}` })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}
