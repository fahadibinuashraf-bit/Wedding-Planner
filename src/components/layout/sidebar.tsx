"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarHeart,
  CheckSquare,
  ShoppingBag,
  Wallet,
  Users,
  Store,
  BarChart3,
  Settings,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const iconMap = {
  LayoutDashboard,
  CalendarHeart,
  CheckSquare,
  ShoppingBag,
  Wallet,
  Users,
  Store,
  BarChart3,
  Settings,
};

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" as const },
  { href: "/dashboard/events", label: "Events", icon: "CalendarHeart" as const },
  { href: "/dashboard/tasks", label: "Tasks", icon: "CheckSquare" as const },
  { href: "/dashboard/shopping", label: "Shopping", icon: "ShoppingBag" as const },
  { href: "/dashboard/budget", label: "Budget", icon: "Wallet" as const },
  { href: "/dashboard/guests", label: "Guests", icon: "Users" as const },
  { href: "/dashboard/vendors", label: "Vendors", icon: "Store" as const },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" as const },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" as const },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-emerald-gold">
          <Heart className="h-5 w-5 text-white" fill="white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-hidden"
          >
            <p className="truncate font-display text-sm font-semibold leading-tight">
              Ashhar&apos;s Wedding
            </p>
            <p className="truncate text-xs text-muted-foreground">Planner</p>
          </motion.div>
        )}
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald/10 text-emerald-dark dark:text-emerald-light shadow-sm ring-1 ring-emerald/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-emerald")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {onToggle && (
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn("w-full", collapsed && "px-2")}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      )}
    </aside>
  );
}

export { navItems };
