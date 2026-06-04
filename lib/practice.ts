import { HexagramGuide, HEXAGRAMS, getDailyHexagram, type Locale } from './iching'

export interface AssessmentScores {
  generosity:    { body: number; speech: number; mind: number }
  discipline:    { body: number; speech: number; mind: number }
  patience:      { body: number; speech: number; mind: number }
  diligence:     { body: number; speech: number; mind: number }
  concentration: { body: number; speech: number; mind: number }
  wisdom:        { body: number; speech: number; mind: number }
}

export interface DailyAssessment {
  date: string
  hexagramId: number
  scores: AssessmentScores
}

export interface MonthlyFeedback {
  month: string
  wealth: number
  safety: number
  relationships: number
  achievement: number
  clarity: number
  overall: number
}

export interface PracticeSession {
  date: string
  dayNumber: number
  hexagram: HexagramGuide
  completed: boolean | null
  reflection: string
  mood: number
  questionAnswer?: string
  questionNumber?: number
  assessment?: DailyAssessment | null
}

export interface PracticeStreak {
  current: number
  longest: number
  totalCompleted: number
  totalSessions: number
}

export function getTodayPractice(dateStr: string, practiceDay: number): PracticeSession {
  const hexagram = getDailyHexagram(dateStr, practiceDay)
  return {
    date: dateStr,
    dayNumber: practiceDay,
    hexagram,
    completed: null,
    reflection: '',
    mood: 3,
  }
}

export function calculateStreak(history: PracticeSession[]): PracticeStreak {
  const completed = history.filter(s => s.completed === true)
  
  let current = 0
  let longest = 0
  let temp = 0

  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].completed === true) {
      temp++
      if (temp > longest) longest = temp
    } else {
      if (i === 0) current = temp
      temp = 0
    }
  }
  if (sorted.length > 0 && sorted[0].completed === true && current === 0) {
    current = temp
  }

  return {
    current,
    longest: Math.max(longest, current),
    totalCompleted: completed.length,
    totalSessions: history.length,
  }
}

const rippleData = {
  zh: {
    ripples: [
      '一位同事得到了你的耐心，而非沮丧',
      '一位家人因为你停下来倾听而感到被看见',
      '一位陌生人捕捉到你的微笑并把它传递给了下一个人',
      '未来的你自己——ta将继承更少的悔恨和更多的平静',
    ],
    summaries: [
      '你的第一道涟漪从今天开始。',
      (n: number) => `你已经创造了 ${n} 个正向影响时刻。它们很小，但它们是真实的。`,
      (n: number) => `你通过练习影响了大约 ${n} 个人。他们中的一些人永远不会知道你的名字。`,
      (n: number) => `通过 ${n} 天的练习，你的涟漪已经触达成百上千的人。你正在无声地重塑你的世界。`,
    ],
  },
  en: {
    ripples: [
      'A coworker who received your patience instead of your frustration',
      'A family member who felt seen because you paused and listened',
      'A stranger who caught your smile and carried it to someone else',
      'Your own future self — who now inherits less regret and more peace',
    ],
    summaries: [
      'Your first ripple starts today.',
      (n: number) => `You have created ${n} moments of positive impact. They are small, but they are real.`,
      (n: number) => `You have affected approximately ${n} people through your practice. Some of them will never know your name.`,
      (n: number) => `Through ${n} days of practice, your ripples have touched hundreds. You are silently reshaping your world.`,
    ],
  },
}

export function getRippleEffect(history: PracticeSession[], locale: Locale = 'en'): {
  peopleAffected: number
  ripples: string[]
  summary: string
} {
  const completed = history.filter(s => s.completed === true).length
  const dataLocale = locale === 'zh-CN' ? 'zh' : locale
  const data = rippleData[dataLocale]
  const n = completed * 3

  let summaryIdx: number
  if (completed === 0) summaryIdx = 0
  else if (completed < 5) summaryIdx = 1
  else if (completed < 30) summaryIdx = 2
  else summaryIdx = 3

  const summaryFn = data.summaries[summaryIdx]
  const summary = typeof summaryFn === 'function' ? summaryFn(completed) : summaryFn

  return {
    peopleAffected: Math.max(n, 1),
    ripples: data.ripples.slice(0, Math.min(completed, 4)),
    summary,
  }
}

export function getCommunityRanking(practiceDays: number): {
  percentile: number
  totalUsers: number
  rank: number
} {
  const totalUsers = 124837
  let percentile = 50

  if (practiceDays === 0) percentile = 5
  else if (practiceDays <= 3) percentile = 15
  else if (practiceDays <= 7) percentile = 35
  else if (practiceDays <= 14) percentile = 55
  else if (practiceDays <= 30) percentile = 75
  else if (practiceDays <= 60) percentile = 90
  else if (practiceDays <= 100) percentile = 97
  else percentile = 99

  return {
    percentile,
    totalUsers,
    rank: Math.round(totalUsers * (1 - percentile / 100)),
  }
}

const antiSelfData = {
  zh: {
    traits: [
      '急躁——打断别人的话，永远听不到他们真正想说什么',
      '吝啬——抓住每一分钱、每一句赞美、每一秒注意力不放',
      '逃避——把每个挑战看作需要逃离的威胁，而非需要学习的功课',
      '记恨——记录每一笔委屈，让苦涩无声地复利',
      '恐惧——让害怕出错的心理扼杀了可能做对的事',
    ],
    dissolving: '你的"反我"正在溶解。你完成的每一次练习都在削弱这个版本的你。',
    footholds: (n: number) => `你的"反我"还剩下 ${n} 个立足点。每一个都是你选择了更轻松道路的日子。`,
  },
  en: {
    traits: [
      'Impatient — cuts others off mid-sentence, never hears what they really mean',
      'Withholding — holds onto every dollar, every compliment, every second of attention',
      'Avoidant — sees every challenge as a threat to be fled, not a lesson to be learned',
      'Resentful — keeps score of every wrong, lets bitterness compound silently',
      'Fearful — lets the fear of what might go wrong prevent what could go right',
    ],
    dissolving: 'Your anti-self is dissolving. Every practice you complete weakens this version of you.',
    footholds: (n: number) => `Your anti-self has ${n} footholds remaining. Each one is a day you chose the easier path.`,
  },
}

export function getAntiSelfProfile(history: PracticeSession[], locale: Locale = 'en'): {
  traits: string[]
  summary: string
} {
  const skipped = history.filter(s => s.completed === false)
  const dataLocale = locale === 'zh-CN' ? 'zh' : locale
  const data = antiSelfData[dataLocale]

  return {
    traits: data.traits.slice(0, Math.min(skipped.length + 2, 5)),
    summary: skipped.length === 0
      ? data.dissolving
      : data.footholds(skipped.length),
  }
}
