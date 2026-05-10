import { useDashboardStore } from '@/store/dashboardStore'
import { Sun, Moon, Search, Menu, Bell, RefreshCw } from '@/components/ui/Icons'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

export function TopBar() {
  const { theme, toggleTheme, toggleSidebar } = useDashboardStore()
  const qc = useQueryClient()

  const refresh = () => qc.invalidateQueries()

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
        <span className="text-2xl">🌊</span>
        <div>
          <h1 className="text-sm font-bold text-primary leading-none">DamWatch</h1>
          <p className="text-xs text-muted leading-none">Monitoring System</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="location-search"
          type="text"
          placeholder="Search dam or location…"
          className={cn(
            'w-full pl-9 pr-4 py-2 rounded-lg text-sm',
            'bg-card border border-card text-primary placeholder:text-muted',
            'focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30',
            'transition-all'
          )}
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
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
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
