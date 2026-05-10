import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AlertLevel, MetricConfig, MetricKey, SensorReading } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Per-property alert rules ───────────────────────────────────────────────
// Each entry is an ordered list of { max, level, label } checked low→high.
// For o2 (dissolved oxygen) the scale is INVERTED: low = danger.


type AlertRule = { max: number; level: AlertLevel; label: string }

const ALERT_RULES: Partial<Record<MetricKey, AlertRule[]>> = {
  // 🫧 Dissolved Oxygen (mg/L) — inverted: low is dangerous
  o2: [
    { max: 2,        level: 'critical', label: 'Critical danger (asphyxiation)' },
    { max: 4,        level: 'warning',  label: 'Biological stress'              },
    { max: 6,        level: 'caution',  label: 'Moderate quality'               },
    { max: Infinity, level: 'normal',   label: 'Good quality'                   },
  ],
  // 🌫️ Turbidity (NTU)
  turbidity: [
    { max: 5,        level: 'normal',   label: 'Clear water'           },
    { max: 10,       level: 'caution',  label: 'Slight turbidity'      },
    { max: 50,       level: 'warning',  label: 'Probable pollution'    },
    { max: Infinity, level: 'critical', label: 'Severe degradation'    },
  ],
  // 🌱 Chlorophyll-a (µg/L) — mapped to `chlorophil` key in SensorReading
  chlorophil: [
    { max: 5,        level: 'normal',   label: 'Low algal activity'              },
    { max: 20,       level: 'caution',  label: 'Beginning of algal proliferation'},
    { max: 50,       level: 'warning',  label: 'Algal bloom'                     },
    { max: Infinity, level: 'critical', label: 'Severe eutrophication'           },
  ],
  // 🧪 TAN (Azote ammoniacal total) (mg/L)
  nh4: [
    { max: 0.2,      level: 'normal',   label: 'Clean water'           },
    { max: 0.5,      level: 'caution',  label: 'Slight pollution'      },
    { max: 1,        level: 'warning',  label: 'Significant pollution' },
    { max: Infinity, level: 'critical', label: 'Severe contamination'  },
  ],
}

export interface AlertInfo {
  level: AlertLevel
  label: string
}

export function getAlertInfo(
  value: number | null | undefined,
  config: MetricConfig
): AlertInfo {
  if (value == null) return { level: 'offline', label: 'Offline' }
  const rules = ALERT_RULES[config.key]
  if (!rules) return { level: 'none', label: '' }
  for (const rule of rules) {
    if (value <= rule.max) return { level: rule.level, label: rule.label }
  }
  return { level: 'none', label: '' }
}

/** Convenience wrapper — use getAlertInfo() when you also need the label. */
export function getAlertLevel(
  value: number | null | undefined,
  config: MetricConfig
): AlertLevel {
  return getAlertInfo(value, config).level
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
