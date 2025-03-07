"use client";

import {
  ChevronsLeft,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { useParticipantFilterStore } from "@/store/participantFilterStore";
import { Participant } from "@/lib/types/participants";

interface DataTablePaginationProps {
  table: Table<Participant>;
  total: number;
  totalPages: number;
  hasNext: boolean;
}

export function DataTablePagination({
  table,
  total,
  totalPages,
  hasNext,
}: DataTablePaginationProps) {
  const { page, setPage, pageSize } = useParticipantFilterStore();

  const canPreviousPage = page > 1;
  const canNextPage = hasNext;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white text-sm text-gray-600">
      <div className="space-x-2">
        <span className="text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length} de {total} fila(s) seleccionada(s).
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(1)}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">Ir a la primera página</span>
          <ChevronsLeft className="h-4 w-4 text-current" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page - 1)}
          disabled={!canPreviousPage}
        >
          <span className="sr-only">Ir a la página anterior</span>
          <ChevronLeft className="h-4 w-4 text-current" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(page + 1)}
          disabled={!canNextPage}
        >
          <span className="sr-only">Ir a la siguiente página</span>
          <ChevronRight className="h-4 w-4 text-current" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setPage(totalPages)}
          disabled={!canNextPage}
        >
          <span className="sr-only">Ir a la última página</span>
          <ChevronsRight className="h-4 w-4 text-current" />
        </Button>
      </div>
      <div className="text-sm text-gray-500">
        Página {page} de {totalPages} (Total: {total})
      </div>
    </div>
  );
}