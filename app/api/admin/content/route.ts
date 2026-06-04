import { NextRequest, NextResponse } from 'next/server'
import { createClientSupabase } from '@/lib/supabase'

// GET /api/admin/content?key=daily_q1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    const supabase = createClientSupabase()
    let query = supabase.from('admin_content').select('*')

    if (key) {
      query = query.eq('content_key', key)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 })
  }
}

// POST /api/admin/content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, contentZh, contentEn } = body

    if (!key) {
      return NextResponse.json({ error: 'Missing content key' }, { status: 400 })
    }

    const supabase = createClientSupabase()
    const { data, error } = await supabase
      .from('admin_content')
      .upsert(
        { content_key: key, content_zh: contentZh || '', content_en: contentEn || '', updated_at: new Date().toISOString() },
        { onConflict: 'content_key' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 })
  }
}
