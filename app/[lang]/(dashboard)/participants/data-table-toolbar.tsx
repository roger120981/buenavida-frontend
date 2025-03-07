"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { Table as ReactTable } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Participant } from "@/lib/types/participants";

const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

interface DataTableToolbarProps {
  table: ReactTable<Participant>;
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const statusColumn = table.getColumn("isActive");

  const getFilterValue = (columnId: string) => {
    const filterValue = table.getColumn(columnId)?.getFilterValue();
    return typeof filterValue === "string" ? filterValue : "";
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Mostrar</span>
          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            defaultValue="10"
          >
            <SelectTrigger className="w-20 h-9 rounded-md border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="w-20 min-w-[80px]">
              {Array.from({ length: 9 }, (_, index) => {
                const number = index + 10;
                return (
                  <SelectItem key={number} value={`${number}`} className="text-sm">
                    {number}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Input
            placeholder="Buscar por Medicaid ID..."
            value={getFilterValue("medicaidId")}
            onChange={(event) =>
              table.getColumn("medicaidId")?.setFilterValue(event.target.value)
            }
            className="w-[200px] h-9 pl-8 pr-3 rounded-md border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-1 focus:ring-blue-500"
          />
          <Icon
            icon="heroicons:magnifying-glass"
            className="w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {statusColumn && (
          <DataTableFacetedFilter
            column={statusColumn}
            title="Estado"
            options={statusOptions}
            className="h-9 rounded-md border border-gray-300 bg-white shadow-sm text-sm text-gray-700 focus:ring-1 focus:ring-blue-500"
          />
        )}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-3 rounded-md border border-gray-300 bg-white shadow-sm text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition-colors"
          >
            Resetear
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        <Button asChild className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm flex items-center">
          <Link href="/participants/create">
            <Plus className="w-5 h-5 mr-2" />
            Crear Participante
          </Link>
        </Button>
      </div>
    </div>
  );
}