'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getTodayPractice, type PracticeSession, type DailyAssessment, type AssessmentScores } from '@/lib/practice'
import { getLocalized } from '@/lib/iching'
import AssessmentTable from '@/components/AssessmentTable'

export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({ day: String(i + 1) }))
}

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<PracticeSession | null>(null)
  const [completed, setCompleted] = useState<boolean | null>(null)
  const [reflection, setReflection] = useState('')
  const [mood, setMood] = useState(3)
  const [submitted, setSubmitted] = useState(false)
  const [showAssessment, setShowAssessment] = useState(false)
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

    setShowInterpretation(true)
    setInterpretationState('loading')
    fetchInterpretation(session.hexagram.id, session.dayNumber)
  }

  const fetchInterpretation = async (hexagramId: number, dayNumber: number) => {
    const hexagramName = hexagram.name || hexagram.principle || ''
    const questions = [
      'Which matters more — having good intentions, or performing good deeds?',
      'If a kindness goes entirely unnoticed, does it still count?',
      'Is a good act done out of duty as valuable as one done out of love?',
      'Can you be angry at someone and still wish them well?',
      'If you had to choose — be right, or be kind — which would you pick?',
      'Do you owe more kindness to strangers or to yourself?',
      'Is forgiveness for the other person, or for you?',
      'When you help someone, are you changing their destiny — or yours?',
      'Can an unkind truth be more loving than a kind lie?',
      'If every thought left a trace in the world, would you think differently?',
      'Is it possible to be too selfless?',
      'Does suffering make a person kinder, or harder?',
      'If no one were watching, who would you be?',
      'What is one kindness you received that changed you — but the giver never knew?',
    ]
    const question = questions[((dayNumber - 1) % questions.length)]

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
          locale: 'en',
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

    const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    const entry = history.find((h: PracticeSession) => h.date === session.date)
    if (entry) {
      entry.assessment = assessment
      sessionStorage.setItem('karmic_history', JSON.stringify(history))
    }

    setShowAssessment(false)
    setSubmitted(true)
  }, [session])

  const handleAssessmentSkip = useCallback(() => {
    if (!session) return

    const history = JSON.parse(sessionStorage.getItem('karmic_history') || '[]')
    const entry = history.find((h: PracticeSession) => h.date === session.date)
    if (entry) {
      entry.assessment = null
      sessionStorage.setItem('karmic_history', JSON.stringify(history))
    }

    setShowAssessment(false)
    setSubmitted(true)
  }, [session])

  const handleContinue = () => {
    if (session) {
      router.push('/dashboard')
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-karmic-muted">Loading your practice...</p>
      </div>
    )
  }

  const { hexagram } = session

  if (showInterpretation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="karmic-card w-full max-w-lg">
          <p className="caption uppercase tracking-widest mb-4 text-karmic-accent">
            AI Interpretation
          </p>
          {interpretationState === 'loading' && (
            <div className="py-8 animate-pulse-slow">
              <p className="body text-karmic-muted">AI is reading your hexagram and question...</p>
            </div>
          )}
          {interpretationState === 'fallback' && (
            <div className="py-4">
              <p className="body text-karmic-muted">AI interpretation is not configured</p>
            </div>
          )}
          {interpretationState === 'error' && (
            <div className="py-4">
              <p className="body text-karmic-muted">AI interpretation is unavailable, please try again later</p>
            </div>
          )}
          {interpretationState === 'done' && (
            <div className="text-left mb-6">
              <p className="body leading-relaxed">{interpretationText}</p>
              <p className="caption text-karmic-muted mt-4 text-center">This interpretation is AI-generated, for reference only</p>
            </div>
          )}
          <button
            onClick={() => { setShowInterpretation(false); setShowAssessment(true) }}
            className="btn-primary w-full max-w-xs mx-auto mt-4"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

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

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <div className="text-5xl mb-6">
          {completed ? '🌅' : '💫'}
        </div>
        <h2 className="h2 text-gold mb-3">
          {completed ? 'Practice Complete' : 'Thank You'}
        </h2>
        <p className="body text-karmic-muted mb-2">
          {completed
            ? 'You have taken one step off the path of inertia. The mirror has shifted.'
            : 'Honesty matters more than success. You showed up — that already counts.'}
        </p>
        <p className="caption mb-8">
          {completed
            ? `Day ${session.dayNumber} · ${hexagram.name}`
            : 'Come back tomorrow. The practice will be waiting.'}
        </p>
        <button onClick={handleContinue} className="btn-primary w-full max-w-xs">
          {completed ? 'Continue' : 'Back to Dashboard'}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Day header */}
      <div className="text-center mb-8 pt-4">
        <p className="caption uppercase tracking-widest mb-1">Day {session.dayNumber}</p>
        <div className="text-5xl mb-3">{'䷀'}</div>
        <h2 className="h2 text-gold mb-1">{hexagram.name}</h2>
        <p className="text-sm text-karmic-muted">{hexagram.nameEn}</p>
      </div>

      {/* The principle */}
      <div className="karmic-card-gold text-center mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">Today&apos;s Wisdom</p>
        <p className="text-lg font-serif italic text-gold leading-relaxed">
          &ldquo;{getLocalized(hexagram.principle, 'en')}&rdquo;
        </p>
      </div>

      {/* The practice */}
      <div className="karmic-card mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">Your Practice</p>
        <p className="body text-lg mb-4 leading-relaxed">{getLocalized(hexagram.practice, 'en')}</p>
        <div className="bg-karmic-bg/50 rounded-xl p-4">
          <p className="caption uppercase tracking-widest mb-1">Why This Matters</p>
          <p className="body text-sm text-karmic-muted leading-relaxed">{getLocalized(hexagram.why, 'en')}</p>
        </div>
      </div>

      {/* Reflection */}
      <div className="karmic-card mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">Reflection</p>
        <textarea
          placeholder="What happened when you tried this? How did it feel?"
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          className="karmic-input min-h-[80px] resize-none"
          rows={3}
        />
      </div>

      {/* Mood */}
      <div className="karmic-card mb-8 animate-fade-in">
        <p className="caption uppercase tracking-widest mb-3">How do you feel today?</p>
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
          I did it
        </button>
        <button
          onClick={() => { setCompleted(false); setTimeout(handleSubmit, 300) }}
          className="btn-ghost w-full text-center"
        >
          I tried but couldn&apos;t do it today
        </button>
        <button
          onClick={() => {
            setCompleted(false)
            setReflection('Skipped')
            setTimeout(handleSubmit, 200)
          }}
          className="w-full text-center py-2 caption hover:text-karmic-danger transition-colors"
        >
          Skip today
        </button>
      </div>
    </div>
  )
}
