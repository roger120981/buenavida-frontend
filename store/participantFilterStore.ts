import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Definimos el tipo del estado manualmente
interface ParticipantFilterState {
  filters: Record<string, any>;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setFilters: (filters: Record<string, any>) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
}

// Definimos el tipo del 'set' manualmente
type SetState = (
  partial: ParticipantFilterState | Partial<ParticipantFilterState> | ((state: ParticipantFilterState) => ParticipantFilterState | Partial<ParticipantFilterState>),
  replace?: boolean
) => void;

const createParticipantFilterStore = (set: SetState) => ({
  filters: {},
  page: 1,
  pageSize: 10,
  sortBy: "createdAt",
  sortOrder: "asc" as "asc" | "desc",
  setFilters: (filters: Record<string, any>) => set({ filters }),
  setPage: (page: number) => set({ page }),
  setPageSize: (pageSize: number) => set({ pageSize }),
  setSort: (sortBy: string, sortOrder: "asc" | "desc") => set({ sortBy, sortOrder }),
});

export const useParticipantFilterStore = create<ParticipantFilterState>()(
  persist(createParticipantFilterStore, {
    name: "participant-filter-store-v2",
    storage: createJSONStorage(() => localStorage),
  })
);