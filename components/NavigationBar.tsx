'use client'

import { usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'
import BackButton from '@/components/BackButton'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function NavigationBar() {
  const pathname = usePathname()
  const locale = useLocale()

  // Strip locale prefix for route matching
  const normalizedPath = locale === 'en' ? pathname : pathname.replace(`/${locale}`, '') || '/'

  // Show back button on all pages except landing
  const showBack = normalizedPath !== '/' && normalizedPath !== ''

  return (
    <div className="max-w-lg mx-auto px-4 pt-4">
      <div className="flex items-center justify-between">
        <div className="w-20">
          {showBack && <BackButton />}
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
