// api/caseManagers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios.config";
import { CaseManager, Agency, CaseManagerResponse, AgencyResponse } from "@/lib/types/caseManagers";

// Listar todos los case managers
const fetchCaseManagers = async (): Promise<CaseManagerResponse> => {
  // MODIFICACIÓN: Añadí parámetros por defecto y manejo de errores
  try {
    const response = await api.get("/case-managers", {
      params: { page: 1, pageSize: 10 }, // MODIFICACIÓN: Asegura que el backend no falle
    });
    console.log('Response from /case-managers:', response.data); // MODIFICACIÓN: Depuración
    return response.data;
  } catch (error) {
    console.error('Error fetching case managers:', error); // MODIFICACIÓN: Registro de errores
    throw error;
  }
};

export const useCaseManagers = () => {
  return useQuery({
    queryKey: ["caseManagers"],
    queryFn: fetchCaseManagers,
  });
};

// Listar todas las agencias
const fetchAgencies = async (): Promise<AgencyResponse> => {
  // MODIFICACIÓN: Añadí parámetros por defecto y manejo de errores
  try {
    const response = await api.get("/agencies", {
      params: { page: 1, pageSize: 10 }, // MODIFICACIÓN: Asegura compatibilidad
    });
    console.log('Response from /agencies:', response.data); // MODIFICACIÓN: Depuración
    return response.data;
  } catch (error) {
    console.error('Error fetching agencies:', error); // MODIFICACIÓN: Registro de errores
    throw error;
  }
};

export const useAgencies = () => {
  return useQuery({
    queryKey: ["agencies"],
    queryFn: fetchAgencies,
  });
};

// Crear un nuevo case manager
const createCaseManager = async (data: {
  name: string;
  email: string;
  phone: string;
  agencyId: string;
}): Promise<{ success: boolean; message: string; data: CaseManager }> => {
  const response = await api.post("/case-managers", data);
  return response.data;
};

export const useCreateCaseManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCaseManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseManagers"] });
    },
  });
};