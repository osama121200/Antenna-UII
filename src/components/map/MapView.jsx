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
    </div>
  )
}
