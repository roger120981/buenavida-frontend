// api/caseManagers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios.config";
import { CaseManager, Agency, CaseManagerResponse, AgencyResponse } from "@/lib/types/caseManagers";

// Listar todos los case managers
const fetchCaseManagers = async (): Promise<CaseManagerResponse> => {
  const response = await api.get("/case-managers");
  return response.data;
};

export const useCaseManagers = () => {
  return useQuery({
    queryKey: ["caseManagers"],
    queryFn: fetchCaseManagers,
  });
};

// Listar todas las agencias
const fetchAgencies = async (): Promise<AgencyResponse> => {
  const response = await api.get("/agencies");
  return response.data;
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