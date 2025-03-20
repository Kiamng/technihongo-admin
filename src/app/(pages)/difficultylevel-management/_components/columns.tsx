"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DifficultyLevel } from "@/types/difficulty-level";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<DifficultyLevel>[] = [
  {
    accessorKey: "tag",
    header: "Tag",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <span>
          {format(new Date(row.original.createdAt), "HH:mm, dd/MM/yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];