// types/caregivers.ts
export interface Caregiver {
    id: number;
    name: string;
  }
  
  // Tipado para las respuestas paginadas de la API (si aplica)
  export interface CaregiverResponse {
    data: Caregiver[];
  }