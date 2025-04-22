/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { ColumnDef } from "@tanstack/react-table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { CellAction } from "./cell-action";
// import { StudentViolation } from "@/types/violation";

// export const getColumns = (tab: "flashcardSet" | "rating"): ColumnDef<StudentViolation>[] => {
//   const commonColumns: ColumnDef<StudentViolation>[] = [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "action_taken",
//       header: "Action",
//     },
//     {
//       accessorKey: "handled_by",
//       header: "Handled by",
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//     },
//     {
//       accessorKey: "resolved_at",
//       header: "Handled date",
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => <CellAction data={row.original} tab={tab} />, // Truyền tab để xử lý đúng dữ liệu
//     },
//   ];

//   if (tab === "flashcardSet") {
//     return [{ accessorKey: "student_set_id", header: "ID Flashcard" }, ...commonColumns];
//   } else {
//     return [{ accessorKey: "rating_id", header: "ID Rating" }, ...commonColumns];
//   }
// };


import { StudentViolation } from "@/types/student-violation";
import { ColumnDef } from "@tanstack/react-table";


export const getColumns = (tab: "flashcardSet" | "rating"): ColumnDef<StudentViolation>[] => {
  if (tab === "flashcardSet") {
    return [
      {
        id: "violationId",
        accessorKey: "violationId",
        header: "ID",
      },
      {
        id: "studentFlashcardSetTitle",
        accessorFn: (row) => row.studentFlashcardSet?.title ?? "",
        header: "Flashcard Set",
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
      },
    ];
  }

  return [
    {
      id: "violationId",
      accessorKey: "violationId",
      header: "ID",
    },
    {
      id: "studentCourseRating",
      accessorFn: (row) =>
        row.studentCourseRating
          ? `${row.studentCourseRating.rating}/5 - ${row.studentCourseRating.course.title}`
          : "",
      header: "Rating",
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
    },
  ];
};