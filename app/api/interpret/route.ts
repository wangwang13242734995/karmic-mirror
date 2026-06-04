import { NextRequest, NextResponse } from 'next/server'

const TIMEOUT_MS = 15000

function buildSystemPrompt(locale: string): string {
  if (locale === 'zh-CN') {
    return `你是易经解卦助手。结合卦象、动爻、之卦和用户的具体问题，给出有上下文感知的解读。不是算命，而是帮用户看清当前局势、获得新的视角。解读需包含：(1) 当前处境分析 (2) 变化趋势 (3) 行动建议。控制在200字以内。使用普世品格语言，避免佛教术语。`
  }
  if (locale === 'zh') {
    return `你是易经解卦助手。结合卦象、动爻、之卦和用户的具体问题，给出有上下文感知的解读。不是算命，而是帮用户看清当前局势、获得新的视角。解读需包含：(1) 当前处境分析 (2) 变化趋势 (3) 行动建议。控制在200字以内。`
  }
  return `You are an I Ching interpretation assistant. Combine the hexagram, changing lines, related hexagram, and the user's specific question to provide a context-aware reading. This is not fortune-telling — help the user see their current situation clearly and gain a fresh perspective. Your interpretation should include: (1) Analysis of the current situation (2) Trends of change (3) Actionable advice. Keep it within 150 words.`
}

function buildUserMessage(
  hexagramId: number,
  hexagramName: string,
  changingLines: number[],
  relatedHexagramId: number | undefined,
  relatedHexagramName: string | undefined,
  question: string,
  locale: string
): string {
  if (locale.startsWith('zh')) {
    let msg = `本卦：第${hexagramId}卦 ${hexagramName}\n`
    if (changingLines.length > 0) {
      msg += `动爻：第${changingLines.map(l => l + 1).join('、')}爻\n`
    }
    if (relatedHexagramId && relatedHexagramName) {
      msg += `之卦：第${relatedHexagramId}卦 ${relatedHexagramName}\n`
    }
    msg += `用户问题：${question}`
    return msg
  }
  let msg = `Primary Hexagram: #${hexagramId} ${hexagramName}\n`
  if (changingLines.length > 0) {
    msg += `Changing Lines: ${changingLines.map(l => l + 1).join(', ')}\n`
  }
  if (relatedHexagramId && relatedHexagramName) {
    msg += `Related Hexagram: #${relatedHexagramId} ${relatedHexagramName}\n`
  }
  msg += `User Question: ${question}`
  return msg
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY not configured' },
      { status: 503 }
    )
  }

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  let body: {
    hexagramId: number
    hexagramName: string
    changingLines: number[]
    relatedHexagramId?: number
    relatedHexagramName?: string
    question: string
    locale: 'zh' | 'en' | 'zh-CN'
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { hexagramId, hexagramName, changingLines = [], relatedHexagramId, relatedHexagramName, question, locale = 'zh' } = body

  if (hexagramId == null || !question) {
    return NextResponse.json({ error: 'Missing required fields: hexagramId, question' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt(locale) },
          { role: 'user', content: buildUserMessage(hexagramId, hexagramName, changingLines, relatedHexagramId, relatedHexagramName, question, locale) },
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error('OpenAI API error:', response.status, errText)
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const interpretation = data.choices?.[0]?.message?.content?.trim()

    if (!interpretation) {
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 502 }
      )
    }

    return NextResponse.json({ interpretation })
  } catch (e: any) {
    clearTimeout(timeoutId)
    if (e.name === 'AbortError') {
      return NextResponse.json(
        { error: 'AI interpretation timed out' },
        { status: 504 }
      )
    }
    console.error('Interpret API error:', e)
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    )
  }
}
