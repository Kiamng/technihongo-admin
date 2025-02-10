import {
  LayoutDashboard,
  MonitorCog,
  SquareChartGantt,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const NavItems = () => {
  const pathname = usePathname();
  const size: number = 24;

  function isNavItemActive(pathname: string, nav: string) {
    return pathname.includes(nav);
  }

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
      name: "Subscription management",
      href: "/subscription-management",
      icon: <SquareChartGantt size={size} />,
      active: isNavItemActive(pathname, "/subscription-management"),
      position: "top",
    },
    {
      name: "System Configuration",
      href: "/system-configuration",
      icon: <MonitorCog size={size} />,
      active: isNavItemActive(pathname, "/system-configuration"),
      position: "top",
    },
  ];
};
