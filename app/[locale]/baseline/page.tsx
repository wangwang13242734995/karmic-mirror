'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { calculateBaseline, type BaselineResult } from '@/lib/destiny'
import { HEXAGRAMS, getLocalized } from '@/lib/iching'

export default function BaselinePage() {
  const t = useTranslations('baseline')
  const td = useTranslations('dimensions')
  const locale = useLocale() as 'zh' | 'en'
  const router = useRouter()
  const [result, setResult] = useState<BaselineResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState<number[]>([])
  const [allRevealed, setAllRevealed] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('karmic_birth')
    if (!stored) {
      router.push('/')
      return
    }

    const birth = JSON.parse(stored)
    const baseline = calculateBaseline(birth.year, birth.month, birth.day, birth.hexagram)
    
    sessionStorage.setItem('karmic_baseline', JSON.stringify(baseline))
    
    setResult(baseline)
    setLoading(false)

    setTimeout(() => setRevealed([0]), 800)
    setTimeout(() => setRevealed([0, 1]), 1600)
    setTimeout(() => setRevealed([0, 1, 2]), 2400)
    setTimeout(() => setRevealed([0, 1, 2, 3]), 3200)
    setTimeout(() => { setRevealed([0, 1, 2, 3, 4]); setAllRevealed(true) }, 4000)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-pulse-slow text-4xl mb-6">䷀</div>
        <p className="text-gold text-lg">{t('calculating')}</p>
      </div>
    )
  }

  if (!result) return null

  const lifeHexagram = HEXAGRAMS.find(h => {
    const stored = sessionStorage.getItem('karmic_birth')
    if (!stored) return false
    return h.id === JSON.parse(stored).hexagram
  })

  const dimKeys = ['career', 'wealth', 'love', 'health', 'mind'] as const
  const dimIcons: Record<string, string> = {
    career: '⚡', wealth: '💰', love: '💫', health: '🫀', mind: '🧠',
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="text-center mb-10 pt-8">
        <p className="caption uppercase tracking-widest mb-3">{t('title')}</p>
        <h1 className="h1 text-gold mb-3">{t.rich('subtitle', { br: () => <br /> })}</h1>
        <p className="body text-karmic-muted italic">{t('hint')}</p>
      </div>

      {/* Karma Inertia Index */}
      <div className="karmic-card-gold text-center mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">{t('karmaIndex')}</p>
        <div className="gauge-ring mb-4">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="#1e1e2e" strokeWidth="8" />
            <circle
              cx="70" cy="70" r="60" fill="none" stroke="url(#gaugeGradient)" strokeWidth="8"
              strokeDasharray={`${(result.karmaInertiaIndex / 100) * 377} 377`}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
              className="progress-ring-circle"
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c5cfc" />
                <stop offset="100%" stopColor="#c9a96e" />
              </linearGradient>
            </defs>
          </svg>
          <span className="gauge-value">{result.karmaInertiaIndex}</span>
        </div>
        <p className="body text-karmic-muted text-sm max-w-xs mx-auto">{result.summary}</p>
      </div>

      {/* 5 Dimensions */}
      <div className="space-y-4">
        {result.readings.map((reading, idx) => {
          const dimKey = dimKeys[idx]
          const isRevealed = revealed.includes(idx)

          return (
            <div
              key={reading.dimension}
              className={`karmic-card transition-all duration-700 ${
                isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{dimIcons[dimKey]}</span>
                  <h3 className="h3">{td(dimKey)}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-karmic-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${reading.score}%`,
                        background: `linear-gradient(90deg, #7c5cfc, #c9a96e)`,
                      }}
                    />
                  </div>
                  <span className="text-gold text-sm font-medium">{reading.score}</span>
                </div>
              </div>
              {isRevealed && (
                <div className="animate-fade-in">
                  <p className="body text-sm mb-2">{reading.trajectory}</p>
                  <div className="flex gap-4 caption mt-3">
                    <span>{t('critical')}: Age {reading.criticalYear}</span>
                    <span className="text-karmic-accent">{t('window')}: +{reading.window}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      {allRevealed && (
        <div className="text-center mt-10 animate-fade-in">
          <div className="karmic-card mb-6">
            <p className="text-sm text-karmic-muted mb-1">{t('lifeHexagram')}</p>
            <p className="text-gold text-2xl mb-1">{lifeHexagram?.name} ({lifeHexagram?.nameEn})</p>
            <p className="text-sm text-karmic-muted italic">&ldquo;{lifeHexagram ? getLocalized(lifeHexagram.principle, locale) : ''}&rdquo;</p>
          </div>
          <p className="body text-karmic-muted mb-6">{t('notFate')}</p>
          <button
            onClick={() => {
              sessionStorage.setItem('karmic_practice_day', '1')
              router.push('/practice/1')
            }}
            className="btn-primary w-full"
          >
            {t('beginPractice')}
          </button>
          <p className="caption mt-4">{t('firstStep')}</p>
        </div>
      )}
    </div>
  )
}
