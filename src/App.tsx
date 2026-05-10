import { useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useDashboardStore } from '@/store/dashboardStore'

export default function App() {
  const { theme, activeView, setActiveView } = useDashboardStore()

  // Sync persisted theme to DOM on first mount
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // URL Synchronization
  useEffect(() => {
    // 1. Initialize view from URL on mount
    const path = window.location.pathname.substring(1) || 'dashboard'
    if (path !== activeView) {
      setActiveView(path)
    }

    // 2. Handle browser back/forward buttons
    const handlePopState = () => {
      const newPath = window.location.pathname.substring(1) || 'dashboard'
      setActiveView(newPath)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [setActiveView]) // Run once on mount

  // 3. Update URL when activeView changes
  useEffect(() => {
    const currentPath = window.location.pathname.substring(1) || 'dashboard'
    if (activeView !== currentPath) {
      const newPath = activeView === 'dashboard' ? '/' : `/${activeView}`
      window.history.pushState({ view: activeView }, '', newPath)
    }
  }, [activeView])

  return <AppShell />
}
