'use client'

import { DIMENSION_LABELS, type Dimension } from '@/lib/destiny'

interface Props {
  readings: Array<{ dimension: Dimension; originalScore: number; currentScore: number }>
}

export default function DestinyChart({ readings }: Props) {
  const dimIcons: Record<Dimension, string> = {
    career: '⚡',
    wealth: '💰',
    love: '💫',
    health: '🫀',
    mind: '🧠',
  }

  return (
    <div className="space-y-3">
      {readings.map(r => (
        <div key={r.dimension} className="flex items-center gap-3">
          <span className="text-sm w-6 text-center">{dimIcons[r.dimension]}</span>
          <span className="text-xs text-karmic-muted w-16">{DIMENSION_LABELS[r.dimension]}</span>
          <div className="flex-1 h-2 bg-karmic-border rounded-full overflow-hidden relative">
            <div
              className="absolute inset-0 h-full rounded-full opacity-20"
              style={{ width: `${r.originalScore}%`, background: '#6b6b7b' }}
            />
            <div
              className="h-full rounded-full"
              style={{
                width: `${r.currentScore}%`,
                background: 'linear-gradient(90deg, #7c5cfc, #c9a96e)',
              }}
            />
          </div>
          <span className="text-xs text-gold w-8 text-right">{r.currentScore}</span>
        </div>
      ))}
    </div>
  )
}
