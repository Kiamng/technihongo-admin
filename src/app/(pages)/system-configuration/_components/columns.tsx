"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CellAction } from "./cell-action";
import { Domain } from "@/types/domain";

export const columns = (onUpdate: () => void): ColumnDef<Domain>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "parentDomainId",
    header: "Parent Domain ID",
  },
  {
    accessorKey: "tag",
    header: "Tag",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => {
      return row.original.isActive ? (
        <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">ACTIVE</div>
      ) : (
        <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">INACTIVE</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} onUpdate={onUpdate} />,
  },
];
