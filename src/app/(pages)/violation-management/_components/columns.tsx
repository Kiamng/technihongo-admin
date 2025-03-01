"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CellAction } from "./cell-action";
import { StudentViolation } from "@/types/violation";

export const getColumns = (tab: "flashcardSet" | "rating"): ColumnDef<StudentViolation>[] => {
  const commonColumns: ColumnDef<StudentViolation>[] = [
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
      accessorKey: "action_taken",
      header: "Action",
    },
    {
      accessorKey: "handled_by",
      header: "Handled by",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "resolved_at",
      header: "Handled date",
    },
    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} tab={tab} />, // Truyền tab để xử lý đúng dữ liệu
    },
  ];

  if (tab === "flashcardSet") {
    return [{ accessorKey: "student_set_id", header: "ID Flashcard" }, ...commonColumns];
  } else {
    return [{ accessorKey: "rating_id", header: "ID Rating" }, ...commonColumns];
  }
};
