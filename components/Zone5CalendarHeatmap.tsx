'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { DailyAssessment } from '@/lib/practice'
import { DIMENSIONS, type DimensionKey, dimAvg } from './useDashboardData'

interface Props {
  history: { date: string; assessment: DailyAssessment | null | undefined }[]
}

type ColorMode = 'total' | DimensionKey

const MODE_KEYS: { key: ColorMode; labelKey: string }[] = [
  { key: 'total', labelKey: 'byTotal' },
  { key: 'generosity', labelKey: 'byGenerosity' },
  { key: 'discipline', labelKey: 'byDiscipline' },
  { key: 'patience', labelKey: 'byPatience' },
  { key: 'diligence', labelKey: 'byDiligence' },
  { key: 'concentration', labelKey: 'byConcentration' },
  { key: 'wisdom', labelKey: 'byWisdom' },
]

function getScore(a: DailyAssessment, mode: ColorMode): number {
  if (mode === 'total') {
    return Object.values(a.scores).reduce((s, ch) => s + ch.body + ch.speech + ch.mind, 0)
  }
  return Math.round(dimAvg(a.scores, mode) * 3) // scale to roughly 0-15 for color
}

function getColor(score: number, maxScore: number): string {
  if (score === 0) return 'bg-karmic-border/40'
  const ratio = score / maxScore
  if (ratio <= 0.33) return 'bg-green-900/40'
  if (ratio <= 0.66) return 'bg-green-700/50'
  return 'bg-green-500/60'
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Zone5CalendarHeatmap({ history }: Props) {
  const t = useTranslations('dashboard.zone5')
  const [mode, setMode] = useState<ColorMode>('total')

  // Build a map: dateStr -> score
  const scoreMap = useMemo(() => {
    const map: Record<string, number> = {}
    const maxScore = mode === 'total' ? 90 : 15
    for (const h of history) {
      if (h.assessment?.scores) {
        map[h.date] = getScore(h.assessment, mode)
      }
    }
    return map
  }, [history, mode])

  // Generate last 3 months of calendar data
  const weeks = useMemo(() => {
    const today = new Date()
    const startDate = new Date()
    startDate.setMonth(today.getMonth() - 3)

    // Align to Monday
    const dayOfWeek = startDate.getDay()
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Monday = 0
    startDate.setDate(startDate.getDate() - offset)

    const result: { date: string; score: number }[][] = []
    let currentWeek: { date: string; score: number }[] = []
    const cursor = new Date(startDate)

    while (cursor <= today) {
      const dateStr = cursor.toISOString().split('T')[0]
      currentWeek.push({ date: dateStr, score: scoreMap[dateStr] || 0 })
      if (currentWeek.length === 7) {
        result.push(currentWeek)
        currentWeek = []
      }
      cursor.setDate(cursor.getDate() + 1)
    }
    if (currentWeek.length > 0) result.push(currentWeek)

    return result
  }, [scoreMap])

  const maxScore = mode === 'total' ? 90 : 15
  const hasAny = Object.values(scoreMap).some(v => v > 0)

  return (
    <div className="karmic-card mb-6">
      <h3 className="h3 text-gold mb-4">{t('title')}</h3>

      {/* Mode switcher */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {MODE_KEYS.map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
              mode === m.key
                ? 'bg-karmic-accent/20 text-accent border border-karmic-accent'
                : 'text-karmic-muted border border-karmic-border hover:border-karmic-muted'
            }`}
          >
            {t(m.labelKey as any)}
          </button>
        ))}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-[10px] text-karmic-muted">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      {weeks.length > 0 ? (
        <div className="space-y-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map(day => (
                <div
                  key={day.date}
                  className={`aspect-square rounded-sm ${getColor(day.score, maxScore)}`}
                  title={`${day.date}: ${day.score}`}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-karmic-muted text-center py-8">{t('noData')}</p>
      )}

      {/* Legend */}
      {hasAny && (
        <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-karmic-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-500/60 inline-block" />
            {t('legendDeep')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-900/40 inline-block" />
            {t('legendLight')}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-karmic-border/40 inline-block" />
            {t('legendGray')}
          </span>
        </div>
      )}
    </div>
  )
}
