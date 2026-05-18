import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import type { SensorReading } from "@/types";

// Mock the store
vi.mock("@/store/dashboardStore", () => ({
  useDashboardStore: (selector: (s: any) => any) =>
    selector({ selectedStateId: "test-state-id", timeRange: "24h" }),
}));

// Mock the service
vi.mock("@/services/sensorService", () => ({
  fetchLatestSensorReading: vi.fn(),
  fetchHistoricalReadings: vi.fn(),
  fetchStateInfo: vi.fn(),
  fetchPaginatedSensorReadings: vi.fn(),
}));

import {
  useLatestSensorReading,
  useHistoricalReadings,
  useStateInfo,
} from "./useSensorData";
import {
  fetchLatestSensorReading,
  fetchHistoricalReadings,
  fetchStateInfo,
} from "@/services/sensorService";

const mockReading: Partial<SensorReading> = {
  id: "1",
  state_id: "test-state-id",
  state_name: "Test",
  water_temperature: 25,
  ph: 7.5,
  nh4: 0.5,
  conductivity: 500,
  turbidity: 10,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
}

describe("useLatestSensorReading", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches and enriches the latest reading", async () => {
    vi.mocked(fetchLatestSensorReading).mockResolvedValue(mockReading as SensorReading);

    const { result } = renderHook(() => useLatestSensorReading(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchLatestSensorReading).toHaveBeenCalledWith("test-state-id");
    // enrichSensorReading should have calculated salinity from conductivity
    expect(result.current.data?.salinity).toBe(320); // 0.64 * 500
  });

  it("handles null response", async () => {
    vi.mocked(fetchLatestSensorReading).mockResolvedValue(null);

    const { result } = renderHook(() => useLatestSensorReading(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });
});

describe("useHistoricalReadings", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches and enriches historical readings", async () => {
    vi.mocked(fetchHistoricalReadings).mockResolvedValue([mockReading as SensorReading]);

    const { result } = renderHook(() => useHistoricalReadings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchHistoricalReadings).toHaveBeenCalledWith("test-state-id", "24h");
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].salinity).toBe(320);
  });
});

describe("useStateInfo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("fetches state info with correct id", async () => {
    const mockState = { id: "test-state-id", name: "Test Dam" };
    vi.mocked(fetchStateInfo).mockResolvedValue(mockState as any);

    const { result } = renderHook(() => useStateInfo(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchStateInfo).toHaveBeenCalledWith("test-state-id");
    expect(result.current.data?.name).toBe("Test Dam");
  });
});
