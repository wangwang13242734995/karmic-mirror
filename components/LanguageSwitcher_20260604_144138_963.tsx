'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = () => {
    const nextLocale = locale === 'zh' ? 'en' : 'zh'
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <div className="flex justify-end mb-2">
      <button
        onClick={switchLocale}
        className="text-xs px-3 py-1.5 rounded-lg border border-karmic-border text-karmic-muted hover:text-karmic-gold hover:border-karmic-gold/40 transition-all"
        aria-label={locale === 'zh' ? 'Switch to English' : '切换为中文'}
      >
        {locale === 'zh' ? 'EN' : '中文'}
      </button>
    </div>
  )
}
