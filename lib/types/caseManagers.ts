// types/caseManagers.ts
export interface CaseManager {
    id: number;
    name: string;
  }
  
  export interface Agency {
    id: number;
    name: string;
  }
  
  export interface CaseManagerResponse {
    data: CaseManager[];
  }
  
  export interface AgencyResponse {
    data: Agency[];
  }