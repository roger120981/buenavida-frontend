// types/caseManagers.ts
export interface CaseManager {
  id: number;
  name: string;
  email: string;
  phone: string;
  agencyId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  id: number;
  name: string;
}

export interface CaseManagerResponse {
  data: CaseManager[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
}

export interface AgencyResponse {
  data: Agency[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
}

// MODIFICACIÓN: Nuevo tipo para la respuesta de la mutación
export interface CreateCaseManagerResponse {
  success: boolean;
  message: string;
  data: CaseManager;
}