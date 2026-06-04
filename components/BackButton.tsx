'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function BackButton() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('navigation')

  const basePath = locale === 'en' ? '' : `/${locale}`

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      const fallback = pathname.includes('/practice/')
        ? `${basePath}/dashboard`
        : pathname.includes('/drift') || pathname.includes('/share')
          ? `${basePath}/dashboard`
          : pathname.includes('/baseline')
            ? `${basePath}/onboarding`
            : `${basePath}/`
      router.push(fallback)
    }
  }

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-xs text-karmic-muted hover:text-gold transition-colors mb-4"
      aria-label={t('back')}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{t('back')}</span>
    </button>
  )
}
