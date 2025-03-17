"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Column } from "@tanstack/react-table";

interface FilterOption {
  label: string;
  value: string | boolean; // Permitimos boolean para true/false
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableFacetedFilterProps<TData> {
  column: Column<TData, unknown>;
  title: string;
  options: FilterOption[];
  className?: string;
}

export function DataTableFacetedFilter<TData>({
  column,
  title,
  options,
  className,
}: DataTableFacetedFilterProps<TData>) {
  const selectedValue = column?.getFilterValue() as string | boolean | undefined;

  return (
    <Select
      onValueChange={(value) => {
        const filterValue = value === "all" ? undefined : value === "true" ? true : value === "false" ? false : value;
        console.log("Valor del filtro aplicado:", filterValue); // Depuración
        column?.setFilterValue(filterValue);
      }}
      value={selectedValue?.toString() ?? "all"}
    >
      <SelectTrigger
        className={cn(
          "h-9 px-3 rounded-md border-gray-300 shadow-sm text-sm text-gray-700",
          className
        )}
      >
        <Filter className="mr-2 h-4 w-4 text-gray-500" />
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value.toString()} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}