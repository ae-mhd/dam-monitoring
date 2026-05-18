import { describe, it, expect } from "vitest";
import {
  cn,
  enrichSensorReading,
  getAlertInfo,
  getAlertLevel,
  formatValue,
  getTrend,
  parseCoordinates,
  getTimeRangeDates,
  computeStats,
  formatDateTime,
} from "./utils";
import type { MetricConfig, SensorReading } from "@/types";

// Helper to create a minimal SensorReading
function makeReading(overrides: Partial<SensorReading> = {}): SensorReading {
  return {
    id: "1",
    state_id: "s1",
    state_name: "Test",
    temperature: null,
    humidity: null,
    soil_temperature: null,
    soil_humidity: null,
    lighting: null,
    salinity: null,
    volume: null,
    cod: null,
    turbidity: null,
    ph: null,
    orp: null,
    status: 1,
    water_temperature: null,
    conductivity: null,
    o2: null,
    nh4: null,
    cod_built: null,
    soil_ph: null,
    nitrogen: null,
    phosphorus: null,
    potassium: null,
    rainfall: null,
    deleted_at: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const makeConfig = (key: string, thresholds = { warning: 30, critical: 38 }): MetricConfig => ({
  key: key as MetricConfig["key"],
  label: key,
  unit: "u",
  icon: "waves",
  color: "#000",
  gradientFrom: "#00040",
  gradientTo: "#00005",
  chartType: "line",
  thresholds,
  decimals: 2,
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatValue", () => {
  it("returns — for null", () => {
    expect(formatValue(null, 2)).toBe("—");
  });

  it("returns — for undefined", () => {
    expect(formatValue(undefined, 2)).toBe("—");
  });

  it("formats with correct decimals", () => {
    expect(formatValue(3.14159, 2)).toBe("3.14");
    expect(formatValue(7, 0)).toBe("7");
  });
});

describe("getTrend", () => {
  it("returns stable for nulls", () => {
    expect(getTrend(null, null)).toBe("stable");
    expect(getTrend(5, null)).toBe("stable");
    expect(getTrend(null, 5)).toBe("stable");
  });

  it("returns up when current > previous", () => {
    expect(getTrend(5, 4)).toBe("up");
  });

  it("returns down when current < previous", () => {
    expect(getTrend(3, 4)).toBe("down");
  });

  it("returns stable within threshold", () => {
    expect(getTrend(5, 5.005)).toBe("stable");
  });
});

describe("parseCoordinates", () => {
  it("parses valid coordinates", () => {
    expect(parseCoordinates("36.75, 3.04")).toEqual({ lat: 36.75, lng: 3.04 });
  });

  it("returns null for invalid input", () => {
    expect(parseCoordinates("invalid")).toBeNull();
    expect(parseCoordinates("36.75")).toBeNull();
    expect(parseCoordinates("abc, def")).toBeNull();
  });
});

describe("getTimeRangeDates", () => {
  it("returns same day for 24h", () => {
    const { from, to } = getTimeRangeDates("24h");
    expect(from).toBe(to);
  });

  it("returns 7 days range", () => {
    const { from, to } = getTimeRangeDates("7d");
    const diff = new Date(to).getTime() - new Date(from).getTime();
    expect(diff).toBeCloseTo(7 * 86400000, -4);
  });

  it("returns 30 days range", () => {
    const { from, to } = getTimeRangeDates("30d");
    const diff = new Date(to).getTime() - new Date(from).getTime();
    expect(diff).toBeCloseTo(30 * 86400000, -4);
  });

  it("returns 180 days range for 6m", () => {
    const { from, to } = getTimeRangeDates("6m");
    const diff = new Date(to).getTime() - new Date(from).getTime();
    expect(diff).toBeCloseTo(180 * 86400000, -4);
  });
});

describe("computeStats", () => {
  it("returns nulls for empty array", () => {
    expect(computeStats([], "water_temperature")).toEqual({ min: null, max: null, avg: null });
  });

  it("computes min, max, avg", () => {
    const data = [
      makeReading({ water_temperature: 10 }),
      makeReading({ water_temperature: 20 }),
      makeReading({ water_temperature: 30 }),
    ];
    expect(computeStats(data, "water_temperature")).toEqual({ min: 10, max: 30, avg: 20 });
  });

  it("ignores null values", () => {
    const data = [
      makeReading({ water_temperature: 10 }),
      makeReading({ water_temperature: null }),
      makeReading({ water_temperature: 20 }),
    ];
    expect(computeStats(data, "water_temperature")).toEqual({ min: 10, max: 20, avg: 15 });
  });
});

describe("getAlertInfo", () => {
  it("returns offline for null value", () => {
    const config = makeConfig("o2");
    expect(getAlertInfo(null, config)).toEqual({ level: "offline", label: "Offline" });
  });

  it("returns none for metrics without rules", () => {
    const config = makeConfig("water_temperature");
    expect(getAlertInfo(25, config)).toEqual({ level: "none", label: "" });
  });

  it("evaluates o2 thresholds correctly", () => {
    const config = makeConfig("o2");
    expect(getAlertInfo(1, config).level).toBe("critical");
    expect(getAlertInfo(3, config).level).toBe("warning");
    expect(getAlertInfo(5, config).level).toBe("caution");
    expect(getAlertInfo(8, config).level).toBe("normal");
  });

  it("evaluates turbidity thresholds correctly", () => {
    const config = makeConfig("turbidity");
    expect(getAlertInfo(3, config).level).toBe("normal");
    expect(getAlertInfo(7, config).level).toBe("caution");
    expect(getAlertInfo(30, config).level).toBe("warning");
    expect(getAlertInfo(100, config).level).toBe("critical");
  });
});

describe("getAlertLevel", () => {
  it("returns just the level string", () => {
    const config = makeConfig("o2");
    expect(getAlertLevel(1, config)).toBe("critical");
  });
});

describe("enrichSensorReading", () => {
  it("returns null for null input", () => {
    expect(enrichSensorReading(null)).toBeNull();
  });

  it("calculates ammonia and ammonium from TAN, temp, pH", () => {
    const reading = makeReading({ nh4: 1.0, water_temperature: 25, ph: 8.0 });
    const result = enrichSensorReading(reading)!;
    expect(result.ammonia).toBeGreaterThan(0);
    expect(result.ammonium).toBeGreaterThan(0);
    // ammonia + ammonium should equal TAN
    expect(result.ammonia! + result.ammonium!).toBeCloseTo(1.0, 5);
  });

  it("calculates salinity from conductivity", () => {
    const reading = makeReading({ conductivity: 1000 });
    const result = enrichSensorReading(reading)!;
    expect(result.salinity).toBe(640);
  });

  it("calculates concentration from turbidity", () => {
    const reading = makeReading({ turbidity: 50 });
    const result = enrichSensorReading(reading)!;
    expect(result.concentration).toBeCloseTo((50 + 17.063) / 74.129, 5);
  });

  it("does not calculate ammonia if any input is null", () => {
    const reading = makeReading({ nh4: 1.0, water_temperature: 25, ph: null });
    const result = enrichSensorReading(reading)!;
    expect(result.ammonia).toBeUndefined();
  });
});

describe("formatDateTime", () => {
  it("returns — for null", () => {
    expect(formatDateTime(null)).toBe("—");
  });

  it("formats a valid date string", () => {
    const result = formatDateTime("2026-05-18T14:30:00Z");
    expect(result).toContain("18");
    expect(result).toContain("May");
    expect(result).toContain("2026");
  });
});
