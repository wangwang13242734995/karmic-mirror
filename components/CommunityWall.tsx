'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useLocale } from 'next-intl'
import { HEXAGRAMS, getLocalized } from '@/lib/iching'

interface Reflection {
  id: number
  user_id: string
  date: string
  day_number: number
  hexagram_id: number
  question_number: number
  answer: string
  like_count: number
  created_at: string
}

const QUESTIONS_ZH: Record<number, string> = {
  1: '善念和善行，哪个更重要？',
  2: '无人知晓的善行，还算善行吗？',
  3: '出于责任的善，和出于爱的善，价值相等吗？',
  4: '你可以对一个人感到愤怒，同时仍祝愿他好吗？',
  5: '如果必须二选一——正确，还是善良——你选哪个？',
  6: '你对陌生人的善意，应该多于对自己的善意吗？',
  7: '原谅，是为了对方，还是为了自己？',
  8: '当你帮助一个人时，你在改变他的命运，还是自己的？',
  9: '不善良的真相，是否比善良的谎言更有爱？',
  10: '如果每一个念头都会在世界留下痕迹，你的念头会不同吗？',
  11: '人可能过于无私吗？',
  12: '苦难让人更善良，还是更坚硬？',
  13: '如果没有人看着，你会是谁？',
  14: '你曾收过哪一个改变你的善意，而施予者从未知晓？',
}

const QUESTIONS_EN: Record<number, string> = {
  1: 'Which matters more — having good intentions, or performing good deeds?',
  2: 'If a kindness goes entirely unnoticed, does it still count?',
  3: 'Is a good act done out of duty as valuable as one done out of love?',
  4: 'Can you be angry at someone and still wish them well?',
  5: 'If you had to choose — be right, or be kind — which would you pick?',
  6: 'Do you owe more kindness to strangers or to yourself?',
  7: 'Is forgiveness for the other person, or for you?',
  8: 'When you help someone, are you changing their destiny — or yours?',
  9: 'Can an unkind truth be more loving than a kind lie?',
  10: 'If every thought left a trace in the world, would you think differently?',
  11: 'Is it possible to be too selfless?',
  12: 'Does suffering make a person kinder, or harder?',
  13: 'If no one were watching, who would you be?',
  14: 'What is one kindness you received that changed you — but the giver never knew?',
}

function getUserAnonId(): string {
  let id = localStorage.getItem('karmic_anon_id')
  if (!id) {
    id = 'anon-' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('karmic_anon_id', id)
  }
  return id
}

export default function CommunityWall() {
  const locale = useLocale() as 'zh' | 'en'
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [pendingLikes, setPendingLikes] = useState<Set<number>>(new Set())
  const likeTimeouts = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    fetch('/api/community?limit=20')
      .then(r => r.json())
      .then(result => {
        if (result.error) {
          setError(result.error)
        } else {
          setReflections(result.data || [])
        }
      })
      .catch(() => setError('Failed to load community'))
      .finally(() => setLoading(false))
  }, [])

  const toggleLike = useCallback(async (reflectionId: number) => {
    const userAnonId = getUserAnonId()
    const currentlyLiked = likedIds.has(reflectionId)

    // Optimistic update
    setLikedIds(prev => {
      const next = new Set(prev)
      if (currentlyLiked) next.delete(reflectionId)
      else next.add(reflectionId)
      return next
    })

    // Update like count optimistically
    setReflections(prev => prev.map(r =>
      r.id === reflectionId
        ? { ...r, like_count: r.like_count + (currentlyLiked ? -1 : 1) }
        : r
    ))

    setPendingLikes(prev => new Set(prev).add(reflectionId))

    try {
      const res = await fetch('/api/community/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reflectionId: String(reflectionId), userAnonId }),
      })
      const data = await res.json()

      if (data.error) {
        // Rollback
        setLikedIds(prev => {
          const next = new Set(prev)
          if (currentlyLiked) next.add(reflectionId)
          else next.delete(reflectionId)
          return next
        })
        setReflections(prev => prev.map(r =>
          r.id === reflectionId
            ? { ...r, like_count: data.likeCount ?? (r.like_count + (currentlyLiked ? 1 : -1)) }
            : r
        ))
        console.error('Like error:', data.error)
      } else {
        // Sync with server count
        setReflections(prev => prev.map(r =>
          r.id === reflectionId ? { ...r, like_count: data.likeCount } : r
        ))
      }
    } catch {
      // Rollback on network error
      setLikedIds(prev => {
        const next = new Set(prev)
        if (currentlyLiked) next.add(reflectionId)
        else next.delete(reflectionId)
        return next
      })
      setReflections(prev => prev.map(r =>
        r.id === reflectionId
          ? { ...r, like_count: r.like_count + (currentlyLiked ? 1 : -1) }
          : r
      ))
    } finally {
      setPendingLikes(prev => {
        const next = new Set(prev)
        next.delete(reflectionId)
        return next
      })
    }
  }, [likedIds])

  const questions = locale === 'zh' ? QUESTIONS_ZH : QUESTIONS_EN
  const isZh = locale === 'zh'

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-4 bg-karmic-border rounded w-3/4 mx-auto mb-3" />
          <div className="h-4 bg-karmic-border rounded w-1/2 mx-auto" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="body text-karmic-muted mb-2">
          {isZh ? '社区暂时无法加载' : 'Community is waking up'}
        </p>
        <p className="caption">{isZh ? '请稍后再试' : 'Please try again later'}</p>
      </div>
    )
  }

  if (reflections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="body text-karmic-muted">
          {isZh ? '还没有人分享反思。成为第一个吧。' : 'No reflections yet. Be the first.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reflections.map(r => {
        const hex = HEXAGRAMS.find(h => h.id === r.hexagram_id)
        const currentLiked = likedIds.has(r.id)
        const pending = pendingLikes.has(r.id)

        return (
          <div key={r.id} className="karmic-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-lg font-bold mt-0.5 shrink-0 text-gold">
                {hex ? hex.name : '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="body text-sm text-gold italic mb-1">
                  &ldquo;{questions[r.question_number] || `Question #${r.question_number}`}&rdquo;
                </p>
                <p className="body text-sm leading-relaxed break-words">
                  {r.answer}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-karmic-muted">
              <span>Day {r.day_number}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleLike(r.id)}
                  disabled={pending}
                  className="flex items-center gap-1 transition-colors hover:text-karmic-danger disabled:opacity-50"
                  title={isZh ? (currentLiked ? '已点赞' : '点赞') : (currentLiked ? 'Liked' : 'Like')}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill={currentLiked ? '#e74c3c' : 'none'}
                    stroke={currentLiked ? '#e74c3c' : 'currentColor'}
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {(r.like_count || 0) > 0 && (
                    <span>{r.like_count}</span>
                  )}
                </button>
                <span>{new Date(r.created_at).toLocaleDateString(isZh ? 'zh-CN' : 'en-US')}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
