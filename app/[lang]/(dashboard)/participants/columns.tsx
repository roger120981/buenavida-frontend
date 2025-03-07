"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Participant } from "@/lib/types/participants";
import { formatDateShort } from "@/lib/utils"; // Ajusta la ruta según tu estructura

export const columns: ColumnDef<Participant, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="h-4 w-4 border-gray-300 rounded-sm text-blue-600 focus:ring-1 focus:ring-blue-500"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="h-4 w-4 border-gray-300 rounded-sm text-blue-600 focus:ring-1 focus:ring-blue-500"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Participant ID" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[60px] text-sm text-gray-700 whitespace-nowrap">
        #{row.getValue("id")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=28&background=DBEAFE&color=1E3A8A`;

      return (
        <div className="flex items-center space-x-2">
          <img
            src={avatarUrl}
            alt={`${name} avatar`}
            className="h-7 w-7 rounded-full object-cover"
          />
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {name}
            </span>
            <span className="text-xs text-gray-400">
              {row.original.primaryPhone || "N/A"}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "medicaidId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medicaid ID" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-700 whitespace-nowrap">
          #MED-{row.getValue("medicaidId")}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 text-gray-500 hover:text-blue-600"
          onClick={() => navigator.clipboard.writeText(row.getValue("medicaidId"))}
        >
          <Icon icon="heroicons:clipboard" className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      const badgeColor = gender === "M" ? "success" : gender === "F" ? "info" : "secondary";
      return (
        <Badge
          variant="soft"
          color={badgeColor}
          className="text-sm px-2.5 py-1 rounded-full"
        >
          {gender}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "dob",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string | number | Date;
      const formattedDate = formatDateShort(dob);
      const age = new Date().getFullYear() - new Date(dob).getFullYear();
      return (
        <div className="flex items-center space-x-1">
          <Icon icon="heroicons:calendar" className="h-4 w-4 text-gray-500" />
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm text-gray-700 whitespace-nowrap">
              {formattedDate}
            </span>
            <span className="text-xs text-gray-400">{age} años</span>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        className="text-sm px-2.5 py-1 rounded-full"
        variant="soft"
        color={row.getValue("isActive") ? "success" : "warning"}
      >
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "caseManager",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Case Manager" />
    ),
    cell: ({ row }) => {
      const caseManager = row.original.caseManager;
      const name = caseManager?.name || "N/A";
      const avatarUrl = caseManager
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=28&background=F3F4F6&color=374151`
        : "";

      return (
        <div className="flex items-center space-x-2">
          {caseManager && (
            <img
              src={avatarUrl}
              alt={`${name} avatar`}
              className="h-7 w-7 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm text-gray-700 whitespace-nowrap">
              {name}
            </span>
            <span className="text-xs text-gray-400">Asignado</span>
          </div>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => (
      <div className="flex gap-1 items-center justify-end">
        <Button
          asChild
          size="icon"
          className="h-8 w-8 rounded bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white transition-colors"
        >
          <Link href={`/participants/${row.getValue("id")}`}>
            <Icon icon="heroicons:eye" className="w-4 h-4 text-current" />
          </Link>
        </Button>
        <Button
          size="icon"
          className="h-8 w-8 rounded bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white transition-colors"
        >
          <Icon icon="heroicons:pencil-square" className="w-4 h-4 text-current" />
        </Button>
        <Button
          size="icon"
          className="h-8 w-8 rounded bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white transition-colors"
        >
          <Icon icon="heroicons:trash" className="w-4 h-4 text-current" />
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];