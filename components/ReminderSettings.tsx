'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'

interface StoredSettings {
  enabled: boolean
  hour: number
  minute: number
}

const STORAGE_KEY = 'karmic_reminder'

function loadSettings(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        enabled: parsed.enabled === true,
        hour: typeof parsed.hour === 'number' ? parsed.hour : 8,
        minute: typeof parsed.minute === 'number' ? parsed.minute : 0,
      }
    }
  } catch {}
  return { enabled: false, hour: 8, minute: 0 }
}

function saveSettings(s: StoredSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function getMsUntilTarget(hour: number, minute: number): number {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0)
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1)
  }
  return target.getTime() - now.getTime()
}

export default function ReminderSettings() {
  const t = useTranslations('reminder')
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<StoredSettings>(loadSettings)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [savedMsg, setSavedMsg] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const missedCheckRef = useRef(false)

  const schedule = useCallback((hour: number, minute: number, enabled: boolean) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (!enabled || permission !== 'granted') return

    const ms = getMsUntilTarget(hour, minute)

    // Check if we missed today's reminder (opened page after target time)
    if (!missedCheckRef.current) {
      missedCheckRef.current = true
      const now = new Date()
      const todayTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0)
      if (now.getTime() > todayTarget.getTime() + 5 * 60 * 1000) {
        // Missed today's reminder, show it now with a short delay
        setTimeout(() => {
          new Notification(t('title'), {
            body: t('description'),
            icon: '/favicon.ico',
          })
        }, 3000)
      }
    }

    timerRef.current = setTimeout(() => {
      if (Notification.permission === 'granted') {
        new Notification(t('title'), {
          body: t('description'),
          icon: '/favicon.ico',
        })
      }
      // Reschedule for next day
      schedule(hour, minute, true)
    }, ms)
  }, [permission, t])

  useEffect(() => {
    setPermission(Notification.permission)
    if (settings.enabled) {
      schedule(settings.hour, settings.minute, true)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [schedule, settings.enabled, settings.hour, settings.minute])

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === 'granted') {
      schedule(settings.hour, settings.minute, settings.enabled)
    }
  }, [settings, schedule])

  const toggle = useCallback(() => {
    setSettings(prev => {
      const next = { ...prev, enabled: !prev.enabled }
      saveSettings(next)
      if (!next.enabled && timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      if (next.enabled && permission !== 'granted') {
        requestPermission()
      }
      if (next.enabled && permission === 'granted') {
        schedule(next.hour, next.minute, true)
      }
      return next
    })
  }, [permission, requestPermission, schedule])

  const updateTime = useCallback((h: string, m: string) => {
    const hour = parseInt(h) || 8
    const minute = parseInt(m) || 0
    setSettings(prev => {
      const next = { ...prev, hour, minute }
      saveSettings(next)
      if (next.enabled && permission === 'granted') {
        schedule(hour, minute, true)
      }
      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2000)
      return next
    })
  }, [permission, schedule])

  const testNotification = useCallback(() => {
    if (permission === 'granted') {
      new Notification(t('title'), {
        body: t('testNotification'),
        icon: '/favicon.ico',
      })
    } else {
      requestPermission()
    }
  }, [permission, requestPermission, t])

  const formatTime = (h: number, m: number) =>
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-full transition-colors hover:bg-karmic-border ${
          settings.enabled ? 'text-gold' : 'text-karmic-muted'
        }`}
        title={t('title')}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {settings.enabled && (
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-karmic-danger rounded-full" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-karmic-card-bg border border-karmic-border rounded-xl p-5 shadow-xl animate-fade-in">
            <h3 className="h3 mb-1">{t('title')}</h3>
            <p className="caption text-karmic-muted mb-4">{t('description')}</p>

            {/* Enable toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="body text-sm">
                {settings.enabled ? t('enable') : t('disable')}
              </span>
              <button
                onClick={toggle}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.enabled ? 'bg-karmic-gold' : 'bg-karmic-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Time picker */}
            {settings.enabled && (
              <>
                {permission === 'denied' && (
                  <p className="text-xs text-karmic-danger mb-3">{t('permissionDenied')}</p>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="caption">{t('time')}</span>
                  <select
                    value={settings.hour}
                    onChange={e => updateTime(e.target.value, String(settings.minute))}
                    className="karmic-input text-sm px-2 py-1 rounded"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span className="text-karmic-muted">:</span>
                  <select
                    value={settings.minute}
                    onChange={e => updateTime(String(settings.hour), e.target.value)}
                    className="karmic-input text-sm px-2 py-1 rounded"
                  >
                    {[0, 15, 30, 45].map(m => (
                      <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>

                {/* Test button */}
                <button
                  onClick={testNotification}
                  className="body text-sm text-karmic-gold hover:underline mb-3 block"
                >
                  {t('testNotification')}
                </button>
              </>
            )}

            {savedMsg && (
              <p className="text-xs text-karmic-success animate-fade-in">{t('saved')}</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
