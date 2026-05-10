import { formatValue, computeStats } from '@/lib/utils'
import type { MetricConfig, SensorReading } from '@/types'
import { TrendingUp, TrendingDown, Minus } from '@/components/ui/Icons'
import { useTranslation } from 'react-i18next'

interface ActiveMetricSummaryProps {
  config: MetricConfig
  data: SensorReading[]
  currentReading: SensorReading | null | undefined
}

export function ActiveMetricSummary({
  config,
  data,
  currentReading,
}: ActiveMetricSummaryProps) {
  const { t } = useTranslation()
  const stats = computeStats(data, config.key)
  const current = currentReading?.[config.key] ?? null

  const stats_items = [
    { label: t('analytics.current'), value: current, icon: Minus, color: config.color },
    { label: t('analytics.minimum'), value: stats.min, icon: TrendingDown, color: '#34d399' },
    { label: t('analytics.average'), value: stats.avg, icon: Minus, color: '#94a3b8' },
    { label: t('analytics.maximum'), value: stats.max, icon: TrendingUp, color: '#f87171' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {stats_items.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="glass rounded-xl p-3 flex flex-col items-center text-center gap-1"
        >
          <Icon size={14} style={{ color }} />
          <span className="text-xs text-muted">{label}</span>
          <span className="text-base font-bold text-primary tabular-nums">
            {formatValue(value as number | null, config.decimals)}
          </span>
          <span className="text-xs text-muted">{config.unit}</span>
        </div>
      ))}
    </div>
  )
}
