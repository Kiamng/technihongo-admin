// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   CornerDownLeft,
//   LogIn,
//   Clock,
//   BookOpen,
//   Trophy,
//   LucideIcon,
//   MessageSquare,
//   UserPlus,
//   UserCheck,
//   FileText,
//   Lock,
//   Trash,
//   PenSquare,
//   User,
//   Mail,
//   Flame,
//   Coins,
//   Calendar,
//   CheckCircle2,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { User as UserType } from "@/types/user";
// import { getUserById } from "@/app/api/user/user.api";
// import { getActivityLog } from "@/app/api/learningLog/learninglog.api";
// import { Badge } from "@/components/ui/badge";
// import { useSession } from "next-auth/react";

// interface UserDetailPageProps {
//   params: Promise<{ userId: string }>;
// }

// interface StatCardProps {
//   icon: LucideIcon;
//   title: string;
//   value: string | number;
//   className?: string;
// }

// const userStats = {
//   totalLessons: 245,
//   totalStudyTime: "45h 30m",
//   streakDays: 15,
// };

// export default function UserDetailPage({ params }: UserDetailPageProps) {
//   const router = useRouter();
//   const [user, setUser] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const { data: session } = useSession();
//   const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
//   const [visibleActivities, setVisibleActivities] = useState<ActivityLog[]>([]);
//   const [currentPage, setCurrentPage] = useState<number>(0);
//   const ITEMS_PER_PAGE = 4;

