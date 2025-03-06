// lib/types/participants.ts
export interface CaseManagerRelation {
    create?: {
      name: string;
      email: string;
      phone: string;
      agencyId: number;
    };
    connect?: {
      id: number;
    };
  }
  
  export interface CreateParticipantDto {
    name: string;
    isActive: boolean;
    gender: string;
    medicaidId: string;
    dob: string; // ISO date string, ej: "2023-01-01"
    location: string;
    community: string;
    address: string;
    primaryPhone: string;
    secondaryPhone?: string;
    locStartDate: string; // ISO date string
    locEndDate: string; // ISO date string
    pocStartDate: string; // ISO date string
    pocEndDate: string; // ISO date string
    units?: number;
    hours?: number;
    hdm?: boolean;
    adhc?: boolean;
    caseManager: CaseManagerRelation;
  }
  
  export interface UpdateParticipantDto {
    name?: string;
    isActive?: boolean;
    gender?: string;
    medicaidId?: string;
    dob?: string;
    location?: string;
    community?: string;
    address?: string;
    primaryPhone?: string;
    secondaryPhone?: string;
    locStartDate?: string;
    locEndDate?: string;
    pocStartDate?: string;
    pocEndDate?: string;
    units?: number;
    hours?: number;
    hdm?: boolean;
    adhc?: boolean;
    caseManager?: CaseManagerRelation;
  }
  
  export interface Participant {
    id: number; // Asumo que el backend agrega este campo al devolver un participante
    name: string;
    isActive: boolean;
    gender: string;
    medicaidId: string;
    dob: string;
    location: string;
    community: string;
    address: string;
    primaryPhone: string;
    secondaryPhone?: string;
    locStartDate: string;
    locEndDate: string;
    pocStartDate: string;
    pocEndDate: string;
    units?: number;
    hours?: number;
    hdm?: boolean;
    adhc?: boolean;
    caseManager: { id: number; name: string }; // Simplificado, ajusta según tu modelo
  }
  
  export interface PaginatedParticipantResponse {
    data: Participant[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
  }