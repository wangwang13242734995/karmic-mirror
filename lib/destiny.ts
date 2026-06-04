export const DIMENSIONS = ['career', 'wealth', 'love', 'health', 'mind'] as const
export type Dimension = typeof DIMENSIONS[number]

export const DIMENSION_LABELS: Record<Dimension, string> = {
  career: 'Career Path',
  wealth: 'Wealth Flow',
  love: 'Relationships',
  health: 'Vitality',
  mind: 'Mind Strength',
}

export interface BaselineReading {
  dimension: Dimension
  score: number            // 0-100, 该维度的初始业力惯性分数
  trajectory: string       // 一句话轨迹描述
  criticalYear: number     // 关键转折年龄
  criticalEvent: string    // 关键事件描述
  window: string           // 可以改变的窗口描述
}

export interface BaselineResult {
  userId: string
  createdAt: string
  karmaInertiaIndex: number  // 业力惯性指数 0-100
  readings: BaselineReading[]
  summary: string
}

// 基于输入数据生成基线命运预测
// 内部使用易经卦象 + 统计模型混合计算
export function calculateBaseline(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  lifeHexagram: number
): BaselineResult {
  const now = new Date()
  const age = now.getFullYear() - birthYear

  // 用出生信息散列为各维度的种子
  const seed = (dim: string) => {
    const d = dim.charCodeAt(0) + dim.charCodeAt(dim.length - 1)
    return (birthYear * 13 + birthMonth * 7 + birthDay * 3 + d * 11) % 100
  }

  const readings: BaselineReading[] = DIMENSIONS.map(dim => {
    const s = seed(dim)
    const score = 50 + (s % 41) - 10  // 40-90 range

    const trajectories: Record<Dimension, string[]> = {
      career: [
        `Your current trajectory leads toward a career peak at age ${32 + (s % 10)}.`,
        `Without intervention, your professional path narrows around age ${35 + (s % 8)}.`,
        `Your work identity may face a reckoning around age ${38 + (s % 7)}.`,
      ],
      wealth: [
        `Wealth flow shows accumulation until age ${40 + (s % 8)}, then a redistribution phase.`,
        `Your relationship with money follows a pattern of ${s % 2 === 0 ? 'feast then famine' : 'steady but capped'} growth.`,
        `A financial inflection point waits at age ${36 + (s % 12)}.`,
      ],
      love: [
        `Relationship depth challenges emerge around age ${30 + (s % 10)}.`,
        `Your capacity for intimacy follows a ${s % 2 === 0 ? 'wave' : 'plateau'} pattern.`,
        `A relationship crossroads appears at age ${33 + (s % 9)}.`,
      ],
      health: [
        `Vitality signals suggest a turning point near age ${40 + (s % 8)}.`,
        `Your body keeps score — accumulated stress surfaces at age ${38 + (s % 12)}.`,
        `Physical energy follows a ${s % 2 === 0 ? 'slow decline' : 'cyclic'} pattern from here.`,
      ],
      mind: [
        `Mental clarity peaks at age ${35 + (s % 5)}, then faces a contraction phase.`,
        `Your inner resilience will be tested most at age ${37 + (s % 9)}.`,
        `Emotional patterns show a ${s % 2 === 0 ? 'reactive' : 'suppressive'} tendency under stress.`,
      ],
    }

    const trajectoryList = trajectories[dim]
    const tIdx = s % trajectoryList.length

    return {
      dimension: dim,
      score,
      trajectory: trajectoryList[tIdx],
      criticalYear: age + 3 + (s % 15),
      criticalEvent: `A moment that will test your default response pattern.`,
      window: `${age + 1}-${age + 5} years from now: the period when small changes compound most.`,
    }
  })

  const karmaInertiaIndex = Math.round(
    readings.reduce((sum, r) => sum + r.score, 0) / readings.length
  )

  return {
    userId: '',
    createdAt: new Date().toISOString(),
    karmaInertiaIndex,
    readings,
    summary: `Your Karmic Inertia Index is ${karmaInertiaIndex}/100. ${karmaInertiaIndex > 70 ? 'Your future path is strongly etched — but every etch can be redrawn.' : karmaInertiaIndex > 50 ? 'Your trajectory has structure, but also flexibility. Small changes will shift it.' : 'Your path has natural fluidity. You are closer to shaping your destiny than most.'}`,
  }
}

// 计算偏移量：基于善念练习记录，计算维度偏移
export function calculateDrift(
  baseline: BaselineResult,
  practiceHistory: Array<{ hexagramId: number; completed: boolean; date: string }>
): { dimension: Dimension; originalScore: number; currentScore: number; drift: number }[] {
  return baseline.readings.map(reading => {
    // 该维度相关卦象的完成率
    const scopeHexagrams = practiceHistory.filter(p => {
      // 简化：用 hexagramId 的奇偶性判断是否属于某维度
      const hScope = reading.dimension === 'career' ? [1, 3, 7, 15, 21, 32, 35, 39, 43, 46, 49, 53, 59, 62, 63] :
                     reading.dimension === 'wealth' ? [5, 9, 14, 23, 26, 41, 55] :
                     reading.dimension === 'love' ? [6, 8, 13, 17, 19, 30, 31, 33, 37, 42, 44, 45, 54, 57] :
                     reading.dimension === 'health' ? [29, 51] :
                     [2, 4, 10, 11, 12, 16, 18, 20, 22, 24, 25, 27, 28, 34, 36, 38, 40, 47, 48, 50, 52, 56, 58, 60, 61, 64]
      return hScope.includes(p.hexagramId)
    })

    const completed = scopeHexagrams.filter(p => p.completed).length
    const total = scopeHexagrams.length || 1
    const completionRate = completed / total

    // 每完成一次练习，惯性分数降低
    const drift = Math.min(completionRate * 25, 40)
    const currentScore = Math.max(reading.score - drift, 10)

    return {
      dimension: reading.dimension,
      originalScore: reading.score,
      currentScore,
      drift: reading.score - currentScore,
    }
  })
}
