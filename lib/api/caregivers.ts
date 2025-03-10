// api/caregivers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios.config";
import { Caregiver, CaregiverResponse } from "../types/caregivers"; // Necesario para tipado de las respuestas de la API

// Listar todos los cuidadores
const fetchCaregivers = async (): Promise<CaregiverResponse> => {
  const response = await api.get("/caregivers");
  return response.data;
};

export const useCaregivers = () => {
  return useQuery({
    queryKey: ["caregivers"],
    queryFn: fetchCaregivers,
  });
};

// Listar cuidadores asignados a un participante
const fetchAssignedCaregivers = async (participantId: number): Promise<CaregiverResponse> => {
  const response = await api.get(`/participants/${participantId}/caregivers`);
  return response.data;
};

export const useAssignedCaregivers = (participantId: number) => {
  return useQuery({
    queryKey: ["assignedCaregivers", participantId],
    queryFn: () => fetchAssignedCaregivers(participantId),
    enabled: !!participantId,
  });
};

// Asignar un cuidador a un participante
const assignCaregiver = async ({
  participantId,
  caregiverId,
}: {
  participantId: number;
  caregiverId: number;
}): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`/participants/${participantId}/caregivers/${caregiverId}`);
  return response.data;
};

export const useAssignCaregiver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignCaregiver,
    onSuccess: (_, { participantId }) => {
      queryClient.invalidateQueries({ queryKey: ["assignedCaregivers", participantId] });
    },
  });
};

// Desvincular un cuidador de un participante
const unassignCaregiver = async ({
  participantId,
  caregiverId,
}: {
  participantId: number;
  caregiverId: number;
}): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/participants/${participantId}/caregivers/${caregiverId}`);
  return response.data;
};

export const useUnassignCaregiver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unassignCaregiver,
    onSuccess: (_, { participantId }) => {
      queryClient.invalidateQueries({ queryKey: ["assignedCaregivers", participantId] });
    },
  });
};