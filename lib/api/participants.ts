// lib/api/participants.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./../../config/axios.config"; // Tu configuración de Axios
import {
  PaginatedParticipantResponse,
  Participant,
  CreateParticipantDto,
  UpdateParticipantDto,
} from "../types/participants";

// Listar participantes con filtros y paginación
const fetchParticipants = async ({
  filters = {},
  page = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortOrder = "asc",
}: {
  filters?: Record<string, any>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedParticipantResponse> => {
  const response = await api.get("/participants", {
    params: {
      filters: JSON.stringify(filters),
      page,
      pageSize,
      sortBy,
      sortOrder,
    },
  });
  return response.data;
};

export const useParticipants = (options: {
  filters?: Record<string, any>;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: ["participants", options],
    queryFn: () => fetchParticipants(options),
  });
};

// Obtener un participante por ID
const fetchParticipantById = async (id: number): Promise<Participant> => {
  const response = await api.get(`/participants/${id}`);
  return response.data;
};

export const useParticipantById = (id: number) => {
  return useQuery({
    queryKey: ["participant", id],
    queryFn: () => fetchParticipantById(id),
    enabled: !!id, // Solo ejecuta si hay un ID válido
  });
};

// Crear un participante
const createParticipant = async (data: CreateParticipantDto): Promise<Participant> => {
  const response = await api.post("/participants", data);
  return response.data;
};

export const useCreateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
};

// Actualizar un participante
const updateParticipant = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateParticipantDto;
}): Promise<Participant> => {
  const response = await api.put(`/participants/${id}`, data);
  return response.data;
};

export const useUpdateParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
};

// Desactivar un participante (soft delete)
const deleteParticipant = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/participants/${id}`);
  return response.data;
};

export const useDeleteParticipant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteParticipant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["participants"] });
    },
  });
};