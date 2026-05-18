import { describe, it, expect, beforeEach } from "vitest";
import { useDashboardStore } from "./dashboardStore";

describe("dashboardStore", () => {
  beforeEach(() => {
    // Reset store to initial state between tests
    useDashboardStore.setState({
      activeMetric: "water_temperature",
      selectedStateId: "918a4130-3c81-11f1-b61f-d3a5d06b2124",
      theme: "dark",
      sidebarCollapsed: false,
      timeRange: "24h",
      activeView: "dashboard",
      analyticsMetrics: ["water_temperature"],
    });
  });

  it("has correct initial state", () => {
    const state = useDashboardStore.getState();
    expect(state.activeMetric).toBe("water_temperature");
    expect(state.timeRange).toBe("24h");
    expect(state.theme).toBe("dark");
    expect(state.sidebarCollapsed).toBe(false);
  });

  it("setActiveMetric updates metric", () => {
    useDashboardStore.getState().setActiveMetric("ph");
    expect(useDashboardStore.getState().activeMetric).toBe("ph");
  });

  it("setTimeRange updates time range", () => {
    useDashboardStore.getState().setTimeRange("7d");
    expect(useDashboardStore.getState().timeRange).toBe("7d");
  });

  it("setSelectedStateId updates state id", () => {
    useDashboardStore.getState().setSelectedStateId("new-id");
    expect(useDashboardStore.getState().selectedStateId).toBe("new-id");
  });

  it("toggleSidebar flips collapsed state", () => {
    useDashboardStore.getState().toggleSidebar();
    expect(useDashboardStore.getState().sidebarCollapsed).toBe(true);
    useDashboardStore.getState().toggleSidebar();
    expect(useDashboardStore.getState().sidebarCollapsed).toBe(false);
  });

  it("toggleAnalyticsMetric adds and removes metrics", () => {
    useDashboardStore.getState().toggleAnalyticsMetric("ph");
    expect(useDashboardStore.getState().analyticsMetrics).toContain("ph");

    useDashboardStore.getState().toggleAnalyticsMetric("ph");
    expect(useDashboardStore.getState().analyticsMetrics).not.toContain("ph");
  });

  it("setActiveView updates view", () => {
    useDashboardStore.getState().setActiveView("analytics");
    expect(useDashboardStore.getState().activeView).toBe("analytics");
  });

  it("toggleTheme switches between dark and light", () => {
    useDashboardStore.getState().toggleTheme();
    expect(useDashboardStore.getState().theme).toBe("light");
    useDashboardStore.getState().toggleTheme();
    expect(useDashboardStore.getState().theme).toBe("dark");
  });
});
