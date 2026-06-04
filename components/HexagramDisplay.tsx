'use client'

import { HexagramGuide } from '@/lib/iching'

interface Props {
  hexagram: HexagramGuide
  size?: 'sm' | 'md' | 'lg'
}

// 生成卦象的阴阳爻表示
function getHexagramLines(id: number): boolean[] {
  // 简化的阴阳爻生成，使用卦ID映射
  const lines: boolean[] = []
  let n = id - 1
  for (let i = 0; i < 6; i++) {
    lines.push(n % 2 === 0) // true = yang, false = yin
    n = Math.floor(n / 2)
  }
  return lines.reverse()
}

export default function HexagramDisplay({ hexagram, size = 'md' }: Props) {
  const lines = getHexagramLines(hexagram.id)
  const sizeMap = { sm: 'w-8', md: 'w-12', lg: 'w-16' }
  const lineWidth = sizeMap[size]

  return (
    <div className="hexagram-lines">
      {lines.map((isYang, i) => (
        <div key={i} className={`hexagram-line ${isYang ? 'yang' : 'yin'} ${lineWidth}`} />
      ))}
    </div>
  )
}
