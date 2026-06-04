import { NextRequest, NextResponse } from 'next/server'
import { createClientSupabase } from '@/lib/supabase'

// GET /api/community?limit=20&offset=0
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createClientSupabase()
    const { data, error, count } = await supabase
      .from('reflections')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count, offset, limit })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 })
  }
}

// POST /api/community
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, date, dayNumber, hexagramId, questionNumber, answer } = body

    if (!userId || !date || !dayNumber || questionNumber == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClientSupabase()
    const { data, error } = await supabase
      .from('reflections')
      .upsert(
        { user_id: userId, date, day_number: dayNumber, hexagram_id: hexagramId || 0, question_number: questionNumber, answer: answer || '' },
        { onConflict: 'user_id, date' }
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
