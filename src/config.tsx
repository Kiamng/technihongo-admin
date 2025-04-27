import {
  CreditCardIcon,
  GraduationCap,
  LandPlot,
  LayoutDashboard,
  LucideAlbum,
  MessageSquareWarning,
  Mic,
  MonitorCog,
  Target,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const size: number = 24;

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

  if (session?.user.role === "Administrator") {
    return [
      {
        name: "Thống kê",
        href: "/dashboard",
        icon: <LayoutDashboard size={size} />,
        active: isNavItemActive(pathname, "/dashboard"),
        position: "top",
      },
      {
        name: "Quản lí người dùng",
        href: "/user-management",
        icon: <User size={size} />,
        active: isNavItemActive(pathname, "/user-management"),
        position: "top",
      },

      {
        name: "Báo cáo vi phạm",
        href: "/violation-management",
        icon: < MessageSquareWarning size={size} />,
        active: isNavItemActive(pathname, "/violation-management"),
        position: "top",
      },
      {
        name: "Thành tựu",
        href: "/achievement-management",
        icon: <LucideAlbum size={size} />,
        active: isNavItemActive(pathname, "/achievement-management"),
        position: "top",
      },
      {
        name: "Quản lí gói",
        href: "/supscription-management",
        icon: <CreditCardIcon size={size} />,
        active: isNavItemActive(pathname, "/supscription-management"),
        position: "top",
      },


    ];
  }

  if (session?.user.role === "Content Manager") {
    return [
      {
        name: "Khóa học",
        href: "/course-management",
        icon: < GraduationCap size={size} />,
        active: isNavItemActive(pathname, "/course-management"),
        position: "top",
      },
      {
        name: "Lộ trình học tập",
        href: "/learning-path",
        icon: <LandPlot size={size} />,
        active: isNavItemActive(pathname, "/learning-path"),
        position: "top",
      },
      {
        name: "Độ khó",
        href: "/difficultylevel-management",
        icon: <Target size={size} />,
        active: isNavItemActive(pathname, "/difficultylevel-management"),
        position: "top",
      },
      {
        name: "Lĩnh vực",
        href: "/system-configuration",
        icon: <MonitorCog size={size} />,
        active: isNavItemActive(pathname, "/system-configuration"),
        position: "top",
      },
      {
        name: "Hội thoại",
        href: "/meeting-management",
        icon: < Mic size={size} />,
        active: isNavItemActive(pathname, "/meeting-management"),
        position: "top",
      },
    ]
  }
};
