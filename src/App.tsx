import { MainLayout } from './layouts/MainLayout';
import { FuelMap } from './features/fuel-map/FuelMap';
import { useFuelData } from './hooks/useFuelData';
import { useState, useEffect } from 'react';
import { Hero } from './features/home/Hero';
import { TopPicks } from './features/home/TopPicks';
import { Stats } from './features/home/Stats';
import { RadiusSearch } from './features/home/RadiusSearch';
import './App.css';

const FUEL_TYPES = [
  { id: 6, name: '95' },
  { id: 7, name: '98' },
  { id: 8, name: 'D' },
  { id: 10, name: 'LPG' },
];

function App() {
  const { allStations, topPicks, loading } = useFuelData();
  const [selectedMapFuelId, setSelectedMapFuelId] = useState<number | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [focusedStationId, setFocusedStationId] = useState<number | null>(null);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lon: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState(5);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isFullScreen]);

  const handleStationSelect = (id: number) => {
    setFocusedStationId(id);
    if (!isFullScreen) {
      const mapSection = document.querySelector('.main-map-section');
      mapSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMapClick = (lat: number, lon: number) => {
    setSearchCenter({ lat, lon });
  };

  const handleClearSearch = () => {
    setSearchCenter(null);
  };

  return (
    <MainLayout>
      <div className="home-page">
        <Hero />

        <TopPicks 
          topPicks={topPicks} 
          fuelTypes={FUEL_TYPES} 
          onStationSelect={handleStationSelect} 
        />

        <RadiusSearch 
          stations={allStations}
          fuelTypes={FUEL_TYPES}
          searchCenter={searchCenter}
          radius={searchRadius}
          onRadiusChange={setSearchRadius}
          onStationSelect={handleStationSelect}
          onClearSearch={handleClearSearch}
        />

        <section className="main-map-section">
          <div className="map-header">
            <h3>Station Map</h3>
            {!isFullScreen && (
              <div className="map-controls">
                <div className="map-filters">
                  <button className={`map-filter-btn ${selectedMapFuelId === null ? 'active' : ''}`} onClick={() => setSelectedMapFuelId(null)}>All</button>
                  {FUEL_TYPES.map(type => (
                    <button key={type.id} className={`map-filter-btn ${selectedMapFuelId === type.id ? 'active' : ''}`} onClick={() => setSelectedMapFuelId(type.id)}>{type.name}</button>
                  ))}
                </div>
                <button className="fullscreen-btn" onClick={() => setIsFullScreen(true)}>Full Screen</button>
              </div>
            )}
          </div>
          
          <div className={`map-container-outer ${isFullScreen ? 'full-screen-mode' : ''}`}>
            {isFullScreen && (
              <div className="fs-overlay-controls">
                <div className="map-filters">
                  <button className={`map-filter-btn ${selectedMapFuelId === null ? 'active' : ''}`} onClick={() => setSelectedMapFuelId(null)}>All</button>
                  {FUEL_TYPES.map(type => (
                    <button key={type.id} className={`map-filter-btn ${selectedMapFuelId === type.id ? 'active' : ''}`} onClick={() => setSelectedMapFuelId(type.id)}>{type.name}</button>
                  ))}
                </div>
                <button className="exit-fs-btn-icon" onClick={() => setIsFullScreen(false)}>✕</button>
              </div>
            )}
            {loading ? (
              <div className="map-loading">Loading stations...</div>
            ) : (
              <FuelMap 
                stations={allStations} 
                selectedFuelId={selectedMapFuelId} 
                focusedStationId={focusedStationId}
                searchCenter={searchCenter}
                searchRadius={searchRadius}
                onMapClick={handleMapClick}
              />
            )}
          </div>
        </section>

        <Stats stationCount={allStations.length} />
      </div>
    </MainLayout>
  );
}

export default App;
