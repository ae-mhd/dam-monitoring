import api from './api'
import type { PaginatedResponse, SensorReading, StationState } from '@/types'
import { getTimeRangeDates } from '@/lib/utils'

// Fetch latest single sensor reading for a state
export async function fetchLatestSensorReading(
  stateId: string
): Promise<SensorReading | null> {
  const { data } = await api.post<PaginatedResponse<SensorReading>>(
    '/last-sensor-readings/search',
    {
      pagination: { per_page: 1, current_page: 1 },
      search: '',
      state_id: stateId,
    }
  )
  return data.data[0] ?? null
}

// Fetch historical sensor readings
export async function fetchHistoricalReadings(
  stateId: string,
  timeRange: string
): Promise<SensorReading[]> {
  const { from, to } = getTimeRangeDates(timeRange)
  const perPage = timeRange === '24h' ? 288 : timeRange === '7d' ? 168 : 120

  const { data } = await api.post<PaginatedResponse<SensorReading>>(
    '/sensor-readings/search',
    {
      pagination: { per_page: perPage, current_page: 1 },
      orderBy: 'created_at',
      order: 'asc',
      from,
      to,
      state_id: stateId,
    }
  )
  return data.data
}

// Fetch state information
export async function fetchStateInfo(
  stateId: string
): Promise<StationState | null> {
  try {
    const { data } = await api.get<StationState>(`/states/${stateId}`)
    return data
  } catch {
    return null
  }
}

// Fetch all available states (for search)
export async function fetchAllStates(): Promise<StationState[]> {
  try {
    const { data } = await api.get<{ data: StationState[] }>('/states')
    return data.data ?? []
  } catch {
    return []
  }
}
