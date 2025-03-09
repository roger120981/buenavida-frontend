"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  CellContext,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Participant } from "@/lib/types/participants";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface DataTableProps {
  columns: ColumnDef<Participant, any>[];
  data: Participant[];
  total: number;
  totalPages: number;
  hasNext: boolean;
  onView: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
}

export function DataTable({
  columns: originalColumns,
  data,
  total,
  totalPages,
  hasNext,
  onView,
  onDelete,
}: DataTableProps) {
  React.useEffect(() => {
    console.log("Data received by DataTable:", data);
  }, [data]);

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = React.useMemo(() => {
    const hasActionsColumn = originalColumns.some((col) => col.id === "actions");
    if (!hasActionsColumn) {
      return [
        ...originalColumns,
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }: CellContext<Participant, unknown>) => (
            <div className="flex space-x-2 justify-end min-w-[120px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log("View button clicked for participant:", row.original);
                  if (typeof onView === "function") {
                    onView(row.original);
                  }
                }}
                title="View"
              >
                <Icon icon="heroicons:eye" className="w-4 h-4" />
              </Button>
              <Link href={`/participants/${row.original.id}/edit`}>
                <Button variant="ghost" size="sm" title="Edit">
                  <Icon icon="heroicons:pencil" className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log("Delete button clicked for participant:", row.original);
                  if (typeof onDelete === "function") {
                    onDelete(row.original);
                  }
                }}
                title="Delete"
              >
                <Icon icon="heroicons:trash" className="w-4 h-4" />
              </Button>
            </div>
          ),
        },
      ];
    }
    return originalColumns;
  }, [originalColumns, onView, onDelete]);

  const table = useReactTable<Participant>({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: { onView, onDelete }, // Pasamos onView y onDelete a meta
  });

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-full">
      <div className="p-4">
        <div className="overflow-x-auto md:hidden">
          <div className="w-full min-w-[500px] flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <DataTableToolbar table={table} />
          </div>
        </div>
        <div className="hidden md:block">
          <DataTableToolbar table={table} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-sm font-semibold text-gray-900 px-4 py-3 ltr:last:text-right rtl:last:text-left whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-sm text-gray-700 px-4 py-3 ltr:last:text-right rtl:last:text-left"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="overflow-x-auto p-4">
        <div className="w-full flex justify-end">
          <div className="flex items-center space-x-4">
            <DataTablePagination
              table={table}
              total={total}
              totalPages={totalPages}
              hasNext={hasNext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}