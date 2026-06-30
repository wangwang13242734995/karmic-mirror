'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { getTodayPractice, type PracticeSession, type DailyAssessment, type AssessmentScores } from '@/lib/practice'
import { getLocalizedHexagram } from '@/lib/iching'
import AssessmentTable from '@/components/AssessmentTable'

export function generateStaticParams() {
  const locales = ['en', 'zh', 'zh-CN']
  const days = Array.from({ length: 64 }, (_, i) => String(i + 1))
  return locales.flatMap(locale => days.map(day => ({ locale, day })))
}

const TOTAL_QUESTIONS = 14

function pickDailyQuestion(dayNumber: number): number {
  return ((dayNumber - 1) % TOTAL_QUESTIONS) + 1
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations('practice')
  const at = useTranslations('assessment')
  const qt = useTranslations('dailyQuestion')
  const it = useTranslations('interpretation')
  const locale = useLocale()
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [completed, setCompleted] = useState<boolean | null>(null)
  const [reflection, setReflection] = useState('')
  const [mood, setMood] = useState(3)
  const [submitted, setSubmitted] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
  const [showDailyQuestion, setShowDailyQuestion] = useState(false)
  const [questionAnswer, setQuestionAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(0)
  const [showInterpretation, setShowInterpretation] = useState(false)
  const [interpretationText, setInterpretationText] = useState('')
  const [interpretationState, setInterpretationState] = useState<'loading' | 'done' | 'fallback' | 'error'>('loading')

  useEffect(() => {
    const day = parseInt(params.day as string) || 1
    const today = new Date().toISOString().split('T')[0]
    const practice = getTodayPractice(today, day)
    setSession(practice)
  }, [params.day])

  const handleSubmit = () => {
    if (!session || completed === null) return

    const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    const existingIdx = history.findIndex((h: PracticeSession) => h.date === session.date)

    const entry: PracticeSession = {
      ...session,
      completed,
      reflection,
      mood,
    }

    if (existingIdx >= 0) {
      history[existingIdx] = entry
    } else {
      history.push(entry)
    }

    sessionStorage.setItem('karmic_history', JSON.stringify(history))

    const nextDay = session.dayNumber + 1
    sessionStorage.setItem('karmic_practice_day', String(nextDay))

    // Show AI interpretation first
    setShowInterpretation(true)
    setInterpretationState('loading')
    fetchInterpretation(session.hexagram.id, session.dayNumber)
  }

  const fetchInterpretation = async (hexagramId: number, dayNumber: number) => {
    const qNum = pickDailyQuestion(dayNumber)
    const localContent = getLocalizedHexagram(hexagram, locale as 'zh' | 'zh-CN' | 'en')
    const hexagramName = localContent.name || localContent.principle || ''

    const question = qt(`q${qNum}` as any)

    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hexagramId,
          hexagramName,
          changingLines: [],
          relatedHexagramId: undefined,
          question,
          locale,
        }),
      })
      if (res.status === 503) {
        setInterpretationState('fallback')
        return
      }
      const data = await res.json()
      if (data.interpretation) {
        setInterpretationText(data.interpretation)
        setInterpretationState('done')
      } else {
        setInterpretationState('error')
      }
    } catch {
      setInterpretationState('error')
    }
  }

  const handleAssessmentSave = useCallback((scores: AssessmentScores) => {
    if (!session) return

    const assessment: DailyAssessment = {
      date: session.date,
      hexagramId: session.hexagram.id,
      scores,
    }

    // Save assessment to session history
    const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    const entry = history.find((h: PracticeSession) => h.date === session.date)
    if (entry) {
      entry.assessment = assessment
      sessionStorage.setItem('karmic_history', JSON.stringify(history))
    }

    setShowAssessment(false)
    setQuestionNumber(pickDailyQuestion(session.dayNumber))
    setShowDailyQuestion(true)
  }, [session])

  const handleAssessmentSkip = useCallback(() => {
    if (!session) return

    // Mark as skipped (null)
    const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    const entry = history.find((h: PracticeSession) => h.date === session.date)
    if (entry) {
      entry.assessment = null
      sessionStorage.setItem('karmic_history', JSON.stringify(history))
    }

    setShowAssessment(false)
    setQuestionNumber(pickDailyQuestion(session.dayNumber))
    setShowDailyQuestion(true)
  }, [session])

  const syncToCommunity = async (answerText: string, qNum: number) => {
    try {
      await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'anonymous-' + Math.random().toString(36).slice(2, 10),
          date: session?.date,
          dayNumber: session?.dayNumber,
          hexagramId: session?.hexagram.id,
          questionNumber: qNum,
          answer: answerText,
        }),
      })
    } catch {
      // Silently fail — community sync is best-effort
    }
  }

  const handleContinue = () => {
    if (session) {
      router.push('/dashboard')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-karmic-muted">{t('loading')}</p>
      </div>
    )
  }

  const { hexagram } = session
  const localContent = getLocalizedHexagram(hexagram, locale as 'zh' | 'zh-CN' | 'en')

  // AI Interpretation modal
  if (showInterpretation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="karmic-card w-full max-w-lg">
          <p className="caption uppercase tracking-widest mb-4 text-karmic-accent">
            {it('aiLabel')}
          </p>
          {interpretationState === 'loading' && (
            <div className="py-8 animate-pulse-slow">
              <p className="body text-karmic-muted">{it('loading')}</p>
            </div>
          )}
          {interpretationState === 'fallback' && (
            <div className="py-4">
              <p className="body text-karmic-muted">{it('fallback')}</p>
            </div>
          )}
          {interpretationState === 'error' && (
            <div className="py-4">
              <p className="body text-karmic-muted">{it('error')}</p>
            </div>
          )}
          {interpretationState === 'done' && (
            <div className="text-left mb-6">
              <p className="body leading-relaxed">{interpretationText}</p>
              <p className="caption text-karmic-muted mt-4 text-center">{it('disclaimer')}</p>
            </div>
          )}
          <button
            onClick={() => { setShowInterpretation(false); setShowAssessment(true) }}
            className="btn-primary w-full max-w-xs mx-auto mt-4"
          >
            {t('continue')}
          </button>
        </div>
      </div>
    )
  }

  // Assessment modal
  if (showAssessment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <AssessmentTable
          onSave={handleAssessmentSave}
          onSkip={handleAssessmentSkip}
        />
      </div>
    )
  }

  if (showDailyQuestion && !submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-4 text-karmic-muted">{qt('prompt')}</p>
        <div className="karmic-card-gold w-full max-w-md mb-8">
          <p className="text-xl font-serif italic text-gold leading-relaxed mb-6">
            &ldquo;{qt(`q${questionNumber}` as any)}&rdquo;
          </p>
          <textarea
            placeholder="..."
            value={questionAnswer}
            onChange={e => setQuestionAnswer(e.target.value)}
            className="karmic-input min-h-[60px] resize-none text-sm"
            rows={2}
          />
        </div>
        <div className="space-y-3 w-full max-w-xs">
          <button
            onClick={() => {
              // Save answer to history and sync to community
              const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
              const entry = history.find((h: PracticeSession) => h.date === session?.date)
              if (entry) {
                entry.questionAnswer = questionAnswer
                entry.questionNumber = questionNumber
                sessionStorage.setItem('karmic_history', JSON.stringify(history))
              }
              if (questionAnswer.trim()) {
                syncToCommunity(questionAnswer, questionNumber)
              }
              setSubmitted(true)
            }}
            className="btn-primary w-full"
          >
            {qt('submit')}
          </button>
          <button
            onClick={() => setSubmitted(true)}
            className="w-full text-center py-2 caption hover:text-karmic-muted transition-colors"
          >
            {qt('skip')}
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="text-5xl mb-6">
          {completed ? '🌅' : '💫'}
        </div>
        <h2 className="h2 text-gold mb-3">
          {completed ? t('complete') : t('thankYou')}
        </h2>
        <p className="body text-karmic-muted mb-2">
          {completed ? t('completeMessage') : t('failedMessage')}
        </p>
        <p className="caption mb-8">
          {completed
            ? t('day', { day: session.dayNumber }) + ' · ' + localContent.name
            : t('comeBackTomorrow')}
        </p>
        <button onClick={handleContinue} className="btn-primary w-full max-w-xs">
          {completed ? t('continue') : t('backToDashboard')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Day header */}
      <div className="text-center mb-8 pt-4">
        <p className="caption uppercase tracking-widest mb-1">{t('day', { day: session.dayNumber })}</p>
        <div className="text-5xl mb-3">{'䷀'}</div>
        <h2 className="h2 text-gold mb-1">{localContent.name}</h2>
        {locale === 'zh' && hexagram.nameEn && (
          <p className="text-sm text-karmic-muted">{hexagram.nameEn}</p>
        )}
      </div>

      {/* The principle */}
      <div className="karmic-card-gold text-center mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">{t('todaysWisdom')}</p>
        <p className="text-lg font-serif italic text-gold leading-relaxed">
          &ldquo;{localContent.principle}&rdquo;
        </p>
      </div>

      {/* The practice */}
      <div className="karmic-card mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">{t('yourPractice')}</p>
        <p className="body text-lg mb-4 leading-relaxed">{localContent.practice}</p>
        <div className="bg-karmic-bg/50 rounded-xl p-4">
          <p className="caption uppercase tracking-widest mb-1">{t('whyThisMatters')}</p>
          <p className="body text-sm text-karmic-muted leading-relaxed">{localContent.why}</p>
        </div>
      </div>

      {/* Reflection */}
      <div className="karmic-card mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">{t('reflection')}</p>
        <textarea
          placeholder={t('reflectionPlaceholder')}
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          className="karmic-input min-h-[80px] resize-none"
          rows={3}
        />
      </div>

      {/* Mood */}
      <div className="karmic-card mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">{t('moodQuestion')}</p>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map(m => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`flex-1 py-3 rounded-xl text-xl transition-all ${
                mood === m
                  ? 'bg-karmic-gold/20 border border-karmic-gold'
                  : 'border border-karmic-border text-karmic-muted hover:border-karmic-accent'
              }`}
            >
              {['😔', '😐', '😊', '😄', '🌟'][m - 1]}
            </button>
          ))}
        </div>
      </div>

      {/* Complete / Skip */}
      <div className="space-y-3 animate-fade-in">
        <button
          onClick={() => { setCompleted(true); setTimeout(handleSubmit, 300) }}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span className="text-lg">✓</span>
          {t('iDidIt')}
        </button>
        <button
          onClick={() => { setCompleted(false); setTimeout(handleSubmit, 300) }}
          className="btn-ghost w-full text-center"
        >
          {t('triedButFailed')}
        </button>
        <button
          onClick={() => {
            setCompleted(false)
            setReflection('Skipped')
            setTimeout(handleSubmit, 200)
          }}
          className="w-full text-center py-2 caption hover:text-karmic-danger transition-colors"
        >
          {t('skipToday')}
        </button>
      </div>
    </div>
  )
}
