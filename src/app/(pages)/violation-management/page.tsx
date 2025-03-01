"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pagination } from "./_components/Pagination";
import { getColumns } from "./_components/columns"; // Cột thay đổi theo tab
import studentViolations from "@/types/violation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ViolationManagementPage() {
  const [currentTab, setCurrentTab] = useState<"flashcardSet" | "rating">("flashcardSet");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "resolved" | "dismissed">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Lọc dữ liệu theo tab và status
  const filteredData = useMemo(() => {
    return studentViolations.filter((violation) => {
      if (statusFilter !== "all" && violation.status !== statusFilter) return false;
      return currentTab === "flashcardSet" ? violation.student_set_id !== null : violation.rating_id !== null;
    });
  }, [statusFilter, currentTab]);

  // Phân trang
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [filteredData, currentPage]);

  // Cột bảng dữ liệu thay đổi theo tab
  const columns = useMemo(() => getColumns(currentTab), [currentTab]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Violation Report Management</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="flashcardSet" onValueChange={(value) => setCurrentTab(value as "flashcardSet" | "rating")} className="w-full">
        <TabsList className="flex gap-4 mb-6">
          <TabsTrigger value="flashcardSet">Flashcard Set</TabsTrigger>
          <TabsTrigger value="rating">Rating</TabsTrigger>
        </TabsList>

        {/* Thanh tìm kiếm + Dropdown lọc */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Input type="text" placeholder="Search name" />
            
          </div>

          {/* Dropdown menu filter status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{statusFilter === "all" ? " Status" : statusFilter}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolved</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("dismissed")}>Dismissed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bảng dữ liệu */}
        <TabsContent value="flashcardSet">
          <DataTable columns={columns} searchKey="student_set_id" data={paginatedData} isLoading={false} />
        </TabsContent>
        <TabsContent value="rating">
          <DataTable columns={columns} searchKey="rating_id" data={paginatedData} isLoading={false} />
        </TabsContent>
      </Tabs>

      {/* Phân trang */}
      <Pagination currentPage={currentPage} totalPages={Math.ceil(filteredData.length / itemsPerPage)} onPageChange={setCurrentPage} />
    </div>
  );
}
