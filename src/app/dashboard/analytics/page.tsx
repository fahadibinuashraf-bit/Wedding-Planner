import { createClient } from "@/lib/supabase/server";
import type { ReactNode } from "react";

import {
  BarChart3,
  CheckCircle2,
  Users,
  Wallet,
  ShoppingBag,
  Store,
  TrendingUp,
  CalendarDays,
  CircleDollarSign,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  searchParams: Promise<{
    event?: string;
  }>;
}

type EventRow = {
  id: string;
  name: string;
};

type TaskRow = {
  id: string;
  event_id: string;
  status?: string | null;
  completion_pct?: number | null;
};

type GuestRow = {
  id: string;
  event_id: string;
  rsvp_status?: string | null;
};

type ShoppingRow = {
  id: string;
  event_id: string;
  price?: number | null;
  paid?: number | null;
  purchased?: boolean | null;
};

type BudgetRow = {
  id: string;
  event_id: string;
  estimated_amount?: number | null;
  actual_amount?: number | null;
  paid?: boolean | null;
  category?: string | null;
};

type VendorRow = {
  id: string;
  event_id: string;
  total_amount?: number | null;
  advance_paid?: number | null;
};

type EventAnalytics = {
  event: EventRow;
  tasks: number;
  completedTasks: number;
  taskProgress: number;
  guests: number;
  acceptedGuests: number;
  respondedGuests: number;
  rsvpProgress: number;
  shoppingItems: number;
  purchasedItems: number;
  shoppingProgress: number;
  shoppingTotal: number;
  shoppingPaid: number;
  shoppingBalance: number;
  estimatedBudget: number;
  actualBudget: number;
  paidBudget: number;
  budgetBalance: number;
  vendors: number;
  vendorTotal: number;
  vendorPaid: number;
  vendorBalance: number;
  totalExpense: number;
  totalPaid: number;
  totalBalance: number;
  overallProgress: number;
};

export const dynamic = "force-dynamic";

const formatCurrency = (value: number) =>
  `₹${Math.round(value || 0).toLocaleString("en-IN")}`;

function percentage(value: number, total: number) {
  return total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
}

function buildEventAnalytics(
  event: EventRow,
  tasks: TaskRow[],
  guests: GuestRow[],
  shopping: ShoppingRow[],
  budget: BudgetRow[],
  vendors: VendorRow[]
): EventAnalytics {
  const eventTasks = tasks.filter((item) => item.event_id === event.id);
  const eventGuests = guests.filter((item) => item.event_id === event.id);
  const eventShopping = shopping.filter((item) => item.event_id === event.id);
  const eventBudget = budget.filter((item) => item.event_id === event.id);
  const eventVendors = vendors.filter((item) => item.event_id === event.id);

  const completedTasks = eventTasks.filter(
    (task) =>
      task.status === "completed" ||
      Number(task.completion_pct || 0) >= 100
  ).length;

  const taskProgress =
    eventTasks.length > 0
      ? Math.round(
          eventTasks.reduce(
            (sum, task) =>
              sum +
              (task.status === "completed"
                ? 100
                : Number(task.completion_pct || 0)),
            0
          ) / eventTasks.length
        )
      : 0;

  const acceptedGuests = eventGuests.filter(
    (guest) => guest.rsvp_status === "Accepted"
  ).length;

  const respondedGuests = eventGuests.filter(
    (guest) =>
      guest.rsvp_status === "Accepted" ||
      guest.rsvp_status === "Declined"
  ).length;

  const rsvpProgress = percentage(
    respondedGuests,
    eventGuests.length
  );

  const purchasedItems = eventShopping.filter(
    (item) => item.purchased === true
  ).length;

  const shoppingProgress = percentage(
    purchasedItems,
    eventShopping.length
  );

  const shoppingTotal = eventShopping.reduce(
    (sum, item) => sum + Number(item.price || 0),
    0
  );

  const shoppingPaid = eventShopping.reduce(
    (sum, item) => sum + Number(item.paid || 0),
    0
  );

  const estimatedBudget = eventBudget.reduce(
    (sum, item) => sum + Number(item.estimated_amount || 0),
    0
  );

  const actualBudget = eventBudget.reduce(
    (sum, item) => sum + Number(item.actual_amount || 0),
    0
  );

  const paidBudget = eventBudget
    .filter((item) => item.paid === true)
    .reduce(
      (sum, item) => sum + Number(item.actual_amount || 0),
      0
    );

  const vendorTotal = eventVendors.reduce(
    (sum, vendor) => sum + Number(vendor.total_amount || 0),
    0
  );

  const vendorPaid = eventVendors.reduce(
    (sum, vendor) => sum + Number(vendor.advance_paid || 0),
    0
  );

  const totalExpense =
    actualBudget + vendorTotal + shoppingTotal;

  const totalPaid =
    paidBudget + vendorPaid + shoppingPaid;

  const totalBalance = Math.max(
    0,
    totalExpense - totalPaid
  );

  const overallProgress =
    Math.round(
      (taskProgress + rsvpProgress + shoppingProgress) / 3
    );

  return {
    event,
    tasks: eventTasks.length,
    completedTasks,
    taskProgress,
    guests: eventGuests.length,
    acceptedGuests,
    respondedGuests,
    rsvpProgress,
    shoppingItems: eventShopping.length,
    purchasedItems,
    shoppingProgress,
    shoppingTotal,
    shoppingPaid,
    shoppingBalance: Math.max(0, shoppingTotal - shoppingPaid),
    estimatedBudget,
    actualBudget,
    paidBudget,
    budgetBalance: Math.max(0, actualBudget - paidBudget),
    vendors: eventVendors.length,
    vendorTotal,
    vendorPaid,
    vendorBalance: Math.max(0, vendorTotal - vendorPaid),
    totalExpense,
    totalPaid,
    totalBalance,
    overallProgress,
  };
}

