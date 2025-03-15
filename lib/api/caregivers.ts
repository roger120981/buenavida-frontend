// lib/api/caregivers.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/config/axios.config";
import { Caregiver, CreateCaregiverDto } from "@/lib/types/caregivers"; // Solo los tipos necesarios

export type CaregiversResponse = {
  data: Caregiver[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const useCaregivers = () => {
  return useQuery<CaregiversResponse, Error>({
    queryKey: ["caregivers"],
    queryFn: async () => {
      const response = await api.get<CaregiversResponse>("/caregivers", {
        params: {
          page: 1,
          pageSize: 10,
        },
      });
      return response.data;
    },
  });
};

export const useCreateCaregiver = () => {
  return useMutation({
    mutationFn: async (createCaregiverDto: CreateCaregiverDto) => {
      const response = await api.post("/caregivers", createCaregiverDto);
      return response.data;
    },
  });
};

export const useAssignCaregiver = () => {
  return useMutation({
    mutationFn: async ({ participantId, caregiverId }: { participantId: number; caregiverId: number }) => {
      const response = await api.post(`/participants/${participantId}/caregivers/${caregiverId}`);
      return response.data;
    },
  });
};

export const useUnassignCaregiver = () => {
  return useMutation({
    mutationFn: async ({ participantId, caregiverId }: { participantId: number; caregiverId: number }) => {
      const response = await api.delete(`/participants/${participantId}/caregivers/${caregiverId}`);
      return response.data;
    },
  });
};