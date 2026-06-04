'use client'

import { useState, useEffect, useMemo } from 'react'
import type { PracticeSession, DailyAssessment, MonthlyFeedback } from '@/lib/practice'

export interface DashboardData {
  history: PracticeSession[]
  practiceDay: number
  todayAssessment: DailyAssessment | null | undefined
  todaySession: PracticeSession | null
  streak: { current: number; longest: number; totalCompleted: number; totalSessions: number }
  sevenDayScores: { date: string; total: number; body: number; speech: number; mind: number }[]
  monthlyFeedback: MonthlyFeedback | null
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

function channelSum(scores: DailyAssessment['scores'], channel: 'body' | 'speech' | 'mind'): number {
  const dims = ['generosity', 'discipline', 'patience', 'diligence', 'concentration', 'wisdom'] as const
  return dims.reduce((sum, d) => sum + scores[d][channel], 0)
}

function totalSum(scores: DailyAssessment['scores']): number {
  let total = 0
  const dims = ['generosity', 'discipline', 'patience', 'diligence', 'concentration', 'wisdom'] as const
  for (const d of dims) {
    total += scores[d].body + scores[d].speech + scores[d].mind
  }
  return total
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    history: [],
    practiceDay: 1,
    todayAssessment: undefined,
    todaySession: null,
    streak: { current: 0, longest: 0, totalCompleted: 0, totalSessions: 0 },
    sevenDayScores: [],
    monthlyFeedback: null,
  })

  useEffect(() => {
    const history: PracticeSession[] = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    const practiceDay = parseInt(sessionStorage.getItem('karmic_practice_day') || '1')
    const today = getTodayStr()

    // Today's assessment
    const todaySession = history.find((s: PracticeSession) => s.date === today) || null
    const todayAssessment = todaySession?.assessment

    // Streak
    const completed = history.filter((s: PracticeSession) => s.completed === true)
    let current = 0
    let longest = 0
    let temp = 0
    const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].completed === true) { temp++; if (temp > longest) longest = temp }
      else { if (i === 0) current = temp; temp = 0 }
    }
    if (sorted.length > 0 && sorted[0].completed === true && current === 0) current = temp

    // 7-day scores
    const sevenDayScores: DashboardData['sevenDayScores'] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      const session = history.find((s: PracticeSession) => s.date === ds)
      if (session?.assessment?.scores) {
        sevenDayScores.push({
          date: ds,
          total: totalSum(session.assessment.scores),
          body: channelSum(session.assessment.scores, 'body'),
          speech: channelSum(session.assessment.scores, 'speech'),
          mind: channelSum(session.assessment.scores, 'mind'),
        })
      }
    }

    // Monthly feedback
    const monthKey = today.slice(0, 7) // "2026-06"
    const stored = sessionStorage.getItem(`karmic_feedback_${monthKey}`)
    const monthlyFeedback: MonthlyFeedback | null = stored ? JSON.parse(stored) : null

    setData({
      history,
      practiceDay,
      todayAssessment,
      todaySession,
      streak: { current, longest, totalCompleted: completed.length, totalSessions: history.length },
      sevenDayScores,
      monthlyFeedback,
    })
  }, [])

  return data
}

export const DIMENSIONS = ['generosity', 'discipline', 'patience', 'diligence', 'concentration', 'wisdom'] as const
export type DimensionKey = (typeof DIMENSIONS)[number]

export function dimAvg(scores: DailyAssessment['scores'], dim: DimensionKey): number {
  return Math.round(((scores[dim].body + scores[dim].speech + scores[dim].mind) / 3) * 10) / 10
}

export { channelSum, totalSum }
