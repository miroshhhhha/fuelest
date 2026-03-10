import { MainLayout } from './layouts/MainLayout';
import { FuelMap } from './features/fuel-map/FuelMap';
import { useFuelData } from './hooks/useFuelData';
import { useState, useEffect } from 'react';
import { Hero } from './features/home/Hero';
import { TopPicks } from './features/home/TopPicks';
import { Stats } from './features/home/Stats';
import { RadiusSearch } from './features/home/RadiusSearch';
import { PriceChart } from './features/home/PriceChart';

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
      const mapSection = document.querySelector('#map-section');
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
      <div className="home-page animate-in fade-in duration-500">
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

        <section id="map-section" className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="m-0 text-xl font-extrabold text-text-main">Station Map</h3>
            {!isFullScreen && (
              <div className="flex gap-3 items-center">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <button className={`border-none bg-transparent py-1.5 px-3.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${selectedMapFuelId === null ? 'bg-white text-primary shadow-sm' : 'text-text-muted'}`} onClick={() => setSelectedMapFuelId(null)}>All</button>
                  {FUEL_TYPES.map(type => (
                    <button key={type.id} className={`border-none bg-transparent py-1.5 px-3.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${selectedMapFuelId === type.id ? 'bg-white text-primary shadow-sm' : 'text-text-muted'}`} onClick={() => setSelectedMapFuelId(type.id)}>{type.name}</button>
                  ))}
                </div>
                <button className="bg-slate-800 text-white border-none py-2 px-3.5 rounded-lg font-bold text-xs cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => setIsFullScreen(true)}>Full Screen</button>
              </div>
            )}
          </div>
          
          <div className={`h-[600px] rounded-2xl overflow-hidden border border-slate-200 relative ${isFullScreen ? 'fixed inset-0 w-screen h-screen z-[2000] rounded-none border-none' : ''}`}>
            {isFullScreen && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[2100] flex items-center gap-3 bg-white/90 backdrop-blur-md p-1.5 rounded-[14px] shadow-2xl">
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <button className={`border-none bg-transparent py-1.5 px-3.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${selectedMapFuelId === null ? 'bg-white text-primary shadow-sm' : 'text-text-muted'}`} onClick={() => setSelectedMapFuelId(null)}>All</button>
                  {FUEL_TYPES.map(type => (
                    <button key={type.id} className={`border-none bg-transparent py-1.5 px-3.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${selectedMapFuelId === type.id ? 'bg-white text-primary shadow-sm' : 'text-text-muted'}`} onClick={() => setSelectedMapFuelId(type.id)}>{type.name}</button>
                  ))}
                </div>
                <button className="bg-red-500 text-white border-none w-8 h-8 rounded-lg font-black cursor-pointer hover:bg-red-600 transition-colors" onClick={() => setIsFullScreen(false)}>✕</button>
              </div>
            )}
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 font-medium">Loading stations...</div>
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

        <PriceChart />

        <Stats stationCount={allStations.length} />
      </div>
    </MainLayout>
  );
}

export default App;
