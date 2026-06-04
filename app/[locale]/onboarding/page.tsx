'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getLifeHexagram } from '@/lib/iching'

export default function OnboardingPage() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [hour, setHour] = useState('12')
  const [error, setError] = useState('')

  const handleNext = () => {
    setError('')

    if (step === 1) {
      const y = parseInt(year)
      if (!y || y < 1900 || y > 2026) {
        setError(t('errors.invalidYear'))
        return
      }
      setStep(2)
      return
    }

    if (step === 2) {
      const m = parseInt(month)
      if (!m || m < 1 || m > 12) {
        setError(t('errors.invalidMonth'))
        return
      }
      setStep(3)
      return
    }

    if (step === 3) {
      const d = parseInt(day)
      if (!d || d < 1 || d > 31) {
        setError(t('errors.invalidDay'))
        return
      }
      setStep(4)
      return
    }

    if (step === 4) {
      const h = parseInt(hour)
      if (isNaN(h) || h < 0 || h > 23) {
        setError(t('errors.invalidHour'))
        return
      }

      const hexagram = getLifeHexagram(
        parseInt(year), parseInt(month), parseInt(day), parseInt(hour)
      )

      sessionStorage.setItem('karmic_birth', JSON.stringify({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour),
        hexagram,
      }))

      router.push('/baseline')
    }
  }

  const monthNames = t.raw('months') as unknown as string[]

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-12">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i === step
                ? 'bg-karmic-gold w-8'
                : i < step
                  ? 'bg-karmic-gold opacity-60'
                  : 'bg-karmic-border'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="animate-fade-in" key={step}>
        {step === 1 && (
          <div className="text-center">
            <p className="text-karmic-muted mb-2">{t('step1Hint')}</p>
            <h2 className="h2 text-gold mb-8">{t('step1Title')}</h2>
            <input
              type="number"
              placeholder="1990"
              value={year}
              onChange={e => setYear(e.target.value)}
              className="karmic-input text-center text-3xl max-w-[200px] mx-auto"
              maxLength={4}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <p className="text-karmic-muted mb-2">{t('step2Hint')}</p>
            <h2 className="h2 text-gold mb-8">{t('step2Title')}</h2>
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <button
                  key={m}
                  onClick={() => { setMonth(String(m)); setTimeout(handleNext, 200) }}
                  className={`p-3 rounded-xl text-sm border transition-all ${
                    month === String(m)
                      ? 'border-karmic-gold bg-karmic-gold/10 text-karmic-gold'
                      : 'border-karmic-border text-karmic-muted hover:border-karmic-accent'
                  }`}
                >
                  {monthNames[m - 1]}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <p className="text-karmic-muted mb-2">{t('step3Hint')}</p>
            <h2 className="h2 text-gold mb-8">{t('step3Title')}</h2>
            <input
              type="number"
              placeholder="15"
              value={day}
              onChange={e => setDay(e.target.value)}
              className="karmic-input text-center text-3xl max-w-[200px] mx-auto"
              min={1}
              max={31}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleNext()}
            />
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <p className="text-karmic-muted mb-2">{t('step4Hint')}</p>
            <h2 className="h2 text-gold mb-8">{t('step4Title')}</h2>
            <select
              value={hour}
              onChange={e => setHour(e.target.value)}
              className="karmic-input text-center text-xl max-w-[300px] mx-auto"
              autoFocus
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0 ? t('midnight') :
                   i === 12 ? t('noon') :
                   `${i.toString().padStart(2, '0')}:00`}
                </option>
              ))}
            </select>
            <p className="caption mt-4">{t('dontKnow')}</p>
          </div>
        )}

        {/* Error display */}
        {error && (
          <p className="text-karmic-danger text-sm text-center mt-6 animate-fade-in">{error}</p>
        )}
      </div>

      {/* Next button */}
      <div className="mt-12">
        {step < 4 ? (
          <button onClick={handleNext} className="btn-primary w-full">
            {step === 3 ? t('continue') : t('next')}
          </button>
        ) : (
          <button onClick={handleNext} className="btn-primary w-full">
            {t('reveal')}
          </button>
        )}
      </div>
    </div>
  )
}
