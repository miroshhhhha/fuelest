import React, { useState, useMemo } from 'react';
import type { ApiStation } from '../../api/types';
import {calculateDistance, formatAge, formatPrice} from '../../utils/formatters';
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
    <section className="radius-search-section">
      <div className="radius-card">
        <div className="radius-header">
          <div className="header-top-row">
            <h3>Search in Radius</h3>
            {searchCenter && (
              <button className="clear-search-btn" onClick={onClearSearch}>
                ✕ Clear
              </button>
            )}
          </div>
          <p>Click on the map to set center and see all prices in range</p>
        </div>

        <div className="radius-controls">
          <div className="control-group">
            <label>Fuel Type</label>
            <div className="fuel-selector-mini">
              {fuelTypes.map(f => (
                <button 
                  key={f.id} 
                  className={`mini-fuel-btn ${selectedFuelId === f.id ? 'active' : ''}`}
                  onClick={() => setSelectedFuelId(f.id)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div className="label-row">
              <label>Radius</label>
              <span className="radius-val">{radius < 1 ? `${(radius * 1000).toFixed(0)} m` : `${radius} km`}</span>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="25" 
              step="0.1"
              value={radius} 
              onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
              className="radius-slider"
            />
          </div>
        </div>

        <div className="radius-results-container">
          {!searchCenter ? (
            <div className="radius-empty-state">
              <span className="icon">📍</span>
              <p>Click anywhere on the map to start</p>
            </div>
          ) : results.length > 0 ? (
            <div className="radius-results-list">
              <div className="results-count">Found {results.length} stations</div>
              {results.map(s => {
                const company = COMPANIES[s.companyId as CompanyId] || { name: 'Unknown', color: '#666' };
                return (
                  <div 
                    key={s.id} 
                    className="radius-result-item"
                    onClick={() => onStationSelect(s.id)}
                  >
                    <div className="result-main">
                      <span className="result-company" style={{ color: company.color }}>{company.name}</span>
                      <span className="result-name">{s.displayName}</span>
                      <div className="result-meta">
                        <span className="result-dist">{s.distance < 1 ? `${(s.distance * 1000).toFixed(0)}m` : `${s.distance.toFixed(1)}km`}</span>
                        <span className="result-dot">•</span>
                        <span className="result-age">{s.fuel ? formatAge(s.fuel.age) : ''}</span>
                      </div>
                    </div>
                    <div className="result-price">
                      <span className="price-val">{formatPrice(s.fuel?.price || 0)}€</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="radius-empty-state">
              <p>No stations found with {fuelTypes.find(f => f.id === selectedFuelId)?.name} in this area</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
