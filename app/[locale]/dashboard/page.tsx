'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import type { MonthlyFeedback } from '@/lib/practice'
import { HEXAGRAMS } from '@/lib/iching'
import { useDashboardData } from '@/components/useDashboardData'
import Zone1OverviewCards from '@/components/Zone1OverviewCards'
import Zone2RadarChart from '@/components/Zone2RadarChart'
import Zone3TrendChart from '@/components/Zone3TrendChart'
import Zone4KarmaLedger from '@/components/Zone4KarmaLedger'
import Zone5CalendarHeatmap from '@/components/Zone5CalendarHeatmap'
import ReminderSettings from '@/components/ReminderSettings'

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale() as 'zh' | 'zh-CN' | 'en'
  const data = useDashboardData()

  const [monthlyFeedback, setMonthlyFeedback] = useState<MonthlyFeedback | null>(null)

  useEffect(() => {
    setMonthlyFeedback(data.monthlyFeedback)
  }, [data.monthlyFeedback])

  const handleSaveFeedback = useCallback((feedback: MonthlyFeedback) => {
    const monthKey = feedback.month || new Date().toISOString().slice(0, 7)
    sessionStorage.setItem(`karmic_feedback_${monthKey}`, JSON.stringify(feedback))
    setMonthlyFeedback(feedback)
  }, [])

  const birth = JSON.parse(sessionStorage.getItem('karmic_birth') || '{}')
  const lifeHexagram = HEXAGRAMS.find(h => h.id === birth.hexagram)

  const dayLabel = t('day', { day: data.practiceDay })

  const historyWithAssessments = data.history.map(h => ({
    date: h.date,
    assessment: h.assessment,
  }))

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="text-center mb-6 pt-2 relative">
        <div className="absolute top-2 right-0">
          <ReminderSettings />
        </div>
        <div className="text-4xl mb-2">{'䷀'}</div>
        <p className="caption uppercase tracking-widest mb-1">{dayLabel}</p>
        <p className="body text-karmic-muted text-sm">
          {lifeHexagram ? `${lifeHexagram.name} · ${lifeHexagram.nameEn}` : t('yourJourney')}
        </p>
      </div>

      {/* Practice entry button */}
      <Link href={`/practice/${data.practiceDay}`} className="block mb-6">
        <div className="karmic-card flex items-center gap-4 hover:border-karmic-gold/40 transition-all cursor-pointer animate-fade-in">
          <span className="text-2xl">{'🌅'}</span>
          <div className="flex-1">
            <h3 className="h3 text-gold">{t('todaysPractice')}</h3>
            <p className="caption">{t('todaysPracticeDesc')}</p>
          </div>
          <span className="text-karmic-muted">{'→'}</span>
        </div>
      </Link>

      {/* Zone 1: Today Overview */}
      <Zone1OverviewCards data={data} />

      {/* Zone 2: Six Paramitas Radar */}
      <Zone2RadarChart history={historyWithAssessments} />

      {/* Zone 3: Body/Speech/Mind Trends */}
      <Zone3TrendChart history={historyWithAssessments} />

      {/* Zone 4: Karma Ledger */}
      <Zone4KarmaLedger
        history={historyWithAssessments}
        monthlyFeedback={monthlyFeedback}
        onSaveFeedback={handleSaveFeedback}
      />

      {/* Zone 5: Calendar Heatmap */}
      <Zone5CalendarHeatmap history={historyWithAssessments} />

      {/* View all records */}
      <div className="text-center pb-8">
        <Link
          href="/community"
          className="text-sm text-karmic-muted hover:text-karmic-gold transition-colors"
        >
          {t('viewAllRecords')}
        </Link>
      </div>
    </div>
  )
}
