import Link from "next/link";

import {
  CalendarHeart,
  CheckCircle2,
  Users,
  Wallet,
  ShoppingBag,
  Store,
  ArrowRight,
  Clock3,
  AlertCircle,
  Plus,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type EventData = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  event_date: string | null;
  event_type: string | null;
  completion_pct: number;
};

type TaskData = {
  id: string;
  title: string;
  status: string | null;
  completion_pct: number | null;
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
  purchased: boolean | null;
};

type BudgetData = {
  id: string;
  name: string;
  estimated_amount: number | null;
  actual_amount: number | null;
  paid: boolean | null;
};

type VendorData = {
  id: string;
  name: string;
  category: string | null;
  total_amount: number | null;
  advance_paid: number | null;
};

interface DashboardProps {
  searchParams: Promise<{
    event?: string;
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardProps) {
  const params = await searchParams;

  const selectedEventId =
    params.event || "";

  const supabase =
    (await createClient()) as any;

  /* -------------------------------------------------
     EVENTS
  ------------------------------------------------- */

  const { data: rawEvents } =
    await supabase
      .from("events")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  const allEvents: EventData[] = (
    rawEvents ?? []
  ).map((event: any) => ({
    id: String(event.id),

    name: String(
      event.name || "Your Wedding"
    ),

    slug:
      event.slug ?? null,

    description:
      event.description ?? null,

    event_date:
      event.event_date ?? null,

    event_type:
      event.event_type ?? null,

    completion_pct: Number(
      event.completion_pct ?? 0
    ),
  }));

  /* -------------------------------------------------
     SELECT EVENT
  ------------------------------------------------- */

  const selectedEvent =
    allEvents.find(
      (event) =>
        event.id === selectedEventId
    ) || allEvents[0] || null;

  const eventId =
    selectedEvent?.id || "";

  /* -------------------------------------------------
     EMPTY STATE
  ------------------------------------------------- */

  if (!selectedEvent) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Everything you need to keep your
            wedding planning on track.
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
              Start by creating your wedding event.
              You can then manage tasks, guests,
              budget, vendors and shopping.
            </p>

            <Link
              href="/dashboard/events"
              className="mt-6"
            >
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------------------------------------------------
     LOAD EVENT DATA
  ------------------------------------------------- */

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

  /* -------------------------------------------------
     NORMALIZE DATA
  ------------------------------------------------- */

  const tasks: TaskData[] = (
    tasksResult.data ?? []
  ).map((task: any) => ({
    id: String(task.id),

    title: String(
      task.title || "Untitled Task"
    ),

    status:
      task.status ?? "not_started",

    completion_pct: Number(
      task.completion_pct ?? 0
    ),

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

    estimated_amount:
      item.estimated_amount == null
        ? 0
        : Number(
            item.estimated_amount
          ),

    actual_amount:
      item.actual_amount == null
        ? 0
        : Number(
            item.actual_amount
          ),

    paid: Boolean(item.paid),
  }));

  const vendors: VendorData[] = (
    vendorsResult.data ?? []
  ).map((vendor: any) => ({
    id: String(vendor.id),

    name: String(
      vendor.name || "Vendor"
    ),

    category:
      vendor.category ?? null,

    total_amount:
      vendor.total_amount == null
        ? 0
        : Number(
            vendor.total_amount
          ),

    advance_paid:
      vendor.advance_paid == null
        ? 0
        : Number(
            vendor.advance_paid
          ),
  }));

  /* -------------------------------------------------
     TASK CALCULATIONS
  ------------------------------------------------- */

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
          "completed" ||
        Number(
          task.completion_pct || 0
        ) >= 100
    ).length;

  const taskProgress =
    tasks.length > 0
      ? Math.round(
          tasks.reduce(
            (total, task) =>
              total +
              Number(
                task.completion_pct || 0
              ),
            0
          ) / tasks.length
        )
      : 0;

  /* -------------------------------------------------
     GUEST CALCULATIONS
  ------------------------------------------------- */

  const acceptedGuests =
    guests.filter(
      (guest) =>
        normalizeRsvp(
          guest.rsvp_status
        ) === "accepted"
    ).length;

  const pendingGuests =
    guests.filter(
      (guest) =>
        normalizeRsvp(
          guest.rsvp_status
        ) === "pending"
    ).length;

