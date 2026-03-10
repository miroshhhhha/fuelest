export const COMPANIES = {
  3: { name: 'Alexela', color: '#004A99' },
  4: { name: 'Circle K', color: '#ED1C24' },
  5: { name: 'Neste', color: '#0072BC' },
  6: { name: 'Olerex', color: '#FFD700' },
  7: { name: 'Jetoil', color: '#000000' },
  1006: { name: 'Terminal', color: '#F7941E' },
} as const;

export type CompanyId = keyof typeof COMPANIES;
