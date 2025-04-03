"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Pagination } from "./_components/Pagination";
import { columns } from "./_components/columns";
import { getAllAchievement } from "@/app/api/achievement/achievement.api";
import type { Achievement } from "@/types/achievement";
import { useSession } from "next-auth/react";



export default function Achievement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const { data: session } = useSession()
  const itemsPerPage = 5;
  const totalPages = Math.ceil(achievements.length / itemsPerPage);
  const paginatedUsers = achievements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true)
        const response = await getAllAchievement(session?.user.token as string);
        setAchievements(response);
      } catch (err) {
        console.log(err);

      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, [])

  return (
    <div className="p-6">
      {/* Tiêu đề trang */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Achievement</h1>

      </div>
      {/*}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SubscriptionStats title="Total Subscription" count={625} icon={<Users className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Achievement" count={625} icon={<GraduationCap className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Total" count={625} icon={<UserCheck className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Money this month" count={123} icon={<Calendar className="w-6 h-6 text-gray-500" />} />
      </div>
      */}

      {/* Bảng dữ liệu + Phân trang */}
      <DataTable columns={columns} searchKey="badgeName" data={paginatedUsers} isLoading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />


    </div>
  );
}
