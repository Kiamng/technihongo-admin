
"use client";

import { useEffect, useState } from "react";
import { SubscriptionStats } from "./_components/SubscriptionStats";
import { Users, GraduationCap, UserCheck } from "lucide-react";
import {
  AdminOverview,
  getAdminOverview,
  getRevenueByPlan,
  getRevenueByPeriod,
  RevenueByPlan,
  RevenueByPeriod,
  MostPopularPlan,
  getMostPopularPlan,
} from "@/app/api/subscription/subscription.api";
import { useSession } from "next-auth/react";
import {  CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RevenueAreaChart } from "./_components/AreaCharts";
import { RevenueBarChart } from "./_components/RevenueBarChart";
import { RevenuePieChart } from "./_components/revenuePieChart";

export default function Dashboard() {
  const [overview, setOverview] = useState<AdminOverview>({
    totalStudents: 0,
    totalActiveCourses: 0,
    totalSubscriptionsSold: 0,
    yearlyRevenue: [],
  });
  const [revenueData, setRevenueData] = useState<RevenueByPlan[]>([]);
  const [revenueByPeriod, setRevenueByPeriod] = useState<{
    weekly: RevenueByPeriod[];
    monthly: RevenueByPeriod[];
    quarterly: RevenueByPeriod[];
    yearly: RevenueByPeriod[];
  }>({
    weekly: [],
    monthly: [],
    quarterly: [],
    yearly: [],
  });
  const [mostPopularPlan, setMostPopularPlan] = useState<MostPopularPlan | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "yearly" | "monthly" | "weekly" | "quarterly"
  >("yearly");
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch admin overview
  const fetchAdminOverview = async () => {
    try {
      const response = await getAdminOverview(session?.user.token as string);
      setOverview(response);
    } catch (err) {
      console.error("Lỗi khi tải tổng quan:", err);
      setError("Không thể tải dữ liệu tổng quan.");
    }
  };

  // Fetch revenue by plan
  const fetchRevenueByPlan = async () => {
    try {
      const response = await getRevenueByPlan(session?.user.token as string);
      setRevenueData(response);
    } catch (err) {
      console.error("Lỗi khi tải doanh thu theo gói:", err);
      setError("Không thể tải dữ liệu doanh thu theo gói.");
    }
  };

  // Fetch most popular plan
  const fetchMostPopularPlan = async () => {
    try {
      const response = await getMostPopularPlan(session?.user.token as string);
      setMostPopularPlan(response);
    } catch (err) {
      console.error("Lỗi khi tải gói phổ biến nhất:", err);
      setError("Không thể tải dữ liệu gói phổ biến nhất.");
    }
  };

  // Fetch revenue by period for all period types
  const fetchRevenueByPeriod = async () => {
    try {
      const periodTypes = ["weekly", "monthly", "quarterly", "yearly"];
      const backendPeriodTypes: { [key: string]: string } = {
        weekly: "WEEK",
        monthly: "MONTH",
        quarterly: "QUARTER",
        yearly: "YEAR",
      };

      const results = await Promise.all(
        periodTypes.map(async (type) => {
          try {
            const backendType = backendPeriodTypes[type];
            if (!backendType) {
              throw new Error(`Loại kỳ không hợp lệ: ${type}`);
            }
            const response = await getRevenueByPeriod(
              session?.user.token as string,
              backendType
            );
            return { type, data: response };
          } catch (err) {
            console.error(`Lỗi khi tải doanh thu cho kỳ ${type}:`, err);
            return { type, data: [] };
          }
        })
      );

      const updatedRevenueByPeriod = results.reduce(
        (acc, { type, data }) => {
          acc[type as keyof typeof acc] = data;
          return acc;
        },
        { weekly: [], monthly: [], quarterly: [], yearly: [] } as typeof revenueByPeriod
      );

      setRevenueByPeriod(updatedRevenueByPeriod);
    } catch (err) {
      console.error("Lỗi khi tải doanh thu theo kỳ:", err);
      setError("Không thể tải dữ liệu doanh thu theo kỳ.");
    }
  };

  useEffect(() => {
    if (session?.user.token) {
      fetchAdminOverview();
      fetchRevenueByPlan();
      fetchRevenueByPeriod();
      fetchMostPopularPlan();
    }
  }, [session?.user.token]);

  // Hàm render biểu đồ dựa trên loại kỳ được chọn
  const renderRevenueChart = () => {
    const data = revenueByPeriod[selectedPeriod];
    const titles = {
      yearly: "Doanh thu hàng năm",
      monthly: "Doanh thu hàng tháng",
      weekly: "Doanh thu hàng tuần",
      quarterly: "Doanh thu hàng quý",
    };
    const descriptions = {
      yearly: "Xu hướng doanh thu năm 2025",
      monthly: "Xu hướng doanh thu theo tháng trong năm 2025",
      weekly: "Xu hướng doanh thu theo tuần trong năm 2025",
      quarterly: "Xu hướng doanh thu theo quý trong năm 2025",
    };
    const footerTexts = {
      yearly: "Hiển thị tổng doanh thu theo tháng cho năm 2025",
      monthly: "Hiển thị tổng doanh thu theo tháng cho năm 2025",
      weekly: "Hiển thị tổng doanh thu theo tuần cho năm 2025",
      quarterly: "Hiển thị tổng doanh thu theo quý cho năm 2025",
    };

    if (selectedPeriod === "yearly") {
      return (
        <RevenueAreaChart
          data={data}
          title={titles[selectedPeriod]}
          description={descriptions[selectedPeriod]}
          footerText={footerTexts[selectedPeriod]}
          
        />
      );
    } else {
      return (
        <RevenueBarChart
          data={data}
          periodType={selectedPeriod}
          title={titles[selectedPeriod]}
          description={descriptions[selectedPeriod]}
          footerText={footerTexts[selectedPeriod]}
          
        />
      );
    }
  };

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="w-full">
      {/* Page title */}
      <div className="flex justify-between items-center mb-6">
        <CardTitle>Dashboard</CardTitle>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Stats cards */}
      <div className="w-full flex flex-row space-x-4 mb-6">
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
      </div>

      {/* Revenue Pie Chart with Most Popular Plan */}
      <div className="mb-6">
        <RevenuePieChart
          data={revenueData}
          title="Doanh thu theo gói đăng ký"
          description="Phân bổ doanh thu năm 2025"
          footerText="Hiển thị tổng doanh thu theo gói đăng ký cho năm 2025"
          trendText="Doanh thu tăng 5.2% trong tháng này"
          mostPopularPlan={mostPopularPlan}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Revenue by Period Chart with Select */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Xu hướng doanh thu theo kỳ</h2>
          <Select
            value={selectedPeriod}
            onValueChange={(value) =>
              setSelectedPeriod(value as typeof selectedPeriod)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn kỳ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Hàng năm</SelectItem>
              <SelectItem value="quarterly">Hàng quý</SelectItem>
              <SelectItem value="monthly">Hàng tháng</SelectItem>
              <SelectItem value="weekly">Hàng tuần</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {renderRevenueChart()}
      </div>
    </div>
  );
}