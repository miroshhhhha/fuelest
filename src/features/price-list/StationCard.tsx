import React from 'react';
import type { ApiStation } from '../../api/types';
import { COMPANIES, type CompanyId } from '../../constants/companies';
import { formatAge, formatPrice } from '../../utils/formatters';
import './StationCard.css';

interface StationCardProps {
  station: ApiStation;
  selectedFuelId: number;
}

export const StationCard: React.FC<StationCardProps> = ({ station, selectedFuelId }) => {
  const fuel = station.fuelTypes.find(f => f.id === selectedFuelId);
  const company = COMPANIES[station.companyId as CompanyId] || { name: 'Unknown', color: '#666' };

  if (!fuel) return null;

  const fuelShortName = fuel.name.replace('Bensiin ', '').replace('Diisel', 'D');
  const priceColor = fuel.price < 1.6 ? '#16a34a' : 'inherit';
  const { latitude, longitude } = station.location;

  // Останавливаем всплытие клика, чтобы при нажатии на кнопки Maps/Waze 
  // не срабатывал переход по карте (который висит на родителе в App.tsx)
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="station-card-compact">
      <div className="card-main-row">
        <div className="fuel-badge-square" style={{ backgroundColor: company.color }}>
          {fuelShortName}
        </div>
        <div className="card-info">
          <div className="station-name-mini" title={station.displayName}>{station.displayName}</div>
          <div className="age-tag-mini">{formatAge(fuel.age)}</div>
        </div>
        <div className="price-tag-compact" style={{ color: priceColor }}>
          {formatPrice(fuel.price)}<span className="unit-mini">€</span>
        </div>
      </div>
      
      <div className="card-actions-row" onClick={handleActionClick}>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`} 
           target="_blank" rel="noreferrer" className="mini-btn gmaps">Maps</a>
        <a href={`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`} 
           target="_blank" rel="noreferrer" className="mini-btn waze">Waze</a>
        {station.isEmergencyStation && <span className="em-dot" title="Emergency Station">●</span>}
      </div>
    </div>
  );
};
