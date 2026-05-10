import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  LineChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatValue, computeStats } from '@/lib/utils'
import type { MetricConfig, SensorReading } from '@/types'

interface MetricChartProps {
  config: MetricConfig
  data: SensorReading[]
  isLoading: boolean
}

interface CustomTooltipProps {
  active?: boolean
  payload?: any
  label?: string
  config: MetricConfig
}

function CustomTooltip({ active, payload, label, config }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs shadow-xl border border-slate-700">
      <p className="text-muted mb-1">{label}</p>
      <p className="font-bold" style={{ color: config.color }}>
        {formatValue(value as number | null, config.decimals)} {config.unit}
      </p>
    </div>
  )
}

export function MetricChart({ config, data, isLoading }: MetricChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        time: new Date(d.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        value: d[config.key] ?? null,
      })),
    [data, config.key]
  )

  const stats = computeStats(data, config.key)

  if (isLoading) {
    return <Skeleton className="w-full h-64 rounded-xl" />
  }

  if (!chartData.length) {
    return (
      <div className="w-full h-64 rounded-xl flex flex-col items-center justify-center text-muted gap-2">
        <span className="text-3xl opacity-30">📊</span>
        <p className="text-sm">No data available for this period</p>
      </div>
    )
  }

  const gradientId = `gradient-${config.key}`

  const sharedProps = {
    data: chartData,
    margin: { top: 10, right: 16, left: -10, bottom: 0 },
  }

  const axisProps = {
    xAxis: (
      <XAxis
        dataKey="time"
        tick={{ fontSize: 10, fill: '#64748b' }}
        tickLine={false}
        axisLine={false}
        interval="preserveStartEnd"
      />
    ),
    yAxis: (
      <YAxis
        tick={{ fontSize: 10, fill: '#64748b' }}
        tickLine={false}
        axisLine={false}
        tickFormatter={(v: number) => formatValue(v, config.decimals)}
        width={52}
      />
    ),
    grid: (
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
    ),
    tooltip: (
      <Tooltip
        content={(props) => <CustomTooltip {...props} config={config} />}
        cursor={{ stroke: config.color, strokeWidth: 1, strokeDasharray: '4 2' }}
      />
    ),
    avgLine: stats.avg != null ? (
      <ReferenceLine
        y={stats.avg}
        stroke={config.color}
        strokeDasharray="4 4"
        strokeOpacity={0.4}
        label={{
          value: `avg ${formatValue(stats.avg, config.decimals)}`,
          position: 'insideTopRight',
          fontSize: 9,
          fill: config.color,
        }}
      />
    ) : null,
    warnLine: (
      <ReferenceLine
        y={config.thresholds.warning}
        stroke="#f59e0b"
        strokeDasharray="3 3"
        strokeOpacity={0.35}
      />
    ),
    critLine: (
      <ReferenceLine
        y={config.thresholds.critical}
        stroke="#ef4444"
        strokeDasharray="3 3"
        strokeOpacity={0.35}
      />
    ),
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      {config.chartType === 'area' ? (
        <AreaChart {...sharedProps}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0.01} />
            </linearGradient>
          </defs>
          {axisProps.grid}
          {axisProps.xAxis}
          {axisProps.yAxis}
          {axisProps.tooltip}
          {axisProps.avgLine}
          {axisProps.warnLine}
          {axisProps.critLine}
          <Area
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: config.color, stroke: '#0f172a', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={600}
          />
        </AreaChart>
      ) : (
        <LineChart {...sharedProps}>
          {axisProps.grid}
          {axisProps.xAxis}
          {axisProps.yAxis}
          {axisProps.tooltip}
          {axisProps.avgLine}
          {axisProps.warnLine}
          {axisProps.critLine}
          <Line
            type="monotone"
            dataKey="value"
            stroke={config.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: config.color, stroke: '#0f172a', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={600}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}
