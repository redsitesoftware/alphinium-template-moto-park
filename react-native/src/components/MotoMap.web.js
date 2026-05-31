/**
 * MotoMap.web.js — Leaflet map for motorcycle parking spots
 */
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Fix Leaflet default icon paths
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

function createMotoIcon(type, selected) {
  const L = require('leaflet');
  const bg = selected ? '#FFD60A' : type === 'dedicated' ? '#30D158' : type === 'undercover' ? '#636AFF' : '#FF6B00';
  const emoji = type === 'dedicated' ? '🏍️' : type === 'undercover' ? '🏢' : type === 'bay' ? '🅿️' : '🛣️';
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${bg}; color:#000; font-size:${selected?'18px':'14px'};
      width:${selected?'40px':'32px'}; height:${selected?'40px':'32px'};
      border-radius:50%; display:flex; align-items:center; justify-content:center;
      border:${selected?'3px solid #fff':'2px solid rgba(0,0,0,0.3)'};
      box-shadow:0 2px 6px rgba(0,0,0,0.5);
      transition: all 0.2s;
    ">${emoji}</div>`,
    iconSize: selected ? [40,40] : [32,32],
    iconAnchor: selected ? [20,20] : [16,16],
    popupAnchor: [0, -20],
  });
}

function MapCenter({ spots }) {
  const map = useMap();
  useEffect(() => {
    if (spots.length > 0) {
      const avgLat = spots.reduce((s,p) => s + p.lat, 0) / spots.length;
      const avgLng = spots.reduce((s,p) => s + p.lng, 0) / spots.length;
      map.setView([avgLat, avgLng], 14);
    }
  }, [spots.length]);
  return null;
}

export default function MotoMap({ spots, selectedId, onSelectSpot }) {
  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
  }, []);

  const center = spots.length > 0
    ? [spots[0].lat, spots[0].lng]
    : [-33.8688, 151.2093];

  return (
    <MapContainer center={center} zoom={13}
      style={{ width: '100%', height: '100%', background: '#1a1a2e' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; CartoDB"
        maxZoom={19}
      />
      <MapCenter spots={spots} />
      {spots.map(spot => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={createMotoIcon(spot.type, spot.id === selectedId)}
          eventHandlers={{ click: () => onSelectSpot(spot.id) }}
        >
          <Popup>
            <div style={{ fontFamily: 'sans-serif', minWidth: 160 }}>
              <strong style={{ fontSize: 14 }}>{spot.name}</strong>
              <div style={{ color: '#666', fontSize: 12, margin: '4px 0' }}>
                {spot.free ? '✅ Free' : '💰 Paid'} · {spot.covered ? '🏢 Covered' : '☀️ Open air'}
              </div>
              <div style={{ fontSize: 12, color: '#333' }}>⭐ {spot.rating} · {spot.confirmed} confirmations</div>
              <button onClick={() => onSelectSpot(spot.id)}
                style={{ marginTop: 8, background: '#FF6B00', color: '#fff', border: 'none',
                  borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                View Details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
