"use client";
import { useEffect, useState } from "react";
import { UserStats } from "./_components/UserStats";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { Users, GraduationCap, UserCheck, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types/user";
import { getStudent, getContentManager } from "@/app/api/user/user.api";
import AddContentManagerPopup from "./_components/add-content-manager-popup";
import { Pagination } from "@/components/Pagination";

export default function UserManagementPage() {

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);
  const [contentManagers, setContentManagers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("student");
  const [contentManagersLoaded, setContentManagersLoaded] = useState(false); // Đánh dấu đã tải content managers

  const itemsPerPage = 5;
  const totalPages = Math.ceil(
    (activeTab === "student" ? users.length : contentManagers.length) / itemsPerPage
  );

  const paginatedData =
    activeTab === "student"
      ? users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : contentManagers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Tải danh sách sinh viên khi vào trang
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudent();
        setUsers(response);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  // Khi bấm vào tab Content Manager lần đầu tiên thì mới tải dữ liệu
  useEffect(() => {
    if (activeTab === "contentManager" && !contentManagersLoaded) {
      const fetchContentManagers = async () => {
        try {
          setLoading(true);
          const response = await getContentManager();
          setContentManagers(response);
          setContentManagersLoaded(true); // Đánh dấu đã tải
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchContentManagers();
    }
  }, [activeTab, contentManagersLoaded]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Account Management</h1>
        <AddContentManagerPopup />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <UserStats title="Total user" count={625} icon={<Users className="w-6 h-6 text-gray-500" />} />
        <UserStats title="Student" count={users.length} icon={<GraduationCap className="w-6 h-6 text-gray-500" />} />
        <UserStats title="Content manager" count={contentManagers.length} icon={<UserCheck className="w-6 h-6 text-gray-500" />} />
        <UserStats title="Joined this month" count={123} icon={<Calendar className="w-6 h-6 text-gray-500" />} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="student" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="contentManager">Content Manager</TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <DataTable columns={columns} searchKey="userName" data={paginatedData} isLoading={loading} />
        </TabsContent>
        <TabsContent value="contentManager">
          <DataTable columns={columns} searchKey="userName" data={paginatedData} isLoading={loading} />
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
