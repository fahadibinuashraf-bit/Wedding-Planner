import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Wallet,
  Store,
  ShoppingBag,
  Users,
  CalendarHeart,
  ArrowRight,
  CircleDollarSign,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type EventData = {
  id: string;
  name: string;
  event_date: string | null;
};

type TaskData = {
  id: string;
  title: string;
  status: string | null;
  due_date: string | null;
};

type GuestData = {
  id: string;
  name: string;
  rsvp_status: string | null;
};

type ShoppingData = {
  id: string;
  name: string;
  price: number;
  paid: number;
  purchased: boolean;
};

type BudgetData = {
  id: string;
  name: string;
  actual_amount: number;
  paid: boolean;
};

type VendorData = {
  id: string;
  name: string;
  total_amount: number;
  advance_paid: number;
};

type NotificationItem = {
  id: string;
  type:
    | "urgent"
    | "warning"
    | "info"
    | "success";
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
};

interface NotificationsPageProps {
  searchParams: Promise<{
    event?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const params = await searchParams;
  const selectedEventId = params.event || "";

  const supabase = (await createClient()) as any;

  /*
   * -------------------------------------------------
   * EVENTS
   * -------------------------------------------------
   */

  const { data: rawEvents } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const events: EventData[] = (rawEvents ?? []).map(
    (event: any) => ({
      id: String(event.id),
      name: String(
        event.name || "Your Wedding"
      ),
      event_date:
        event.event_date ?? null,
    })
  );

  const selectedEvent =
    events.find(
      (event) =>
        event.id === selectedEventId
    ) ||
    events[0] ||
    null;

  /*
   * -------------------------------------------------
   * EMPTY STATE
   * -------------------------------------------------
   */

  if (!selectedEvent) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Notifications
          </h1>

          <p className="mt-2 text-muted-foreground">
            Important reminders and things that
            need your attention.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <CalendarHeart className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Create your first event
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Create a wedding event first. Your
              notifications will automatically appear
              here.
            </p>

            <Link
              href="/dashboard/events"
              className="mt-6"
            >
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Manage Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const eventId = selectedEvent.id;

  /*
   * -------------------------------------------------
   * LOAD EVENT DATA
   * -------------------------------------------------
   */

  const [
    tasksResult,
    guestsResult,
    shoppingResult,
    budgetResult,
    vendorsResult,
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("event_id", eventId),

    supabase
      .from("guests")
      .select("*")
      .eq("event_id", eventId),

    supabase
      .from("shopping_items")
      .select("*")
      .eq("event_id", eventId),

    supabase
      .from("budget_items")
      .select("*")
      .eq("event_id", eventId),

    supabase
      .from("vendors")
      .select("*")
      .eq("event_id", eventId),
  ]);

  /*
   * -------------------------------------------------
   * NORMALIZE DATA
   * -------------------------------------------------
   */

  const tasks: TaskData[] = (
    tasksResult.data ?? []
  ).map((task: any) => ({
    id: String(task.id),
    title: String(
      task.title || "Untitled Task"
    ),
    status:
      task.status ?? "not_started",
    due_date:
      task.due_date ?? null,
  }));

  const guests: GuestData[] = (
    guestsResult.data ?? []
  ).map((guest: any) => ({
    id: String(guest.id),
    name: String(
      guest.name || "Guest"
    ),
    rsvp_status:
      guest.rsvp_status ?? "pending",
  }));

  const shopping: ShoppingData[] = (
    shoppingResult.data ?? []
  ).map((item: any) => ({
    id: String(item.id),
    name: String(
      item.name || "Shopping Item"
    ),
    price:
      item.price == null
        ? 0
        : Number(item.price),
    paid:
      item.paid == null
        ? 0
        : Number(item.paid),
    purchased: Boolean(
      item.purchased
    ),
  }));

  const budget: BudgetData[] = (
    budgetResult.data ?? []
  ).map((item: any) => ({
    id: String(item.id),
    name: String(
      item.name || "Expense"
    ),
    actual_amount:
      item.actual_amount == null
        ? 0
        : Number(item.actual_amount),
    paid: Boolean(item.paid),
  }));

