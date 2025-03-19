"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserList } from "@/types/user";
import {
  getStudent,
  getContentManager,
  searchStudent,
  searchContentManager,
} from "@/app/api/user/user.api";
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
  const [fetchedTabs, setFetchedTabs] = useState<string[]>([]);
  const [studentCurrentPage, setStudentCurrentPage] = useState<number>(0);
  const [contentManagerCurrentPage, setContentManagerCurrentPage] = useState<number>(0);

  // Update search value
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  // Debounce search value
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update current page based on the tab
    if (value === "student") {
      setCurrentPage(studentCurrentPage);
    } else {
      setCurrentPage(contentManagerCurrentPage);
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (activeTab === "student") {
      setStudentCurrentPage(newPage);
    } else {
      setContentManagerCurrentPage(newPage);
    }
  };

  // Fetch student data only if needed or search changes
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        let response: UserList;
        if (debouncedSearchValue) {
          response = await searchStudent({
            pageNo: currentPage,
            pageSize: 5,
            sortBy: "userId",
            sortDir: "desc",
            keyword: debouncedSearchValue,
          });
        } else {
          response = await getStudent({
            pageNo: currentPage,
            pageSize: 5,
            sortBy: "userId",
            sortDir: "desc",
          });
          
          // Mark as fetched if it's not a search result
          if (!debouncedSearchValue && !fetchedTabs.includes("student")) {
            setFetchedTabs(prev => [...prev, "student"]);
          }
        }
        setUsers(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch only if it's the active tab and either:
    // 1. We haven't fetched this tab before, or
    // 2. The search value has changed, or
    // 3. The page has changed
    if (activeTab === "student" && 
        (!fetchedTabs.includes("student") || 
         debouncedSearchValue || 
         currentPage !== studentCurrentPage)) {
      fetchStudentData();
    }
  }, [activeTab, currentPage, debouncedSearchValue, fetchedTabs, studentCurrentPage]);

  // Fetch content manager data only if needed or search changes
  useEffect(() => {
    const fetchContentManagerData = async () => {
      try {
        setLoading(true);
        let response: UserList;
        if (debouncedSearchValue) {
          response = await searchContentManager({
            pageNo: currentPage,
            pageSize: 5,
            sortBy: "userId",
            sortDir: "desc",
            keyword: debouncedSearchValue,
          });
        } else {
          response = await getContentManager({
            pageNo: currentPage,
            pageSize: 5,
            sortBy: "userId",
            sortDir: "desc",
          });
          
          // Mark as fetched if it's not a search result
          if (!debouncedSearchValue && !fetchedTabs.includes("contentManager")) {
            setFetchedTabs(prev => [...prev, "contentManager"]);
          }
        }
        setContentManagers(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch only if it's the active tab and either:
    // 1. We haven't fetched this tab before, or
    // 2. The search value has changed, or
    // 3. The page has changed
    if (activeTab === "contentManager" && 
        (!fetchedTabs.includes("contentManager") || 
         debouncedSearchValue || 
         currentPage !== contentManagerCurrentPage)) {
      fetchContentManagerData();
    }
  }, [activeTab, currentPage, debouncedSearchValue, fetchedTabs, contentManagerCurrentPage]);

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

      <Tabs defaultValue="student" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="student">
            Student
          </TabsTrigger>
          <TabsTrigger value="contentManager">
            Content Manager
          </TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="student">
          <div className="font-medium">Total students: {users?.totalElements || 0}</div>
          <DataTable
            columns={columns}
            data={users?.content || []}
            isLoading={loading && activeTab === "student"}
          />
        </TabsContent>
        <TabsContent className="space-y-6" value="contentManager">
          <div className="font-medium">Total content managers: {contentManagers?.totalElements || 0}</div>
          <DataTable
            columns={columns}
            data={contentManagers?.content || []}
            isLoading={loading && activeTab === "contentManager"}
          />
        </TabsContent>
      </Tabs>

      <Pagination className="space-x-6">
        <PaginationContent>
          <PaginationItem>
            <Button
              disabled={currentPage === 0}
              onClick={() => handlePageChange(Math.max(currentPage - 1, 0))}
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
              onClick={() => handlePageChange(currentPage + 1)}
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