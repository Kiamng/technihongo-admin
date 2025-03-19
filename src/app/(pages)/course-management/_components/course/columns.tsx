"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Course } from "@/types/course";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Course>[] = [
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
        header: "Level",
        cell: ({ row }) => {
            return row.original.difficultyLevel.tag
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
