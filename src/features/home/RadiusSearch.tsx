import React, { useState, useMemo } from 'react';
import type { ApiStation } from '../../api/types';
import { calculateDistance, formatPrice, formatAge } from '../../utils/formatters';
import { COMPANIES, type CompanyId } from '../../constants/companies';

interface RadiusSearchProps {
  stations: ApiStation[];
  fuelTypes: { id: number; name: string }[];
  searchCenter: { lat: number; lon: number } | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
  onStationSelect: (id: number) => void;
  onClearSearch: () => void;
}

export const RadiusSearch: React.FC<RadiusSearchProps> = ({ 
  stations, 
  fuelTypes, 
  searchCenter, 
  radius, 
  onRadiusChange, 
  onStationSelect,
  onClearSearch
}) => {
  const [selectedFuelId, setSelectedFuelId] = useState(fuelTypes[0].id);

  const results = useMemo(() => {
    if (!searchCenter) return [];

    return stations
      .map(s => {
        const fuel = s.fuelTypes.find(f => f.id === selectedFuelId);
        const distance = calculateDistance(searchCenter.lat, searchCenter.lon, s.location.latitude, s.location.longitude);
        return { ...s, fuel, distance };
      })
      .filter(s => s.fuel && s.fuel.price > 0 && s.distance <= radius)
      .sort((a, b) => (a.fuel?.price || 0) - (b.fuel?.price || 0));
  }, [stations, searchCenter, radius, selectedFuelId]);

  return (
    <section className="mb-8">
      <div className="bg-white text-text-main rounded-[20px] p-6 shadow-sm border border-slate-200">
        <div className="mb-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="m-0 text-xl font-extrabold">Search in Radius</h3>
            {searchCenter && (
              <button 
                className="bg-red-50 text-red-500 border border-red-100 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-transform hover:-translate-y-px active:translate-y-0" 
                onClick={onClearSearch}
              >
                ✕ Clear
              </button>
            )}
          </div>
          <p className="m-0 mb-5 text-sm text-text-muted">Click on the map to set center and see all prices in range</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-[0.75rem] font-extrabold uppercase text-text-muted">Fuel Type</label>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {fuelTypes.map(f => (
                <button 
                  key={f.id} 
                  className={`border-none bg-transparent py-2 px-3 rounded-lg font-bold text-xs cursor-pointer flex-1 transition-all duration-200 ${selectedFuelId === f.id ? 'bg-white text-primary shadow-sm' : 'text-text-muted'}`}
                  onClick={() => setSelectedFuelId(f.id)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-[0.75rem] font-extrabold uppercase text-text-muted">Radius</label>
              <span className="text-primary font-extrabold text-[0.875rem]">
                {radius < 1 ? `${(radius * 1000).toFixed(0)} m` : `${radius} km`}
              </span>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="25" 
              step="0.1"
              value={radius} 
              onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full bg-slate-200 accent-primary cursor-pointer appearance-none"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5">
          {!searchCenter ? (
            <div className="text-center py-10 text-text-muted">
              <span className="text-3xl block mb-2">📍</span>
              <p>Click anywhere on the map to start</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-2">
              <div className="text-[0.75rem] font-extrabold text-text-muted uppercase mb-3">Found {results.length} stations</div>
              <div className="flex flex-col gap-2 max-height-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {results.map(s => {
                  const company = COMPANIES[s.companyId as CompanyId] || { name: 'Unknown', color: '#666' };
                  return (
                    <div 
                      key={s.id} 
                      className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-xl cursor-pointer transition-all duration-200 border border-slate-200 hover:translate-x-1 hover:border-primary hover:bg-slate-100"
                      onClick={() => onStationSelect(s.id)}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.65rem] font-black uppercase" style={{ color: company.color }}>{company.name}</span>
                        <span className="text-sm font-bold text-text-main">{s.displayName}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-text-muted">{s.distance < 1 ? `${(s.distance * 1000).toFixed(0)}m` : `${s.distance.toFixed(1)}km`}</span>
                          <span className="text-slate-300 text-[0.6rem]">•</span>
                          <span className="text-xs text-text-muted">{s.fuel ? formatAge(s.fuel.age) : ''}</span>
                        </div>
                      </div>
                      <div className="result-price">
                        <span className="text-lg font-black text-primary">{formatPrice(s.fuel?.price || 0)}€</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-text-muted">
              <p>No stations found with {fuelTypes.find(f => f.id === selectedFuelId)?.name} in this area</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
