import { useState } from 'react'
import { Copy, Check, Map } from '@/components/ui/Icons'
import { Skeleton } from '@/components/ui/Skeleton'
import type { StationState } from '@/types'

interface LocationInformationProps {
  state: StationState | null | undefined
  isLoading: boolean
}

export function LocationInformation({ state, isLoading }: LocationInformationProps) {
  const [copied, setCopied] = useState(false)

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
          <p className="text-xs text-muted uppercase tracking-wider">Station</p>
          <p className="text-sm font-semibold text-primary">{state.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card rounded-lg p-2.5">
          <p className="text-xs text-muted mb-0.5">Postal Code</p>
          <p className="text-sm font-medium text-primary">{state.postal_code}</p>
        </div>
        <div className="bg-card rounded-lg p-2.5">
          <p className="text-xs text-muted mb-0.5">State ID</p>
          <p className="text-sm font-medium text-primary">{state.state_id}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-2.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted mb-0.5">Coordinates</p>
          <p className="text-xs font-mono text-secondary truncate">{state.coordinates}</p>
        </div>
        <button
          id="copy-coords-btn"
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg hover:bg-card-hover text-muted hover:text-primary transition-colors"
          title="Copy coordinates"
          aria-label="Copy coordinates to clipboard"
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
