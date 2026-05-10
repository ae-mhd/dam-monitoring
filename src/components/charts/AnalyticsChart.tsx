import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import type { TooltipPayload } from 'recharts/types/state/tooltipSlice'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatValue } from '@/lib/utils'
import type { MetricConfig, SensorReading } from '@/types'

interface AnalyticsChartProps {
  configs: MetricConfig[]
  data: SensorReading[]
  isLoading: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload
  label?: string | number
  configs: MetricConfig[]
}

function CustomTooltip({ active, payload, label, configs }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-xl border border-slate-700">
      <p className="text-muted mb-2 font-medium">{label}</p>
      <div className="flex flex-col gap-1.5">
        {payload.map((entry) => {
          const config = configs.find(c => c.key === entry.dataKey)
          if (!config) return null
          return (
            <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                <span className="text-slate-300">{config.label}</span>
              </div>
              <span className="font-bold" style={{ color: entry.color }}>
                {formatValue(entry.value as number | null, config.decimals)} {config.unit}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ChartPoint {
  time: string
  [key: string]: string | number | null
}

export function AnalyticsChart({ configs, data, isLoading }: AnalyticsChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => {
        const point: ChartPoint = {
          time: new Date(d.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
        configs.forEach(c => {
          point[c.key] = (d[c.key as keyof SensorReading] as number) ?? null
        })
        return point
      }),
    [data, configs]
  )

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-xl" />
  }

  if (!chartData.length) {
    return (
      <div className="w-full h-[400px] rounded-xl flex flex-col items-center justify-center text-muted gap-2">
        <span className="text-3xl opacity-30">📊</span>
        <p className="text-sm">No data available for this period</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 11, fill: '#64748b' }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        
        {configs.map((config, index) => (
          <YAxis
            key={`yaxis-${config.key}`}
            yAxisId={config.key}
            orientation={index % 2 === 0 ? 'left' : 'right'}
            tick={{ fontSize: 11, fill: '#64748b' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatValue(v, config.decimals)}
            hide={index > 1} // Hide extra axes to prevent clutter
            width={52}
          />
        ))}

        <Tooltip
          content={(props) => <CustomTooltip {...props} configs={configs} />}
          cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 2' }}
        />
        
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />

        {configs.map((config) => (
          <Line
            key={`line-${config.key}`}
            yAxisId={config.key}
            type="monotone"
            name={config.label}
            dataKey={config.key}
            stroke={config.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: config.color, stroke: '#0f172a', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={600}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
