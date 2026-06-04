'use client'

interface Props {
  completed: boolean | null
  onClick?: () => void
  label?: string
}

export default function PracticeCard({ completed, onClick, label }: Props) {
  return (
    <button
      onClick={onClick}
      className={`karmic-card w-full text-left transition-all ${
        completed === true
          ? 'border-karmic-gold/40'
          : completed === false
            ? 'border-karmic-danger/20'
            : 'hover:border-karmic-gold/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          completed === true
            ? 'bg-karmic-gold/10 text-karmic-gold'
            : completed === false
              ? 'bg-karmic-danger/10 text-karmic-danger'
              : 'bg-karmic-border text-karmic-muted'
        }`}>
          {completed === true ? '✓' : completed === false ? '✗' : '○'}
        </div>
        <span className="body text-sm">{label || 'Today\'s Practice'}</span>
        {completed === true && (
          <span className="ml-auto text-xs text-karmic-gold">Done</span>
        )}
        {completed === false && (
          <span className="ml-auto text-xs text-karmic-muted">Skipped</span>
        )}
      </div>
    </button>
  )
}
