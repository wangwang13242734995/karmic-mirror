'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import type { DailyAssessment, MonthlyFeedback } from '@/lib/practice'
import MonthlyFeedbackModal from './MonthlyFeedbackModal'
import { channelSum, DIMENSIONS, dimAvg } from './useDashboardData'

interface Props {
  history: { date: string; assessment: DailyAssessment | null | undefined }[]
  monthlyFeedback: MonthlyFeedback | null
  onSaveFeedback: (feedback: MonthlyFeedback) => void
}

interface CauseEffectDef {
  dim: (typeof DIMENSIONS)[number]
  feedbackKey: keyof Omit<MonthlyFeedback, 'month' | 'overall'>
  titleKey: string
  practiceColor: string
  feedbackColor: string
}

const CAUSE_EFFECTS: CauseEffectDef[] = [
  { dim: 'generosity', feedbackKey: 'wealth', titleKey: 'generosityWealth', practiceColor: '#60a5fa', feedbackColor: '#fb923c' },
  { dim: 'discipline', feedbackKey: 'safety', titleKey: 'disciplineSafety', practiceColor: '#60a5fa', feedbackColor: '#fb923c' },
  { dim: 'patience', feedbackKey: 'relationships', titleKey: 'patienceRelationships', practiceColor: '#60a5fa', feedbackColor: '#fb923c' },
  { dim: 'diligence', feedbackKey: 'achievement', titleKey: 'diligenceAchievement', practiceColor: '#60a5fa', feedbackColor: '#fb923c' },
  { dim: 'concentration', feedbackKey: 'clarity', titleKey: 'concentrationClarity', practiceColor: '#60a5fa', feedbackColor: '#fb923c' },
  { dim: 'wisdom', feedbackKey: 'overall' as any, titleKey: 'wisdomWisdom', practiceColor: '#60a5fa', feedbackColor: '#fb923c' },
]

export default function Zone4KarmaLedger({ history, monthlyFeedback, onSaveFeedback }: Props) {
  const t = useTranslations('dashboard.zone4')
  const [showModal, setShowModal] = useState(false)

  const allAssessments = useMemo(() =>
    history.filter(h => h.assessment?.scores).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [history]
  )

  const handleSave = (fb: MonthlyFeedback) => {
    onSaveFeedback(fb)
    setShowModal(false)
  }

  return (
    <div className="karmic-card mb-6">
      <h3 className="h3 text-gold mb-4">{t('title')}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CAUSE_EFFECTS.map(ce => {
          const practiceData = allAssessments.map(a => ({
            date: a.date.slice(5),
            practice: dimAvg(a.assessment!.scores, ce.dim),
          }))

          const feedbackLine = monthlyFeedback ? [
            { date: '月初', feedback: monthlyFeedback[ce.feedbackKey] || 0 },
            { date: '现在', feedback: monthlyFeedback[ce.feedbackKey] || 0 },
          ] : []

          return (
            <div key={ce.dim} className="karmic-card !p-3 !rounded-xl">
              <p className="text-xs text-karmic-muted mb-2 font-medium">{t(ce.titleKey as any)}</p>

              {/* Mini practice line chart */}
              <div className="w-full h-[60px] mb-2">
                {practiceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={practiceData}>
                      <Line type="monotone" dataKey="practice" stroke={ce.practiceColor} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs text-karmic-muted">--</span>
                  </div>
                )}
              </div>

              {/* Feedback line */}
              {monthlyFeedback ? (
                <div className="w-full h-[40px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={feedbackLine}>
                      <Line type="monotone" dataKey="feedback" stroke={ce.feedbackColor} strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-[10px] text-karmic-muted text-right -mt-1">{monthlyFeedback[ce.feedbackKey] || 0}/5</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full text-xs text-karmic-accent hover:text-karmic-gold transition-colors text-left py-1"
                >
                  {t('notEvaluated')}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {showModal && (
        <MonthlyFeedbackModal onSave={handleSave} onCancel={() => setShowModal(false)} />
      )}
    </div>
  )
}
