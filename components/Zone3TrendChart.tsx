'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { DailyAssessment } from '@/lib/practice'
import { channelSum } from './useDashboardData'

interface Props {
  history: { date: string; assessment: DailyAssessment | null | undefined }[]
}

type Range = 7 | 30 | 90

const CHANNELS = ['body', 'speech', 'mind'] as const
const COLORS: Record<string, string> = { body: '#60a5fa', speech: '#fb923c', mind: '#34d399' }

export default function Zone3TrendChart({ history }: Props) {
  const t = useTranslations('dashboard.zone3')
  const locale = useLocale()
  const [range, setRange] = useState<Range>(30)

  const assessments = useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - range)
    return history
      .filter(h => h.assessment?.scores && new Date(h.date) >= cutoff)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [history, range])

  const chartData = useMemo(() => {
    return assessments.map(a => ({
      date: a.date.slice(5), // MM-DD
      body: channelSum(a.assessment!.scores, 'body'),
      speech: channelSum(a.assessment!.scores, 'speech'),
      mind: channelSum(a.assessment!.scores, 'mind'),
    }))
  }, [assessments])

  // Insight
  const insight = useMemo(() => {
    if (chartData.length === 0) return null
    // Get this week's data (last 7 entries or fewer)
    const weekData = chartData.slice(-7)
    const bodyAvg = weekData.reduce((s, d) => s + d.body, 0) / weekData.length
    const speechAvg = weekData.reduce((s, d) => s + d.speech, 0) / weekData.length
    const mindAvg = weekData.reduce((s, d) => s + d.mind, 0) / weekData.length

    const chNames: Record<string, string> = { body: t('body'), speech: t('speech'), mind: t('mind') }
    const vals = [
      { key: 'body', label: chNames.body, val: bodyAvg },
      { key: 'speech', label: chNames.speech, val: speechAvg },
      { key: 'mind', label: chNames.mind, val: mindAvg },
    ]
    vals.sort((a, b) => b.val - a.val)
    const highest = vals[0]
    const lowest = vals[2]
    const diff = highest.val - lowest.val

    if (diff > 5) {
      return t('insightImbalance', { highest: highest.label, lowest: lowest.label })
    }
    return t('insightBalanced')
  }, [chartData, t])

  if (chartData.length === 0) {
    return (
      <div className="karmic-card mb-6">
        <h3 className="h3 text-gold mb-2">{t('title')}</h3>
        <p className="text-sm text-karmic-muted">{t('noData')}</p>
      </div>
    )
  }

  return (
    <div className="karmic-card mb-6">
      <h3 className="h3 text-gold mb-4">{t('title')}</h3>

      {/* Chart */}
      <div className="w-full h-[260px] mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
            <XAxis dataKey="date" tick={{ fill: '#6b6b7b', fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis domain={[0, 30]} tick={{ fill: '#6b6b7b', fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: '#14141f',
                border: '1px solid #1e1e2e',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#e0dcd0' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#e0dcd0' }}
            />
            {CHANNELS.map(ch => (
              <Line
                key={ch}
                type="monotone"
                dataKey={ch}
                name={t(ch)}
                stroke={COLORS[ch]}
                strokeWidth={2}
                dot={chartData.length <= 14}
                strokeDasharray={ch === 'mind' ? undefined : undefined}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Range selector */}
      <div className="flex gap-2 mb-4">
        {([7, 30, 90] as Range[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              range === r
                ? 'bg-karmic-accent/20 text-accent border border-karmic-accent'
                : 'text-karmic-muted border border-karmic-border hover:border-karmic-muted'
            }`}
          >
            {t(`days${r}` as any)}
          </button>
        ))}
      </div>

      {/* Insight */}
      {insight && (
        <div className="bg-karmic-bg/50 rounded-xl p-4">
          <p className="text-sm text-karmic-text italic leading-relaxed">{insight}</p>
        </div>
      )}
    </div>
  )
}
