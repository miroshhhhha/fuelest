import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { ApiStation } from '../../api/types';
import { COMPANIES, type CompanyId } from '../../constants/companies';
import { formatPrice, formatAge } from '../../utils/formatters';

const createStationIcon = (color: string) => L.divIcon({
  html: `
    <div class="custom-station-pin" style="background-color: ${color}">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 22L3 7"></path>
        <path d="M3 7A2 2 0 0 1 5 5L13 5A2 2 0 0 1 15 7L15 22"></path>
        <path d="M18 7L18 13"></path>
        <path d="M15 9H18"></path>
        <path d="M9 11V9"></path>
      </svg>
      <div class="pin-tip" style="background-color: ${color}"></div>
    </div>
  `,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 38],
  popupAnchor: [0, -38]
});

interface FuelMapProps {
  stations: ApiStation[];
  selectedFuelId: number | null;
  focusedStationId?: number | null;
}

interface MapSyncProps {
  focusedStationId: number | null;
  stations: ApiStation[];
  markerRefs: React.MutableRefObject<Record<number, L.Marker>>;
}

const MapSync: React.FC<MapSyncProps> = ({ focusedStationId, stations, markerRefs }) => {
  const map = useMap();
  
  useEffect(() => {
    if (focusedStationId) {
      const station = stations.find((s) => s.id === focusedStationId);
      const marker = markerRefs.current[focusedStationId];
      
      if (station && marker) {
        map.flyTo([station.location.latitude, station.location.longitude], 14, {
          duration: 1.2,
          easeLinearity: 0.25
        });
        
        setTimeout(() => {
          marker.openPopup();
        }, 1200);
      }
    }
  }, [focusedStationId, map, stations, markerRefs]);

  return null;
};

export const FuelMap: React.FC<FuelMapProps> = ({ stations, selectedFuelId, focusedStationId = null }) => {
  const center: [number, number] = [58.6, 25.5];
  const markerRefs = useRef<Record<number, L.Marker>>({});

  const filteredStations = useMemo(() => {
    if (selectedFuelId === null) return stations;
    return stations.filter(s => s.fuelTypes.some(f => f.id === selectedFuelId));
  }, [stations, selectedFuelId]);

  return (
    <MapContainer 
      key={stations.length > 0 ? 'loaded' : 'empty'}
      center={center} 
      zoom={7} 
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      <MapSync focusedStationId={focusedStationId} stations={stations} markerRefs={markerRefs} />
      
      {filteredStations.map(station => {
        const company = COMPANIES[station.companyId as CompanyId] || { name: 'Unknown', color: '#666' };
        const icon = createStationIcon(company.color);

        return (
          <Marker 
            key={station.id} 
            position={[station.location.latitude, station.location.longitude]}
            icon={icon}
            ref={(el) => {
              if (el) markerRefs.current[station.id] = el;
            }}
          >
            <Popup className="station-popup">
              <div className="map-popup-content">
                <div className="popup-header">
                  <span className="popup-company" style={{ color: company.color }}>{company.name}</span>
                  <h4 className="popup-name">{station.displayName}</h4>
                  <p className="popup-address">{station.address}</p>
                </div>
                
                <div className="popup-fuel-list">
                  {station.fuelTypes.map(f => (
                    <div key={f.id} className={`popup-fuel-row ${f.id === selectedFuelId ? 'highlight' : ''}`}>
                      <span className="fuel-name">{f.name.replace('Bensiin ', '')}</span>
                      <div className="fuel-details">
                        <span className="fuel-price">{formatPrice(f.price)}€</span>
                        <span className="fuel-age">{formatAge(f.age)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="popup-actions-grid">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.location.latitude},${station.location.longitude}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="action-btn gmaps"
                  >
                    Google Maps
                  </a>
                  <a 
                    href={`https://waze.com/ul?ll=${station.location.latitude},${station.location.longitude}&navigate=yes`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="action-btn waze"
                  >
                    Waze
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};
