export function generateStaticParams() {
  const locales = ['en', 'zh', 'zh-CN']
  const days = Array.from({ length: 64 }, (_, i) => String(i + 1))
  return locales.flatMap(locale => days.map(day => ({ locale, day })))
}

export default function LocalePracticeDayLayout({ children }: { children: React.ReactNode }) {
  return children
}
