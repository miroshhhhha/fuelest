import React from 'react';
import type { ApiStation } from '../../api/types';
import { COMPANIES, type CompanyId } from '../../constants/companies';
import { formatAge, formatPrice } from '../../utils/formatters';

interface StationCardProps {
  station: ApiStation;
  selectedFuelId: number;
}

export const StationCard: React.FC<StationCardProps> = ({ station, selectedFuelId }) => {
  const fuel = station.fuelTypes.find(f => f.id === selectedFuelId);
  const company = COMPANIES[station.companyId as CompanyId] || { name: 'Unknown', color: '#666' };

  if (!fuel) return null;

  const fuelShortName = fuel.name.replace('Bensiin ', '').replace('Diisel', 'D');
  const isCheap = fuel.price < 1.6;
  const { latitude, longitude } = station.location;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 flex flex-col gap-2.5 transition-all duration-200 hover:border-primary hover:shadow-md">
      <div className="flex items-center gap-2.5">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-extrabold text-[0.75rem] shrink-0" 
          style={{ backgroundColor: company.color }}
        >
          {fuelShortName}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[0.85rem] whitespace-nowrap overflow-hidden text-ellipsis text-slate-800" title={station.displayName}>
            {station.displayName}
          </div>
          <div className="text-[0.7rem] text-slate-400">
            {formatAge(fuel.age)}
          </div>
        </div>
        <div className={`font-extrabold text-[1.1rem] text-right shrink-0 ${isCheap ? 'text-green-600' : 'text-slate-900'}`}>
          {formatPrice(fuel.price)}<span className="text-[0.7rem] text-slate-400 ml-0.5">€</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1.5" onClick={handleActionClick}>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`} 
           target="_blank" rel="noreferrer" 
           className="flex-1 text-center no-underline text-[0.7rem] font-extrabold py-1.5 rounded-md text-white bg-[#4285F4] hover:brightness-110">
          Maps
        </a>
        <a href={`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`} 
           target="_blank" rel="noreferrer" 
           className="flex-1 text-center no-underline text-[0.7rem] font-extrabold py-1.5 rounded-md text-white bg-[#33CCFF] hover:brightness-110">
          Waze
        </a>
        {station.isEmergencyStation && <span className="text-red-600 text-xl leading-none cursor-help px-1" title="Emergency Station">●</span>}
      </div>
    </div>
  );
};