  const declinedGuests =
    guests.filter(
      (guest) =>
        normalizeRsvp(
          guest.rsvp_status
        ) === "declined"
    ).length;

  const guestProgress =
    guests.length > 0
      ? Math.round(
          (acceptedGuests /
            guests.length) *
            100
        )
      : 0;

  /* -------------------------------------------------
     SHOPPING CALCULATIONS
  ------------------------------------------------- */

  const purchasedItems =
    shopping.filter(
      (item) =>
        item.purchased
    ).length;

  const shoppingProgress =
    shopping.length > 0
      ? Math.round(
          (purchasedItems /
            shopping.length) *
            100
        )
      : 0;

  /* -------------------------------------------------
     BUDGET CALCULATIONS
  ------------------------------------------------- */

  const estimatedBudget =
    budget.reduce(
      (total, item) =>
        total +
        Number(
          item.estimated_amount || 0
        ),
      0
    );

  const actualBudget =
    budget.reduce(
      (total, item) =>
        total +
        Number(
          item.actual_amount || 0
        ),
      0
    );

  const paidBudget =
    budget
      .filter(
        (item) => item.paid
      )
      .reduce(
        (total, item) =>
          total +
          Number(
            item.actual_amount || 0
          ),
        0
      );

  const budgetProgress =
    estimatedBudget > 0
      ? Math.min(
          100,
          Math.round(
            (actualBudget /
              estimatedBudget) *
              100
          )
        )
      : 0;

  /* -------------------------------------------------
     VENDOR CALCULATIONS
  ------------------------------------------------- */

  const vendorTotal =
    vendors.reduce(
      (total, vendor) =>
        total +
        Number(
          vendor.total_amount || 0
        ),
      0
    );

  const vendorAdvance =
    vendors.reduce(
      (total, vendor) =>
        total +
        Number(
          vendor.advance_paid || 0
        ),
      0
    );

  const vendorRemaining =
    Math.max(
      0,
      vendorTotal -
        vendorAdvance
    );

  /* -------------------------------------------------
     OVERALL PROGRESS
  ------------------------------------------------- */

  const overallProgress =
    Math.round(
      (taskProgress +
        guestProgress +
        shoppingProgress) /
        3
    );

  /* -------------------------------------------------
     DATE / COUNTDOWN
  ------------------------------------------------- */

  const weddingDate =
    selectedEvent.event_date;

  const daysUntil =
    weddingDate
      ? Math.ceil(
          (new Date(
            weddingDate
          ).getTime() -
            new Date().getTime()) /
            (1000 *
              60 *
              60 *
              24)
        )
      : null;

  /* -------------------------------------------------
     UPCOMING TASKS
  ------------------------------------------------- */

  const upcomingTasks =
    [...tasks]
      .filter(
        (task) =>
          task.status !==
            "completed" &&
          task.due_date
      )
      .sort(
        (a, b) =>
          new Date(
            a.due_date as string
          ).getTime() -
          new Date(
            b.due_date as string
          ).getTime()
      )
      .slice(0, 5);

  /* -------------------------------------------------
     OVERDUE TASKS
  ------------------------------------------------- */

  const now =
    new Date();

  const overdueTasks =
    tasks.filter(
      (task) =>
        task.status !==
          "completed" &&
        task.due_date &&
        new Date(
          task.due_date
        ) < now
    );

  /* -------------------------------------------------
     FORMAT DATE
  ------------------------------------------------- */

