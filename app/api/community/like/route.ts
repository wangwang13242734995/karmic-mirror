import { NextRequest, NextResponse } from 'next/server'
import { createClientSupabase } from '@/lib/supabase'

// POST /api/community/like
// Body: { reflectionId: string, userAnonId: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reflectionId, userAnonId } = body

    if (!reflectionId || !userAnonId) {
      return NextResponse.json(
        { error: 'Missing required fields: reflectionId, userAnonId' },
        { status: 400 }
      )
    }

    const supabase = createClientSupabase()

    // Check if already liked
    const { data: existing } = await supabase
      .from('reflection_likes')
      .select('id')
      .eq('reflection_id', reflectionId)
      .eq('user_anon_id', userAnonId)
      .single()

    if (existing) {
      // Unlike: delete record and decrement
      const { error: deleteError } = await supabase
        .from('reflection_likes')
        .delete()
        .eq('reflection_id', reflectionId)
        .eq('user_anon_id', userAnonId)

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      // Decrement like_count
      const { data: rpcResult } = await supabase
        .rpc('decrement_like_count', { reflection_id: reflectionId })

      // Fallback: manually update like_count
      const rpcData = rpcResult as { like_count?: number } | null
      if (!rpcData) {
        const { data: ref, error: refErr } = await supabase
          .from('reflections')
          .select('like_count')
          .eq('id', reflectionId)
          .single()

        if (!refErr && ref) {
          const newCount = Math.max(0, (ref.like_count || 1) - 1)
          await supabase
            .from('reflections')
            .update({ like_count: newCount })
            .eq('id', reflectionId)
          return NextResponse.json({ liked: false, likeCount: newCount })
        }
      }

      const likeCount = rpcData?.like_count ?? 0
      return NextResponse.json({ liked: false, likeCount })
    }

    // Like: insert record and increment
    const { error: insertError } = await supabase
      .from('reflection_likes')
      .insert({ reflection_id: reflectionId, user_anon_id: userAnonId })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Increment like_count
    const { data: rpcResult2 } = await supabase
      .rpc('increment_like_count', { reflection_id: reflectionId })

    // Fallback: manually update
    const rpcData2 = rpcResult2 as { like_count?: number } | null
    if (!rpcData2) {
      const { data: ref, error: refErr } = await supabase
        .from('reflections')
        .select('like_count')
        .eq('id', reflectionId)
        .single()

      if (!refErr && ref) {
        const newCount = (ref.like_count || 0) + 1
        await supabase
          .from('reflections')
          .update({ like_count: newCount })
          .eq('id', reflectionId)
        return NextResponse.json({ liked: true, likeCount: newCount })
      }
    }

    const likeCount = rpcData2?.like_count ?? 1
    return NextResponse.json({ liked: true, likeCount })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
