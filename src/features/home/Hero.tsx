import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="py-8 text-center">
      <div className="hero-content">
        <h1 className="text-4xl font-black m-0 tracking-tight leading-tight">Estonia Fuel Prices</h1>
        <p className="text-lg text-text-muted mt-2">Real-time tracking of best deals</p>
        <p className="text-sm mt-3 font-medium text-text-muted">
          Data provided by <a href="https://fuelest.ee" target="_blank" rel="noreferrer" className="text-primary no-underline font-bold border-b border-transparent hover:border-primary transition-colors">fuelest.ee</a>
        </p>
      </div>
    </section>
  );
};
