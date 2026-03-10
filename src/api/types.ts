export interface ApiLocation {
  id: number;
  latitude: number;
  longitude: number;
}

export interface ApiFuelType {
  id: number;
  name: string;
  price: number;
  dateTime: string;
  age: number;
  logo: string;
  unit: number;
}

export interface ApiStation {
  id: number;
  companyId: number;
  countyId: number;
  address: string;
  name: string;
  displayName: string;
  isEmergencyStation: boolean;
  location: ApiLocation;
  fuelTypes: ApiFuelType[];
}

export interface ApiCounty {
  id: number;
  countryId: number;
  name: string;
}

export interface ApiResponse {
  data: {
    counties: ApiCounty[];
    allStations: ApiStation[];
  };
}

export interface PricePoint {
  fuelTypeId: number;
  day: string;
  price: number;
}

export interface OilPoint {
  day: string;
  price: number;
}

export interface ChartDataResponse {
  data: {
    chartStep: number;
    fuelTypePrices: {
      fuelTypeId: number;
      groupedPriceInfos: PricePoint[];
    }[];
    oilPrices: OilPoint[];
  };
}
