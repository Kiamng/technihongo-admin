"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./_components/columns";
import { SubscriptionStats } from "./_components/SubscriptionStats";
import { SubscriptionPlan } from "@/types/subscription";
import { Users, GraduationCap, UserCheck, Calendar, } from "lucide-react";
import React from "react";
import { getAllSubscription } from "@/app/api/subscription/subscription.api";
import AddSubscriptionPlanPopup from "./_components/add-subscription-popup";
import { Pagination } from "@/components/Pagination";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([])
  const itemsPerPage = 5;
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
  const paginatedUsers = subscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const { data: session } = useSession()

  const fetchSubscriptions = async () => {
    try {

      setLoading(true)
      const response = await getAllSubscription(session?.user.token as string);
      setSubscriptions(response);

    } catch (err) {
      console.log(err);

    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchSubscriptions();
  }, [session?.user.token])

  return (
    <div className=" w-full">
      {/* Tiêu đề trang */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <AddSubscriptionPlanPopup token={session?.user.token as string} fetchSubscriptions={fetchSubscriptions} />
      </div>
      {/* Thống kê */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <SubscriptionStats title="Total Subscription" count={625} icon={<Users className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Achievement" count={625} icon={<GraduationCap className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Total" count={625} icon={<UserCheck className="w-6 h-6 text-gray-500" />} />
        <SubscriptionStats title="Money this month" count={123} icon={<Calendar className="w-6 h-6 text-gray-500" />} />
      </div>

      {/* Bảng dữ liệu + Phân trang */}
      <DataTable columns={columns({ fetchSubscriptions })} searchKey="name" data={paginatedUsers} isLoading={loading} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />


    </div>
  );
}
