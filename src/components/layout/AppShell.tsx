import { TopBar } from "@/components/topbar/TopBar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { LocationPanel } from "@/components/location/LocationPanel";
import { MonitoringPanel } from "@/components/layout/MonitoringPanel";
// import { useDashboardStore } from '@/store/dashboardStore'
import { cn } from "@/lib/utils";

export function AppShell() {
  // const { sidebarCollapsed } = useDashboardStore()

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-primary">
      {/* Top Bar */}
      <TopBar />

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 transition-all duration-300",
          )}
        >
          <div className="max-w-screen-2xl mx-auto h-full">
            {/* Two-column layout on desktop */}
            <div className="flex flex-col lg:flex-row gap-5 h-full">
              {/* Left: Location Panel (30%) */}
              <aside className="w-full lg:w-[280px] xl:w-[300px] shrink-0 flex flex-col gap-4">
                <LocationPanel />
              </aside>

              {/* Right: Monitoring Panel (70%) */}
              <div className="flex-1 min-w-0">
                <MonitoringPanel />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
