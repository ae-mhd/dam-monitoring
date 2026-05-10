import { cn } from '@/lib/utils'
import type { AlertLevel } from '@/types'

const levelStyles: Record<AlertLevel, string> = {
  normal: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  offline: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
}

const levelDot: Record<AlertLevel, string> = {
  normal: 'bg-emerald-400',
  warning: 'bg-amber-400',
  critical: 'bg-red-400',
  offline: 'bg-slate-400',
}

const levelLabel: Record<AlertLevel, string> = {
  normal: 'Normal',
  warning: 'Warning',
  critical: 'Critical',
  offline: 'Offline',
}

interface StatusBadgeProps {
  level: AlertLevel
  className?: string
}

export function StatusBadge({ level, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        levelStyles[level],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', levelDot[level], level !== 'offline' && 'pulse-dot')} />
      {levelLabel[level]}
    </span>
  )
}
