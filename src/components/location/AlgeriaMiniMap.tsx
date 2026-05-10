import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { parseCoordinates } from '@/lib/utils'
import type { StationState } from '@/types'

// Fix default marker icon paths broken by Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface AlgeriaMiniMapProps {
  state: StationState | null | undefined
}

export function AlgeriaMiniMap({ state }: AlgeriaMiniMapProps) {
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
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !state) return

    const coords = parseCoordinates(state.coordinates)
    if (!coords) return

    if (markerRef.current) {
      markerRef.current.setLatLng([coords.lat, coords.lng])
    } else {
      // Custom pulsing marker
      const pulseIcon = L.divIcon({
        className: '',
        html: `
          <div style="position:relative;width:20px;height:20px">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background:rgba(56,189,248,0.3);
              animation:ping 1.5s ease-in-out infinite;
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:10px;height:10px;border-radius:50%;
              background:#38bdf8;border:2px solid #fff;
            "></div>
          </div>
          <style>
            @keyframes ping {
              0%,100%{transform:scale(1);opacity:0.7}
              50%{transform:scale(2);opacity:0}
            }
          </style>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      markerRef.current = L.marker([coords.lat, coords.lng], { icon: pulseIcon })
        .addTo(map)
        .bindPopup(`<b>${state.name}</b><br/>${state.postal_code}`)
    }

    map.flyTo([coords.lat, coords.lng], 8, { duration: 1.2 })
  }, [state])

  return (
    <div
      ref={mapRef}
      id="algeria-map"
      className="w-full h-48 rounded-xl overflow-hidden"
      style={{ background: '#0f172a' }}
    />
  )
}
