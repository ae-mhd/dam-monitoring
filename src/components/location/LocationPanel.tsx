import { AlgeriaMiniMap } from './AlgeriaMiniMap'
import { LocationInformation } from './LocationInformation'
import { useStateInfo } from '@/hooks/useSensorData'
import { useTranslation } from 'react-i18next'

export function LocationPanel() {
  const { data: state, isLoading } = useStateInfo()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Map */}
      <div className="glass rounded-xl overflow-hidden animate-fade-in">
        <div className="px-4 pt-3 pb-2 border-b border-card">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
            {t('location.stationLocation')}
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
            {t('location.locationDetails')}
          </h2>
        </div>
        <LocationInformation state={state} isLoading={isLoading} />
      </div>


    </div>
  )
}
