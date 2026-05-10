import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { parseCoordinates } from '@/lib/utils'
import type { StationState } from '@/types'
import markerIcon from '@/assets/marker.png'
import { Maximize2 } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/Dialog'
import { cn } from '@/lib/utils'

// Fix default marker icon paths broken by Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface AlgeriaMiniMapProps {
  state: StationState | null | undefined
  className?: string
  isFull?: boolean
}

export function AlgeriaMiniMap({ state, className, isFull = false }: AlgeriaMiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Center on Algeria
    const map = L.map(mapRef.current, {
      center: [28.0339, 1.6596],
      zoom: 5,
      attributionControl: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map)

    mapInstanceRef.current = map
    return () => {
      map.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !state) return

    const coords = parseCoordinates(state.coordinates)
    if (!coords) return

    if (markerRef.current) {
      markerRef.current.setLatLng([coords.lat, coords.lng]).addTo(map)
    } else {
      // Custom pulsing marker with imported icon
      const pulseIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
            <div style="
              position:absolute;width:100%;height:100%;border-radius:50%;
              background:rgba(56,189,248,0.4);
              animation:marker-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <img src="${markerIcon}" style="
              position:relative;width:32px;height:32px;object-fit:contain;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
              z-index: 10;
            " />
          </div>
          <style>
            @keyframes marker-ping {
              75%, 100% { transform: scale(2); opacity: 0; }
            }
          </style>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      })

      markerRef.current = L.marker([coords.lat, coords.lng], { icon: pulseIcon })
        .addTo(map)
        .bindPopup(`<b>${state.name}</b>`)
    }

    map.flyTo([coords.lat, coords.lng], 8, { duration: 1.2 })
  }, [state])

  return (
    <div className={cn("relative group w-full", isFull ? "h-full" : "h-48", className)}>
      <div
        ref={mapRef}
        id={isFull ? "algeria-map-full" : "algeria-map"}
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ background: '#0f172a' }}
      />

      {!isFull && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="absolute top-3 right-3 z-[1000] p-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
              title="Expand map"
            >
              <Maximize2 size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[80vh] p-0 border-none bg-transparent shadow-2xl">
            <DialogTitle className="sr-only">Map View - {state?.name}</DialogTitle>
            <DialogDescription className="sr-only">Detailed geographical location of the station.</DialogDescription>
            <AlgeriaMiniMap state={state} isFull className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
