import { useQuery } from "@tanstack/react-query";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  fetchHistoricalReadings,
  fetchLatestSensorReading,
  fetchStateInfo,
  fetchPaginatedSensorReadings,
} from "@/services/sensorService";
import { enrichSensorReading } from "@/lib/utils";
import type { SensorReading } from "@/types";

export function useLatestSensorReading() {
  const stateId = useDashboardStore((s) => s.selectedStateId);
  return useQuery({
    queryKey: ["latestSensor", stateId],
    queryFn: async () => {
      const data = await fetchLatestSensorReading(stateId);
      return enrichSensorReading(data);
    },
    refetchInterval: 30_000,
    staleTime: 25_000,
    retry: 3,
  });
}

function sortByCreatedAtAsc(readings: SensorReading[]): SensorReading[] {
  return [...readings].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );
}

export function useHistoricalReadings() {
  const stateId = useDashboardStore((s) => s.selectedStateId);
  return useQuery({
    queryKey: ["historicalReadings", stateId],
    queryFn: async () => {
      const data = await fetchHistoricalReadings(stateId);
      return sortByCreatedAtAsc(data.map(enrichSensorReading) as SensorReading[]);
    },
    staleTime: 60_000,
    retry: 2,
  });
}

export function usePaginatedSensorReadings(page: number, perPage: number = 10, from?: string, to?: string) {
  const stateId = useDashboardStore((s) => s.selectedStateId);
  return useQuery({
    queryKey: ["paginatedReadings", stateId, page, perPage, from, to],
    queryFn: async () => {
      const response = await fetchPaginatedSensorReadings(
        stateId,
        page,
        perPage,
        from,
        to,
      );
      return {
        ...response,
        data: response.data.map(enrichSensorReading) as SensorReading[],
      };
    },
    staleTime: 60_000,
    retry: 2,
  });
}

export function useStateInfo() {
  const stateId = useDashboardStore((s) => s.selectedStateId);
  return useQuery({
    queryKey: ["stateInfo", stateId],
    queryFn: () => fetchStateInfo(stateId),
    staleTime: 300_000,
  });
}
