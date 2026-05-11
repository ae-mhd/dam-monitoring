import { MetricsGrid } from "@/components/metrics/MetricsGrid";
import { ChartToolbar } from "@/components/charts/ChartToolbar";
import { MetricChart } from "@/components/charts/MetricChart";
import { ActiveMetricSummary } from "@/components/charts/ActiveMetricSummary";
import {
  useLatestSensorReading,
  useHistoricalReadings,
} from "@/hooks/useSensorData";
import { useDashboardStore } from "@/store/dashboardStore";
import { METRIC_MAP } from "@/lib/constants";
import { Icon, AlertCircle, RefreshCw, Activity } from "@/components/ui/Icons";
import { PageHeader } from "@/components/layout/PageHeader";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "@/lib/utils";
import { Clock } from "@/components/ui/Icons";

export function MonitoringPanel() {
  const { t } = useTranslation();
  const { activeMetric } = useDashboardStore();
  const config = METRIC_MAP[activeMetric];
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

  return (
    <div className="flex flex-col gap-5 min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          icon={Activity}
          title={t("monitoring.liveMonitoring")}
          description={t("monitoring.liveMonitoringDesc")}
          className="mb-0"
        />

        {latestReading?.updated_at && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border-sky-500/20 text-xs font-medium text-sky-400 animate-fade-in shadow-lg shadow-sky-500/5 transition-all hover:bg-sky-500/5">
            <Clock size={14} className="animate-pulse" />
            <span className="opacity-70">{t("location.lastUpdate")}:</span>
            <span className="font-semibold whitespace-nowrap">
              {formatDateTime(latestReading.updated_at)}
            </span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {hasError && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <p className="text-sm text-red-300 flex-1">
            {t("analytics.failedLoadData")}
          </p>
          <button
            onClick={() => qc.invalidateQueries()}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <RefreshCw size={12} /> {t("analytics.retry")}
          </button>
        </div>
      )}

      {/* Metric Cards */}
      <section aria-label="Sensor Metrics">
        <MetricsGrid reading={latestReading} isLoading={loadingLatest} />
      </section>

      {/* Summary Stats */}
      {!loadingHistory && historicalData.length > 0 && (
        <section aria-label="Statistics Summary" className="animate-fade-in">
          <ActiveMetricSummary
            config={config}
            data={historicalData}
            currentReading={latestReading}
          />
        </section>
      )}

      {/* Chart Section */}
      <section
        aria-label="Metric Chart"
        className="glass rounded-xl p-4 flex flex-col gap-4 animate-fade-in stagger-3"
      >
        {/* Chart header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: config.gradientFrom }}
            >
              <Icon
                name={config.icon}
                size={16}
                style={{ color: config.color }}
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">
                {t(`metrics.${config.key}`)} {t("monitoring.trend")}
              </h2>
              <p className="text-xs text-muted">{config.unit}</p>
            </div>
          </div>
          <ChartToolbar />
        </div>

        {/* Chart */}
        <MetricChart
          config={config}
          data={historicalData}
          isLoading={loadingHistory}
        />

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-1 border-t border-card">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2 w-4 rounded-sm"
              style={{ background: config.color }}
            />
            <span>{t(`metrics.${config.key}`)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-px w-4 bg-amber-400 opacity-50" />
            <span>
              {t("monitoring.warningThreshold")} ({config.thresholds.warning} {config.unit})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-px w-4 bg-red-400 opacity-50" />
            <span>
              {t("monitoring.criticalThreshold")} ({config.thresholds.critical} {config.unit})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="h-px w-4 border-t border-dashed"
              style={{ borderColor: config.color }}
            />
            <span>{t("monitoring.average")}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
