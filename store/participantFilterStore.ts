// store/participantFilterStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export const useParticipantFilterStore = create<ParticipantFilterState>()(
  persist(
    (set) => ({
      filters: { isActive: true }, // Filtro inicial: solo participantes activos
      page: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortOrder: "asc",
      setFilters: (filters) => set({ filters }),
      setPage: (page) => set({ page }),
      setPageSize: (pageSize) => set({ pageSize }),
      setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
    }),
    {
      name: "participant-filter-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);