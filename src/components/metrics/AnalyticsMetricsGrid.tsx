import { MetricCard } from '@/components/metrics/MetricCard'
import { METRICS } from '@/lib/constants'
import { useDashboardStore } from '@/store/dashboardStore'
import type { MetricKey, SensorReading } from '@/types'

interface AnalyticsMetricsGridProps {
  reading: SensorReading | null | undefined
  isLoading: boolean
}

const STAGGER = Array.from({ length: 20 }, (_, i) => `stagger-${i + 1}`)

export function AnalyticsMetricsGrid({ reading, isLoading }: AnalyticsMetricsGridProps) {
  const { analyticsMetrics, toggleAnalyticsMetric } = useDashboardStore()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
      {METRICS.map((config, i) => (
        <MetricCard
          key={config.key}
          config={config}
          reading={reading}
          isActive={analyticsMetrics.includes(config.key as MetricKey)}
          isLoading={isLoading}
          onClick={() => toggleAnalyticsMetric(config.key as MetricKey)}
          animationClass={`animate-slide-up ${STAGGER[i] ?? ''}`}
        />
      ))}
    </div>
  )
}
