import {
  GraduationCap,
  LayoutDashboard,
  LucideAlbum
  MessageSquareWarning,
  MonitorCog,
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
        name: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard size={size} />,
        active: isNavItemActive(pathname, "/dashboard"),
        position: "top",
      },
      {
        name: "User management",
        href: "/user-management",
        icon: <User size={size} />,
        active: isNavItemActive(pathname, "/user-management"),
        position: "top",
      },
      {
        name: "System Configuration",
        href: "/system-configuration",
        icon: <MonitorCog size={size} />,
        active: isNavItemActive(pathname, "/system-configuration"),
        position: "top",
      },
      {
        name: "Violation Management",
        href: "/violation-management",
        icon: < MessageSquareWarning size={size} />,
        active: isNavItemActive(pathname, "/violation-management"),
        position: "top",
      },

      {
        name: "Learning Path Management",
        href: "/learning-path",
        icon: <GraduationCap size={size} />,
        active: isNavItemActive(pathname, "/learning-path"),
        position: "top",
      },
      
    {
      name: "Achievement Management",
      href: "/achievement-management",
      icon: <LucideAlbum size={size} />,
      active: isNavItemActive(pathname, "/achievement-management"),
      position: "top",
    },

    ];
  }

  if (session?.user.role === "Content Manager") {
    return [
      {
        name: "Course Management",
        href: "/course-management",
        icon: < GraduationCap size={size} />,
        active: isNavItemActive(pathname, "/course-management"),
        position: "top",
      },]
  }
};
