"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import users from "@/types/user";
import { 
  CornerDownLeft, 
  LogIn,
  LogOut,
  User,
  Calendar,
  Clock,
  BookOpen,
  Trophy,
  Target,
  LucideIcon,
  ImageIcon,
  MessageSquare,
  UserPlus,
  UserCheck,
  FileText,
  Lock,
  Trash,
  PenSquare,
  Mail
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

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
  completedLessons: 178,
  streakDays: 15,
  totalStudyTime: "45h 30m",
  monthlyProgress: "85%",
  lastActive: "2 giờ trước"
};

type ActivityLog = {
  content: string;
  createdDate: Date;
  img: string;
  type: string;
};

const activityLogs: ActivityLog[] = [
  {
    content: "User logged in",
    createdDate: new Date("2025-02-13T08:30:00"),
    img: "/images/login.png",
    type: "auth",
  },
  {
    content: "User updated profile",
    createdDate: new Date("2025-02-14T10:15:00"),
    img: "/images/profile.png",
    type: "update",
  },
  {
    content: "New post created",
    createdDate: new Date("2025-02-13T12:45:00"),
    img: "/images/post.png",
    type: "post",
  },
  {
    content: "Comment added",
    createdDate: new Date("2025-02-14T14:00:00"),
    img: "/images/comment.png",
    type: "comment",
  },
  {
    content: "User logged out",
    createdDate: new Date("2025-02-13T16:20:00"),
    img: "/images/logout.png",
    type: "auth",
  },
  {
    content: "Password changed",
    createdDate: new Date("2025-02-14T18:05:00"),
    img: "/images/password.png",
    type: "security",
  },
  {
    content: "Friend request sent",
    createdDate: new Date("2025-02-13T20:30:00"),
    img: "/images/friend.png",
    type: "social",
  },
  {
    content: "Friend request accepted",
    createdDate: new Date("2025-02-14T21:45:00"),
    img: "/images/friend-accept.png",
    type: "social",
  },
  {
    content: "User uploaded a photo",
    createdDate: new Date("2025-02-13T22:10:00"),
    img: "/images/upload.png",
    type: "media",
  },
  {
    content: "User deleted an account",
    createdDate: new Date("2025-02-14T23:50:00"),
    img: "/images/delete.png",
    type: "security",
  },
];

const getActivityIcon = (type: string, content: string) => {
  if (content.toLowerCase().includes("logged in")) return { icon: LogIn, color: "bg-blue-100 text-blue-600" };
  if (content.toLowerCase().includes("logged out")) return { icon: LogOut, color: "bg-blue-100 text-blue-600" };
  if (content.toLowerCase().includes("deleted")) return { icon: Trash, color: "bg-red-100 text-red-600" };
  if (content.toLowerCase().includes("password")) return { icon: Lock, color: "bg-yellow-100 text-yellow-600" };
  if (content.toLowerCase().includes("uploaded")) return { icon: ImageIcon, color: "bg-purple-100 text-purple-600" };
  if (content.toLowerCase().includes("comment")) return { icon: MessageSquare, color: "bg-green-100 text-green-600" };
  if (content.toLowerCase().includes("friend request sent")) return { icon: UserPlus, color: "bg-indigo-100 text-indigo-600" };
  if (content.toLowerCase().includes("friend request accepted")) return { icon: UserCheck, color: "bg-indigo-100 text-indigo-600" };
  
  switch (type) {
    case "auth":
      return { icon: LogIn, color: "bg-blue-100 text-blue-600" };
    case "update":
      return { icon: PenSquare, color: "bg-green-100 text-green-600" };
    case "post":
      return { icon: FileText, color: "bg-orange-100 text-orange-600" };
    case "security":
      return { icon: Lock, color: "bg-yellow-100 text-yellow-600" };
    case "social":
      return { icon: UserPlus, color: "bg-indigo-100 text-indigo-600" };
    case "media":
      return { icon: ImageIcon, color: "bg-purple-100 text-purple-600" };
    default:
      return { icon: Clock, color: "bg-gray-100 text-gray-600" };
  }
};

const groupActivitiesByDate = (activities: ActivityLog[]) => {
  return activities.reduce((groups: { [key: string]: ActivityLog[] }, activity) => {
    const date = activity.createdDate.toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});
};

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const currentUser = users.find(user => user.id === resolvedParams.userId);

  const StatCard = ({ icon: Icon, title, value, className = "" }: StatCardProps) => (
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

  const groupedActivities = groupActivitiesByDate(activityLogs);
  const sortedDates = Object.keys(groupedActivities).sort((a, b) => b.localeCompare(a));

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
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{currentUser?.fullname || 'Người dùng không tồn tại'}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>{currentUser?.email}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Tham gia từ: {currentUser?.joinDate}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          icon={BookOpen} 
          title="Tổng số bài học" 
          value={userStats.totalLessons}
          className="bg-blue-100 text-blue-600"
        />
        <StatCard 
          icon={Trophy} 
          title="Số ngày liên tiếp" 
          value={userStats.streakDays}
          className="bg-amber-100 text-amber-600"
        />
        <StatCard 
          icon={Clock} 
          title="Tổng thời gian học" 
          value={userStats.totalStudyTime}
          className="bg-green-100 text-green-600"
        />
      </div>

      {/* Progress Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Tiến độ tháng này</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {userStats.monthlyProgress}
          </div>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: userStats.monthlyProgress }}
          />
        </div>
      </Card>

      {/* Activity Timeline */}
      <div className="space-y-6">
        {sortedDates.map(date => (
          <div key={date} className="rounded-lg bg-card p-4">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b flex items-center gap-2">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              {new Date(date).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <div className="space-y-4">
              {groupedActivities[date]
                .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
                .map((activity, index) => {
                  const { icon: ActivityIcon, color } = getActivityIcon(activity.type, activity.content);
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${color}`}>
                        <ActivityIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.content}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.createdDate.toLocaleTimeString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}