export default async function AnalyticsPage({
  searchParams,
}: Props) {
  const { event: selectedEventId } = await searchParams;

  const supabase = await createClient();

  const [
    eventsResult,
    tasksResult,
    guestsResult,
    shoppingResult,
    budgetResult,
    vendorsResult,
  ] = await Promise.all([
    supabase.from("events").select("id, name").order("name"),
    supabase.from("tasks").select("id, event_id, status, completion_pct"),
    supabase.from("guests").select("id, event_id, rsvp_status"),
    supabase
      .from("shopping_items")
      .select("id, event_id, price, paid, purchased"),
    supabase
      .from("budget_items")
      .select(
        "id, event_id, estimated_amount, actual_amount, paid, category"
      ),
    supabase
      .from("vendors")
      .select("id, event_id, total_amount, advance_paid"),
  ]);

  if (eventsResult.error) {
    console.error("Failed to load analytics events:", eventsResult.error);
  }
  if (tasksResult.error) {
    console.error("Failed to load analytics tasks:", tasksResult.error);
  }
  if (guestsResult.error) {
    console.error("Failed to load analytics guests:", guestsResult.error);
  }
  if (shoppingResult.error) {
    console.error(
      "Failed to load analytics shopping:",
      shoppingResult.error
    );
  }
  if (budgetResult.error) {
    console.error("Failed to load analytics budget:", budgetResult.error);
  }
  if (vendorsResult.error) {
    console.error("Failed to load analytics vendors:", vendorsResult.error);
  }

  const events = (eventsResult.data || []) as EventRow[];
  const tasks = (tasksResult.data || []) as TaskRow[];
  const guests = (guestsResult.data || []) as GuestRow[];
  const shopping = (shoppingResult.data || []) as ShoppingRow[];
  const budget = (budgetResult.data || []) as BudgetRow[];
  const vendors = (vendorsResult.data || []) as VendorRow[];

  const analytics = events.map((item) =>
    buildEventAnalytics(
      item,
      tasks,
      guests,
      shopping,
      budget,
      vendors
    )
  );

  const totalTasks = analytics.reduce(
    (sum, item) => sum + item.tasks,
    0
  );
  const completedTasks = analytics.reduce(
    (sum, item) => sum + item.completedTasks,
    0
  );
  const totalGuests = analytics.reduce(
    (sum, item) => sum + item.guests,
    0
  );
  const acceptedGuests = analytics.reduce(
    (sum, item) => sum + item.acceptedGuests,
    0
  );
  const respondedGuests = analytics.reduce(
    (sum, item) => sum + item.respondedGuests,
    0
  );
  const totalShoppingItems = analytics.reduce(
    (sum, item) => sum + item.shoppingItems,
    0
  );
  const purchasedItems = analytics.reduce(
    (sum, item) => sum + item.purchasedItems,
    0
  );
  const estimatedBudget = analytics.reduce(
    (sum, item) => sum + item.estimatedBudget,
    0
  );
  const actualBudget = analytics.reduce(
    (sum, item) => sum + item.actualBudget,
    0
  );
  const paidBudget = analytics.reduce(
    (sum, item) => sum + item.paidBudget,
    0
  );
  const totalVendors = analytics.reduce(
    (sum, item) => sum + item.vendors,
    0
  );
  const vendorTotal = analytics.reduce(
    (sum, item) => sum + item.vendorTotal,
    0
  );
  const vendorPaid = analytics.reduce(
    (sum, item) => sum + item.vendorPaid,
    0
  );
  const shoppingTotal = analytics.reduce(
    (sum, item) => sum + item.shoppingTotal,
    0
  );
  const shoppingPaid = analytics.reduce(
    (sum, item) => sum + item.shoppingPaid,
    0
  );

  const totalExpenses =
    actualBudget + vendorTotal + shoppingTotal;
  const totalPaid =
    paidBudget + vendorPaid + shoppingPaid;
  const totalBalance = Math.max(
    0,
    totalExpenses - totalPaid
  );

  const overallTaskProgress = percentage(
    completedTasks,
    totalTasks
  );
  const overallRsvpProgress = percentage(
    respondedGuests,
    totalGuests
  );
  const overallShoppingProgress = percentage(
    purchasedItems,
    totalShoppingItems
  );
  const overallPlanningProgress =
    Math.round(
      (overallTaskProgress +
        overallRsvpProgress +
        overallShoppingProgress) /
        3
    );

  const selectedAnalytics = analytics.find(
    (item) => item.event.id === selectedEventId
  );

  if (selectedEventId && selectedAnalytics) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Analytics"
          subtitle={`Detailed analytics for ${selectedAnalytics.event.name}`}
        />

        <AllEventsSummary
          eventsCount={events.length}
          totalExpenses={totalExpenses}
          totalPaid={totalPaid}
          totalBalance={totalBalance}
          planningProgress={overallPlanningProgress}
          href="/dashboard/analytics"
        />

        <EventAnalyticsView data={selectedAnalytics} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        subtitle="Overall wedding analytics across every event"
      />

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                <h2 className="text-2xl font-bold">
                  Overall Planning Progress
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Combined progress from tasks, guest RSVPs and shopping
                across all events.
              </p>
            </div>
            <div className="text-4xl font-bold text-emerald-600">
              {overallPlanningProgress}%
            </div>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{ width: `${overallPlanningProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Events"
          value={events.length}
          description="All wedding events"
          icon={<CalendarDays className="h-6 w-6 text-emerald-600" />}
        />
        <StatCard
          title="Tasks"
          value={`${completedTasks}/${totalTasks}`}
          description={`${overallTaskProgress}% completed`}
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
        />
        <StatCard
          title="Guests"
          value={totalGuests}
          description={`${acceptedGuests} accepted`}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Shopping"
          value={`${purchasedItems}/${totalShoppingItems}`}
          description={`${overallShoppingProgress}% purchased`}
          icon={<ShoppingBag className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Vendors"
          value={totalVendors}
          description={`${formatCurrency(vendorPaid)} paid`}
          icon={<Store className="h-6 w-6 text-orange-600" />}
        />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <CircleDollarSign className="mt-1 h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold">
                Overall Expense Analytics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All expenses combined from every event, separated into
                budget, vendors and shopping.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MoneyCard
              title="Total Expenses"
              amount={totalExpenses}
              description="Budget + vendors + shopping"
            />
            <MoneyCard
              title="Total Paid"
              amount={totalPaid}
              description={`${percentage(totalPaid, totalExpenses)}% paid`}
              positive
            />
            <MoneyCard
              title="Total Balance"
              amount={totalBalance}
              description="Still outstanding"
            />
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Overall payment progress
              </span>
              <span className="font-semibold">
                {percentage(totalPaid, totalExpenses)}%
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-600"
                style={{
                  width: `${percentage(totalPaid, totalExpenses)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ExpenseSourceCard
              title="Budget"
              total={actualBudget}
              paid={paidBudget}
              icon={<Wallet className="h-5 w-5 text-emerald-600" />}
            />
            <ExpenseSourceCard
              title="Vendors"
              total={vendorTotal}
              paid={vendorPaid}
              icon={<Store className="h-5 w-5 text-blue-600" />}
            />
            <ExpenseSourceCard
              title="Shopping"
              total={shoppingTotal}
              paid={shoppingPaid}
              icon={<ShoppingBag className="h-5 w-5 text-orange-600" />}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-1 h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-2xl font-bold">
                Event Analytics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare every event separately. Open any event for its
                detailed analytics.
              </p>
            </div>
          </div>

          {analytics.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mt-6 space-y-4">
              {analytics.map((item) => (
                <EventAnalyticsRow
                  key={item.event.id}
                  data={item}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>
      <BarChart3 className="h-7 w-7 text-emerald-600" />
    </div>
  );
}

function AllEventsSummary({
  eventsCount,
  totalExpenses,
  totalPaid,
  totalBalance,
  planningProgress,
  href,
}: {
  eventsCount: number;
  totalExpenses: number;
  totalPaid: number;
  totalBalance: number;
  planningProgress: number;
  href: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              All Events Overview
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {eventsCount} event{eventsCount === 1 ? "" : "s"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Overall expenses: {formatCurrency(totalExpenses)} · Paid:{" "}
              {formatCurrency(totalPaid)} · Balance:{" "}
              {formatCurrency(totalBalance)}
            </p>
          </div>

          <a
            href={href}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            View All Events Analytics
          </a>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">
              Overall planning progress
            </span>
            <span className="font-semibold">
              {planningProgress}%
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${planningProgress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventAnalyticsView({
  data,
}: {
  data: EventAnalytics;
}) {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Selected Event
              </p>
              <h2 className="mt-1 text-3xl font-bold">
                {data.event.name}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Event planning progress
              </p>
              <p className="mt-1 text-4xl font-bold text-emerald-600">
                {data.overallProgress}%
              </p>
            </div>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600"
              style={{ width: `${data.overallProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Tasks"
          value={`${data.completedTasks}/${data.tasks}`}
          description={`${data.taskProgress}% completed`}
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-600" />}
        />
        <StatCard
          title="Guests"
          value={data.guests}
          description={`${data.acceptedGuests} accepted`}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <StatCard
          title="Budget"
          value={formatCurrency(data.actualBudget)}
          description={`${percentage(data.actualBudget, data.estimatedBudget)}% of estimate`}
          icon={<Wallet className="h-6 w-6 text-emerald-600" />}
        />
        <StatCard
          title="Shopping"
          value={`${data.purchasedItems}/${data.shoppingItems}`}
          description={`${data.shoppingProgress}% purchased`}
          icon={<ShoppingBag className="h-6 w-6 text-purple-600" />}
        />
        <StatCard
          title="Vendors"
          value={data.vendors}
          description={`${formatCurrency(data.vendorPaid)} paid`}
          icon={<Store className="h-6 w-6 text-orange-600" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressSection
          title="Task Status"
          subtitle="Task completion for this event."
          customContent={
            <div className="space-y-5">
              <AnalyticsBar
                label="Task completion"
                value={data.taskProgress}
                total={100}
                color="bg-emerald-600"
                suffix="%"
              />
            </div>
          }
        />

        <ProgressSection
          title="Guest RSVP"
          subtitle="Response progress for this event."
          customContent={
            <div className="space-y-5">
              <AnalyticsBar
                label="Accepted"
                value={data.acceptedGuests}
                total={data.guests}
                color="bg-emerald-600"
              />
              <AnalyticsBar
                label="Responded"
                value={data.respondedGuests}
                total={data.guests}
                color="bg-blue-600"
              />
              <AnalyticsBar
                label="Pending response"
                value={Math.max(0, data.guests - data.respondedGuests)}
                total={data.guests}
                color="bg-yellow-500"
              />
            </div>
          }
        />
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">
            Expense Analytics — {data.event.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Expenses and payments for this event only.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MoneyCard
              title="Total Expenses"
              amount={data.totalExpense}
              description="Budget + vendors + shopping"
            />
            <MoneyCard
              title="Total Paid"
              amount={data.totalPaid}
              description={`${percentage(data.totalPaid, data.totalExpense)}% paid`}
              positive
            />
            <MoneyCard
              title="Balance"
              amount={data.totalBalance}
              description="Still outstanding"
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ExpenseSourceCard
              title="Budget"
              total={data.actualBudget}
              paid={data.paidBudget}
              icon={<Wallet className="h-5 w-5 text-emerald-600" />}
            />
            <ExpenseSourceCard
              title="Vendors"
              total={data.vendorTotal}
              paid={data.vendorPaid}
              icon={<Store className="h-5 w-5 text-blue-600" />}
            />
            <ExpenseSourceCard
              title="Shopping"
              total={data.shoppingTotal}
              paid={data.shoppingPaid}
              icon={<ShoppingBag className="h-5 w-5 text-orange-600" />}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ProgressSection({
  title,
  subtitle,
  customContent,
}: {
  title: string;
  subtitle: string;
  customContent: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-6">{customContent}</div>
      </CardContent>
    </Card>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        {icon}
        <p className="mt-4 text-sm text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 text-3xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function MoneyCard({
  title,
  amount,
  description,
  positive = false,
}: {
  title: string;
  amount: number;
  description: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border p-5">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p
        className={`mt-1 text-3xl font-bold ${
          positive ? "text-emerald-600" : ""
        }`}
      >
        {formatCurrency(amount)}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ExpenseSourceCard({
  title,
  total,
  paid,
  icon,
}: {
  title: string;
  total: number;
  paid: number;
  icon: ReactNode;
}) {
  const progress = percentage(paid, total);
  const balance = Math.max(0, total - paid);

  return (
    <div className="rounded-xl border p-5">
      <div className="flex items-center gap-2">
        {icon}
        <p className="font-semibold">{title}</p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Paid</p>
          <p className="font-semibold text-emerald-600">
            {formatCurrency(paid)}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
        <span>{progress}% paid</span>
        <span>Balance {formatCurrency(balance)}</span>
      </div>
    </div>
  );
}

function EventAnalyticsRow({
  data,
}: {
  data: EventAnalytics;
}) {
  return (
    <a
      href={`/dashboard/analytics?event=${data.event.id}`}
      className="block rounded-xl border p-5 transition hover:bg-muted/40"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold">
            {data.event.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Planning progress {data.overallProgress}% ·{" "}
            {data.completedTasks}/{data.tasks} tasks ·{" "}
            {data.acceptedGuests}/{data.guests} guests accepted
          </p>
        </div>

        <div className="grid grid-cols-3 gap-5 text-right">
          <div>
            <p className="text-xs text-muted-foreground">
              Expenses
            </p>
            <p className="font-semibold">
              {formatCurrency(data.totalExpense)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Paid
            </p>
            <p className="font-semibold text-emerald-600">
              {formatCurrency(data.totalPaid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Balance
            </p>
            <p className="font-semibold">
              {formatCurrency(data.totalBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{
            width: `${data.overallProgress}%`,
          }}
        />
      </div>
    </a>
  );
}

function AnalyticsBar({
  label,
  value,
  total,
  color,
  suffix,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
  suffix?: string;
}) {
  const percent =
    suffix === "%"
      ? Math.min(100, Math.max(0, value))
      : percentage(value, total);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">
          {suffix === "%" ? `${value}%` : value}
          {suffix !== "%" && (
            <span className="text-muted-foreground">
              {" "}
              ({percent}%)
            </span>
          )}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="text-xl font-bold">No events yet</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Create an event first and its analytics will appear here
        automatically.
      </p>
    </div>
  );
}
