import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['en', 'zh', 'zh-CN'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
