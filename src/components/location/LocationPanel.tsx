import { AlgeriaMiniMap } from './AlgeriaMiniMap'
import { LocationInformation } from './LocationInformation'
import { useStateInfo } from '@/hooks/useSensorData'

export function LocationPanel() {
  const { data: state, isLoading } = useStateInfo()

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Map */}
      <div className="glass rounded-xl overflow-hidden animate-fade-in">
        <div className="px-4 pt-3 pb-2 border-b border-card">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Station Location
          </h2>
        </div>
        <div className="p-3">
          <AlgeriaMiniMap state={state} />
        </div>
      </div>

      {/* Info */}
      <div className="glass rounded-xl overflow-hidden animate-fade-in stagger-1">
        <div className="px-4 pt-3 pb-2 border-b border-card">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Location Details
          </h2>
        </div>
        <LocationInformation state={state} isLoading={isLoading} />
      </div>

      {/* Live indicator */}
      <div className="glass rounded-xl p-4 flex items-center justify-between animate-fade-in stagger-2">
        <div>
          <p className="text-xs text-muted">Data Refresh</p>
          <p className="text-sm font-semibold text-primary">Every 30 seconds</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>
    </div>
  )
}
