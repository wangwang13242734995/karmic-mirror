'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import type { DailyAssessment } from '@/lib/practice'
import { DIMENSIONS, type DimensionKey, dimAvg } from './useDashboardData'

interface Props {
  history: { date: string; assessment: DailyAssessment | null | undefined }[]
}

type Period = 'week' | 'month' | 'all'

const DIM_LABEL_KEYS: Record<DimensionKey, string> = {
  generosity: 'generosity',
  discipline: 'discipline',
  patience: 'patience',
  diligence: 'diligence',
  concentration: 'concentration',
  wisdom: 'wisdom',
}

function getAssessmentsInRange(history: Props['history'], period: Period): DailyAssessment[] {
  const now = new Date()
  const cutoff = new Date()
  if (period === 'week') cutoff.setDate(now.getDate() - 7)
  else if (period === 'month') cutoff.setMonth(now.getMonth() - 1)
  else cutoff.setFullYear(2000)

  return history
    .filter(h => h.assessment?.scores && new Date(h.date) >= cutoff)
    .map(h => h.assessment!)
}

function computeAvgByDim(assessments: DailyAssessment[]): Record<DimensionKey, number> {
  const result: Record<string, number> = {}
  for (const dim of DIMENSIONS) {
    if (assessments.length === 0) { result[dim] = 0; continue }
    const sum = assessments.reduce((s, a) => s + dimAvg(a.scores, dim), 0)
    result[dim] = Math.round((sum / assessments.length) * 10) / 10
  }
  return result as Record<DimensionKey, number>
}

function getPrevPeriodAssessments(history: Props['history'], period: Period): DailyAssessment[] {
  const now = new Date()
  if (period === 'week') {
    const end = new Date(); end.setDate(now.getDate() - 7)
    const start = new Date(); start.setDate(end.getDate() - 7)
    return history.filter(h => h.assessment?.scores && new Date(h.date) >= start && new Date(h.date) < end).map(h => h.assessment!)
  } else if (period === 'month') {
    const end = new Date(); end.setMonth(now.getMonth() - 1)
    const start = new Date(); start.setMonth(end.getMonth() - 1)
    return history.filter(h => h.assessment?.scores && new Date(h.date) >= start && new Date(h.date) < end).map(h => h.assessment!)
  }
  return []
}

export default function Zone2RadarChart({ history }: Props) {
  const t = useTranslations('dashboard.zone2')
  const at = useTranslations('assessment.dimensions')
  const locale = useLocale() as 'zh' | 'zh-CN' | 'en'
  const [period, setPeriod] = useState<Period>('week')

  const assessments = useMemo(() => getAssessmentsInRange(history, period), [history, period])
  const avgScores = useMemo(() => computeAvgByDim(assessments), [assessments])

  const prevAssessments = useMemo(() => getPrevPeriodAssessments(history, period), [history, period])
  const prevAvgScores = useMemo(() => computeAvgByDim(prevAssessments), [prevAssessments])

  const chartData = DIMENSIONS.map(dim => ({
    dimension: at(DIM_LABEL_KEYS[dim] as any),
    score: avgScores[dim],
    fullMark: 5,
  }))

  // Insights
  const shortest = useMemo(() => {
    if (assessments.length === 0) return null
    let minDim: DimensionKey = 'generosity'
    let minVal = avgScores.generosity
    for (const dim of DIMENSIONS) { if (avgScores[dim] < minVal) { minVal = avgScores[dim]; minDim = dim } }
    return { dim: minDim, label: at(DIM_LABEL_KEYS[minDim] as any), score: minVal }
  }, [avgScores, assessments, at])

  const mostImproved = useMemo(() => {
    if (prevAssessments.length === 0 || assessments.length === 0) return null
    let bestDim: DimensionKey = 'generosity'
    let bestDelta = avgScores.generosity - (prevAvgScores.generosity || 0)
    for (const dim of DIMENSIONS) {
      const delta = avgScores[dim] - (prevAvgScores[dim] || 0)
      if (delta > bestDelta) { bestDelta = delta; bestDim = dim }
    }
    if (bestDelta <= 0) return null
    return { dim: bestDim, label: at(DIM_LABEL_KEYS[bestDim] as any), delta: Math.round(bestDelta * 10) / 10 }
  }, [avgScores, prevAvgScores, assessments, prevAssessments, at])

  const steady = useMemo(() => {
    if (assessments.length === 0) return null
    for (const dim of DIMENSIONS) {
      if (avgScores[dim] >= 4.0) return { dim, label: at(DIM_LABEL_KEYS[dim] as any), score: avgScores[dim] }
    }
    return null
  }, [avgScores, assessments, at])

  if (assessments.length === 0) {
    return (
      <div className="karmic-card mb-6">
        <h3 className="h3 text-gold mb-2">{t('title')}</h3>
        <p className="text-sm text-karmic-muted">{t('noData')}</p>
      </div>
    )
  }

  return (
    <div className="karmic-card mb-6">
      <h3 className="h3 text-gold mb-4">{t('title')}</h3>

      {/* Period switcher */}
      <div className="flex gap-2 mb-4">
        {(['week', 'month', 'all'] as Period[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              period === p
                ? 'bg-karmic-accent/20 text-accent border border-karmic-accent'
                : 'text-karmic-muted border border-karmic-border hover:border-karmic-muted'
            }`}
          >
            {t(p === 'week' ? 'thisWeek' : p === 'month' ? 'thisMonth' : 'allTime')}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[320px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#1e1e2e" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#e0dcd0', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: '#6b6b7b', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#7c5cfc"
              fill="#7c5cfc"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="space-y-2 text-sm">
        {shortest && (
          <p className="text-karmic-text">
            <span className="text-karmic-danger">{t('shortest')}：{shortest.label}</span>
            {' '}({t('avgScore', { score: shortest.score })})
          </p>
        )}
        {mostImproved && (
          <p className="text-karmic-text">
            <span className="text-green-400">{t('mostImproved')}：{mostImproved.label}</span>
            {' '}({t('improved', { delta: mostImproved.delta })})
          </p>
        )}
        {steady && (
          <p className="text-karmic-text">
            <span className="text-gold">{t('steady')}：{steady.label}</span>
            {' '}({t('steadyAt', { score: steady.score })})
          </p>
        )}
      </div>
    </div>
  )
}
