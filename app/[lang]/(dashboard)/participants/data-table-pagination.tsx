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
    <div className="flex flex-col md:flex-row items-center justify-end px-4 py-3 bg-white text-sm text-gray-600">
      <div className="flex flex-row items-center space-x-4">
        <span className="text-gray-500">
          {table.getFilteredSelectedRowModel().rows.length} of {total} row(s) selected.
        </span>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to the first page</span>
            <ChevronsLeft className="h-4 w-4 text-current" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page - 1)}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Go to the previous page</span>
            <ChevronLeft className="h-4 w-4 text-current" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page + 1)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to the next page</span>
            <ChevronRight className="h-4 w-4 text-current" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0 rounded-sm bg-white border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(totalPages)}
            disabled={!canNextPage}
          >
            <span className="sr-only">Go to the last page</span>
            <ChevronsRight className="h-4 w-4 text-current" />
          </Button>
        </div>
        <span className="text-gray-500">
          Page {page} of {totalPages} (Total: {total})
        </span>
      </div>
    </div>
  );
}