  const vendors: VendorData[] = (
    vendorsResult.data ?? []
  ).map((vendor: any) => ({
    id: String(vendor.id),
    name: String(
      vendor.name || "Vendor"
    ),
    total_amount:
      vendor.total_amount == null
        ? 0
        : Number(vendor.total_amount),
    advance_paid:
      vendor.advance_paid == null
        ? 0
        : Number(vendor.advance_paid),
  }));

  /*
   * -------------------------------------------------
   * DATE HELPERS
   * -------------------------------------------------
   */

  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  /*
   * -------------------------------------------------
   * TASK NOTIFICATIONS
   * -------------------------------------------------
   */

  const overdueTasks = tasks.filter(
    (task) => {
      if (
        task.status === "completed" ||
        !task.due_date
      ) {
        return false;
      }

      return (
        new Date(task.due_date) <
        startOfToday
      );
    }
  );

  const upcomingTasks = tasks
    .filter((task) => {
      if (
        task.status === "completed" ||
        !task.due_date
      ) {
        return false;
      }

      const dueDate = new Date(
        task.due_date
      );

      const difference =
        dueDate.getTime() -
        startOfToday.getTime();

      const days =
        difference /
        (1000 * 60 * 60 * 24);

      return days >= 0 && days <= 7;
    })
    .sort(
      (a, b) =>
        new Date(
          a.due_date as string
        ).getTime() -
        new Date(
          b.due_date as string
        ).getTime()
    );

  /*
   * -------------------------------------------------
   * GUEST NOTIFICATIONS
   * -------------------------------------------------
   */

  const pendingGuests = guests.filter(
    (guest) =>
      normalizeRsvp(
        guest.rsvp_status
      ) === "pending"
  );

  /*
   * -------------------------------------------------
   * BUDGET NOTIFICATIONS
   * -------------------------------------------------
   */

  const pendingBudgetItems =
    budget.filter(
      (item) => !item.paid
    );

  /*
   * -------------------------------------------------
   * VENDOR NOTIFICATIONS
   * -------------------------------------------------
   */

  const unpaidVendors =
    vendors.filter(
      (vendor) =>
        Math.max(
          0,
          vendor.total_amount -
            vendor.advance_paid
        ) > 0
    );

  /*
   * -------------------------------------------------
   * SHOPPING NOTIFICATIONS
   * -------------------------------------------------
   */

  const unpaidShopping =
    shopping.filter(
      (item) =>
        Math.max(
          0,
          item.price - item.paid
        ) > 0
    );

  /*
   * -------------------------------------------------
   * WEDDING COUNTDOWN
   * -------------------------------------------------
   */

  let daysUntilWedding: number | null =
    null;

  if (selectedEvent.event_date) {
    const weddingDate = new Date(
      selectedEvent.event_date
    );

    const difference =
      weddingDate.getTime() -
      startOfToday.getTime();

    daysUntilWedding = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  }

  /*
   * -------------------------------------------------
   * BUILD NOTIFICATIONS
   * -------------------------------------------------
   */

  const notifications: NotificationItem[] =
    [];

  /*
   * OVERDUE TASKS
   */

  if (overdueTasks.length > 0) {
    notifications.push({
      id: "overdue-tasks",
      type: "urgent",
      title: `${overdueTasks.length} overdue ${
        overdueTasks.length === 1
          ? "task"
          : "tasks"
      }`,
      description:
        "These tasks are past their due date and need attention.",
      href: `/dashboard/tasks?event=${eventId}`,
      icon: (
        <AlertCircle className="h-5 w-5" />
      ),
    });
  }

  /*
   * UPCOMING TASKS
   */

  if (upcomingTasks.length > 0) {
    notifications.push({
      id: "upcoming-tasks",
      type: "warning",
      title: `${upcomingTasks.length} ${
        upcomingTasks.length === 1
          ? "task"
          : "tasks"
      } due within 7 days`,
      description:
        "Review your upcoming deadlines before they become overdue.",
      href: `/dashboard/tasks?event=${eventId}`,
      icon: (
        <Clock3 className="h-5 w-5" />
      ),
    });
  }

  /*
   * PENDING RSVPS
   */

