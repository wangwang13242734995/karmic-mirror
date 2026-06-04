'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { type BaselineResult, calculateDrift, DIMENSION_LABELS, type Dimension } from '@/lib/destiny'
import type { PracticeSession } from '@/lib/practice'
import { getRippleEffect } from '@/lib/practice'

export default function DriftPage() {
  const t = useTranslations('drift')
  const locale = useLocale() as 'zh' | 'en'
  const [baseline, setBaseline] = useState<BaselineResult | null>(null)
  const [driftData, setDriftData] = useState<Array<{ dimension: Dimension; originalScore: number; currentScore: number; drift: number }>>([])
  const [practiceDays, setPracticeDays] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('karmic_baseline')
    const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')

    if (!stored) {
      setLoading(false)
      return
    }

    const bl = JSON.parse(stored) as BaselineResult
    const drift = calculateDrift(bl, history)
    const completed = history.filter((h: PracticeSession) => h.completed === true).length

    setBaseline(bl)
    setDriftData(drift)
    setPracticeDays(completed)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-karmic-muted">{t('calculating')}</p>
      </div>
    )
  }

  if (!baseline || driftData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="body text-karmic-muted mb-4">{t('noBaseline')}</p>
        <Link href="/onboarding" className="btn-primary">
          {t('setBaseline')}
        </Link>
      </div>
    )
  }

  const currentKarmaIndex = Math.round(
    driftData.reduce((sum, d) => sum + d.currentScore, 0) / driftData.length
  )

  const totalDrift = baseline.karmaInertiaIndex - currentKarmaIndex

  const dimIcons: Record<Dimension, string> = {
    career: '⚡',
    wealth: '💰',
    love: '💫',
    health: '🫀',
    mind: '🧠',
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="text-center mb-8 pt-4">
        <p className="caption uppercase tracking-widest mb-1">{t('title')}</p>
        <h1 className="h1 text-gold mb-2">{t.rich('subtitle', { br: () => <br /> })}</h1>
        <p className="body text-karmic-muted text-sm">
          {t('practiceSummary', { days: practiceDays, drift: totalDrift > 0 ? `${totalDrift} point shift` : 'Just beginning' })}
        </p>
      </div>

      {/* Karma Index comparison */}
      <div className="karmic-card mb-8 text-center">
        <p className="caption uppercase tracking-widest mb-4">{t('karmicInertia')}</p>
        <div className="flex items-center justify-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-3xl text-karmic-muted line-through">{baseline.karmaInertiaIndex}</p>
            <p className="caption">{t('before')}</p>
          </div>
          <div className="text-2xl text-gold">→</div>
          <div className="text-center">
            <p className="text-3xl text-gold">{currentKarmaIndex}</p>
            <p className="caption">{t('now')}</p>
          </div>
        </div>
        {totalDrift > 0 && (
          <p className="text-accent text-sm">{t('lessPredictable', { points: totalDrift })}</p>
        )}
        {totalDrift === 0 && practiceDays > 0 && (
          <p className="text-karmic-muted text-sm">{t('patience')}</p>
        )}
        {practiceDays === 0 && (
          <p className="text-karmic-muted text-sm">{t('beginPractice')}</p>
        )}
      </div>

      {/* Dimension drifts */}
      <div className="space-y-4 mb-8">
        {driftData.map(d => (
          <div key={d.dimension} className="karmic-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{dimIcons[d.dimension]}</span>
                <h3 className="h3">{DIMENSION_LABELS[d.dimension]}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-karmic-muted line-through text-sm">{d.originalScore}</span>
                <span className="text-gold font-semibold">{d.currentScore}</span>
                {d.drift > 0 && (
                  <span className="text-accent text-xs">(-{d.drift})</span>
                )}
              </div>
            </div>
            {/* Progress bar with before/after */}
            <div className="w-full h-2 bg-karmic-border rounded-full overflow-hidden relative">
              <div
                className="absolute inset-0 h-full rounded-full opacity-30"
                style={{
                  width: `${d.originalScore}%`,
                  background: '#6b6b7b',
                }}
              />
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${d.currentScore}%`,
                  background: 'linear-gradient(90deg, #7c5cfc, #c9a96e)',
                }}
              />
            </div>
            <p className="caption mt-2">
              {d.drift > 5
                ? t('significantShift')
                : d.drift > 0
                  ? t('subtleMovement')
                  : t('needsAttention')}
            </p>
          </div>
        ))}
      </div>

      {/* Ripple effect */}
      <div className="karmic-card-gold mb-8">
        <p className="caption uppercase tracking-widest mb-3">{t('rippleEffect')}</p>
        <p className="body text-sm leading-relaxed">
          {getRippleEffect(JSON.parse(sessionStorage.getItem('karmic_history') || '[]'), locale).summary}
        </p>
      </div>

      {/* Back to practice */}
      <Link href="/dashboard" className="btn-ghost w-full text-center block">
        {t('backToDashboard')}
      </Link>
    </div>
  )
}
