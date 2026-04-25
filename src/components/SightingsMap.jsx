import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useMapData } from '../hooks/useMapData'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const TYPE_COLORS = {
  sightings: '#c49a20',
  checkins: '#2a7a3a',
  tips: '#8b1c1c',
}

function createIcon(type) {
  const color = TYPE_COLORS[type] || '#555'
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="-2 -2 32 40">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
        fill="${color}" stroke="#1a1208" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="#fff" opacity="0.9"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  })
}

export default function SightingsMap() {
  const { points, loading, error } = useMapData()

  return (
    <section id="map" className="map-section">
      <div className="map-section-inner">
        <h2 className="section-title">Sightings Map</h2>
        <p className="section-subtitle">
          Tracking Podo's last known locations
        </p>

        {loading && (
          <div className="map-overlay-state">
            Loading location data
            <span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </div>
        )}

        {error && (
          <div className="map-overlay-state error">
            Failed to load map data: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="map-wrap">
            <div className="map-legend">
              {Object.entries(TYPE_COLORS).map(([type, color]) => (
                <span key={type} className="legend-item">
                  <span className="legend-dot" style={{ background: color }} />
                  {type}
                </span>
              ))}
              <span className="legend-count">{points.length} location{points.length !== 1 ? 's' : ''} found</span>
            </div>

            <MapContainer
              center={points.length > 0 ? [points[0].coords.lat, points[0].coords.lng] : [41.0082, 28.9784]}
              zoom={points.length > 0 ? 12 : 6}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {points.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.coords.lat, point.coords.lng]}
                  icon={createIcon(point.type)}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{point.label}</strong>
                      {point.name && <div>By: {point.name}</div>}
                      {point.location && <div>Location: {point.location}</div>}
                      {point.note && <div>Note: {point.note}</div>}
                      {point.date && <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>{point.date}</div>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
      </div>
    </section>
  )
}
