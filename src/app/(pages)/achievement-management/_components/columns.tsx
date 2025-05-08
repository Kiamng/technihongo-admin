"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Achievement } from "@/types/achievement";

export const columns: ColumnDef<Achievement>[] = [

  {
    accessorKey: "badgeName",
    header: "Badge Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "conditionValue",
    header: "Condition Value",
  },
  {
    accessorKey: "conditionType",
    header: "Condition Type",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      return row.original.active ? (
        <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">ACTIVE</div>
      ) : (
        <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">INACTIVE</div>
      );
    },
  },
];
