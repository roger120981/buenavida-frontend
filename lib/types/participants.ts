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
  id: number;
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
  caseManager?: { id: number; name: string }; // Revertido a caseManager para compatibilidad con findAll
  createdAt: string;
  updatedAt: string;
  caregivers?: Array<{
    participantId: number;
    caregiverId: number;
    assignedAt: string;
    assignedBy: string;
    caregiver: { id: number; name: string };
  }>;
}

export interface PaginatedParticipantResponse {
  data: Participant[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
}