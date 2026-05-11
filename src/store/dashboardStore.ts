import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DashboardStore, MetricKey, TimeRange } from "@/types";
import { DEFAULT_METRIC, DEFAULT_STATE_ID } from "@/lib/constants";

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      activeMetric: DEFAULT_METRIC,
      selectedStateId: DEFAULT_STATE_ID,
      theme: "dark",
      sidebarCollapsed: false,
      timeRange: "24h",
      activeView: "dashboard",
      analyticsMetrics: ["water_temperature"],

      setActiveMetric: (m: MetricKey) => set({ activeMetric: m }),
      setActiveView: (view: string) => set({ activeView: view }),
      setAnalyticsMetrics: (metrics: MetricKey[]) => set({ analyticsMetrics: metrics }),
      toggleAnalyticsMetric: (m: MetricKey) => set((s) => ({
        analyticsMetrics: s.analyticsMetrics.includes(m)
          ? s.analyticsMetrics.filter((x) => x !== m)
          : [...s.analyticsMetrics, m]
      })),
      setSelectedStateId: (id: string) => set({ selectedStateId: id }),
      setTheme: (t: "light" | "dark") => {
        set({ theme: t });
        document.documentElement.classList.toggle("light", t === "light");
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },
      setSidebarCollapsed: (v: boolean) => set({ sidebarCollapsed: v }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setTimeRange: (r: TimeRange) => set({ timeRange: r }),
    }),
    {
      name: "dam-dashboard-store",
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
        selectedStateId: s.selectedStateId,
      }),
    },
  ),
);
