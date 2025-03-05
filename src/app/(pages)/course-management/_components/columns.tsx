"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/types/course";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Course>[] = [
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
        accessorKey: "title",
        header: "Title",
    },
    {
        header: "Domain",
        cell: ({ row }) => {
            return row.original.domain.name
        },
    },
    {
        accessorKey: "enrollmentCount",
        header: "Enrollments",
    },
    {
        accessorKey: "estimatedDuration",
        header: "Estimate duration",
    },
    {
        accessorKey: "public",
        header: "Public status",
        cell: ({ row }) => {
            return row.original.publicStatus ? (
                <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">ACTIVE</div>
            ) : (
                <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">INACTIVE</div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
