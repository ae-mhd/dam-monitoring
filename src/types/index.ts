// ── Sensor & API Types ────────────────────────────────────────────────────────

export interface SensorReading {
  id: string
  state_id: string
  state_name: string
  temperature: number | null
  humidity: number | null
  soil_temperature: number | null
  soil_humidity: number | null
  lighting: number | null
  salinity: number | null
  volume: number | null
  cod: number | null
  turbidity: number | null
  ph: number | null
  orp: number | null
  status: number
  water_temperature: number | null
  conductivity: number | null
  o2: number | null
  nh4: number | null
  cod_built: number | null
  soil_ph: number | null
  nitrogen: number | null
  phosphorus: number | null
  potassium: number | null
  rainfall: number | null
  chlorophil?: number | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  state?: StationState
}

export interface StationState {
  id: string
  state_id: number
  country_id: string | null
  country_name: string | null
  name: string
  postal_code: string
  coordinates: string
  type: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: { url: string | null; label: string; active: boolean }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// ── Metric Config ─────────────────────────────────────────────────────────────

export type AlertLevel = 'normal' | 'warning' | 'critical' | 'offline'
export type TimeRange = '24h' | '7d' | '30d' | '6m'
export type MetricKey = keyof Pick<
  SensorReading,
  | 'temperature'
  | 'humidity'
  | 'water_temperature'
  | 'ph'
  | 'conductivity'
  | 'turbidity'
  | 'salinity'
  | 'o2'
  | 'nh4'
  | 'volume'
>

export interface MetricThreshold {
  warning: number
  critical: number
}

export interface MetricConfig {
  key: MetricKey
  label: string
  unit: string
  icon: string
  color: string
  gradientFrom: string
  gradientTo: string
  chartType: 'line' | 'area'
  thresholds: MetricThreshold
  decimals: number
}

// ── Dashboard Store ───────────────────────────────────────────────────────────

export interface DashboardStore {
  activeMetric: MetricKey
  selectedStateId: string
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  timeRange: TimeRange
  setActiveMetric: (m: MetricKey) => void
  setSelectedStateId: (id: string) => void
  setTheme: (t: 'light' | 'dark') => void
  toggleTheme: () => void
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  setTimeRange: (r: TimeRange) => void
}
