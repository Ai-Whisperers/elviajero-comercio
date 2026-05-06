import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@ai-whisperers/auth/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const email = form.get('email')?.toString()
    if (!email) return NextResponse.redirect(new URL('/?subscribe=error', req.url))

    const supabase = await createClient()
    await supabase.from('subscribers').upsert({ email }, { onConflict: 'email' })

    return NextResponse.redirect(new URL('/?subscribe=success', req.url))
  } catch {
    return NextResponse.redirect(new URL('/?subscribe=error', req.url))
  }
}
