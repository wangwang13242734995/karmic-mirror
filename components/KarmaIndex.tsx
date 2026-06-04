'use client'

interface Props {
  value: number
  size?: number
  label?: string
  previousValue?: number
}

export default function KarmaIndex({ value, size = 120, label = 'Karmic Inertia', previousValue }: Props) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="gauge-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#1e1e2e" strokeWidth="6"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="url(#kiGradient)" strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="progress-ring-circle"
          />
          <defs>
            <linearGradient id="kiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c5cfc" />
              <stop offset="100%" stopColor="#c9a96e" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute text-2xl font-bold text-gold">{value}</span>
      </div>
      {label && <p className="caption mt-2">{label}</p>}
      {previousValue !== undefined && previousValue !== value && (
        <p className={`text-xs mt-1 ${value < previousValue ? 'text-accent' : 'text-karmic-danger'}`}>
          {value < previousValue ? `↓ ${previousValue - value}` : `↑ ${value - previousValue}`}
        </p>
      )}
    </div>
  )
}
