"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "@/types/user";
import { getStudent, getContentManager } from "@/app/api/user/user.api";
import AddContentManagerPopup from "./_components/add-content-manager-popup";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserList | undefined>();
  const [contentManagers, setContentManagers] = useState<UserList | undefined>();
  const [activeTab, setActiveTab] = useState("student");
  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>("");

  // Cập nhật giá trị tìm kiếm
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Debounce giá trị tìm kiếm
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Fetch students
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudent({
          pageNo: currentPage,
          pageSize: 5,
          sortBy: "userId",
          sortDir: "desc",
          keyword: searchValue,
        });
        setUsers(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "student") {
      fetchStudent();
    }
  }, [activeTab, currentPage, debouncedSearchValue]);

  // Fetch content managers
  useEffect(() => {
    const fetchContentManagers = async () => {
      try {
        setLoading(true);
        const response = await getContentManager({
          pageNo: currentPage,
          pageSize: 5,
          sortBy: "userId",
          sortDir: "desc",
          keyword: searchValue,
        });
        setContentManagers(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (activeTab === "contentManager") {
      fetchContentManagers();
    }
  }, [activeTab, currentPage, debouncedSearchValue]);

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Account Management</h1>
        <AddContentManagerPopup />
      </div>

      <div className="w-full flex flex-row justify-between">
        <Input
          className="w-[300px]"
          placeholder="Search name"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>

      <Tabs defaultValue="student" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger onClick={() => setCurrentPage(0)} value="student">
            Student
          </TabsTrigger>
          <TabsTrigger onClick={() => setCurrentPage(0)} value="contentManager">
            Content Manager
          </TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="student">
          <div className="font-medium">Total students: {users?.totalElements || 0}</div>
          <DataTable
            columns={columns}
            data={users?.content || []}
            isLoading={loading}
          />
        </TabsContent>
        <TabsContent className="space-y-6" value="contentManager">
          <div className="font-medium">Total content managers: {contentManagers?.totalElements || 0}</div>
          <DataTable
            columns={columns}
            data={contentManagers?.content || []}
            isLoading={loading}
          />
        </TabsContent>
      </Tabs>

      <Pagination className="space-x-6">
        <PaginationContent>
          <PaginationItem>
            <Button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              variant={"ghost"}
            >
              <ChevronLeft /> Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            {currentPage + 1}/
            {(activeTab === "student" ? users?.totalPages : contentManagers?.totalPages) || 1}
          </PaginationItem>
          <PaginationItem>
            <Button
              disabled={activeTab === "student" ? users?.last : contentManagers?.last}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant={"ghost"}
            >
              Next <ChevronRight />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
