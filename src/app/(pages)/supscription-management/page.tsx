// /* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import { useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { Users, GraduationCap, UserCheck } from 'lucide-react';
// import { CardTitle } from '@/components/ui/card';
// import { getAllSubscription } from '@/app/api/subscription/subscription.api';
// import { SubscriptionStats } from '../dashboard/_components/SubscriptionStats';
// import { SubscriptionPlan } from '@/types/subscription';
// import AddSubscriptionPlanPopup from '../dashboard/_components/add-subscription-popup';
// import { DataTable } from '@/components/data-table';

// import { Pagination } from '@/components/Pagination';
// import { SubscriptionPlanColumns } from '../dashboard/_components/columns';


// // Mock data for the dashboard
// const overview = {
//   totalStudents: 1200,
//   totalActiveCourses: 45,
//   totalSubscriptionsSold: 850,
// };

// const SupscriptionManagement = () => {
//   const { data: session } = useSession();
//   const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [error, setError] = useState<string | null>(null);
//     const itemsPerPage = 5;
//     const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
//     const paginatedUsers = subscriptions.slice(
//       (currentPage - 1) * itemsPerPage,
//       currentPage * itemsPerPage
//     );


//   // Fetch subscriptions
//   const fetchSubscriptions = async () => {
//     try {
//       setLoading(true);
//       const response = await getAllSubscription(session?.user.token as string);
//       setSubscriptions(response);
//     } catch (err) {
//       console.log(err);
//       setError("Không thể tải danh sách gói đăng ký.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <CardTitle>Dashboard</CardTitle>
//         <AddSubscriptionPlanPopup
//           token={session?.user.token as string}
//           fetchSubscriptions={fetchSubscriptions}
//         />
//       </div>

//       <div className="w-full flex flex-row space-x-4 mb-6">
//         <SubscriptionStats
//           title="Tổng số học viên"
//           count={overview.totalStudents}
//           icon={<Users className="w-6 h-6 text-gray-500" />}
//         />
//         <SubscriptionStats
//           title="Khóa học đang hoạt động"
//           count={overview.totalActiveCourses}
//           icon={<GraduationCap className="w-6 h-6 text-gray-500" />}
//         />
//         <SubscriptionStats
//           title="Gói đăng ký đã bán"
//           count={overview.totalSubscriptionsSold}
//           icon={<UserCheck className="w-6 h-6 text-gray-500" />}
//         />
//       </div>
//         {/* Data table + Pagination */}
//             <DataTable
//               columns={SubscriptionPlanColumns({ fetchSubscriptions })}
//               searchKey="name"
//               data={paginatedUsers}
//               isLoading={loading}
//             />
//             <Pagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//             />
//     </div>
//   );
// };

// export default SupscriptionManagement;

// app/subscription-management/page.tsx
"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";

import { SubscriptionPlan } from "@/types/subscription";
// import { Users, GraduationCap, UserCheck } from "lucide-react";
import {
  getAllSubscription,
} from "@/app/api/subscription/subscription.api";

import { Pagination } from "@/components/Pagination";
import { useSession } from "next-auth/react";
// import { SubscriptionStats } from "../dashboard/_components/SubscriptionStats";
import { SubscriptionPlanColumns } from "../dashboard/_components/columns";
import EditSubscriptionPlanPopup from "../dashboard/_components/add-subscription-popup";


export default function SubscriptionManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([]);
  // const [overview, setOverview] = useState<AdminOverview>({
  //   totalStudents: 0,
  //   totalActiveCourses: 0,
  //   totalSubscriptionsSold: 0,
  //   yearlyRevenue: [],
  // });
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(subscriptions.length / itemsPerPage);
  const paginatedUsers = subscriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const { data: session } = useSession();

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await getAllSubscription(session?.user.token as string);
      setSubscriptions(response);
    } catch (err) {
      console.log(err);
      setError("Không thể tải danh sách gói đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch admin overview
  // const fetchAdminOverview = async () => {
  //   try {
  //     const response = await getAdminOverview(session?.user.token as string);
  //     setOverview(response);
  //   } catch (err) {
  //     console.error("Lỗi khi tải tổng quan:", err);
  //     setError("Không thể tải dữ liệu tổng quan.");
  //   }
  // };

  useEffect(() => {
    if (session?.user.token) {
      fetchSubscriptions();
      // fetchAdminOverview();
    }
  }, [session?.user.token]);

  return (
    <div className="w-full">
      {/* Page title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Quản lí gói đăng ký</h1>
        <EditSubscriptionPlanPopup
          token={session?.user.token as string}
          fetchSubscriptions={fetchSubscriptions}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Stats cards */}
      {/* <div className="w-full flex flex-row space-x-4 mb-6">
        <SubscriptionStats
          title="Tổng số học viên"
          count={overview.totalStudents}
          icon={<Users className="w-6 h-6 text-gray-500" />}
        />
        <SubscriptionStats
          title="Khóa học đang hoạt động"
          count={overview.totalActiveCourses}
          icon={<GraduationCap className="w-6 h-6 text-gray-500" />}
        />
        <SubscriptionStats
          title="Gói đăng ký đã bán"
          count={overview.totalSubscriptionsSold}
          icon={<UserCheck className="w-6 h-6 text-gray-500" />}
        />
      </div> */}

      {/* Data table + Pagination */}
      <DataTable
        columns={SubscriptionPlanColumns({ fetchSubscriptions })}
        searchKey="name"
        data={paginatedUsers}
        isLoading={loading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}