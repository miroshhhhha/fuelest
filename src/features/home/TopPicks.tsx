import React from 'react';
import { StationCard } from '../price-list/StationCard';
import type { TopPick } from '../../hooks/useFuelData';

interface TopPicksProps {
  topPicks: Record<number, TopPick>;
  fuelTypes: { id: number; name: string }[];
  onStationSelect: (id: number) => void;
}

export const TopPicks: React.FC<TopPicksProps> = ({ topPicks, fuelTypes, onStationSelect }) => {
  return (
    <section className="mb-8">
      <div className="text-xl font-extrabold mb-4">Best prices right now (24h)</div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-2">
        {fuelTypes.map(type => {
          const pick = topPicks[type.id];
          return pick ? (
            <div 
              key={type.id} 
              className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-98" 
              onClick={() => onStationSelect(pick.station.id)}
            >
              <StationCard 
                station={pick.station} 
                selectedFuelId={type.id} 
              />
            </div>
          ) : null;
        })}
      </div>
    </section>
  );
};
