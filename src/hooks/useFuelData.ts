import { useState, useEffect, useMemo } from 'react';
import type { ApiStation, ApiCounty, ApiFuelType } from '../api/types';
import { fuelApi } from '../api/fuelApi';

export interface TopPick {
  station: ApiStation;
  fuel: ApiFuelType;
}

export const useFuelData = () => {
  const [stations, setStations] = useState<ApiStation[]>([]);
  const [counties, setCounties] = useState<ApiCounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fuelApi.getPageData(1);
        setStations(response.data.allStations);
        setCounties(response.data.counties);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const topPicks = useMemo(() => {
    const fuelIds = [6, 7, 8, 10];
    const picks: Record<number, TopPick> = {};
    const MAX_AGE_HOURS = 24;

    fuelIds.forEach(id => {
      let minPrice = Infinity;
      let bestStation: ApiStation | null = null;
      let bestFuel: ApiFuelType | null = null;

      stations.forEach(s => {
        const fuel = s.fuelTypes.find(f => f.id === id);
        if (fuel && fuel.price > 0 && fuel.age <= MAX_AGE_HOURS && fuel.price < minPrice) {
          minPrice = fuel.price;
          bestStation = s;
          bestFuel = fuel;
        }
      });

      if (bestStation && bestFuel) {
        picks[id] = { station: bestStation, fuel: bestFuel };
      }
    });

    return picks;
  }, [stations]);

  return {
    allStations: stations,
    topPicks,
    counties,
    loading,
    error,
  };
};
