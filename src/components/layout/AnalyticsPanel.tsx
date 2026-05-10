import { AnalyticsMetricsGrid } from "@/components/metrics/AnalyticsMetricsGrid";
import { ChartToolbar } from "@/components/charts/ChartToolbar";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { SensorReadingsTable } from "@/components/layout/SensorReadingsTable";
import {
  useLatestSensorReading,
  useHistoricalReadings,
} from "@/hooks/useSensorData";
import { useDashboardStore } from "@/store/dashboardStore";
import { METRIC_MAP } from "@/lib/constants";
import { Icon, AlertCircle, RefreshCw, BarChart2 } from "@/components/ui/Icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { useQueryClient } from "@tanstack/react-query";

export function AnalyticsPanel() {
  const { analyticsMetrics } = useDashboardStore();
  const qc = useQueryClient();

  const {
    data: latestReading,
    isLoading: loadingLatest,
    isError: errorLatest,
  } = useLatestSensorReading();

  const {
    data: historicalData = [],
    isLoading: loadingHistory,
    isError: errorHistory,
  } = useHistoricalReadings();

  const hasError = errorLatest || errorHistory;
  
  // Get configs for all selected metrics
  const activeConfigs = analyticsMetrics.map(key => METRIC_MAP[key]).filter(Boolean);

  return (
    <div className="flex flex-col gap-5 min-h-0">
      <PageHeader
        icon={BarChart2}
        title="Data Analytics"
        description="Deep dive into sensor data trends and historical records"
        iconClassName="bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
      />

      {/* Error Banner */}
      {hasError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300 flex-1">
            Failed to load sensor data.
          </p>
          <button
            onClick={() => qc.invalidateQueries()}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {/* Metric Cards - Multi Selectable */}
      <section aria-label="Sensor Metrics Selection">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-slate-300">Select Metrics to Analyze</h2>
          <span className="text-xs text-muted bg-card px-2 py-1 rounded-md">
            {analyticsMetrics.length} selected
          </span>
        </div>
        <AnalyticsMetricsGrid reading={latestReading} isLoading={loadingLatest} />
      </section>

      {/* Chart Section */}
      <section
        aria-label="Multi-Metric Analytics Chart"
        className="glass rounded-xl p-4 flex flex-col gap-4 animate-fade-in stagger-3"
      >
        {/* Chart header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <Icon
                name="BarChart2"
                size={16}
                className="text-indigo-400"
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">
                Comparative Analytics
              </h2>
              <p className="text-xs text-muted">Compare trends across multiple metrics</p>
            </div>
          </div>
          <ChartToolbar />
        </div>

        {/* Chart */}
        {activeConfigs.length > 0 ? (
          <AnalyticsChart
            configs={activeConfigs}
            data={historicalData}
            isLoading={loadingHistory}
          />
        ) : (
          <div className="w-full h-[400px] rounded-xl flex flex-col items-center justify-center text-muted gap-2 bg-slate-900/20 border border-slate-800 border-dashed">
            <span className="text-3xl opacity-30">📊</span>
            <p className="text-sm">Select at least one metric to view the chart</p>
          </div>
        )}
      </section>

      {/* Paginated Table Section */}
      <section aria-label="Sensor Readings Data Table">
        <SensorReadingsTable />
      </section>
    </div>
  );
}
