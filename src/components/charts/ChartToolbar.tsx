import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/store/dashboardStore'
import { TIME_RANGES } from '@/lib/constants'
import type { TimeRange } from '@/types'
import { useTranslation } from 'react-i18next'

export function ChartToolbar() {
  const { t } = useTranslation()
  const { timeRange, setTimeRange } = useDashboardStore()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted font-medium mr-1">{t('analytics.range')}:</span>
      {TIME_RANGES.map(({ value }) => (
        <button
          key={value}
          id={`time-range-${value}`}
          onClick={() => setTimeRange(value as TimeRange)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
            timeRange === value
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'bg-card text-secondary hover:bg-card-hover hover:text-primary border border-card'
          )}
          aria-pressed={timeRange === value}
        >
          {t(`timeRanges.${value}`)}
        </button>
      ))}
    </div>
  )
}
