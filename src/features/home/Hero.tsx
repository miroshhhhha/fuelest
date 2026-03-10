import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Estonia Fuel Prices</h1>
        <p className="subtitle">Real-time tracking of best deals</p>
        <p className="data-source-credit">
          Data provided by <a href="https://fuelest.ee" target="_blank" rel="noreferrer">fuelest.ee</a>
        </p>
      </div>
    </section>
  );
};
