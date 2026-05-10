import { useLatestSensorReading } from "@/hooks/useSensorData";
import { useDashboardStore } from "@/store/dashboardStore";
import { METRICS } from "@/lib/constants";
import { MetricCard } from "@/components/metrics/MetricCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { getAlertLevel, ALERT_RULES } from "@/lib/utils";
import type { MetricKey } from "@/types";
import { AlertCircle, BookOpen, ShieldAlert, Icon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const STAGGER = Array.from({ length: 20 }, (_, i) => `stagger-${i + 1}`);

const LEVEL_COLORS = {
  normal: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  caution: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  warning: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  offline: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  none: "text-slate-400 bg-transparent border-transparent",
};

export function AlertsPanel() {
  const { data: reading, isLoading } = useLatestSensorReading();
  const { setActiveMetric, setActiveView } = useDashboardStore();

  const handleMetricClick = (key: MetricKey) => {
    setActiveMetric(key);
    setActiveView("dashboard");
  };

  // Find metrics that currently have an alert
  const alertMetrics = METRICS.filter((config) => {
    if (!reading) return false;
    const value = reading[config.key] as number | null;
    const level = getAlertLevel(value, config);
    return level === "caution" || level === "warning" || level === "critical";
  });

  return (
    <div className="flex flex-col gap-6 min-h-0 h-full overflow-y-auto pb-8 pr-2">
      {/* Header */}
      <PageHeader
        icon={ShieldAlert}
        title="System Alerts"
        description="Current warnings and active thresholds"
        iconClassName="bg-red-500/10 border-red-500/20 text-red-400"
      />

      {/* Active Alerts Section */}
      <section className="flex flex-col gap-4" aria-label="Active Alerts">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <AlertCircle size={16} />
          Active Alerts ({alertMetrics.length})
        </h2>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8 glass rounded-xl">
            <span className="text-muted animate-pulse">Checking for alerts...</span>
          </div>
        ) : alertMetrics.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {alertMetrics.map((config, i) => (
              <MetricCard
                key={config.key}
                config={config}
                reading={reading}
                isActive={false}
                isLoading={false}
                onClick={() => handleMetricClick(config.key as MetricKey)}
                animationClass={`animate-slide-up ${STAGGER[i] ?? ""}`}
              />
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 border-emerald-500/20 bg-emerald-500/5">
            <div className="p-3 rounded-full bg-emerald-500/10">
              <ShieldAlert className="text-emerald-400" size={32} />
            </div>
            <div>
              <p className="text-primary font-medium">All Systems Normal</p>
              <p className="text-sm text-muted">No active alerts detected across monitored metrics.</p>
            </div>
          </div>
        )}
      </section>

      {/* Documentation Section */}
      <section className="flex flex-col gap-4 mt-6 animate-fade-in stagger-2" aria-label="Alert Documentation">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
          <BookOpen size={16} />
          Alert Rules Documentation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(ALERT_RULES).map(([key, rules]) => {
            const config = METRICS.find((m) => m.key === key);
            if (!config || !rules) return null;

            return (
              <div key={key} className="glass rounded-xl p-5 flex flex-col gap-4 border-l-4" style={{ borderLeftColor: config.color }}>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-card-hover">
                    <Icon name={config.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">{config.label}</h3>
                    <p className="text-xs text-muted font-mono">{config.key === 'nh4' ? 'TAN' : config.key} ({config.unit})</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start justify-between text-sm py-2 border-b border-card last:border-0">
                      <div className="flex flex-col gap-1">
                        <span className="text-primary font-medium">{rule.label}</span>
                        <span className="text-xs text-muted">
                          {idx === 0 
                            ? `Up to ${rule.max === Infinity ? 'Any' : rule.max} ${config.unit}` 
                            : `> ${rules[idx - 1].max} to ${rule.max === Infinity ? '∞' : rule.max} ${config.unit}`}
                        </span>
                      </div>
                      <span className={cn("text-[10px] uppercase font-bold px-2 py-1 rounded-md border", LEVEL_COLORS[rule.level])}>
                        {rule.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
