import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AlertLevel, MetricConfig, SensorReading } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAlertLevel(
  value: number | null | undefined,
  config: MetricConfig
): AlertLevel {
  if (value == null) return 'offline'
  if (value >= config.thresholds.critical) return 'critical'
  if (value >= config.thresholds.warning) return 'warning'
  return 'normal'
}

export function formatValue(
  value: number | null | undefined,
  decimals: number
): string {
  if (value == null) return '—'
  return value.toFixed(decimals)
}

export function getTrend(
  current: number | null,
  previous: number | null
): 'up' | 'down' | 'stable' {
  if (current == null || previous == null) return 'stable'
  if (current > previous + 0.01) return 'up'
  if (current < previous - 0.01) return 'down'
  return 'stable'
}

export function parseCoordinates(
  coords: string
): { lat: number; lng: number } | null {
  const parts = coords.split(',').map((s) => parseFloat(s.trim()))
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null
  return { lat: parts[0], lng: parts[1] }
}

export function getTimeRangeDates(range: string): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0]
  let from: string

  switch (range) {
    case '7d':
      from = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
      break
    case '30d':
      from = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
      break
    case '6m':
      from = new Date(Date.now() - 180 * 86400000).toISOString().split('T')[0]
      break
    default:
      from = to
  }

  return { from, to }
}

export function computeStats<K extends keyof SensorReading>(data: SensorReading[], key: K) {
  const values = data
    .map((d) => d[key] as number)
    .filter((v) => v != null && !isNaN(v))

  if (!values.length) return { min: null, max: null, avg: null }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  return { min, max, avg }
}
