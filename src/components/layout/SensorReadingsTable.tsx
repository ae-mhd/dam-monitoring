import { useState, useRef, useEffect } from 'react'
import { usePaginatedSensorReadings } from '@/hooks/useSensorData'
import { METRICS } from '@/lib/constants'
import { formatValue } from '@/lib/utils'
import { ChevronLeft, ChevronRight, RefreshCw, AlertCircle, Database, Columns, Check } from '@/components/ui/Icons'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import type { MetricKey } from '@/types'
import { useTranslation } from 'react-i18next'

export function SensorReadingsTable() {
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState(1)
  const [visibleColumns, setVisibleColumns] = useState<MetricKey[]>(METRICS.map(m => m.key as MetricKey))
  const [showColumnToggle, setShowColumnToggle] = useState(false)
  const perPage = 10
  const qc = useQueryClient()
  const toggleRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toggleRef.current && !toggleRef.current.contains(event.target as Node)) {
        setShowColumnToggle(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1))
  const handleNextPage = () => {
    if (data && page < data.last_page) setPage((p) => p + 1)
  }

  const toggleColumn = (key: MetricKey) => {
    setVisibleColumns(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const filteredMetrics = METRICS.filter(m => visibleColumns.includes(m.key as MetricKey))

  const { data, isLoading, isError, isFetching } = usePaginatedSensorReadings(page, perPage)

  if (isError) {
    return (
      <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <div className="p-2 bg-red-500/20 rounded-full">
          <AlertCircle size={20} className="text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-300">{t('analytics.connectionError')}</h3>
          <p className="text-xs text-red-400/80 mt-0.5">{t('analytics.connectionErrorDesc')}</p>
        </div>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ['paginatedReadings'] })}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
        >
          <RefreshCw size={14} /> {t('analytics.retryConnection')}
        </button>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col relative animate-fade-in stagger-4 shadow-xl border border-slate-800/60 bg-slate-900/40">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-800/60 flex items-center justify-between bg-gradient-to-r from-slate-900/50 to-transparent relative z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
            <Database size={18} className="text-sky-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 tracking-wide">{t('analytics.dataLog')}</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{t('analytics.dataLogDesc')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Column Toggle */}
          <div className="relative" ref={toggleRef}>
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-700/50 bg-slate-800/40 text-slate-300 transition-all duration-200",
                "hover:bg-slate-700 hover:text-white hover:border-slate-600",
                showColumnToggle && "bg-slate-700 text-white border-slate-500 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              )}
            >
              <Columns size={16} />
              <span className="text-xs font-medium hidden sm:inline">{t('analytics.columns')}</span>
            </button>

            {showColumnToggle && (
              <div className="absolute right-0 mt-2 w-56 glass border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('analytics.showHideColumns')}</h3>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5 bg-slate-900/60">
                  {METRICS.map((metric) => (
                    <button
                      key={metric.key}
                      onClick={() => toggleColumn(metric.key as MetricKey)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/5 group"
                    >
                      <div className="flex items-center gap-2.5 text-slate-300 group-hover:text-slate-100">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: metric.color }} />
                        {t(`metrics.${metric.key}`)}
                      </div>
                      {visibleColumns.includes(metric.key as MetricKey) && (
                        <Check size={14} className="text-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-800/60 bg-slate-900/40 flex justify-between">
                   <button 
                    onClick={() => setVisibleColumns(METRICS.map(m => m.key as MetricKey))}
                    className="text-[10px] text-sky-400 hover:text-sky-300 px-2 py-1 transition-colors"
                  >
                    {t('analytics.selectAll')}
                  </button>
                  <button 
                    onClick={() => setVisibleColumns([])}
                    className="text-[10px] text-slate-500 hover:text-slate-400 px-2 py-1 transition-colors"
                  >
                    {t('analytics.clear')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {isFetching && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
              <RefreshCw size={12} className="text-sky-400 animate-spin" />
              <span className="text-xs font-medium text-slate-300 hidden sm:inline">{t('analytics.syncing')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar relative">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-400 bg-slate-900/80 sticky top-0 z-10 backdrop-blur-md">
            <tr>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider border-b border-slate-800/80">
                {t('analytics.timestamp')}
              </th>
              {filteredMetrics.map((metric) => (
                <th key={metric.key} className="px-6 py-4 font-semibold uppercase tracking-wider border-b border-slate-800/80 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color, opacity: 0.8 }} />
                    <span>{t(`metrics.${metric.key}`)}</span>
                    <span className="text-slate-500 normal-case ml-1">({metric.unit})</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {isLoading ? (
              Array.from({ length: perPage }).map((_, i) => (
                <tr key={i} className="animate-pulse bg-slate-900/20">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800/50 rounded-md w-32"></div></td>
                  {filteredMetrics.map((m) => (
                    <td key={m.key} className="px-6 py-4"><div className="h-4 bg-slate-800/50 rounded-md w-16"></div></td>
                  ))}
                </tr>
              ))
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={filteredMetrics.length + 1} className="px-6 py-16">
                  <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                    <Database size={40} className="opacity-20" />
                    <p className="text-sm font-medium">{t('analytics.noReadings')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data?.data.map((reading) => {
                const date = new Date(reading.created_at)
                return (
                  <tr key={reading.id} className="group hover:bg-slate-800/40 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium">
                          {date.toLocaleDateString(i18n.language, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    {filteredMetrics.map((metric) => {
                      const val = reading[metric.key] ?? null
                      return (
                        <td key={metric.key} className="px-6 py-4 whitespace-nowrap">
                          {val !== null ? (
                            <span 
                              className="font-mono font-medium tracking-tight px-2.5 py-1 rounded-md transition-colors"
                              style={{ 
                                color: metric.color,
                                backgroundColor: `color-mix(in srgb, ${metric.color} 8%, transparent)`
                              }}
                            >
                              {formatValue(val, metric.decimals)}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-400">
          {t('analytics.showing')} <span className="text-slate-200 font-semibold">{data ? data.from : 0}</span> {t('location.to')}{' '}
          <span className="text-slate-200 font-semibold">{data ? data.to : 0}</span> {t('alerts.of')}{' '}
          <span className="text-slate-200 font-semibold">{data?.total || 0}</span> {t('analytics.results')}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevPage}
            disabled={page === 1 || isLoading}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-300 transition-all duration-200",
              "hover:bg-slate-700 hover:text-white hover:border-slate-600 active:scale-95",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex items-center justify-center px-4 h-9 rounded-xl border border-slate-700/50 bg-slate-900/80 shadow-inner">
            <span className="text-xs font-medium text-slate-400">
              {t('analytics.page')} <span className="text-sky-400 text-sm mx-1">{page}</span> {t('alerts.of')} <span className="text-slate-200 ml-1">{data?.last_page || 1}</span>
            </span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={!data || page >= data.last_page || isLoading}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-xl border border-slate-700/50 bg-slate-800/50 text-slate-300 transition-all duration-200",
              "hover:bg-slate-700 hover:text-white hover:border-slate-600 active:scale-95",
              "disabled:opacity-40 disabled:pointer-events-none"
            )}
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
