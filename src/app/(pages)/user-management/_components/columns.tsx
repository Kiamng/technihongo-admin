"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "userName",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Joined date",
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
