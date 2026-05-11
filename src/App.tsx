import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { useDashboardStore } from '@/store/dashboardStore'

export default function App() {
  const { theme, activeView, setActiveView } = useDashboardStore()
  const [isLoading, setIsLoading] = useState(true)

  // Sync persisted theme to DOM on first mount
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  // URL Synchronization
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    
    // 1. Initialize view from URL on mount
    const path = window.location.pathname.replace(base, "") || 'dashboard';
    if (path !== activeView) {
      setActiveView(path);
    }

    // 2. Handle browser back/forward buttons
    const handlePopState = () => {
      const newPath = window.location.pathname.replace(base, "") || 'dashboard';
      setActiveView(newPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setActiveView]);

  // 3. Update URL when activeView changes
  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const currentPath = window.location.pathname.replace(base, "") || 'dashboard';
    
    if (activeView !== currentPath) {
      const newPath = activeView === 'dashboard' ? base : `${base}${activeView}`;
      window.history.pushState({ view: activeView }, '', newPath);
    }
  }, [activeView]);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <AppShell />
    </>
  )
}
