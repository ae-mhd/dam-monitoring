import { useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useDashboardStore } from '@/store/dashboardStore'

export default function App() {
  const { theme } = useDashboardStore()

  // Sync persisted theme to DOM on first mount
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return <AppShell />
}