//   // Unwrap params using useEffect
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const resolveParams = async () => {
//       const resolved = await params;
//       setUserId(resolved.userId);
//     };
//     resolveParams();
//   }, [params]);

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserID = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         if (userId && session?.user.token) {
//           const userData = await getUserById(session.user.token, userId);
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//         setError("Failed to load user data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUserID();
//     }
//   }, [userId, session?.user.token]);

//   // Fetch activity log
//   useEffect(() => {
//     const fetchActivityLog = async () => {
//       if (!session?.user.token || !userId) return;
//       try {
//         const activityData = await getActivityLog({
//           token: session.user.token,
//           userId: parseInt(userId),
//           page: 0,
//           size: 20,
//         });
//         // Check for duplicate logIds
//         const logIdCounts = activityData.reduce((acc, log) => {
//           acc[log.logId] = (acc[log.logId] || 0) + 1;
//           return acc;
//         }, {} as Record<number, number>);
//         const duplicates = Object.entries(logIdCounts)
//           .filter(([_, count]) => count > 1)
//           .map(([logId]) => logId);
//         if (duplicates.length > 0) {
//           console.warn(
//             `Duplicate logIds detected: ${duplicates.join(", ")}`,
//             activityData
//           );
//         }
//         setActivityLog(activityData);
//         setVisibleActivities(activityData.slice(0, ITEMS_PER_PAGE));
//         setCurrentPage(0);
//       } catch (err) {
//         console.error("Error fetching activity log:", err);
//         setError("Failed to load activity log. Please try again later.");
//       }
//     };

//     fetchActivityLog();
//   }, [session?.user.token, userId]);

//   const handleLoadMore = () => {
//     const nextPage = currentPage + 1;
//     const startIndex = nextPage * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     // Filter out duplicates based on logId
//     const existingLogIds = new Set(visibleActivities.map((log) => log.logId));
//     const newActivities = activityLog
//       .slice(startIndex, endIndex)
//       .filter((log) => !existingLogIds.has(log.logId));

//     if (newActivities.length > 0) {
//       setVisibleActivities((prev) => [...prev, ...newActivities]);
//       setCurrentPage(nextPage);
//     }
//   };

//   const renderIcon = (iconType: string) => {
//     switch (iconType.toLowerCase()) {
//       case "lesson":
//         return <BookOpen className="h-5 w-5 text-white" />;
//       case "comment":
//         return <MessageSquare className="h-5 w-5 text-white" />;
//       case "streak":
//         return <Flame className="h-5 w-5 text-white" />;
//       case "coin":
//         return <Coins className="h-5 w-5 text-white" />;
//       case "reminder":
//         return <Clock className="h-5 w-5 text-white" />;
//       case "daily":
//         return <Calendar className="h-5 w-5 text-white" />;
//       case "login":
//         return <LogIn className="h-5 w-5 text-white" />;
//       case "complete":
//         return <CheckCircle2 className="h-5 w-5 text-white" />;

//         return <FileText className="h-5 w-5 text-white" />;
//       case "renew_subscription":
//         return <Coins className="h-5 w-5 text-white" />;
//       default:
//         return <FileText className="h-5 w-5 text-white" />;
//     }
//   };

//   const getIconBgColor = (type: string): string => {
//     switch (type.toLowerCase()) {
//       case "lesson":
//         return "bg-indigo-600";
//       case "system":
//         return "bg-blue-600";
//       case "login":
//         return "bg-cyan-600";
//       case "complete":
//         return "bg-green-600";
//       case "streak":
//         return "bg-amber-600";
//       case "coin":
//         return "bg-yellow-600";
//       case "view":
//         return "bg-gray-600";
//       case "renew_subscription":
//         return "bg-purple-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const getIconContainerBgColor = (type: string): string => {
//     switch (type.toLowerCase()) {
//       case "lesson":
//         return "bg-indigo-100";
//       case "system":
//         return "bg-blue-100";
//       case "login":
//         return "bg-cyan-100";
//       case "complete":
//         return "bg-green-100";
//       case "streak":
//         return "bg-amber-100";
//       case "coin":
//         return "bg-yellow-100";
//       case "view":
//         return "bg-gray-100";
//       case "renew_subscription":
//         return "bg-purple-100";
//       default:
//         return "bg-gray-100";
//     }
//   };

//   if (error) {
//     return <div className="text-center text-red-500 p-4">{error}</div>;
//   }

//   if (loading) {
//     return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
//   }

//   const StatCard = ({
//     icon: Icon,
//     title,
//     value,
//     className = "",
//   }: StatCardProps) => (
//     <Card className="flex-1">
//       <CardContent className="flex items-center p-4 gap-3">
//         <div className={`p-2 rounded-lg ${className}`}>
//           <Icon className="w-5 h-5" />
//         </div>
//         <div>
//           <p className="text-sm text-muted-foreground">{title}</p>
//           <p className="text-lg font-semibold">{value}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );

//   const formatJoinDate = (date: Date | string | undefined) => {
//     if (!date) return "";
//     const formattedDate = typeof date === "string" ? new Date(date) : date;
//     return formattedDate.toLocaleDateString("vi-VN", {
//       day: "numeric",
//       month: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col gap-4">
//         <Button
//           onClick={() => router.back()}
//           variant="outline"
//           className="w-fit gap-2 hover:bg-accent/50"
//         >
//           <CornerDownLeft className="w-4 h-4" />
//           <span>Quay lại</span>
//         </Button>

//         {/* User Information Section */}
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//             <User className="w-6 h-6 text-primary" />
//           </div>
//           <div className="flex-1">
//             <h1 className="text-xl font-bold">
//               {user?.userName || "Người dùng không tồn tại"}
//             </h1>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Mail className="w-4 h-4" />
//               <span>{user?.email}</span>
//             </div>
//             <p className="text-sm text-muted-foreground mt-1">
//               Tham gia từ: {formatJoinDate(user?.createdAt)}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <StatCard
//           icon={BookOpen}
//           title="Tổng số bài học"
//           value={userStats.totalLessons}
//           className="bg-blue-100 text-blue-600"
//         />
//         <StatCard
//           icon={Trophy}
//           title="Số ngày liên tiếp"
//           value={userStats.streakDays}
//           className="bg-amber-100 text-amber-600"
//         />
//         <StatCard
//           icon={Clock}
//           title="Tổng thời gian học"
//           value={userStats.totalStudyTime}
//           className="bg-green-100 text-green-600"
//         />
//       </div> */}

//       {/* Activity Log Section */}
//       <div className="space-y-4">
//         <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#57D061] mb-4">
//           <h3 className="font-medium flex items-center mb-1">
//             <FileText className="h-4 w-4 mr-2 text-[#57D061]" />
//             Nhật ký hoạt động
//           </h3>
//           <p className="text-sm text-gray-500">
//             Các hoạt động gần đây của người dùng
//           </p>
//         </div>
//         {activityLog.length > 0 ? (
//           <>
//             <div className="divide-y border rounded-lg shadow-sm bg-white">
//               {visibleActivities.map((log, index) => (
//                 <div
//                   key={`${log.logId}-${index}`} // Use composite key to ensure uniqueness
//                   className="p-4 flex gap-3 items-center hover:bg-gray-50 transition-colors"
//                 >
//                   <div
//                     className={`${getIconContainerBgColor(
//                       log.activityType.toLowerCase()
//                     )} p-2 rounded-lg h-12 w-12 flex items-center justify-center shadow-sm`}
//                   >
//                     <div
//                       className={`w-7 h-7 ${getIconBgColor(
//                         log.activityType.toLowerCase()
//                       )} rounded-md flex items-center justify-center shadow-sm`}
//                     >
//                       {renderIcon(log.activityType.toLowerCase())}
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <div className="font-medium">{log.description}</div>
//                     <div className="text-xs text-gray-500 flex items-center mt-1">
//                       <Clock className="h-3 w-3 mr-1" />
//                       {new Date(log.createdAt).toLocaleString("vi-VN", {
//                         day: "2-digit",
//                         month: "2-digit",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </div>
//                   </div>
//                   <Badge
//                     className={`${getIconContainerBgColor(
//                       log.activityType.toLowerCase()
//                     ).replace("bg-", "bg-")} ${
//                       log.activityType.toLowerCase() === "lesson"
//                         ? "text-indigo-800"
//                         : log.activityType.toLowerCase() === "complete"
//                         ? "text-green-800"
//                         : log.activityType.toLowerCase() === "login"
//                         ? "text-cyan-800"
//                         : log.activityType.toLowerCase() === "view"
//                         ? "text-gray-800"
//                         : log.activityType.toLowerCase() ===
//                           "renew_subscription"
//                         ? "text-purple-800"
//                         : "text-gray-800"
//                     }`}
//                   >
//                     {log.activityType}
//                   </Badge>
//                 </div>
//               ))}
//             </div>
//             {visibleActivities.length < activityLog.length && (
//               <div className="text-center mt-6">
//                 <Button
//                   className="px-6 py-2 hover:bg-gray-100 transition-all"
//                   variant="outline"
//                   onClick={handleLoadMore}
//                 >
//                   <FileText className="h-4 w-4 mr-2" />
//                   Xem thêm nhật ký
//                 </Button>
//               </div>
//             )}
//           </>
//         ) : (
//           <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
//             <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//             <p className="text-lg">Chưa có nhật ký hoạt động</p>
//             <p className="text-sm mt-2">
//               Hoàn thành bài học để xem nhật ký hoạt động của bạn
//             </p>
//             <Button className="mt-4" variant="outline">
//               Bắt đầu học
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CornerDownLeft,
  LogIn,
  Clock,
  BookOpen,
  Trophy,
  LucideIcon,
  MessageSquare,
  UserPlus,
  UserCheck,
  FileText,
  Lock,
  Trash,
  PenSquare,
  User,
  Mail,
  Flame,
  Coins,
  Calendar,
  CheckCircle2,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User as UserType } from "@/types/user";
import { getUserById } from "@/app/api/user/user.api";
import { getActivityLog, getPaymentHistory } from "@/app/api/learningLog/learninglog.api";

import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentLog } from "@/types/paymentLog";

