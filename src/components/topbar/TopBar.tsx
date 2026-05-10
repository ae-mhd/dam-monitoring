import { useDashboardStore } from "@/store/dashboardStore";
import { Sun, Moon, Menu, Bell, RefreshCw, Icon } from "@/components/ui/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { cn, getAlertInfo } from "@/lib/utils";
import { useLatestSensorReading } from "@/hooks/useSensorData";
import { METRICS } from "@/lib/constants";
import type { AlertLevel, MetricConfig } from "@/types";
import logo from "@/assets/bg-logo.png";

export function TopBar() {
  const { theme, toggleTheme, toggleSidebar } = useDashboardStore();
  const qc = useQueryClient();
  const { data: latestReading } = useLatestSensorReading();

  const refresh = () => qc.invalidateQueries();

  // Find worst alert
  let worstMetric: MetricConfig | null = null;
  let worstAlert = { level: "none" as AlertLevel, label: "" };
  let maxSeverity = -1;

  const SEVERITY: Record<AlertLevel, number> = {
    critical: 5,
    warning: 4,
    caution: 3,
    normal: 2,
    offline: 1,
    none: 0,
  };

  if (latestReading) {
    for (const config of METRICS) {
      const value = latestReading[config.key];
      const alert = getAlertInfo(value as number | null, config);

      // Only evaluate metrics that actually have an alert rule
      if (alert.level === "none") continue;

      const severity = SEVERITY[alert.level];
      if (severity > maxSeverity) {
        maxSeverity = severity;
        worstAlert = alert;
        worstMetric = config;
      }
    }
  }

  const alertStyles: Record<
    AlertLevel,
    { wrapper: string; icon: string; text: string; pulse: string }
  > = {
    critical: {
      wrapper:
        "bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
      icon: "text-red-400",
      text: "text-red-400",
      pulse: "bg-red-400",
    },
    warning: {
      wrapper:
        "bg-orange-500/10 border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]",
      icon: "text-orange-400",
      text: "text-orange-400",
      pulse: "bg-orange-400",
    },
    caution: {
      wrapper:
        "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]",
      icon: "text-yellow-400",
      text: "text-yellow-400",
      pulse: "bg-yellow-400",
    },
    normal: {
      wrapper:
        "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      icon: "text-emerald-400",
      text: "text-emerald-400",
      pulse: "bg-emerald-400",
    },
    offline: {
      wrapper: "bg-slate-500/10 border-slate-500/30 shadow-none",
      icon: "text-slate-400",
      text: "text-slate-400",
      pulse: "bg-slate-400",
    },
    none: {
      wrapper: "",
      icon: "",
      text: "",
      pulse: "",
    },
  };

  const activeStyle = alertStyles[worstAlert.level];

  return (
    <header className="h-16 flex items-center px-4 gap-4 border-b border-card bg-secondary z-20 shrink-0">
      {/* Hamburger */}
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        className="p-2 rounded-lg hover:bg-card-hover text-secondary hover:text-primary transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <img src={logo} alt="Logo" className="w-24 h-16 object-contain" />
      </div>

      {/* Global Alert */}
      <div className="flex-1 flex items-center pl-4">
        {worstMetric && worstAlert.level !== "none" && (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500",
              "animate-in fade-in slide-in-from-top-2",
              activeStyle.wrapper,
            )}
          >
            <div className="flex items-center justify-center relative">
              {worstAlert.level !== "normal" &&
                worstAlert.level !== "offline" && (
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping duration-1000",
                      activeStyle.pulse,
                    )}
                  />
                )}
              <div
                className={cn(
                  "relative z-10 p-1.5 rounded-full bg-background/60 backdrop-blur-sm shadow-sm",
                  activeStyle.icon,
                )}
              >
                <Icon name={worstMetric.icon} size={16} strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex flex-col pr-1">
              <span className="text-[10px] uppercase tracking-wider font-bold opacity-70 mb-0.5 leading-none">
                {worstMetric.label}
              </span>
              <span
                className={cn(
                  "text-sm font-bold leading-none tracking-tight",
                  activeStyle.text,
                )}
              >
                {worstAlert.label || worstAlert.level}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Refresh Info */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-card/50 border border-card shadow-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted uppercase tracking-wider font-semibold leading-none mb-1">
              Data Refresh
            </span>
            <span className="text-[11px] text-primary font-bold leading-none">
              Every 30s
            </span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-card">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
            <span className="text-[11px] text-emerald-500 font-bold uppercase tracking-wide">
              Live
            </span>
          </div>
        </div>

        <button
          id="refresh-btn"
          onClick={refresh}
          className="p-2 rounded-lg hover:bg-card-hover text-secondary hover:text-primary transition-colors"
          aria-label="Refresh data"
          title="Refresh data"
        >
          <RefreshCw size={18} />
        </button>
        <button
          id="notification-btn"
          className="relative p-2 rounded-lg hover:bg-card-hover text-secondary hover:text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-card-hover text-secondary hover:text-primary transition-colors"
          aria-label="Toggle theme"
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
