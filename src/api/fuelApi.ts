import type { ApiResponse } from './types';

export const fuelApi = {
  async getPageData(countryId: number = 1): Promise<ApiResponse> {
    const response = await fetch(`/api/Home/GetPageData?countryId=${countryId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
};
