import { useState } from 'react'
import { Copy, Check, Map } from '@/components/ui/Icons'
import { Skeleton } from '@/components/ui/Skeleton'
import type { StationState } from '@/types'
import { useTranslation } from 'react-i18next'
import boatGif from '@/assets/boat_gif.gif'

interface LocationInformationProps {
  state: StationState | null | undefined
  isLoading: boolean
}

export function LocationInformation({ state, isLoading }: LocationInformationProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const handleCopy = async () => {
    if (!state?.coordinates) return
    await navigator.clipboard.writeText(state.coordinates)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  if (!state) return null

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-sky-500/15">
          <Map size={14} className="text-sky-400" />
        </div>
        <div>
          <p className="text-xs text-muted uppercase tracking-wider">{t("location.stationLocation")}</p>
          <p className="text-sm font-semibold text-primary">{state.name}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-2.5">
        <p className="text-xs text-muted mb-0.5">State ID</p>
        <p className="text-sm font-medium text-primary">{state.state_id}</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-white/5 shadow-2xl bg-black/20 group relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img 
          src={boatGif} 
          alt="Dam Monitoring" 
          className="w-full h-56 object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-2 left-3 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-[10px] font-bold text-white/90 uppercase tracking-widest">{t('location.realTimeMonitoring')}</p>
        </div>
      </div>
      <div className="bg-card rounded-lg p-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted mb-0.5">{t("location.coordinates")}</p>
          <p className="text-xs font-mono text-secondary truncate">{state.coordinates}</p>
        </div>
        <button
          id="copy-coords-btn"
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg hover:bg-card-hover text-muted hover:text-primary transition-colors"
          title={t("location.copyCoordinates")}
          aria-label={t("location.copyCoordinates")}
        >
          {copied ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>
    </div>
  )
}
