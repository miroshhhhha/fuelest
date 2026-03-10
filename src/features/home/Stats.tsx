import React from 'react';

interface StatsProps {
  stationCount: number;
}

export const Stats: React.FC<StatsProps> = ({ stationCount }) => {
  return (
    <section className="section-stats">
      <p>Tracking {stationCount} stations across Estonia.</p>
    </section>
  );
};
