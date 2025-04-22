/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useState, useMemo } from "react";
// import { DataTable } from "@/components/data-table";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Pagination } from "./_components/Pagination";
// import { getColumns } from "./_components/columns"; // Cột thay đổi theo tab
// import studentViolations from "@/types/violation";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// export default function ViolationManagementPage() {
//   const [currentTab, setCurrentTab] = useState<"flashcardSet" | "rating">("flashcardSet");
//   const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved" | "dismissed">("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Lọc dữ liệu theo tab và status
//   const filteredData = useMemo(() => {
//     return studentViolations.filter((violation) => {
//       if (statusFilter !== "all" && violation.status !== statusFilter) return false;
//       return currentTab === "flashcardSet" ? violation.student_set_id !== null : violation.rating_id !== null;
//     });
//   }, [statusFilter, currentTab]);

//   // Phân trang
//   const paginatedData = useMemo(() => {
//     return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
//   }, [filteredData, currentPage]);

//   // Cột bảng dữ liệu thay đổi theo tab
//   const columns = useMemo(() => getColumns(currentTab), [currentTab]);

//   return (
//     <div className="w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-bold">Violation Report Management</h1>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="flashcardSet" onValueChange={(value) => setCurrentTab(value as "flashcardSet" | "rating")} className="w-full">
//         <TabsList className="flex gap-4 mb-6">
//           <TabsTrigger value="flashcardSet">Flashcard Set</TabsTrigger>
//           <TabsTrigger value="rating">Rating</TabsTrigger>
//         </TabsList>

//         {/* Thanh tìm kiếm + Dropdown lọc */}
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center space-x-2">
//             <Input type="text" placeholder="Search name" />
            
//           </div>

//           {/* Dropdown menu filter status */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline">{statusFilter === "all" ? " Status" : statusFilter}</Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setStatusFilter("dismissed")}>Dismissed</DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Bảng dữ liệu */}
//         <TabsContent value="flashcardSet">
//           <DataTable columns={columns} searchKey="student_set_id" data={paginatedData} isLoading={false} />
//         </TabsContent>
//         <TabsContent value="rating">
//           <DataTable columns={columns} searchKey="rating_id" data={paginatedData} isLoading={false} />
//         </TabsContent>
//       </Tabs>

//       {/* Phân trang */}
//       <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredData.length / itemsPerPage)} onPageChange={setCurrentPage} />
//     </div>
//   );
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pagination } from "./_components/Pagination";
import { getColumns } from "./_components/columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useSession } from "next-auth/react";
import { getAllViolations } from "@/app/api/student-violation/student-violation.api";
import { StudentViolation, ViolationList } from "@/types/student-violation";

export default function ViolationManagementPage() {
  const { data: session } = useSession();
  const [currentTab, setCurrentTab] = useState<"flashcardSet" | "rating">("flashcardSet");
  const [statusFilter, setStatusFilter] = useState<"all" | "PENDING" | "RESOLVED" | "DISMISSED">("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [violations, setViolations] = useState<StudentViolation[]>([]);

  useEffect(() => {
    const fetchViolations = async () => {
      if (!session?.user?.token) {
        setIsLoading(false);
        setViolations([]);
        return;
      }

      setIsLoading(true);
      try {
        const classifyBy = currentTab === "flashcardSet" ? "FlashcardSet" : "Rating";
        const apiStatus = statusFilter === "all" ? "" : statusFilter;

        const result: ViolationList = await getAllViolations({
          token: session.user.token,
          pageNo: currentPage,
          pageSize,
          sortBy: "createdAt",
          sortDir: "DESC",
          classifyBy,
          status: apiStatus,
        });

        setViolations(result.content);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Failed to fetch violations:", error);
        setViolations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViolations();
  }, [session, currentPage, pageSize, currentTab, statusFilter]);

  const filteredViolations = useMemo(() => {
    if (!searchKeyword) return violations;
    return violations.filter((violation) => {
      const searchLower = searchKeyword.toLowerCase();
      if (currentTab === "flashcardSet") {
        return (
          (violation.studentFlashcardSet?.title?.toLowerCase().includes(searchLower) || false) ||
          violation.description.toLowerCase().includes(searchLower)
        );
      }
      if (currentTab === "rating") {
        return (
          (violation.studentCourseRating?.course.title.toLowerCase().includes(searchLower) || false) ||
          (violation.studentCourseRating?.review.toLowerCase().includes(searchLower) || false) ||
          violation.description.toLowerCase().includes(searchLower)
        );
      }
      return false;
    });
  }, [violations, searchKeyword, currentTab]);

  const columns = useMemo(() => getColumns(currentTab), [currentTab]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(0);
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "flashcardSet" | "rating");
    setCurrentPage(0);
  };

  const handleStatusChange = (status: "all" | "PENDING" | "RESOLVED" | "DISMISSED") => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Violation Report Management</h1>
      </div>

      <Tabs defaultValue="flashcardSet" onValueChange={handleTabChange} className="w-full">
        <TabsList className="flex gap-4 mb-6">
          <TabsTrigger value="flashcardSet">Flashcard Set</TabsTrigger>
          <TabsTrigger value="rating">Rating</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search name"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{statusFilter === "all" ? "Status" : statusFilter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("RESOLVED")}>Resolved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("DISMISSED")}>Dismissed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="flashcardSet">
          <DataTable
            columns={columns}
            searchKey="studentFlashcardSetTitle"
            data={filteredViolations}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="rating">
          <DataTable
            columns={columns}
            searchKey="studentCourseRating"
            data={filteredViolations}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>

      <Pagination
        currentPage={currentPage + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}