import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import NavigationBar from '@/components/NavigationBar'

const locales = ['en', 'zh', 'zh-CN']

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params

  if (!locales.includes(locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale.startsWith('zh') ? 'zh-CN' : 'en'}>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NavigationBar />
          <main className="max-w-lg mx-auto px-4 py-6">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
