import { MetricCard } from './MetricCard'
import { METRICS } from '@/lib/constants'
import { useDashboardStore } from '@/store/dashboardStore'
import type { MetricKey, SensorReading } from '@/types'

interface MetricsGridProps {
  reading: SensorReading | null | undefined
  isLoading: boolean
}

const STAGGER = Array.from({ length: 20 }, (_, i) => `stagger-${i + 1}`)

export function MetricsGrid({ reading, isLoading }: MetricsGridProps) {
  const { activeMetric, setActiveMetric } = useDashboardStore()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
      {METRICS.map((config, i) => (
        <MetricCard
          key={config.key}
          config={config}
          reading={reading}
          isActive={activeMetric === config.key}
          isLoading={isLoading}
          onClick={() => setActiveMetric(config.key as MetricKey)}
          animationClass={`animate-slide-up ${STAGGER[i] ?? ''}`}
        />
      ))}
    </div>
  )
}
