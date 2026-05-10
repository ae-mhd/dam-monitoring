import { cn } from '@/lib/utils'
import { useDashboardStore } from '@/store/dashboardStore'
import {
  Home, BarChart2, Map, Bell, Settings,
  ChevronLeft, ChevronRight,
} from '@/components/ui/Icons'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'map',       label: 'Map View',  icon: Map },
  { id: 'alerts',    label: 'Alerts',    icon: Bell },
  { id: 'settings',  label: 'Settings',  icon: Settings },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useDashboardStore()

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity md:hidden',
          !sidebarCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleSidebar}
      />

      <aside
        className={cn(
          'fixed md:relative z-40 flex flex-col h-full bg-secondary border-r border-card',
          'transition-all duration-300 ease-in-out shrink-0',
          sidebarCollapsed
            ? 'w-0 md:w-16 overflow-hidden md:overflow-visible'
            : 'w-64'
        )}
      >
        {/* Nav */}
        <nav className="flex-1 py-4 overflow-hidden">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map(({ id, label, icon: Icon }, i) => (
              <li key={id}>
                <button
                  id={`nav-${id}`}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                    'transition-all duration-150',
                    i === 0
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'text-secondary hover:bg-card-hover hover:text-primary'
                  )}
                  aria-label={label}
                >
                  <Icon size={18} className="shrink-0" />
                  <span
                    className={cn(
                      'transition-all duration-200 whitespace-nowrap',
                      sidebarCollapsed && 'md:opacity-0 md:w-0 md:overflow-hidden'
                    )}
                  >
                    {label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          id="sidebar-collapse"
          onClick={toggleSidebar}
          className="hidden md:flex items-center justify-center h-10 border-t border-card text-muted hover:text-primary hover:bg-card-hover transition-colors"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>
    </>
  )
}
