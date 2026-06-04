'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { DashboardData } from './useDashboardData'
import { HEXAGRAMS } from '@/lib/iching'

interface Props {
  data: DashboardData
}

export default function Zone1OverviewCards({ data }: Props) {
  const t = useTranslations('dashboard.zone1')
  const locale = useLocale() as 'zh' | 'zh-CN' | 'en'

  const { todaySession, todayAssessment, streak, sevenDayScores, practiceDay } = data

  // Hexagram card
  const hexagram = todaySession?.hexagram

  // Assessment card
  const hasAssessment = todayAssessment && todayAssessment.scores
  const assessmentTotal = hasAssessment ? (
    Object.values(todayAssessment.scores!).reduce((sum, ch) => sum + ch.body + ch.speech + ch.mind, 0)
  ) : 0
  const bodyScore = hasAssessment ? (
    Object.values(todayAssessment.scores!).reduce((sum, ch) => sum + ch.body, 0)
  ) : 0
  const speechScore = hasAssessment ? (
    Object.values(todayAssessment.scores!).reduce((sum, ch) => sum + ch.speech, 0)
  ) : 0
  const mindScore = hasAssessment ? (
    Object.values(todayAssessment.scores!).reduce((sum, ch) => sum + ch.mind, 0)
  ) : 0

  // Weekly trend
  const trendUp = sevenDayScores.length >= 2
    ? sevenDayScores[sevenDayScores.length - 1].total >= sevenDayScores[0].total
    : null

  const trendData = sevenDayScores.map((s, i) => ({
    day: i + 1,
    score: s.total,
  }))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {/* Card 1: Today's Hexagram */}
      <Link href={`/practice/${practiceDay}`} className="block">
        <div className="karmic-card text-center h-full flex flex-col items-center justify-center min-h-[120px] hover:border-karmic-gold/40 transition-all cursor-pointer">
          <p className="caption uppercase tracking-widest mb-2 text-karmic-muted">{t('todayHexagram')}</p>
          {hexagram ? (
            <>
              <p className="text-2xl font-bold text-gold mb-1">{hexagram.name}</p>
            </>
          ) : (
            <p className="text-sm text-karmic-muted mt-2">{t('startPractice')}</p>
          )}
        </div>
      </Link>

      {/* Card 2: Streak */}
      <div className="karmic-card text-center h-full flex flex-col items-center justify-center min-h-[120px]">
        <p className="caption uppercase tracking-widest mb-2 text-karmic-muted">{t('continuousPractice')}</p>
        {streak.current > 0 ? (
          <>
            <p className="text-2xl font-bold text-accent">{streak.current}</p>
            <p className="text-xs text-karmic-muted mt-1">{t('totalPractice')}: {streak.totalSessions}</p>
          </>
        ) : (
          <p className="text-sm text-karmic-muted mt-2">{t('noData')}</p>
        )}
      </div>

      {/* Card 3: Today's Assessment */}
      <div className="karmic-card text-center h-full flex flex-col items-center justify-center min-h-[120px]">
        <p className="caption uppercase tracking-widest mb-2 text-karmic-muted">{t('todayAssessment')}</p>
        {hasAssessment ? (
          <>
            <p className="text-2xl font-bold text-gold">{assessmentTotal}<span className="text-sm text-karmic-muted font-normal">/90</span></p>
            <p className="text-xs text-karmic-muted mt-1">
              {locale === 'en'
                ? `B ${bodyScore}/30 · S ${speechScore}/30 · M ${mindScore}/30`
                : `身 ${bodyScore}/30 · 口 ${speechScore}/30 · 意 ${mindScore}/30`
              }
            </p>
          </>
        ) : (
          <p className="text-sm text-karmic-muted mt-2">{t('noData')}</p>
        )}
      </div>

      {/* Card 4: Weekly Trend */}
      <div className="karmic-card text-center h-full flex flex-col items-center justify-center min-h-[120px]">
        <p className="caption uppercase tracking-widest mb-2 text-karmic-muted">{t('weeklyTrend')}</p>
        {trendData.length > 0 ? (
          <>
            <div className="w-full h-10 -mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#7c5cfc"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-karmic-muted mt-1">
              {trendUp ? (
                <span className="text-green-400">{t('up')}</span>
              ) : (
                <span className="text-red-400">{t('down')}</span>
              )}
            </p>
          </>
        ) : (
          <p className="text-sm text-karmic-muted mt-2">{t('noData')}</p>
        )}
      </div>
    </div>
  )
}
