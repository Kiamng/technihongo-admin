"use client";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "./_components/Pagination";
import { columns } from "./_components/columns";
import { SubscriptionStats } from "./_components/SubscriptionStats";
import users from "@/types/subscription";
import { Users, GraduationCap, UserCheck, Calendar,  } from "lucide-react";

export default function SubscriptionManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subcription Management</h1>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <SubscriptionStats title="Total Subcription" count={625} icon={<Users className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Archivement" count={625} icon={<GraduationCap className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Total " count={625} icon={<UserCheck className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Money this month" count={123} icon={<Calendar className="w-6 h-6 text-gray-500" />} />
      </div>

      {/* Bảng dữ liệu */}
      <DataTable columns={columns} searchKey="name"  data={paginatedUsers} isLoading={false} />

      {/* Phân trang */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
