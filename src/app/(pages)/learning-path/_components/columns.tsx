// // app/learning-path-management/_components/columns.tsx
// "use client";
// import { ColumnDef } from "@tanstack/react-table";
// import { LearningPath } from "@/types/learningPath";
// import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// import Link from "next/link";

// import { CellAction } from "./cell-action";
// import { Eye } from "lucide-react";

// export const columns: ColumnDef<LearningPath>[] = [
//  {
//    accessorKey: "pathId",
//    header: "ID",
//  },
//  {
//    accessorKey: "title",
//    header: "Title",
//  },
//  {
//    accessorKey: "description",
//    header: "Description",
//    cell: ({ row }) => row.original.description || "No description"
//  },
//  {
//    accessorKey: "domainId",
//    header: "Domain ID",
//  },
//  {
//    accessorKey: "totalCourses",
//    header: "Total Courses",
//  },
// //  {
// //    accessorKey: "isPublic",
// //    header: "Status",
// //    cell: ({ row }) => (
// //      <Badge variant={row.original.isPublic ? "default" : "destructive"}>
// //        {row.original.isPublic ? "Public" : "Private"}
// //      </Badge>
// //    )
// //  },
// {
//   accessorKey: "isPublic",
//   header: "Status",
//   cell: ({ row }) => {
//     return row.original.isPublic ? (
//       <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">PUBLIC</div>
//     ) : (
//       <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">PRIVATE</div>
//     );
//   },
// },

//  {
//    accessorKey: "createdAt",
//    header: "Created Date",
//    cell: ({ row }) => {
//      const date = new Date(row.original.createdAt);
//      return date.toLocaleDateString();
//    }
//  },
//  {
//    id: "actions",
//    cell: ({ row }) => (
//      <div className="flex items-center gap-2">
//        <Link href={`/learning-path/${row.original.pathId}`}>
//          <Button variant="outline" size="icon">
//            <Eye className="h-4 w-4" />
//          </Button>
//        </Link>
//        <CellAction 
//          data={row.original} 
//          onUpdate={() => {
//            // Logic refresh danh sách sau khi update
//            // Ví dụ: router.refresh() nếu bạn dùng Next.js
//          }} 
//        />
//      </div>
//    )
//  }
// ];

// app/learning-path-management/_components/columns.tsx
"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { CellAction } from "./cell-action";
import { Eye } from "lucide-react";
import { LearningPath, LearningPathStatus } from "@/types/learningPath";

export const columns: ColumnDef<LearningPath>[] = [
 {
   accessorKey: "pathId",
   header: "ID",
 },
 {
   accessorKey: "title",
   header: "Title",
 },
 {
   accessorKey: "description",
   header: "Description",
   cell: ({ row }) => row.original.description || "No description"
 },
 {
  accessorKey: "domain.domainId", // Truy cập domainId thông qua domain
  header: "Domain ID",
  cell: ({ row }) => row.original.domain?.domainId || "N/A" // Thêm kiểm tra null
},
 {
   accessorKey: "totalCourses",
   header: "Total Courses",
 },
 {
   accessorKey: "isPublic",
   header: "Status",
   cell: ({ row }) => {
     const status = row.original.public 
       ? LearningPathStatus.true
       : LearningPathStatus.false;

     return status === LearningPathStatus.true ? (
       <div className="px-4 py-2 bg-[#56D071] w-fit text-[#56D071] rounded-xl bg-opacity-10">
         {LearningPathStatus.true}
       </div>
     ) : (
       <div className="px-4 py-2 bg-[#FD5673] w-fit text-[#FD5673] rounded-xl bg-opacity-10">
         {LearningPathStatus.false}
       </div>
     );
   },
 },
 {
   accessorKey: "createdAt",
   header: "Created Date",
   cell: ({ row }) => {
     const date = new Date(row.original.createdAt);
     return date.toLocaleDateString();
   }
 },
 {
   id: "actions",
   cell: ({ row }) => (
     <div className="flex items-center gap-2">
       <Link href={`/learning-path/${row.original.pathId}`}>
         <Button variant="outline" size="icon">
           <Eye className="h-4 w-4" />
         </Button>
       </Link>
       <CellAction 
         data={row.original} 
         onUpdate={() => {
           // Logic refresh danh sách sau khi update
           // Ví dụ: router.refresh() nếu bạn dùng Next.js
         }} 
       />
     </div>
   )
 }
];