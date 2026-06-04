'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { AssessmentScores } from '@/lib/practice'

const DIMENSIONS = [
  'generosity',
  'discipline',
  'patience',
  'diligence',
  'concentration',
  'wisdom',
] as const

const CHANNELS = ['body', 'speech', 'mind'] as const

type DimensionKey = (typeof DIMENSIONS)[number]
type ChannelKey = (typeof CHANNELS)[number]

const SCORES = [1, 2, 3, 4, 5]

function createDefaultScores(): AssessmentScores {
  return {
    generosity:    { body: 3, speech: 3, mind: 3 },
    discipline:    { body: 3, speech: 3, mind: 3 },
    patience:      { body: 3, speech: 3, mind: 3 },
    diligence:     { body: 3, speech: 3, mind: 3 },
    concentration: { body: 3, speech: 3, mind: 3 },
    wisdom:        { body: 3, speech: 3, mind: 3 },
  }
}

function calculateTotal(scores: AssessmentScores): number {
  let total = 0
  for (const d of DIMENSIONS) {
    for (const c of CHANNELS) {
      total += scores[d][c]
    }
  }
  return total
}

interface AssessmentTableProps {
  onSave: (scores: AssessmentScores) => void
  onSkip: () => void
}

export default function AssessmentTable({ onSave, onSkip }: AssessmentTableProps) {
  const t = useTranslations('assessment')
  const [scores, setScores] = useState<AssessmentScores>(createDefaultScores)

  const total = useMemo(() => calculateTotal(scores), [scores])

  const handleScoreChange = useCallback(
    (dimension: DimensionKey, channel: ChannelKey, value: number) => {
      setScores((prev) => ({
        ...prev,
        [dimension]: {
          ...prev[dimension],
          [channel]: value,
        },
      }))
    },
    []
  )

  const getScoreClass = (dim: DimensionKey, ch: ChannelKey, val: number): string => {
    const isActive = scores[dim][ch] === val
    if (!isActive) {
      return 'w-9 h-9 rounded-full flex items-center justify-center text-xs cursor-pointer transition-colors hover:bg-karmic-gold/10 text-karmic-muted'
    }
    // Active state with gradient based on score
    if (val <= 2) {
      return 'w-9 h-9 rounded-full flex items-center justify-center text-xs cursor-pointer bg-red-500/20 border border-red-400 text-red-300 font-medium'
    }
    if (val === 3) {
      return 'w-9 h-9 rounded-full flex items-center justify-center text-xs cursor-pointer bg-karmic-accent/20 border border-karmic-accent text-karmic-accent font-medium'
    }
    return 'w-9 h-9 rounded-full flex items-center justify-center text-xs cursor-pointer bg-karmic-gold/30 border border-karmic-gold text-gold font-medium'
  }

  return (
    <div className="karmic-card animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <p className="caption uppercase tracking-widest mb-1">{t('title')}</p>
        <p className="text-xs text-karmic-muted">{t('subtitle')}</p>
      </div>

      {/* Score hint */}
      <p className="text-xs text-karmic-muted mb-4 text-center">
        {t('scoreHint')}
      </p>

      {/* Grid: 4 rows (header + body/speech/mind) x 7 columns (label + 6 dimensions) */}
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="grid min-w-[420px]" style={{ gridTemplateColumns: '56px repeat(6, 1fr)' }}>
          {/* Header row: Dimension names */}
          <div className="h-8" /> {/* Empty corner */}
          {DIMENSIONS.map((dim) => (
            <div
              key={dim}
              className="h-8 flex items-center justify-center text-xs text-karmic-muted tracking-wide"
            >
              {t(`dimensions.${dim}`)}
            </div>
          ))}

          {/* Channel rows */}
          {CHANNELS.map((channel) => (
            <div key={channel} className="contents">
              {/* Row label */}
              <div className="h-14 flex items-center justify-center text-sm text-karmic-muted font-medium border-t border-karmic-border/30">
                {t(`channels.${channel}`)}
              </div>
              {/* Score cells */}
              {DIMENSIONS.map((dim) => (
                <div
                  key={`${dim}-${channel}`}
                  className="h-14 flex items-center justify-center gap-0.5 border-t border-karmic-border/30"
                >
                  {SCORES.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleScoreChange(dim, channel, val)}
                      className={getScoreClass(dim, channel, val)}
                      aria-label={`${dim} ${channel} score ${val}`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Total Score */}
      <div className="mt-6 pt-4 border-t border-karmic-border/30 flex items-center justify-between">
        <span className="text-sm text-karmic-muted">{t('totalScore')}</span>
        <span className="text-xl font-medium text-gold">
          {total}
          <span className="text-xs text-karmic-muted ml-1">{t('outOf')}</span>
        </span>
      </div>

      {/* Action buttons */}
      <div className="mt-6 space-y-3">
        <button
          onClick={() => onSave(scores)}
          className="btn-primary w-full"
        >
          {t('submit')}
        </button>
        <button
          onClick={onSkip}
          className="w-full text-center py-2 caption hover:text-karmic-muted transition-colors"
        >
          {t('skip')}
        </button>
      </div>
    </div>
  )
}
