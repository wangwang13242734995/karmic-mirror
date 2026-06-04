import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const karmaIndex = parseInt(searchParams.get('karmaIndex') || '70')
  const practiceDays = parseInt(searchParams.get('practiceDays') || '0')

  // Simulate drift calculation
  const dimensions = ['career', 'wealth', 'love', 'health', 'mind']
  const drift = dimensions.map(dim => {
    const drift = Math.min(practiceDays * 0.5, 30)
    return {
      dimension: dim,
      originalScore: karmaIndex,
      currentScore: Math.max(karmaIndex - drift, 10),
      drift,
    }
  })

  const currentIndex = Math.round(drift.reduce((s, d) => s + d.currentScore, 0) / drift.length)

  return NextResponse.json({
    previousKarmaIndex: karmaIndex,
    currentKarmaIndex: currentIndex,
    drift,
    summary: `Your karma has shifted from ${karmaIndex} to ${currentIndex}. ${currentIndex < karmaIndex ? 'You are becoming less predictable.' : 'Keep practicing to see change.'}`,
  })
}
