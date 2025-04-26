

"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useSession } from "next-auth/react";
import { getAllViolations } from "@/app/api/student-violation/student-violation.api";
import { ViolationList } from "@/types/student-violation";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./_components/columns";
import { ChevronDown, MessageSquareWarning } from "lucide-react";
import EmptyStateComponent from "@/components/empty-state";

export default function ViolationManagementPage() {
  const { data: session } = useSession();
  const [currentTab, setCurrentTab] = useState<"flashcardSet" | "rating">("flashcardSet");
  const [statusFilter, setStatusFilter] = useState<"PENDING" | "RESOLVED" | "DISMISSED">("PENDING");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [violations, setViolations] = useState<ViolationList>();

  useEffect(() => {
    const fetchViolations = async () => {
      if (!session?.user?.token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const classifyBy = currentTab === "flashcardSet" ? "FlashcardSet" : "Rating";
        const apiStatus = statusFilter === "PENDING" ? "PENDING" : statusFilter;

        const result: ViolationList = await getAllViolations({
          token: session.user.token,
          pageNo: currentPage,
          pageSize: pageSize,
          sortBy: "createdAt",
          sortDir: "DESC",
          classifyBy: classifyBy,
          status: apiStatus,
        });

        setViolations(result);
      } catch (error) {
        console.error("Failed to fetch violations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViolations();
  }, [session?.user.token, currentPage, pageSize, currentTab, statusFilter]);

  const handleTabChange = (value: string) => {
    setCurrentTab(value as "flashcardSet" | "rating");
    setCurrentPage(0);
  };

  const handleStatusChange = (status: "PENDING" | "RESOLVED" | "DISMISSED") => {
    setStatusFilter(status);
    setCurrentPage(0);
  };

  const statusColor = (status: string) => {
    if (status === "PENDING") {
      return "bg-[#FFB600] text-[#FFB600]"
    } else if (status === "RESOLVED") {
      return "bg-[#959595] text-[#959595]"
    } else {
      return "bg-[#FD5673] text-[#FD5673]"
    }
  }

  return (
    <div className="w-full flex flex-col space-y-6">
      <div className="flex space-x-2 items-center">
        <h1 className="text-4xl font-bold">Báo cáo từ người dùng</h1>
        < MessageSquareWarning size={30} />
      </div>

      <Tabs defaultValue="flashcardSet" onValueChange={handleTabChange} className="w-full">


        <div className="flex justify-between items-center">
          <TabsList className="flex gap-4">
            <TabsTrigger value="flashcardSet">Flashcard</TabsTrigger>
            <TabsTrigger value="rating">Đánh giá</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-row space-x-2 items-center">
                <div className={`px-4 py-2 w-fit rounded-xl bg-opacity-10 ${statusColor(statusFilter)}`}>{statusFilter === "PENDING" ? "Đang chờ" : statusFilter === "RESOLVED" ? "Đã xử lí" : "Bỏ qua"}</div>
                <ChevronDown />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}><div className={`px-4 py-2 w-fit rounded-xl bg-opacity-10 ${statusColor("PENDING")}`}>Đang chờ</div></DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("RESOLVED")}><div className={`px-4 py-2 w-fit rounded-xl bg-opacity-10 ${statusColor("RESOLVED")}`}>Đã xử lí</div></DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("DISMISSED")}><div className={`px-4 py-2 w-fit rounded-xl bg-opacity-10 ${statusColor("DISMISSED")}`}>Bỏ qua</div></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Tabs>
      {violations ? (
        <DataTable isLoading={isLoading} data={violations?.content} columns={getColumns({ tab: currentTab, status: statusFilter })} />
      ) :
        (
          <EmptyStateComponent
            message={`không có báo cáo nào với trạng thái này`}
            size={400}
            imgageUrl="https://cdni.iconscout.com/illustration/premium/thumb/no-information-found-illustration-download-in-svg-png-gif-file-formats--zoom-logo-document-user-interface-result-pack-illustrations-8944779.png?f=webp" />
        )}
    </div>
  );
}