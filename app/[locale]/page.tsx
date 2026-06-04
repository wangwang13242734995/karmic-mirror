'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

const HEXAGRAM_SYMBOL = '䷀'

export default function LandingPage() {
  const t = useTranslations('landing')
  const [started, setStarted] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      {/* Hero */}
      <div className={`transition-all duration-1000 ${started ? 'opacity-0 scale-90' : 'opacity-100'}`}>
        <div className="text-7xl mb-8 animate-pulse-slow">{HEXAGRAM_SYMBOL}</div>
        
        <h1 className="h1 text-gold mb-4 tracking-tight">
          Karmic Mirror
        </h1>
        
        <p className="text-2xl font-serif italic text-karmic-muted mb-12 max-w-sm mx-auto leading-relaxed">
          {t.rich('tagline', {
            br: () => <br />,
            gold: (chunks) => <span className="text-gold">{chunks}</span>,
          })}
        </p>

        <div className="space-y-6 mb-16">
          <div className="flex items-center gap-3 text-left">
            <span className="text-gold text-xl">I</span>
            <span className="body">{t('step1')}</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <span className="text-accent text-xl">II</span>
            <span className="body">{t('step2')}</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <span className="text-gold text-xl">III</span>
            <span className="body">{t('step3')}</span>
          </div>
        </div>

        <button 
          onClick={() => setStarted(true)}
          className="btn-primary w-full max-w-xs text-lg"
        >
          {t('begin')}
        </button>

        <p className="caption mt-6">{t('freeNote')}</p>
      </div>

      {/* Transition to onboarding */}
      {started && (
        <div className="animate-fade-in absolute inset-0 flex flex-col items-center justify-center bg-karmic-bg">
          <p className="text-gold text-lg mb-6 animate-pulse-slow">{t('oneMoment')}</p>
          <p className="body opacity-60 whitespace-pre-line">{t('transitionText')}</p>
          <Link 
            href="/onboarding"
            className="btn-primary mt-12 opacity-0 animate-fade-in"
            style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
          >
            {t('ready')}
          </Link>
        </div>
      )}
    </div>
  )
}
