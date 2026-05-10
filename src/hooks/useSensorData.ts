import { useQuery } from '@tanstack/react-query'
import { useDashboardStore } from '@/store/dashboardStore'
import {
  fetchHistoricalReadings,
  fetchLatestSensorReading,
  fetchStateInfo,
  fetchPaginatedSensorReadings,
} from '@/services/sensorService'

export function useLatestSensorReading() {
  const stateId = useDashboardStore((s) => s.selectedStateId)
  return useQuery({
    queryKey: ['latestSensor', stateId],
    queryFn: () => fetchLatestSensorReading(stateId),
    refetchInterval: 30_000,
    staleTime: 25_000,
    retry: 3,
  })
}

export function useHistoricalReadings() {
  const stateId = useDashboardStore((s) => s.selectedStateId)
  const timeRange = useDashboardStore((s) => s.timeRange)
  return useQuery({
    queryKey: ['historicalReadings', stateId, timeRange],
    queryFn: () => fetchHistoricalReadings(stateId, timeRange),
    staleTime: 60_000,
    retry: 2,
  })
}

export function usePaginatedSensorReadings(page: number, perPage: number = 10) {
  const stateId = useDashboardStore((s) => s.selectedStateId)
  const timeRange = useDashboardStore((s) => s.timeRange)
  return useQuery({
    queryKey: ['paginatedReadings', stateId, timeRange, page, perPage],
    queryFn: () => fetchPaginatedSensorReadings(stateId, timeRange, page, perPage),
    staleTime: 60_000,
    retry: 2,
  })
}

export function useStateInfo() {
  const stateId = useDashboardStore((s) => s.selectedStateId)
  return useQuery({
    queryKey: ['stateInfo', stateId],
    queryFn: () => fetchStateInfo(stateId),
    staleTime: 300_000,
  })
}
