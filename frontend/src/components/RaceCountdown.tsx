import { useEffect, useState } from 'react'

interface RaceCountdownProps {
  date: string
  time?: string | null
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

function calculateTimeLeft(dateStr: string, timeStr?: string | null): TimeLeft {
  const targetIso = timeStr ? `${dateStr}T${timeStr}Z` : `${dateStr}T14:00:00Z`
  const target = new Date(targetIso).getTime()
  const now = new Date().getTime()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds, isPast: false }
}

export default function RaceCountdown({ date, time }: RaceCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(date, time))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date, time))
    }, 1000)
    return () => clearInterval(timer)
  }, [date, time])

  if (timeLeft.isPast) {
    return (
      <div className="inline-flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Lights Out · Race Weekend Active
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex flex-col items-center justify-center rounded border border-line bg-ink/70 px-3 py-2 min-w-[54px]">
        <span className="font-display text-2xl font-black text-fg sm:text-3xl">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Days</span>
      </div>
      <span className="font-display text-xl font-bold text-muted/60">:</span>
      <div className="flex flex-col items-center justify-center rounded border border-line bg-ink/70 px-3 py-2 min-w-[54px]">
        <span className="font-display text-2xl font-black text-fg sm:text-3xl">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Hrs</span>
      </div>
      <span className="font-display text-xl font-bold text-muted/60">:</span>
      <div className="flex flex-col items-center justify-center rounded border border-line bg-ink/70 px-3 py-2 min-w-[54px]">
        <span className="font-display text-2xl font-black text-fg sm:text-3xl">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Min</span>
      </div>
      <span className="font-display text-xl font-bold text-muted/60">:</span>
      <div className="flex flex-col items-center justify-center rounded border border-line bg-ink/70 px-3 py-2 min-w-[54px]">
        <span className="font-display text-2xl font-black text-apex sm:text-3xl">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Sec</span>
      </div>
    </div>
  )
}
