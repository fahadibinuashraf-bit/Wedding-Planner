export const WEDDING_DATE = new Date("2026-11-08T00:00:00");
export const PLANNING_START_DATE = new Date("2025-01-01T00:00:00");
export const APP_NAME = "Mohammed Ashhar's Wedding Planner";
export const GROOM_NAME = "Mohammed Ashhar";

export type UrgencyLevel =
  | "overdue"
  | "critical"
  | "urgent"
  | "upcoming"
  | "can_wait";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isPast: boolean;
}

export function getCountdown(targetDate: Date = WEDDING_DATE): Countdown {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const isPast = diff <= 0;
  const absDiff = Math.abs(diff);

  return {
    days: Math.floor(absDiff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((absDiff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((absDiff / (1000 * 60)) % 60),
    seconds: Math.floor((absDiff / 1000) % 60),
    totalMs: diff,
    isPast,
  };
}

export function getWeeksRemaining(targetDate: Date = WEDDING_DATE): number {
  const countdown = getCountdown(targetDate);
  return Math.ceil(countdown.days / 7);
}

export function getPlanningProgress(
  startDate: Date = PLANNING_START_DATE,
  endDate: Date = WEDDING_DATE
): number {
  const total = endDate.getTime() - startDate.getTime();
  const elapsed = Date.now() - startDate.getTime();
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export function getUrgency(dueDate: Date | string | null): {
  level: UrgencyLevel;
  label: string;
  colorClass: string;
  bgClass: string;
} {
  if (!dueDate) {
    return {
      level: "can_wait",
      label: "Can Wait",
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-100 dark:bg-emerald-950",
    };
  }

  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  const daysLeft = (due.getTime() - Date.now()) / (1000 * 60 * 60 * 24);

  if (daysLeft < 0) {
    return {
      level: "overdue",
      label: "Overdue",
      colorClass: "text-red-600",
      bgClass: "bg-red-100 dark:bg-red-950",
    };
  }
  if (daysLeft <= 2) {
    return {
      level: "critical",
      label: "Critical",
      colorClass: "text-red-600",
      bgClass: "bg-red-100 dark:bg-red-950",
    };
  }
  if (daysLeft <= 7) {
    return {
      level: "urgent",
      label: "Urgent",
      colorClass: "text-orange-600",
      bgClass: "bg-orange-100 dark:bg-orange-950",
    };
  }
  if (daysLeft <= 14) {
    return {
      level: "upcoming",
      label: "Upcoming",
      colorClass: "text-yellow-600",
      bgClass: "bg-yellow-100 dark:bg-yellow-950",
    };
  }
  return {
    level: "can_wait",
    label: "Can Wait",
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-100 dark:bg-emerald-950",
  };
}

export const EVENT_GRADIENTS: Record<string, string> = {
  mehendi: "bg-gradient-mehendi",
  haldi: "bg-gradient-haldi",
  nikah: "bg-gradient-nikah",
  reception: "bg-gradient-reception",
  destination: "bg-gradient-destination",
  default: "bg-gradient-emerald-gold",
};

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/events", label: "Events", icon: "CalendarHeart" },
  { href: "/dashboard/tasks", label: "Tasks", icon: "CheckSquare" },
  { href: "/dashboard/shopping", label: "Shopping", icon: "ShoppingBag" },
  { href: "/dashboard/budget", label: "Budget", icon: "Wallet" },
  { href: "/dashboard/guests", label: "Guests", icon: "Users" },
  { href: "/dashboard/vendors", label: "Vendors", icon: "Store" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
