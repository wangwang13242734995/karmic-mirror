import { NextRequest, NextResponse } from 'next/server'
import { getDailyHexagram } from '@/lib/iching'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const day = parseInt(searchParams.get('day') || '1')

  const hexagram = getDailyHexagram(date, day)

  return NextResponse.json({
    date,
    dayNumber: day,
    hexagram,
    completed: null,
    reflection: '',
    mood: 3,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { date, dayNumber, hexagramId, completed, reflection, mood } = body

    // In production: save to Supabase
    return NextResponse.json({
      success: true,
      session: { date, dayNumber, hexagramId, completed, reflection, mood },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save practice' }, { status: 500 })
  }
}