interface UserDetailPageProps {
  params: Promise<{ userId: string }>;
}

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  className?: string;
}

const userStats = {
  totalLessons: 245,
  totalStudyTime: "45h 30m",
  streakDays: 15,
};

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [paymentLog, setPaymentLog] = useState<PaymentLog[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<ActivityLog[]>([]);
  const [visiblePayments, setVisiblePayments] = useState<PaymentLog[]>([]);
  const [currentActivityPage, setCurrentActivityPage] = useState<number>(0);
  const [currentPaymentPage, setCurrentPaymentPage] = useState<number>(0);
  const ITEMS_PER_PAGE = 4;

  // Unwrap params using useEffect
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setUserId(resolved.userId);
    };
    resolveParams();
  }, [params]);

  // Fetch user data
  useEffect(() => {
    const fetchUserID = async () => {
      try {
        setLoading(true);
        setError(null);

        if (userId && session?.user.token) {
          const userData = await getUserById(session.user.token, userId);
          setUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserID();
    }
  }, [userId, session?.user.token]);

  // Fetch activity log
  useEffect(() => {
    const fetchActivityLog = async () => {
      if (!session?.user.token || !userId) return;
      try {
        const activityData = await getActivityLog({
          token: session.user.token,
          userId: parseInt(userId),
          page: 0,
          size: 20,
        });
        // Check for duplicate logIds
        const logIdCounts = activityData.reduce((acc, log) => {
          acc[log.logId] = (acc[log.logId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        const duplicates = Object.entries(logIdCounts)
          .filter(([_, count]) => count > 1)
          .map(([logId]) => logId);
        if (duplicates.length > 0) {
          console.warn(
            `Duplicate logIds detected: ${duplicates.join(", ")}`,
            activityData
          );
        }
        setActivityLog(activityData);
        setVisibleActivities(activityData.slice(0, ITEMS_PER_PAGE));
        setCurrentActivityPage(0);
      } catch (err) {
        console.error("Error fetching activity log:", err);
        setError("Failed to load activity log. Please try again later.");
      }
    };

    fetchActivityLog();
  }, [session?.user.token, userId]);

  // Fetch payment history
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!session?.user.token || !userId) return;
      try {
        const paymentData = await getPaymentHistory({
          token: session.user.token,
          studentId: parseInt(userId),
          transactionStatus: "COMPLETED",
        });
        setPaymentLog(paymentData);
        setVisiblePayments(paymentData.slice(0, ITEMS_PER_PAGE));
        setCurrentPaymentPage(0);
      } catch (err) {
        console.error("Error fetching payment history:", err);
        setError("Failed to load payment history. Please try again later.");
      }
    };

    fetchPaymentHistory();
  }, [session?.user.token, userId]);

  const handleLoadMoreActivities = () => {
    const nextPage = currentActivityPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const existingLogIds = new Set(visibleActivities.map((log) => log.logId));
    const newActivities = activityLog
      .slice(startIndex, endIndex)
      .filter((log) => !existingLogIds.has(log.logId));

    if (newActivities.length > 0) {
      setVisibleActivities((prev) => [...prev, ...newActivities]);
      setCurrentActivityPage(nextPage);
    }
  };

  const handleLoadMorePayments = () => {
    const nextPage = currentPaymentPage + 1;
    const startIndex = nextPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const existingTransactionIds = new Set(
      visiblePayments.map((log) => log.transactionId)
    );
    const newPayments = paymentLog
      .slice(startIndex, endIndex)
      .filter((log) => !existingTransactionIds.has(log.transactionId));

    if (newPayments.length > 0) {
      setVisiblePayments((prev) => [...prev, ...newPayments]);
      setCurrentPaymentPage(nextPage);
    }
  };

  const renderIcon = (iconType: string) => {
    switch (iconType.toLowerCase()) {
      case "lesson":
        return <BookOpen className="h-5 w-5 text-white" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-white" />;
      case "streak":
        return <Flame className="h-5 w-5 text-white" />;
      case "coin":
        return <Coins className="h-5 w-5 text-white" />;
      case "reminder":
        return <Clock className="h-5 w-5 text-white" />;
      case "daily":
        return <Calendar className="h-5 w-5 text-white" />;
      case "login":
        return <LogIn className="h-5 w-5 text-white" />;
      case "complete":
        return <CheckCircle2 className="h-5 w-5 text-white" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-white" />;
      default:
        return <FileText className="h-5 w-5 text-white" />;
    }
  };

  const getIconBgColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "lesson":
        return "bg-indigo-600";
      case "system":
        return "bg-blue-600";
      case "login":
        return "bg-cyan-600";
      case "complete":
        return "bg-green-600";
      case "streak":
        return "bg-amber-600";
      case "coin":
        return "bg-yellow-600";
      case "view":
        return "bg-gray-600";
      case "payment":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  const getIconContainerBgColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case "lesson":
        return "bg-indigo-100";
      case "system":
        return "bg-blue-100";
      case "login":
        return "bg-cyan-100";
      case "complete":
        return "bg-green-100";
      case "streak":
        return "bg-amber-100";
      case "coin":
        return "bg-yellow-100";
      case "view":
        return "bg-gray-100";
      case "payment":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (loading) {
    return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  }

  const StatCard = ({
    icon: Icon,
    title,
    value,
    className = "",
  }: StatCardProps) => (
    <Card className="flex-1">
      <CardContent className="flex items-center p-4 gap-3">
        <div className={`p-2 rounded-lg ${className}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  const formatJoinDate = (date: Date | string | undefined) => {
    if (!date) return "";
    const formattedDate = typeof date === "string" ? new Date(date) : date;
    return formattedDate.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="w-fit gap-2 hover:bg-accent/50"
        >
          <CornerDownLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </Button>

        {/* User Information Section */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold  font-bold">
              {user?.userName || "Người dùng không tồn tại"}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Tham gia từ: {formatJoinDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="activity">Nhật ký hoạt động</TabsTrigger>
          <TabsTrigger value="payment">Lịch sử giao dịch</TabsTrigger>
        </TabsList>

        {/* Activity Log Tab */}
        <TabsContent value="activity" className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#57D061] mb-4">
            <h3 className="font-medium flex items-center mb-1">
              <FileText className="h-4 w-4 mr-2 text-[#57D061]" />
              Nhật ký hoạt động
            </h3>
            <p className="text-sm text-gray-500">
              Các hoạt động gần đây của người dùng
            </p>
          </div>
          {activityLog.length > 0 ? (
            <>
              <div className="divide-y border rounded-lg shadow-sm bg-white">
                {visibleActivities.map((log, index) => (
                  <div
                    key={`${log.logId}-${index}`}
                    className="p-4 flex gap-3 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`${getIconContainerBgColor(
                        log.activityType.toLowerCase()
                      )} p-2 rounded-lg h-12 w-12 flex items-center justify-center shadow-sm`}
                    >
                      <div
                        className={`w-7 h-7 ${getIconBgColor(
                          log.activityType.toLowerCase()
                        )} rounded-md flex items-center justify-center shadow-sm`}
                      >
                        {renderIcon(log.activityType.toLowerCase())}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{log.description}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(log.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <Badge
                      className={`${getIconContainerBgColor(
                        log.activityType.toLowerCase()
                      ).replace("bg-", "bg-")} ${
                        log.activityType.toLowerCase() === "lesson"
                          ? "text-indigo-800"
                          : log.activityType.toLowerCase() === "complete"
                          ? "text-green-800"
                          : log.activityType.toLowerCase() === "login"
                          ? "text-cyan-800"
                          : log.activityType.toLowerCase() === "view"
                          ? "text-gray-800"
                          : log.activityType.toLowerCase() ===
                            "renew_subscription"
                          ? "text-purple-800"
                          : "text-gray-800"
                      }`}
                    >
                      {log.activityType}
                    </Badge>
                  </div>
                ))}
              </div>
              {visibleActivities.length < activityLog.length && (
                <div className="text-center mt-6">
                  <Button
                    className="px-6 py-2 hover:bg-gray-100 transition-all"
                    variant="outline"
                    onClick={handleLoadMoreActivities}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Xem thêm nhật ký
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chưa có nhật ký hoạt động</p>
              
            </div>
          )}
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payment" className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-[#57D061] mb-4">
            <h3 className="font-medium flex items-center mb-1">
              <CreditCard className="h-4 w-4 mr-2 text-[#57D061]" />
              Lịch sử giao dịch
            </h3>
            <p className="text-sm text-gray-500">
              Các giao dịch đã hoàn thành của người dùng
            </p>
          </div>
          {paymentLog.length > 0 ? (
            <>
              <div className="divide-y border rounded-lg shadow-sm bg-white">
                {visiblePayments.map((log, index) => (
                  <div
                    key={`${log.transactionId}-${index}`}
                    className="p-4 flex gap-3 items-center hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`${getIconContainerBgColor("payment")} p-2 rounded-lg h-12 w-12 flex items-center justify-center shadow-sm`}
                    >
                      <div
                        className={`w-7 h-7 ${getIconBgColor(
                          "payment"
                        )} rounded-md flex items-center justify-center shadow-sm`}
                      >
                        {renderIcon("payment")}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {log.subscriptionPlanName} -{" "}
                        {formatCurrency(log.transactionAmount, log.currency)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(log.paymentDate).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Phương thức: {log.paymentMethod}
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {log.transactionStatus}
                    </Badge>
                  </div>
                ))}
              </div>
              {visiblePayments.length < paymentLog.length && (
                <div className="text-center mt-6">
                  <Button
                    className="px-6 py-2 hover:bg-gray-100 transition-all"
                    variant="outline"
                    onClick={handleLoadMorePayments}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Xem thêm giao dịch
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chưa có lịch sử giao dịch</p>
            
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
