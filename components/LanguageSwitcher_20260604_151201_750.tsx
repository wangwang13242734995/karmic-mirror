'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('languageSwitcher')

  const switchLanguage = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh'
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <button
      onClick={switchLanguage}
      className="px-3 py-1.5 text-xs border border-karmic-border rounded-full hover:border-karmic-accent transition-colors"
      aria-label={t('label')}
    >
      {t('switchTo')}
    </button>
  )
}
