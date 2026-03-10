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
  age: number; // minutes
  logo: string;
  unit: number; // 1: L, 2: kg
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