  if (pendingGuests.length > 0) {
    notifications.push({
      id: "pending-rsvps",
      type: "warning",
      title: `${pendingGuests.length} guest${
        pendingGuests.length === 1
          ? ""
          : "s"
      } awaiting RSVP`,
      description:
        "Some guests have not responded to their invitation yet.",
      href: `/dashboard/guests?event=${eventId}`,
      icon: (
        <Users className="h-5 w-5" />
      ),
    });
  }

  /*
   * BUDGET PAYMENTS
   */

  if (pendingBudgetItems.length > 0) {
    notifications.push({
      id: "budget-payments",
      type: "warning",
      title: `${pendingBudgetItems.length} budget payment${
        pendingBudgetItems.length === 1
          ? ""
          : "s"
      } pending`,
      description:
        "Some budget expenses are not marked as paid.",
      href: `/dashboard/budget?event=${eventId}`,
      icon: (
        <Wallet className="h-5 w-5" />
      ),
    });
  }

  /*
   * VENDOR PAYMENTS
   */

  if (unpaidVendors.length > 0) {
    notifications.push({
      id: "vendor-payments",
      type: "warning",
      title: `${unpaidVendors.length} vendor${
        unpaidVendors.length === 1
          ? ""
          : "s"
      } have remaining balances`,
      description:
        "Review vendor payments and remaining balances.",
      href: `/dashboard/vendors?event=${eventId}`,
      icon: (
        <Store className="h-5 w-5" />
      ),
    });
  }

  /*
   * SHOPPING PAYMENTS
   */

  if (unpaidShopping.length > 0) {
    notifications.push({
      id: "shopping-payments",
      type: "info",
      title: `${unpaidShopping.length} shopping item${
        unpaidShopping.length === 1
          ? ""
          : "s"
      } have unpaid balances`,
      description:
        "Some shopping items still have money remaining.",
      href: `/dashboard/shopping?event=${eventId}`,
      icon: (
        <ShoppingBag className="h-5 w-5" />
      ),
    });
  }

  /*
   * WEDDING DATE
   */

  if (
    daysUntilWedding !== null &&
    daysUntilWedding >= 0 &&
    daysUntilWedding <= 30
  ) {
    notifications.push({
      id: "wedding-approaching",
      type:
        daysUntilWedding <= 7
          ? "urgent"
          : "info",
      title:
        daysUntilWedding === 0
          ? "Wedding day is today!"
          : `${daysUntilWedding} days until the wedding`,
      description:
        "Your wedding date is approaching. Review your remaining plans.",
      href: `/dashboard?event=${eventId}`,
      icon: (
        <CalendarHeart className="h-5 w-5" />
      ),
    });
  }

  /*
   * -------------------------------------------------
   * SUMMARY
   * -------------------------------------------------
   */

  const urgentCount =
    notifications.filter(
      (item) => item.type === "urgent"
    ).length;

  const warningCount =
    notifications.filter(
      (item) => item.type === "warning"
    ).length;

  const infoCount =
    notifications.filter(
      (item) => item.type === "info"
    ).length;

  /*
   * -------------------------------------------------
   * RENDER
   * -------------------------------------------------
   */

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <div className="mt-1 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Bell className="h-6 w-6" />
            </div>

            <h1 className="font-display text-4xl font-bold">
              Notifications
            </h1>
          </div>

          <p className="mt-2 text-muted-foreground">
            Important reminders and things that
            need your attention for{" "}
            <span className="font-medium text-foreground">
              {selectedEvent.name}
            </span>
            .
          </p>
        </div>

