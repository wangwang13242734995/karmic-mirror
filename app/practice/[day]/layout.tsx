export function generateStaticParams() {
  return Array.from({ length: 64 }, (_, i) => ({ day: String(i + 1) }))
}

export default function PracticeDayLayout({ children }: { children: React.ReactNode }) {
  return children
}
