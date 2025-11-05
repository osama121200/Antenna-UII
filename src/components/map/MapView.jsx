import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// fix default icon paths for Leaflet when bundling
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadow, iconAnchor: [12, 41] })
L.Marker.prototype.options.icon = DefaultIcon

export default function MapView({ items = [], center = [46.2276, 2.2137], zoom = 6 }) {
  const countsByType = items.reduce((acc, i) => { acc[i.type] = (acc[i.type] || 0) + 1; return acc }, {})
  const countsByStatus = items.reduce((acc, i) => { acc[i.status] = (acc[i.status] || 0) + 1; return acc }, {})

  // Red pin icon similar to Leaflet default, using inline SVG
  const redPinSvg = encodeURIComponent(
    '<svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">\
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5 0 22 12.5 41 12.5 41S25 22 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#ef4444"/>\
      <circle cx="12.5" cy="12.5" r="5" fill="#ffffff"/>\
    </svg>'
  )
  const AnomalyIcon = L.icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${redPinSvg}`,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  })

  // Randomized anomaly notes for demo
  const anomalyNotes = [
    'Signal faible détecté',
    'Défaut d\'alimentation',
    'Problème de structure',
    'Perte de communication',
  ]

  // Three anomaly markers (Ville06–Ville08), placed away from existing blue markers
  const anomalies = [
    { id: 'AN1', name: 'Ville06 – Anomalie détectée', status: 'Anomalie détectée', lat: 43.60, lng: 1.44 },   // Sud-Ouest zone
    { id: 'AN2', name: 'Ville07 – Anomalie détectée', status: 'Anomalie détectée', lat: 48.95, lng: 2.42 },  // Nord Île zone, offset from Paris
    { id: 'AN3', name: 'Ville08 – Anomalie détectée', status: 'Anomalie détectée', lat: 45.19, lng: 5.72 },  // Zone alpine
  ].map((an) => ({ ...an, note: anomalyNotes[Math.floor(Math.random() * anomalyNotes.length)] }))

  return (
    <div className="w-full h-[72vh] min-h-[480px] rounded-lg overflow-hidden border shadow-card relative">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map((a) => (
          <Marker key={a.id} position={[a.lat, a.lng]}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{a.name}</div>
                <div className="text-gray-600">{a.type} · {a.region}</div>
                <div className="text-gray-500">Statut: {a.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {anomalies.map((an) => (
          <Marker key={an.id} position={[an.lat, an.lng]} icon={AnomalyIcon} zIndexOffset={1000}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{an.name}</div>
                <div className="text-gray-600">Statut: {an.status}</div>
                <div className="text-gray-500">{an.note}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Legend overlay */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-md border shadow-card p-3 text-xs space-y-2">
        <div className="font-medium text-gray-800">Types</div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(countsByType).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary-400" />{k}: {v}</div>
          ))}
          {Object.keys(countsByType).length === 0 && <div className="text-gray-500 col-span-3">—</div>}
        </div>
        <div className="font-medium text-gray-800 mt-1">Statuts</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(countsByStatus).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gray-400" />{k}: {v}</div>
          ))}
          {Object.keys(countsByStatus).length === 0 && <div className="text-gray-500 col-span-2">—</div>}
        </div>
      </div>
      {/* Color legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-md border shadow-card px-3 py-2 text-xs space-y-1">
        <div className="flex items-center gap-2"><span>🔵</span> <span className="text-gray-700">Antenne opérationnelle</span></div>
        <div className="flex items-center gap-2"><span>🔴</span> <span className="text-gray-700">Anomalie détectée</span></div>
      </div>
    </div>
  )
}
