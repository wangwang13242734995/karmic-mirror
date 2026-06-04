'use client'

import { useTranslations } from 'next-intl'
import CommunityWall from '@/components/CommunityWall'

export default function CommunityPage() {
  const t = useTranslations('community')

  return (
    <div className="min-h-screen pb-24">
      <div className="text-center mb-8 pt-4">
        <h1 className="h1 text-gold mb-2">{t('title')}</h1>
        <p className="body text-karmic-muted text-sm">{t('subtitle')}</p>
      </div>
      <CommunityWall />
    </div>
  )
}