  const formattedWeddingDate =
    weddingDate
      ? new Date(
          weddingDate
        ).toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        )
      : "Date not set";

  /* -------------------------------------------------
     RENDER
  ------------------------------------------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-muted-foreground">
            Everything you need to keep your
            wedding planning on track.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/events">
            <Button
              variant="outline"
            >
              Manage Events
            </Button>
          </Link>

          <Link
            href={`/dashboard/tasks?event=${eventId}`}
          >
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </Link>
        </div>
      </div>

      {/* EVENT SELECTOR */}

      <Card>
        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Current Event
            </p>

            <h2 className="mt-1 font-display text-2xl font-bold">
              {selectedEvent.name}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {formattedWeddingDate}
            </p>
          </div>

          {allEvents.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {allEvents.map(
                (event) => (
                  <Link
                    key={event.id}
                    href={`/dashboard?event=${event.id}`}
                  >
                    <Button
                      variant={
                        event.id ===
                        eventId
                          ? "default"
                          : "outline"
                      }
                      className={
                        event.id ===
                        eventId
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : ""
                      }
                    >
                      {event.name}
                    </Button>
                  </Link>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* COUNTDOWN */}

      <Card>
        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
              <CalendarHeart className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                {formattedWeddingDate}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {daysUntil === null
                  ? "Set your wedding date"
                  : daysUntil > 0
                  ? `${daysUntil} days until the celebration`
                  : daysUntil === 0
                  ? "Today is the celebration!"
                  : `${Math.abs(
                      daysUntil
                    )} days since the celebration`}
              </h2>
            </div>
          </div>

          <CalendarDays className="hidden h-10 w-10 text-emerald-600 md:block" />
        </CardContent>
      </Card>

      {/* OVERALL PROGRESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />

                <h2 className="font-display text-2xl font-bold">
                  Overall Planning Progress
                </h2>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Based on tasks, shopping and guest
                RSVP progress.
              </p>
            </div>

            <span className="text-4xl font-bold text-emerald-600">
              {overallProgress}%
            </span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* STAT CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          title="Tasks"
          value={`${completedTasks}/${tasks.length}`}
          description={`${taskProgress}% complete`}
          icon={
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          }
          href={`/dashboard/tasks?event=${eventId}`}
        />

        <DashboardStat
          title="Guests"
          value={guests.length}
          description={`${acceptedGuests} accepted`}
          icon={
            <Users className="h-5 w-5 text-emerald-600" />
          }
          href={`/dashboard/guests?event=${eventId}`}
        />

        <DashboardStat
          title="Budget"
          value={formatCurrency(
            estimatedBudget
          )}
          description={`${formatCurrency(
            actualBudget
          )} spent`}
          icon={
            <Wallet className="h-5 w-5 text-emerald-600" />
          }
          href={`/dashboard/budget?event=${eventId}`}
        />

        <DashboardStat
          title="Shopping"
          value={`${purchasedItems}/${shopping.length}`}
          description={`${shoppingProgress}% purchased`}
          icon={
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
          }
          href={`/dashboard/shopping?event=${eventId}`}
        />
      </div>

      {/* PROGRESS CARDS */}

      <div className="grid gap-6 lg:grid-cols-3">
        <ProgressCard
          title="Tasks"
          percentage={taskProgress}
          completed={completedTasks}
          total={tasks.length}
          href={`/dashboard/tasks?event=${eventId}`}
        />

        <ProgressCard
          title="Guest RSVPs"
          percentage={guestProgress}
          completed={acceptedGuests}
          total={guests.length}
          href={`/dashboard/guests?event=${eventId}`}
        />

        <ProgressCard
          title="Shopping"
          percentage={shoppingProgress}
          completed={purchasedItems}
          total={shopping.length}
          href={`/dashboard/shopping?event=${eventId}`}
        />
      </div>

      {/* BUDGET + VENDORS */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Budget
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Wedding expense overview
                </p>
              </div>

              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <InfoBox
                label="Estimated"
                value={formatCurrency(
                  estimatedBudget
                )}
              />

              <InfoBox
                label="Actual"
                value={formatCurrency(
                  actualBudget
                )}
              />

              <InfoBox
                label="Paid"
                value={formatCurrency(
                  paidBudget
                )}
              />

              <InfoBox
                label="Remaining"
                value={formatCurrency(
                  Math.max(
                    0,
                    estimatedBudget -
                      actualBudget
                  )
                )}
              />
            </div>

            <Link
              href={`/dashboard/budget?event=${eventId}`}
              className="mt-5 flex items-center justify-between text-sm font-medium text-emerald-600 hover:underline"
            >
              Manage Budget
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Vendors
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Vendor and payment overview
                </p>
              </div>

              <Store className="h-6 w-6 text-emerald-600" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <InfoBox
                label="Vendors"
                value={String(
                  vendors.length
                )}
              />

              <InfoBox
                label="Total Cost"
                value={formatCurrency(
                  vendorTotal
                )}
              />

              <InfoBox
                label="Advance Paid"
                value={formatCurrency(
                  vendorAdvance
                )}
              />

              <InfoBox
                label="Remaining"
                value={formatCurrency(
                  vendorRemaining
                )}
              />
            </div>

            <Link
              href={`/dashboard/vendors?event=${eventId}`}
              className="mt-5 flex items-center justify-between text-sm font-medium text-emerald-600 hover:underline"
            >
              Manage Vendors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* UPCOMING TASKS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Upcoming Tasks
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Tasks that need your attention
              </p>
            </div>

            <Link
              href={`/dashboard/tasks?event=${eventId}`}
            >
              <Button
                variant="ghost"
                size="sm"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {upcomingTasks.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />

                <p className="mt-2 text-sm font-medium">
                  No upcoming tasks
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your schedule is clear.
                </p>
              </div>
            ) : (
              upcomingTasks.map(
                (task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {task.title}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="h-3.5 w-3.5" />

                        {formatDate(
                          task.due_date
                        )}
                      </p>
                    </div>

                    <span className="ml-4 text-sm font-medium text-emerald-600">
                      {Number(
                        task.completion_pct ||
                          0
                      )}
                      %
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* NEEDS ATTENTION */}

      {(overdueTasks.length > 0 ||
        pendingGuests > 0) && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />

              <h2 className="text-xl font-bold">
                Needs Attention
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {overdueTasks.length >
                0 && (
                <AttentionItem
                  title={`${overdueTasks.length} overdue ${
                    overdueTasks.length ===
                    1
                      ? "task"
                      : "tasks"
                  }`}
                  description="Review and update your overdue tasks."
                  href={`/dashboard/tasks?event=${eventId}`}
                />
              )}

              {pendingGuests >
                0 && (
                <AttentionItem
                  title={`${pendingGuests} guest${
                    pendingGuests === 1
                      ? ""
                      : "s"
                  } awaiting RSVP`}
                  description="Follow up with guests who haven't responded."
                  href={`/dashboard/guests?event=${eventId}`}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* QUICK ACTIONS */}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              label="Tasks"
              href={`/dashboard/tasks?event=${eventId}`}
              icon={
                <CheckCircle2 className="h-5 w-5" />
              }
            />

            <QuickAction
              label="Guests"
              href={`/dashboard/guests?event=${eventId}`}
              icon={
                <Users className="h-5 w-5" />
              }
            />

            <QuickAction
              label="Budget"
              href={`/dashboard/budget?event=${eventId}`}
              icon={
                <Wallet className="h-5 w-5" />
              }
            />

            <QuickAction
              label="Vendors"
              href={`/dashboard/vendors?event=${eventId}`}
              icon={
                <Store className="h-5 w-5" />
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* -------------------------------------------------
   DASHBOARD STAT
------------------------------------------------- */

function DashboardStat({
  title,
  value,
  description,
  icon,
  href,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              {icon}
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
    </Link>
  );
}

/* -------------------------------------------------
   PROGRESS CARD
------------------------------------------------- */

function ProgressCard({
  title,
  percentage,
  completed,
  total,
  href,
}: {
  title: string;
  percentage: number;
  completed: number;
  total: number;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {title}
            </h3>

            <span className="text-lg font-bold text-emerald-600">
              {percentage}%
            </span>
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    percentage
                  )
                )}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            {completed} of {total} completed
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

/* -------------------------------------------------
   INFO BOX
------------------------------------------------- */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-4">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------
   ATTENTION ITEM
------------------------------------------------- */

function AttentionItem({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50"
    >
      <div>
        <p className="font-medium">
          {title}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}

/* -------------------------------------------------
   QUICK ACTION
------------------------------------------------- */

function QuickAction({
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

/* -------------------------------------------------
   RSVP NORMALIZER
------------------------------------------------- */

function normalizeRsvp(
  status: string | null
) {
  const value =
    String(status || "pending")
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

/* -------------------------------------------------
   CURRENCY
------------------------------------------------- */

function formatCurrency(
  amount: number
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(amount || 0);
}

/* -------------------------------------------------
   DATE
------------------------------------------------- */

function formatDate(
  date: string | null
) {
  if (!date) {
    return "No due date";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "No due date";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}