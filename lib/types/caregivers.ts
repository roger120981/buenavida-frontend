// lib/types/caregiver.ts
export type Caregiver = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CaregiverAssignment = {
  caregiverId: number;
  caregiverName: string; // Para mostrar en el frontend
};

export type CreateCaregiverDto = {
  name: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
};

export type CaregiverAssignmentDto = {
  caregiverId: number;
};