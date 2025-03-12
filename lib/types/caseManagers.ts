// types/caseManagers.ts
export interface CaseManager {
  id: number;
  name: string;
}

export interface Agency {
  id: number;
  name: string;
}

// MODIFICACIÓN: Ajusté para coincidir con la respuesta real del backend
export interface CaseManagerResponse {
  data: CaseManager[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
}

// MODIFICACIÓN: Ajusté para coincidir con la respuesta del backend (asumiendo que /agencies es similar)
export interface AgencyResponse {
  data: Agency[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
}