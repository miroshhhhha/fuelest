import React, { useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle } from 'react-leaflet';
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

const searchCenterIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: '<div class="search-center-marker"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

interface FuelMapProps {
  stations: ApiStation[];
  selectedFuelId: number | null;
  focusedStationId?: number | null;
  searchCenter: { lat: number; lon: number } | null;
  searchRadius: number;
  onMapClick: (lat: number, lon: number) => void;
}

const MapEvents = ({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

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
          duration: 1.2
        });
        
        setTimeout(() => {
          marker.openPopup();
        }, 1200);
      }
    }
  }, [focusedStationId, map, stations, markerRefs]);

  return null;
};

export const FuelMap: React.FC<FuelMapProps> = ({ 
  stations, 
  selectedFuelId, 
  focusedStationId = null, 
  searchCenter, 
  searchRadius,
  onMapClick 
}) => {
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
      <MapEvents onMapClick={onMapClick} />

      {searchCenter && (
        <>
          <Marker position={[searchCenter.lat, searchCenter.lon]} icon={searchCenterIcon} />
          <Circle 
            center={[searchCenter.lat, searchCenter.lon]} 
            radius={searchRadius * 1000} 
            pathOptions={{ fillColor: '#2563eb', fillOpacity: 0.1, color: '#2563eb', weight: 1, dashArray: '5, 10' }}
          />
        </>
      )}
      
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
              <div className="p-4 font-sans">
                <div className="mb-3">
                  <span className="text-[0.7rem] font-black uppercase tracking-wider" style={{ color: company.color }}>{company.name}</span>
                  <h4 className="m-0 mt-1 text-[1.125rem] font-extrabold text-slate-900">{station.displayName}</h4>
                  <p className="m-0 text-slate-500 text-[0.8125rem]">{station.address}</p>
                </div>
                
                <div className="flex flex-col gap-1.5 mb-4">
                  {station.fuelTypes.map(f => (
                    <div key={f.id} className={`flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg transition-all ${f.id === selectedFuelId ? 'bg-blue-50 border border-blue-200' : ''}`}>
                      <span className="font-bold text-sm text-slate-700">{f.name.replace('Bensiin ', '')}</span>
                      <div className="flex flex-col items-end">
                        <span className="font-extrabold text-base text-slate-900 leading-tight">{formatPrice(f.price)}€</span>
                        <span className="text-[0.65rem] text-slate-400">{formatAge(f.age)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${station.location.latitude},${station.location.longitude}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="py-3 rounded-xl text-center no-underline text-[0.8125rem] font-extrabold text-white bg-[#4285F4] hover:brightness-110"
                  >
                    Google Maps
                  </a>
                  <a 
                    href={`https://waze.com/ul?ll=${station.location.latitude},${station.location.longitude}&navigate=yes`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="py-3 rounded-xl text-center no-underline text-[0.8125rem] font-extrabold text-white bg-[#33CCFF] hover:brightness-110"
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
