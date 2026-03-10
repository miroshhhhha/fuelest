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
    <section className="top-picks-section">
      <div className="section-title">Best prices right now (24h)</div>
      <div className="top-picks-grid-compact">
        {fuelTypes.map(type => {
          const pick = topPicks[type.id];
          return pick ? (
            <div 
              key={type.id} 
              className="top-pick-clickable" 
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
