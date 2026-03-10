import type { ApiResponse, ChartDataResponse } from './types';

// Используем прокси (для локальной разработки через Vite)
const BASE_URL = '/api-fuel/Home';

export const fuelApi = {
  async getPageData(countryId: number): Promise<ApiResponse> {
    // Исправлено: параметр запроса должен быть countryId
    const response = await fetch(`${BASE_URL}/GetPageData?countryId=${countryId}`);
    if (!response.ok) throw new Error('Failed to fetch fuel data');
    return response.json();
  },

  async getDateRangeAverages(startDate: string, endDate: string, countryId = 1): Promise<ChartDataResponse> {
    const params = new URLSearchParams({
      countryId: countryId.toString(),
      startDate,
      endDate
    });
    const response = await fetch(`${BASE_URL}/GetDateRangeAverages?${params}`);
    if (!response.ok) throw new Error('Failed to fetch chart data');
    return response.json();
  }
};
