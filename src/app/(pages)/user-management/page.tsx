"use client";
import { useEffect, useState } from "react";
import { UserStats } from "./_components/UserStats";
import { Pagination } from "./_components/Pagination";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { Users, GraduationCap, UserCheck, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { getAllUser } from "@/app/api/user/user.api";
import AddContentManagerPopup from "./_components/add-content-manager-popup";

export default function UserManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([])
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("run api");

        setLoading(true)
        // Gọi API với axios
        const response = await getAllUser();
        setUsers(response);
        console.log(response);

      } catch (err) {
        console.log(err);

      } finally {
        // Đổi trạng thái loading thành false khi hoàn thành
        setLoading(false);
      }
    }

    fetchUsers();
  }, [])

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Account Management</h1>
        <AddContentManagerPopup />


      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <UserStats
          title="Total user"
          count={625}
          icon={<Users className="w-6 h-6 text-gray-500" />}
        />
        <UserStats
          title="Student"
          count={625}
          icon={<GraduationCap className="w-6 h-6 text-gray-500" />}
        />
        <UserStats
          title="Content manager"
          count={625}
          icon={<UserCheck className="w-6 h-6 text-gray-500" />}
        />
        <UserStats
          title="Joined this month"
          count={123}
          icon={<Calendar className="w-6 h-6 text-gray-500" />}
        />
      </div>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="contentManager">Content Manager</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <DataTable
            columns={columns}
            searchKey="userName"
            data={paginatedUsers}
            isLoading={loading}
          />
        </TabsContent>
        <TabsContent value="contentManager">
          <DataTable
            columns={columns}
            searchKey="userName"
            data={paginatedUsers}
            isLoading={loading}
          />
        </TabsContent>
      </Tabs>

      {/* Phân trang */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
