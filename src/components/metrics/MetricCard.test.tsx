import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MetricCard } from "./MetricCard";
import type { MetricConfig, SensorReading } from "@/types";

// Mock react-i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const config: MetricConfig = {
  key: "water_temperature",
  label: "Water Temp",
  unit: "°C",
  icon: "waves",
  color: "#06b6d4",
  gradientFrom: "#06b6d440",
  gradientTo: "#06b6d405",
  chartType: "area",
  thresholds: { warning: 30, critical: 38 },
  decimals: 1,
};

const mockReading = {
  id: "1",
  state_id: "s1",
  state_name: "Test",
  water_temperature: 25.7,
  ph: null,
  conductivity: null,
  turbidity: null,
  nh4: null,
  o2: null,
  salinity: null,
  status: 1,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
} as unknown as SensorReading;

describe("MetricCard", () => {
  it("renders value and unit", () => {
    render(
      <MetricCard
        config={config}
        reading={mockReading}
        isActive={false}
        isLoading={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByText("25.7")).toBeInTheDocument();
    expect(screen.getByText("°C")).toBeInTheDocument();
  });

  it("renders — when reading is null", () => {
    render(
      <MetricCard
        config={config}
        reading={null}
        isActive={false}
        isLoading={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("shows loading skeletons when isLoading", () => {
    const { container } = render(
      <MetricCard
        config={config}
        reading={null}
        isActive={false}
        isLoading={true}
        onClick={() => {}}
      />,
    );

    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(0);
  });

  it("fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(
      <MetricCard
        config={config}
        reading={mockReading}
        isActive={false}
        isLoading={false}
        onClick={onClick}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("sets aria-pressed when active", () => {
    render(
      <MetricCard
        config={config}
        reading={mockReading}
        isActive={true}
        isLoading={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("displays metric label translation key", () => {
    render(
      <MetricCard
        config={config}
        reading={mockReading}
        isActive={false}
        isLoading={false}
        onClick={() => {}}
      />,
    );

    expect(screen.getByText("metrics.water_temperature")).toBeInTheDocument();
  });
});
