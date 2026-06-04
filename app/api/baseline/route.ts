import { NextRequest, NextResponse } from 'next/server'
import { calculateBaseline } from '@/lib/destiny'
import { getLifeHexagram } from '@/lib/iching'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { year, month, day, hour } = body

    if (!year || !month || !day) {
      return NextResponse.json({ error: 'Missing birth information' }, { status: 400 })
    }

    const hexagram = getLifeHexagram(year, month, day, hour || 12)
    const baseline = calculateBaseline(year, month, day, hexagram)

    return NextResponse.json({ ...baseline, hexagram })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to calculate baseline' }, { status: 500 })
  }
}
