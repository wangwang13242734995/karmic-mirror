'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { type BaselineResult, DIMENSION_LABELS, type Dimension } from '@/lib/destiny'
import { getRippleEffect, getAntiSelfProfile, getCommunityRanking, type PracticeSession } from '@/lib/practice'
import { HEXAGRAMS } from '@/lib/iching'

type CardType = 'drift' | 'anti_self' | 'ripple' | 'percentile' | null

export default function SharePage() {
  const t = useTranslations('share')
  const locale = useLocale() as 'zh' | 'en'
  const [baseline, setBaseline] = useState<BaselineResult | null>(null)
  const [history, setHistory] = useState<PracticeSession[]>([])
  const [selectedCard, setSelectedCard] = useState<CardType>(null)
  const [karmaIndex, setKarmaIndex] = useState(100)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bl = JSON.parse(sessionStorage.getItem('karmic_baseline') || 'null')
    const hist = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    setBaseline(bl)
    setHistory(hist)

    if (bl) {
      const completed = hist.filter((h: PracticeSession) => h.completed === true).length
      const total = hist.length || 1
      setKarmaIndex(Math.max(bl.karmaInertiaIndex - (completed / total) * 20, 10))
    }
  }, [])

  const handleShare = async () => {
    if (!cardRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
      })

      const blob = await new Promise<Blob>(resolve => canvas.toBlob(b => resolve(b!), 'image/png'))
      const url = URL.createObjectURL(blob)

      // Try Web Share API
      if (navigator.share) {
        const file = new File([blob], 'karmic-mirror.png', { type: 'image/png' })
        await navigator.share({
          title: 'Karmic Mirror',
          text: 'Not what will happen to you. What you are becoming.',
          files: [file],
        })
      } else {
        // Fallback: download
        const a = document.createElement('a')
        a.href = url
        a.download = 'karmic-mirror.png'
        a.click()
      }
    } catch (err) {
      // User cancelled share or not supported — download instead
      if (cardRef.current) {
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0a0a0f', scale: 2 })
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = 'karmic-mirror.png'
        a.click()
      }
    }
  }

  const birth = JSON.parse(sessionStorage.getItem('karmic_birth') || '{}')
  const lifeHexagram = HEXAGRAMS.find(h => h.id === birth.hexagram)
  const ripple = getRippleEffect(history, locale)
  const antiSelf = getAntiSelfProfile(history, locale)
  const ranking = getCommunityRanking(history.filter(h => h.completed === true).length)
  const driftData = baseline ? (() => {
    const completed = history.filter(h => h.completed === true).length
    return baseline.readings.map(r => ({
      ...r,
      currentScore: Math.max(r.score - (completed / Math.max(history.length, 1)) * 15, 10),
    }))
  })() : []

  const cards = [
    { id: 'drift' as CardType, title: t('cards.drift.title'), description: t('cards.drift.desc'), emoji: '🔮' },
    { id: 'anti_self' as CardType, title: t('cards.antiSelf.title'), description: t('cards.antiSelf.desc'), emoji: '👤' },
    { id: 'ripple' as CardType, title: t('cards.ripple.title'), description: t('cards.ripple.desc'), emoji: '🌊' },
    { id: 'percentile' as CardType, title: t('cards.percentile.title'), description: t('cards.percentile.desc'), emoji: '🏆' },
  ]

  return (
    <div className="min-h-screen pb-24">
      <div className="text-center mb-8 pt-4">
        <p className="caption uppercase tracking-widest mb-1">{t('title')}</p>
        <h1 className="h1 text-gold mb-2">{t.rich('subtitle', { br: () => <br /> })}</h1>
        <p className="body text-karmic-muted text-sm">{t('chooseCard')}</p>
      </div>

      {/* Card selection */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => setSelectedCard(card.id)}
            className={`karmic-card text-left p-4 transition-all ${
              selectedCard === card.id ? 'border-karmic-gold bg-karmic-gold/5' : ''
            }`}
          >
            <span className="text-2xl mb-2 block">{card.emoji}</span>
            <h3 className="h3 text-sm mb-1">{card.title}</h3>
            <p className="caption text-xs">{card.description}</p>
          </button>
        ))}
      </div>

      {/* Preview */}
      {selectedCard && (
        <div className="animate-fade-in">
          <div className="mb-6" ref={cardRef}>
            {selectedCard === 'drift' && (
              <div className="share-card" style={{ minHeight: '400px' }}>
                <p className="text-xs text-karmic-muted uppercase tracking-widest mb-4">Karmic Mirror</p>
                <div className="text-4xl mb-6">{'䷀'}</div>
                <h2 className="text-2xl text-gold mb-1 font-serif">{t('cardContent.driftTitle')}</h2>
                <p className="text-sm text-karmic-muted mb-8">{t('cardContent.driftSubtitle')}</p>

                {/* Before/After */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div>
                    <p className="text-3xl text-karmic-muted line-through">{baseline?.karmaInertiaIndex || 100}</p>
                    <p className="caption text-xs">{t('cardContent.inertia')}</p>
                  </div>
                  <span className="text-2xl text-gold">→</span>
                  <div>
                    <p className="text-3xl text-gold">{Math.round(karmaIndex)}</p>
                    <p className="caption text-xs">{t('cardContent.now')}</p>
                  </div>
                </div>

                <p className="text-sm text-karmic-muted italic mb-6">
                  {baseline?.karmaInertiaIndex && baseline.karmaInertiaIndex > 70
                    ? t('cardContent.wasOnRails')
                    : t('cardContent.smallChanges')}
                </p>

                <p className="text-xs text-karmic-muted">karmicmirror.app</p>
              </div>
            )}

            {selectedCard === 'anti_self' && (
              <div className="share-card" style={{ minHeight: '400px' }}>
                <p className="text-xs text-karmic-muted uppercase tracking-widest mb-4">Karmic Mirror</p>
                <div className="text-4xl mb-6">{'👤'}</div>
                <h2 className="text-2xl text-gold mb-1 font-serif">{t('cardContent.antiSelfTitle')}</h2>
                <p className="text-sm text-karmic-muted mb-8">{t('cardContent.antiSelfSubtitle')}</p>

                <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                  {antiSelf.traits.map((trait, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-karmic-danger text-xs mt-0.5">✕</span>
                      <p className="text-sm text-karmic-muted">{trait}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gold italic mb-6">
                  &ldquo;{t('cardContent.choseDifferently')}&rdquo;
                </p>

                <p className="text-xs text-karmic-muted">karmicmirror.app</p>
              </div>
            )}

            {selectedCard === 'ripple' && (
              <div className="share-card" style={{ minHeight: '400px' }}>
                <p className="text-xs text-karmic-muted uppercase tracking-widest mb-4">Karmic Mirror</p>
                <div className="text-4xl mb-6">{'🌊'}</div>
                <h2 className="text-2xl text-gold mb-1 font-serif">{t('cardContent.rippleTitle')}</h2>
                <p className="text-sm text-karmic-muted mb-8">
                  {t('cardContent.rippleSubtitle', { count: ripple.peopleAffected })}
                </p>

                <div className="space-y-3 mb-8 text-left max-w-xs mx-auto">
                  {ripple.ripples.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-gold text-xs mt-0.5">•</span>
                      <p className="text-sm text-karmic-muted">{r}</p>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-karmic-muted italic mb-6">
                  {t('cardContent.neverKnow')}
                </p>

                <p className="text-xs text-karmic-muted">karmicmirror.app</p>
              </div>
            )}

            {selectedCard === 'percentile' && (
              <div className="share-card" style={{ minHeight: '400px' }}>
                <p className="text-xs text-karmic-muted uppercase tracking-widest mb-4">Karmic Mirror</p>
                <div className="text-4xl mb-6">{'🏆'}</div>
                <h2 className="text-2xl text-gold mb-1 font-serif">{t('cardContent.percentileTitle', { pct: ranking.percentile })}</h2>
                <p className="text-sm text-karmic-muted mb-8">
                  {t('cardContent.percentileSubtitle', { pct: ranking.percentile, total: ranking.totalUsers.toLocaleString() })}
                </p>

                <div className="w-full h-2 bg-karmic-border rounded-full mb-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-karmic-accent to-karmic-gold rounded-full"
                    style={{ width: `${ranking.percentile}%` }}
                  />
                </div>

                <p className="text-sm text-karmic-muted italic mb-6">
                  {t('cardContent.percentileRank', { rank: ranking.rank.toLocaleString() })}
                </p>

                <p className="text-xs text-karmic-muted">karmicmirror.app</p>
              </div>
            )}
          </div>

          {/* Share button */}
          <button onClick={handleShare} className="btn-primary w-full mb-4">
            {t('shareButton')}
          </button>
          <p className="caption text-center">{t('shareHint')}</p>
        </div>
      )}

      {!selectedCard && (
        <div className="text-center py-12">
          <p className="body text-karmic-muted">{t('selectCard')}</p>
          <Link href="/dashboard" className="btn-ghost inline-block mt-6">
            {t('backToDashboard')}
          </Link>
        </div>
      )}
    </div>
  )
}
