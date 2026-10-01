"use client";

import { useState } from "react";
import Link from "next/link";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  Menu,
  X,
  LayoutDashboard,
  CalendarHeart,
  CheckSquare,
  ShoppingBag,
  Wallet,
  Users,
  Store,
  BarChart3,
  Bell,
  Settings,
  Heart,
} from "lucide-react";

import { cn } from "@/lib/utils";

import {
  useNotificationCount,
} from "@/components/layout/notification-badge";

const iconMap = {
  LayoutDashboard,
  CalendarHeart,
  CheckSquare,
  ShoppingBag,
  Wallet,
  Users,
  Store,
  BarChart3,
  Bell,
  Settings,
};

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/events",
    label: "Events",
    icon: "CalendarHeart" as const,
    eventAware: false,
  },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: "CheckSquare" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/shopping",
    label: "Shopping",
    icon: "ShoppingBag" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/budget",
    label: "Budget",
    icon: "Wallet" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/guests",
    label: "Guests",
    icon: "Users" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/vendors",
    label: "Vendors",
    icon: "Store" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: "BarChart3" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: "Bell" as const,
    eventAware: true,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "Settings" as const,
    eventAware: false,
  },
];

export function MobileNav() {
  const [isOpen, setIsOpen] =
    useState(false);

  const pathname = usePathname();

  const searchParams =
    useSearchParams();

  const eventId =
    searchParams.get("event");

  /*
   * Real notification count
   */
  const {
    count: notificationCount,
  } = useNotificationCount();

  function closeMenu() {
    setIsOpen(false);
  }

  function getHref(
    item: (typeof navItems)[number]
  ) {
    if (
      item.eventAware &&
      eventId
    ) {
      return `${item.href}?event=${encodeURIComponent(
        eventId
      )}`;
    }

    return item.href;
  }

  return (
    <>
      {/* =========================================
          MOBILE MENU BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-foreground transition hover:bg-muted active:scale-95 lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* =========================================
          MOBILE MENU
      ========================================== */}

      {isOpen && (
        <>
          {/* =====================================
              DARK OVERLAY
          ====================================== */}

          <div
            className="fixed inset-0 z-[9990] bg-black/60 lg:hidden"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* =====================================
              DRAWER
          ====================================== */}

          <aside
            className="fixed left-0 top-0 z-[9999] h-screen w-[300px] max-w-[85vw] overflow-hidden border-r border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-gray-800 dark:bg-gray-950 dark:text-white lg:hidden"
          >
            {/* =================================
                HEADER
            ================================== */}

            <div className="absolute left-0 right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-emerald-gold">
                  <Heart
                    className="h-5 w-5 text-white"
                    fill="white"
                  />
                </div>

                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold leading-tight">
                    Ashhar&apos;s Wedding
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Planner
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* =================================
                NAVIGATION
            ================================== */}

            <div className="absolute bottom-16 left-0 right-0 top-16 overflow-y-auto bg-white px-3 py-4 dark:bg-gray-950">
              <div className="space-y-1">
                {navItems.map(
                  (item) => {
                    const Icon =
                      iconMap[item.icon];

                    const isActive =
                      pathname ===
                        item.href ||
                      (item.href !==
                        "/dashboard" &&
                        pathname.startsWith(
                          item.href
                        ));

                    return (
                      <Link
                        key={item.href}
                        href={getHref(item)}
                        onClick={
                          closeMenu
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                          isActive
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                        )}
                      >
                        {/* Icon */}

                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            isActive
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        {/* Label */}

                        <span className="flex-1 text-left">
                          {item.label}
                        </span>

                        {/* Real Notification Count */}

                        {item.href ===
                          "/dashboard/notifications" &&
                          notificationCount >
                            0 && (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                              {notificationCount >
                              99
                                ? "99+"
                                : notificationCount}
                            </span>
                          )}
                      </Link>
                    );
                  }
                )}
              </div>
            </div>

            {/* =================================
                FOOTER
            ================================== */}

            <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
              <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                Ashhar&apos;s Wedding
                Planner
              </p>
            </div>
          </aside>
        </>
      )}
    </>
  );
}

export { navItems };