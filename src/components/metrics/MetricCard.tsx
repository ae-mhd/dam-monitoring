import { cn, formatValue, getAlertLevel, getTrend } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Icon, TrendingUp, TrendingDown, Minus } from '@/components/ui/Icons'
import { Skeleton } from '@/components/ui/Skeleton'
import type { MetricConfig, SensorReading } from '@/types'

interface MetricCardProps {
  config: MetricConfig
  reading: SensorReading | null | undefined
  prevReading?: SensorReading | null
  isActive: boolean
  isLoading: boolean
  onClick: () => void
  animationClass?: string
}

export function MetricCard({
  config,
  reading,
  prevReading,
  isActive,
  isLoading,
  onClick,
  animationClass,
}: MetricCardProps) {
  const rawValue = reading?.[config.key] ?? null
  const prevValue = prevReading?.[config.key] ?? null
  const alertLevel = getAlertLevel(rawValue, config)
  const trend = getTrend(rawValue as number | null, prevValue as number | null)

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor =
    trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-emerald-400' : 'text-muted'

  if (isLoading) {
    return (
      <div className="rounded-xl border border-card bg-card p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-20" />
      </div>
    )
  }

  return (
    <button
      id={`metric-card-${config.key}`}
      onClick={onClick}
      aria-label={`${config.label}: ${formatValue(rawValue as number | null, config.decimals)} ${config.unit}, status ${alertLevel}`}
      aria-pressed={isActive}
      className={cn(
        'relative w-full text-left rounded-xl border p-4 transition-all duration-200 group',
        'focus:outline-none focus:ring-2 focus:ring-sky-500/50',
        animationClass,
        isActive
          ? 'border-transparent scale-[1.02] shadow-lg'
          : 'border-card bg-card hover:bg-card-hover hover:border-slate-600 hover:scale-[1.01]',
        alertLevel === 'critical' && !isActive && 'border-red-500/40',
        alertLevel === 'warning' && !isActive && 'border-amber-500/30',
      )}
      style={
        isActive
          ? {
              background: `linear-gradient(135deg, ${config.gradientFrom.replace('40', '25')}, ${config.gradientTo})`,
              borderColor: config.color + '60',
              boxShadow: `0 0 20px ${config.color}20`,
            }
          : undefined
      }
    >
      {/* Active accent bar */}
      {isActive && (
        <div
          className="absolute left-0 top-4 bottom-4 w-0.5 rounded-r-full"
          style={{ background: config.color }}
        />
      )}

      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        <div
          className="p-2 rounded-lg transition-colors"
          style={{
            background: isActive ? config.color + '30' : config.gradientFrom,
          }}
        >
          <Icon
            name={config.icon}
            size={18}
            style={{ color: config.color }}
          />
        </div>
        <StatusBadge level={alertLevel} />
      </div>

      {/* Label */}
      <p className="text-xs text-muted font-medium mb-1">{config.label}</p>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span
          className="text-2xl font-bold text-primary tabular-nums"
          style={isActive ? { color: config.color } : undefined}
        >
          {formatValue(rawValue as number | null, config.decimals)}
        </span>
        <span className="text-xs text-muted mb-1 font-medium">{config.unit}</span>
      </div>

      {/* Trend */}
      <div className={cn('flex items-center gap-1 mt-2', trendColor)}>
        <TrendIcon size={12} />
        <span className="text-xs capitalize">{trend}</span>
      </div>
    </button>
  )
}
