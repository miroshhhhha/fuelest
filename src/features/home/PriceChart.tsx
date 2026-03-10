import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { fuelApi } from '../../api/fuelApi';
import type { ChartDataResponse } from '../../api/types';

const RANGES = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: '2 Years', value: '2years' },
  { label: 'Custom', value: 'custom' },
];

const FUEL_LABELS: Record<number, string> = {
  6: '95',
  7: '98',
  8: 'D',
  9: 'CNG',
  10: 'LPG'
};

const FUEL_COLORS: Record<number, string> = {
  6: '#22c55e',
  7: '#16a34a',
  8: '#3b82f6',
  9: '#6366f1',
  10: '#f59e0b'
};

interface MergedDataPoint {
  day: string;
  [key: string]: number | string;
}

export const PriceChart: React.FC = () => {
  const [range, setRange] = useState('year');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<MergedDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const start = new Date();

    if (range === 'week') start.setDate(today.getDate() - 7);
    else if (range === 'month') start.setMonth(today.getMonth() - 1);
    else if (range === 'year') start.setFullYear(today.getFullYear() - 1);
    else if (range === '2years') start.setFullYear(today.getFullYear() - 2);
    else if (range === 'custom') return;

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, [range]);

  const fetchData = useCallback(async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    setError(null);
    try {
      const res: ChartDataResponse = await fuelApi.getDateRangeAverages(
        new Date(startDate).toISOString(),
        new Date(endDate).toISOString()
      );

      if (!res?.data) throw new Error('No data');

      const merged: Record<string, MergedDataPoint> = {};
      
      res.data.fuelTypePrices.forEach(type => {
        if (type.groupedPriceInfos) {
          type.groupedPriceInfos.forEach(p => {
            const day = p.day.split('T')[0];
            if (!merged[day]) merged[day] = { day };
            merged[day][`fuel_${type.fuelTypeId}`] = p.price;
          });
        }
      });

      if (res.data.oilPrices) {
        res.data.oilPrices.forEach(o => {
          const day = o.day.split('T')[0];
          if (!merged[day]) merged[day] = { day };
          merged[day].oil = o.price;
        });
      }

      setData(Object.values(merged).sort((a, b) => a.day.localeCompare(b.day)));
    } catch {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (range !== 'custom') {
      fetchData();
    }
  }, [range, fetchData]);

  const formattedData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return data.map(item => {
      const date = new Date(item.day);
      let displayDate = "";

      if (range === 'year' || range === '2years' || diffDays > 120) {
        displayDate = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      } else {
        displayDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      }

      return { ...item, displayDate };
    });
  }, [data, range, startDate, endDate]);

  return (
    <section className="price-chart-section">
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-group">
            <h3>Price Trends</h3>
            <p className="chart-credit">Source: <a href="https://fuelest.ee" target="_blank" rel="noreferrer">fuelest.ee</a></p>
          </div>
          
          <div className="range-controls-wrapper">
            <div className="range-selector">
              {RANGES.map(r => (
                <button 
                  key={r.value}
                  className={`range-btn ${range === r.value ? 'active' : ''}`}
                  onClick={() => setRange(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {range === 'custom' && (
              <div className="custom-date-inputs">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <span>to</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <button className="apply-date-btn" onClick={fetchData}>Apply</button>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">Loading trends...</div>
          ) : error ? (
            <div className="chart-error">{error}</div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  minTickGap={30}
                />
                
                <YAxis 
                  yAxisId="oil"
                  orientation="left"
                  domain={['auto', 'auto']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => `$${val.toFixed(0)}`}
                  label={{ value: 'Oil (USD)', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fill: '#94a3b8' }}
                />

                <YAxis 
                  yAxisId="fuel"
                  orientation="right"
                  domain={['dataMin - 0.02', 'dataMax + 0.02']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `${val.toFixed(2)}€`}
                  label={{ value: 'Fuel (EUR)', angle: 90, position: 'insideRight', offset: 10, fontSize: 11, fill: '#64748b' }}
                />

                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Legend iconType="circle" />
                
                {[6, 7, 8, 9, 10].map(id => (
                  <Line
                    key={id}
                    yAxisId="fuel"
                    type="linear"
                    connectNulls
                    dataKey={`fuel_${id}`}
                    name={FUEL_LABELS[id]}
                    stroke={FUEL_COLORS[id]}
                    strokeWidth={2.5}
                    dot={range === 'week' || range === 'month'}
                    activeDot={{ r: 5 }}
                  />
                ))}

                <Line
                  yAxisId="oil"
                  type="linear"
                  connectNulls
                  dataKey="oil"
                  name="Brent Oil (USD)"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
};
