"use client";
import { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserList } from "@/types/user";
import { getStudent, getContentManager, searchStudent, searchContentManager } from "@/app/api/user/user.api";
import AddContentManagerPopup from "./_components/add-content-manager-popup";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserList | undefined>();
  const [contentManagers, setContentManagers] = useState<UserList | undefined>();
  const [isAddCMDialogOpen, setIsAddCMDialogOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState("student");
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");
  const { data: session } = useSession();

  const itemsPerPage = 5;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const fetchData = async (tab: string, searchTerm: string) => {
    setLoading(true);
    try {
      let response: UserList;
      if (tab === "student") {
        response = searchTerm
          ? await searchStudent({
            token: session?.user.token as string,
            pageNo: currentPage,
            pageSize: itemsPerPage,
            sortBy: "userId",
            sortDir: "desc",
            keyword: searchTerm,
          })
          : await getStudent({
            token: session?.user.token as string,
            pageNo: currentPage,
            pageSize: itemsPerPage,
            sortBy: "userId",
            sortDir: "desc",
          });
        setUsers(response);
      } else {
        response = searchTerm
          ? await searchContentManager({
            token: session?.user.token as string,
            pageNo: currentPage,
            pageSize: itemsPerPage,
            sortBy: "userId",
            sortDir: "desc",
            keyword: searchTerm,
          })
          : await getContentManager({
            token: session?.user.token as string,
            pageNo: currentPage,
            pageSize: itemsPerPage,
            sortBy: "userId",
            sortDir: "desc",
          });
        setContentManagers(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab, debouncedSearchValue);
  }, [activeTab, debouncedSearchValue, currentPage, session?.user.token]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const currentData = useMemo(() => {
    return activeTab === "student" ? users : contentManagers;
  }, [activeTab, users, contentManagers]);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Quản lí người dùng</h1>
        <Button onClick={() => setIsAddCMDialogOpen(true)} className="flex space-x-2">
          <UserCheck /><span>Thêm mới content manager</span>
        </Button>
      </div>

      <div className="w-full flex flex-row justify-between">
        <Input
          className="w-[300px]"
          placeholder="Tìm kiếm"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <Tabs defaultValue="student" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="contentManager">Content Manager</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="student">
          <div className="font-medium">Tổng students: {currentData?.totalElements || 0}</div>
          <DataTable columns={columns} data={currentData?.content || []} isLoading={loading && activeTab === "student"} />
        </TabsContent>

        <TabsContent className="space-y-6" value="contentManager">
          <div className="font-medium">Tổng content managers: {currentData?.totalElements || 0}</div>
          <DataTable columns={columns} data={currentData?.content || []} isLoading={loading && activeTab === "contentManager"} />
        </TabsContent>
      </Tabs>

      {isAddCMDialogOpen &&
        <AddContentManagerPopup fetchData={fetchData} onClose={setIsAddCMDialogOpen} onOpen={isAddCMDialogOpen} />
      }

      <Pagination className="space-x-6">
        <PaginationContent>
          <PaginationItem>
            <Button
              disabled={currentPage === 0}
              onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
              variant={"ghost"}
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>
          <PaginationItem>
            {currentPage + 1}/{(currentData?.totalPages || 1)}
          </PaginationItem>
          <PaginationItem>
            <Button
              disabled={currentPage === (currentData?.totalPages || 1) - 1}
              onClick={() => handlePageChange(currentPage + 1)}
              variant={"ghost"}
            >
              <ChevronRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
