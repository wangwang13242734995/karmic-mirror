'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { MonthlyFeedback } from '@/lib/practice'

interface Props {
  onSave: (feedback: MonthlyFeedback) => void
  onCancel: () => void
}

const QUESTIONS = [
  { key: 'wealth', labelKey: 'wealth' },
  { key: 'safety', labelKey: 'safety' },
  { key: 'relationships', labelKey: 'relationships' },
  { key: 'achievement', labelKey: 'achievement' },
  { key: 'clarity', labelKey: 'clarity' },
  { key: 'overall', labelKey: 'overall' },
] as const

export default function MonthlyFeedbackModal({ onSave, onCancel }: Props) {
  const t = useTranslations('dashboard.zone4')
  const [scores, setScores] = useState<Record<string, number>>({
    wealth: 3, safety: 3, relationships: 3, achievement: 3, clarity: 3, overall: 3,
  })

  const handleSave = () => {
    const month = new Date().toISOString().slice(0, 7)
    onSave({ month, ...scores } as MonthlyFeedback)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div
        className="karmic-card w-full max-w-sm animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="h3 text-gold mb-4 text-center">{t('monthlyFeedback')}</h3>

        <div className="space-y-4 mb-6">
          {QUESTIONS.map(q => (
            <div key={q.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm text-karmic-text">{t(q.labelKey as any)}</label>
                <span className="text-xs text-gold font-medium">{scores[q.key]}/5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={scores[q.key]}
                onChange={e => setScores(prev => ({ ...prev, [q.key]: parseInt(e.target.value) }))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(90deg, #7c5cfc ${(scores[q.key] - 1) * 25}%, #1e1e2e ${(scores[q.key] - 1) * 25}%)`,
                  accentColor: '#7c5cfc',
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-ghost flex-1">{t('cancel')}</button>
          <button onClick={handleSave} className="btn-primary flex-1">{t('submit')}</button>
        </div>
      </div>
    </div>
  )
}
