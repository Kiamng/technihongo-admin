
import { StudentViolation } from "@/types/student-violation";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CellAction } from "./cell-action";

interface ColumnProps {
  tab: "flashcardSet" | "rating"
  status: "PENDING" | "RESOLVED" | "DISMISSED"
}

export const getColumns = ({ tab, status }: ColumnProps): ColumnDef<StudentViolation>[] => {

  const baseColumns: ColumnDef<StudentViolation>[] = [
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
    },
  ];

  // Define tab-specific columns
  const tabSpecificColumns: ColumnDef<StudentViolation>[] = tab === "flashcardSet"
    ? [
      {
        id: "studentFlashcardSet",
        accessorKey: "studentFlashcardSet",
        accessorFn: (row) => row.studentFlashcardSet?.title ?? "",
        header: "Flashcard Set",
      },
    ]
    : [
      {
        id: "studentCourseRating",
        cell: ({ row }) => {
          if (row.original.studentCourseRating) {
            const rating = row.original.studentCourseRating.rating; // Rating từ 1 đến 5
            const stars = [];
            for (let i = 0; i < 5; i++) {
              if (i < rating) {
                stars.push(<span key={i} className="text-orange-500 text-xl">★</span>); // Ngôi sao vàng
              } else {
                stars.push(<span key={i} className="text-gray-400 text-xl">★</span>); // Ngôi sao xám
              }
            }

            return (
              <div className="flex flex-row space-x-2 items-center">
                <div>
                  {stars}
                </div>
                <span>
                  {row.original.studentCourseRating.review}
                </span>
              </div>
            );
          } else {
            return "No rating";
          }
        },
        header: "Rating",
      }
    ];

  const statusSpecificColumns: { [key in "PENDING" | "RESOLVED" | "DISMISSED"]: ColumnDef<StudentViolation>[] } = {

    PENDING: [
      {
        header: "REPORT By",
        cell: ({ row }) => {
          return (
            <span>{row.original.reportedBy.userName}</span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <div className="px-4 py-2 bg-[#FFB600] w-fit text-[#FFB600] rounded-xl bg-opacity-10">{row.original.status}</div>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: "Report Date",
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
        cell: ({ row }) => {
          return <CellAction data={row.original} tab={tab} />
        },
      },
    ],
    RESOLVED: [
      {
        accessorKey: "actionTaken",
        header: "Action taken",
      },
      {
        header: "Handle By",
        cell: ({ row }) => {
          return (
            <span>{row.original.handledBy?.userName}</span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <div className="px-4 py-2 bg-[#959595] w-fit text-[#959595] rounded-xl bg-opacity-10">{row.original.status}</div>
          )
        },
      },
      {
        accessorKey: "resolvedAt",
        header: "Handle Date",
        cell: ({ row }) => {
          return (
            <span>
              {format(new Date(row.original.createdAt), "HH:mm, dd/MM/yyyy")}
            </span>
          );
        },
      },
    ],
    DISMISSED: [
      {
        id: "description",
        accessorKey: "description",
        header: "Report Description",
      },
      {
        header: "Handle By",
        cell: ({ row }) => {
          return (
            <span>{row.original.handledBy?.userName}</span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">{row.original.status}</div>
          )
        },
      },
      {
        accessorKey: "resolvedAt",
        header: "Handle Date",
        cell: ({ row }) => {
          return (
            <span>
              {format(new Date(row.original.createdAt), "HH:mm, dd/MM/yyyy")}
            </span>
          );
        },
      },
    ],
  };

  return [
    ...tabSpecificColumns,
    ...baseColumns,
    ...statusSpecificColumns[status],
  ];
};