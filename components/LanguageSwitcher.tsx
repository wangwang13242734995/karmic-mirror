'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const DEFAULT_LOCALE = 'en'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('languageSwitcher')

  const switchLanguage = () => {
    const isChinese = locale === 'zh' || locale === 'zh-CN'
    const newLocale = isChinese ? DEFAULT_LOCALE : 'zh'

    let newPath: string
    if (locale === DEFAULT_LOCALE) {
      // Currently on default (no prefix) → add /zh prefix
      newPath = `/${newLocale}${pathname}`
    } else {
      // Currently on non-default (/zh/... or /zh-CN/...) → strip prefix for default, or replace
      if (newLocale === DEFAULT_LOCALE) {
        newPath = pathname.replace(`/${locale}`, '') || '/'
      } else {
        newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
      }
    }

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