        <Link
          href={`/dashboard?event=${eventId}`}
        >
          <Button variant="outline">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* EVENT SELECTOR */}

      {events.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Current Event
                </p>

                <p className="text-sm text-muted-foreground">
                  {selectedEvent.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/dashboard/notifications?event=${event.id}`}
                  >
                    <Button
                      size="sm"
                      variant={
                        event.id === eventId
                          ? "default"
                          : "outline"
                      }
                      className={
                        event.id === eventId
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : ""
                      }
                    >
                      {event.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Alerts"
          value={notifications.length}
          description={
            notifications.length === 0
              ? "Everything looks clear"
              : "Items needing attention"
          }
          icon={
            <Bell className="h-5 w-5" />
          }
        />

        <SummaryCard
          title="Urgent"
          value={urgentCount}
          description="Requires immediate review"
          icon={
            <AlertCircle className="h-5 w-5" />
          }
        />

        <SummaryCard
          title="Warnings"
          value={warningCount}
          description="Needs attention soon"
          icon={
            <Clock3 className="h-5 w-5" />
          }
        />

        <SummaryCard
          title="Information"
          value={infoCount}
          description="Useful reminders"
          icon={
            <CircleDollarSign className="h-5 w-5" />
          }
        />
      </div>

      {/* NOTIFICATION CENTER */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>
                Notification Center
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Automatically generated from your
                wedding planning data.
              </p>
            </div>

            <Bell className="h-6 w-6 text-emerald-600" />
          </div>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                All clear 🎉
              </h2>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                There are no overdue tasks, pending
                payments, unanswered RSVPs, or other
                important reminders right now.
              </p>

              <Link
                href={`/dashboard?event=${eventId}`}
                className="mt-6"
              >
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  View Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(
                (notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={
                      notification
                    }
                  />
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUICK LINKS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink
          label="Tasks"
          href={`/dashboard/tasks?event=${eventId}`}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
        />

        <QuickLink
          label="Guests"
          href={`/dashboard/guests?event=${eventId}`}
          icon={
            <Users className="h-5 w-5" />
          }
        />

        <QuickLink
          label="Budget"
          href={`/dashboard/budget?event=${eventId}`}
          icon={
            <Wallet className="h-5 w-5" />
          }
        />

        <QuickLink
          label="Shopping"
          href={`/dashboard/shopping?event=${eventId}`}
          icon={
            <ShoppingBag className="h-5 w-5" />
          }
        />
      </div>
    </div>
  );
}

/*
 * -------------------------------------------------
 * SUMMARY CARD
 * -------------------------------------------------
 */

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            {icon}
          </div>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {title}
        </p>

        <p className="mt-1 text-2xl font-bold">
          {value}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

/*
 * -------------------------------------------------
 * NOTIFICATION ROW
 * -------------------------------------------------
 */

function NotificationRow({
  notification,
}: {
  notification: NotificationItem;
}) {
  const styles = {
    urgent: {
      wrapper:
        "border-red-200 bg-red-50/60 hover:bg-red-50",
      icon:
        "bg-red-100 text-red-600",
      badge:
        "bg-red-100 text-red-700",
      label: "Urgent",
    },
    warning: {
      wrapper:
        "border-orange-200 bg-orange-50/50 hover:bg-orange-50",
      icon:
        "bg-orange-100 text-orange-600",
      badge:
        "bg-orange-100 text-orange-700",
      label: "Attention",
    },
    info: {
      wrapper:
        "border-blue-200 bg-blue-50/40 hover:bg-blue-50",
      icon:
        "bg-blue-100 text-blue-600",
      badge:
        "bg-blue-100 text-blue-700",
      label: "Reminder",
    },
    success: {
      wrapper:
        "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50",
      icon:
        "bg-emerald-100 text-emerald-600",
      badge:
        "bg-emerald-100 text-emerald-700",
      label: "Complete",
    },
  } as const;

  const style =
    styles[notification.type];

  return (
    <Link
      href={notification.href}
      className={`flex items-center gap-4 rounded-xl border p-4 transition ${style.wrapper}`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
      >
        {notification.icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold">
            {notification.title}
          </p>

          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${style.badge}`}
          >
            {style.label}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          {notification.description}
        </p>
      </div>

      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  );
}

/*
 * -------------------------------------------------
 * QUICK LINK
 * -------------------------------------------------
 */

function QuickLink({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border p-4 font-medium transition hover:border-emerald-300 hover:bg-emerald-50/50"
    >
      <span className="text-emerald-600">
        {icon}
      </span>

      <span>{label}</span>

      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

/*
 * -------------------------------------------------
 * RSVP NORMALIZER
 * -------------------------------------------------
 */

function normalizeRsvp(
  status: string | null
) {
  const value = String(
    status || "pending"
  )
    .trim()
    .toLowerCase();

  if (
    value === "accepted" ||
    value === "accept" ||
    value === "yes" ||
    value === "confirmed"
  ) {
    return "accepted";
  }

  if (
    value === "declined" ||
    value === "decline" ||
    value === "no"
  ) {
    return "declined";
  }

  return "pending";
}