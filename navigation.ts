import { createSharedPathnamesNavigation } from 'next-intl/navigation'

export const locales = ['en', 'zh', 'zh-CN'] as const
export type Locale = (typeof locales)[number]

export const { Link, redirect, usePathname, useRouter } =
  createSharedPathnamesNavigation({ locales })
