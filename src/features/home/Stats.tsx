import React from 'react';

interface StatsProps {
  stationCount: number;
}

export const Stats: React.FC<StatsProps> = ({ stationCount }) => {
  return (
    <section className="text-center py-10 text-text-muted text-sm">
      <p>Tracking {stationCount} stations across Estonia.</p>
    </section>
  );
};
