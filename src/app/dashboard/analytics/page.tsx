import { createClient } from "@/lib/supabase/server";

import {
  BarChart3,
  CheckCircle2,
  Users,
  Wallet,
  ShoppingBag,
  Store,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Props {
  searchParams: Promise<{
    event?: string;
  }>;
}

export const dynamic = "force-dynamic";

type EventData = {
  id: string;
  name: string;
};

type Task = {
  status?: string | null;
  completion_pct?: number | null;
};

type Guest = {
  rsvp_status?: string | null;
  plus_one?: boolean | null;
};

type ShoppingItem = {
  purchased?: boolean | null;
  estimated_price?: number | null;
  actual_price?: number | null;
  quantity?: number | null;
};

type BudgetItem = {
  category?: string | null;
  estimated_amount?: number | null;
  actual_amount?: number | null;
  paid?: boolean | null;
};

type Vendor = {
  total_amount?: number | null;
  advance_paid?: number | null;
};

export default async function AnalyticsPage({
  searchParams,
}: Props) {
  const { event } = await searchParams;

  const supabase = await createClient();

  /* ---------------- EVENT ---------------- */

  let eventData: EventData | null = null;

  if (event) {
    const result = await supabase
      .from("events")
      .select("id, name")
      .eq("id", event)
      .single();

    const data = result.data as unknown as EventData | null;

    if (data) {
      eventData = {
        id: String(data.id),
        name: String(data.name || "Your Wedding"),
      };
    }
  }

  /* ---------------- DATA ---------------- */

  let tasks: Task[] = [];
  let guests: Guest[] = [];
  let shoppingItems: ShoppingItem[] = [];
  let budgetItems: BudgetItem[] = [];
  let vendors: Vendor[] = [];

  if (event) {
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
        .eq("event_id", event),

      supabase
        .from("guests")
        .select("*")
        .eq("event_id", event),

      supabase
        .from("shopping_items")
        .select("*")
        .eq("event_id", event),

      supabase
        .from("budget_items")
        .select("*")
        .eq("event_id", event),

      supabase
        .from("vendors")
        .select("*")
        .eq("event_id", event),
    ]);

    if (tasksResult.error) {
      console.error(
        "Failed to load analytics tasks:",
        tasksResult.error
      );
    }

    if (guestsResult.error) {
      console.error(
        "Failed to load analytics guests:",
        guestsResult.error
      );
    }

    if (shoppingResult.error) {
      console.error(
        "Failed to load analytics shopping:",
        shoppingResult.error
      );
    }

    if (budgetResult.error) {
      console.error(
        "Failed to load analytics budget:",
        budgetResult.error
      );
    }

    if (vendorsResult.error) {
      console.error(
        "Failed to load analytics vendors:",
        vendorsResult.error
      );
    }

    tasks = (tasksResult.data ?? []) as unknown as Task[];
    guests = (guestsResult.data ?? []) as unknown as Guest[];
    shoppingItems =
      (shoppingResult.data ?? []) as unknown as ShoppingItem[];
    budgetItems =
      (budgetResult.data ?? []) as unknown as BudgetItem[];
    vendors =
      (vendorsResult.data ?? []) as unknown as Vendor[];
  }

  /* ---------------- TASKS ---------------- */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "completed" ||
      Number(task.completion_pct ?? 0) >= 100
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in_progress"
  ).length;

  const notStartedTasks = tasks.filter(
    (task) =>
      task.status === "not_started" ||
      !task.status
  ).length;

  const taskCompletion =
    totalTasks > 0
      ? Math.round(
          tasks.reduce(
            (sum, task) =>
              sum +
              (task.status === "completed"
                ? 100
                : Number(task.completion_pct ?? 0)),
            0
          ) / totalTasks
        )
      : 0;

  /* ---------------- GUESTS ---------------- */

  const totalGuests = guests.length;

  const acceptedGuests = guests.filter(
    (guest) => guest.rsvp_status === "Accepted"
  ).length;

  const pendingGuests = guests.filter(
    (guest) => guest.rsvp_status === "Pending"
  ).length;

  const invitedGuests = guests.filter(
    (guest) => guest.rsvp_status === "Invited"
  ).length;

  const declinedGuests = guests.filter(
    (guest) => guest.rsvp_status === "Declined"
  ).length;

  const plusOneGuests = guests.filter(
    (guest) => guest.plus_one === true
  ).length;

  const respondedGuests =
    acceptedGuests + declinedGuests;

  const rsvpResponseRate =
    totalGuests > 0
      ? Math.round(
          (respondedGuests / totalGuests) * 100
        )
      : 0;

  /* ---------------- SHOPPING ---------------- */

  const totalShoppingItems =
    shoppingItems.length;

  const purchasedItems = shoppingItems.filter(
    (item) => item.purchased === true
  ).length;

  const pendingShoppingItems =
    totalShoppingItems - purchasedItems;

  const shoppingProgress =
    totalShoppingItems > 0
      ? Math.round(
          (purchasedItems / totalShoppingItems) * 100
        )
      : 0;

  const shoppingEstimated =
    shoppingItems.reduce(
      (sum, item) =>
        sum +
        Number(item.estimated_price ?? 0) *
          Number(item.quantity ?? 0),
      0
    );

  const shoppingActual =
    shoppingItems.reduce(
      (sum, item) =>
        sum +
        Number(item.actual_price ?? 0) *
          Number(item.quantity ?? 0),
      0
    );

  /* ---------------- BUDGET ---------------- */

  const estimatedBudget =
    budgetItems.reduce(
      (sum, item) =>
        sum + Number(item.estimated_amount ?? 0),
      0
    );

  const actualBudget =
    budgetItems.reduce(
      (sum, item) =>
        sum + Number(item.actual_amount ?? 0),
      0
    );

  const remainingBudget =
    estimatedBudget - actualBudget;

  const budgetProgress =
    estimatedBudget > 0
      ? Math.min(
          Math.round(
            (actualBudget / estimatedBudget) * 100
          ),
          100
        )
      : 0;

  const paidBudgetItems =
    budgetItems.filter(
      (item) => item.paid === true
    ).length;

  const pendingBudgetItems =
    budgetItems.length - paidBudgetItems;

  /* ---------------- VENDORS ---------------- */

  const totalVendors = vendors.length;

  const totalVendorCost =
    vendors.reduce(
      (sum, vendor) =>
        sum + Number(vendor.total_amount ?? 0),
      0
    );

  const totalVendorAdvance =
    vendors.reduce(
      (sum, vendor) =>
        sum + Number(vendor.advance_paid ?? 0),
      0
    );

  const remainingVendorPayment =
    totalVendorCost - totalVendorAdvance;

  const fullyPaidVendors =
    vendors.filter(
      (vendor) =>
        Number(vendor.total_amount ?? 0) > 0 &&
        Number(vendor.advance_paid ?? 0) >=
          Number(vendor.total_amount ?? 0)
    ).length;

  const vendorPaymentProgress =
    totalVendorCost > 0
      ? Math.min(
          Math.round(
            (totalVendorAdvance /
              totalVendorCost) *
              100
          ),
          100
        )
      : 0;

  /* ---------------- OVERALL ---------------- */

  const overallProgress =
    Math.round(
      (taskCompletion +
        shoppingProgress +
        rsvpResponseRate) /
        3
    );

  /* ---------------- BUDGET CATEGORIES ---------------- */

  const budgetCategories =
    budgetItems.reduce(
      (
        result: Record<string, number>,
        item
      ) => {
        const category =
          item.category || "Other";

        result[category] =
          (result[category] || 0) +
          Number(item.actual_amount ?? 0);

        return result;
      },
      {}
    );

  const budgetCategoryEntries =
    Object.entries(budgetCategories).sort(
      ([, a], [, b]) =>
        Number(b) - Number(a)
    );

  /* ---------------- NO EVENT ---------------- */

  if (!event) {
    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Analytics
            </h1>

            <p className="mt-2 text-muted-foreground">
              Charts and insights for wedding
              planning progress.
            </p>
          </div>

          <BarChart3 className="h-7 w-7 text-emerald-600" />
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <BarChart3 className="mb-5 h-14 w-14 text-muted-foreground" />

            <h2 className="text-2xl font-bold">
              Select an event
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Open Analytics from an event to see
              real-time planning statistics, budget
              insights, guests, shopping and vendors.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Analytics
          </h1>

          <p className="mt-2 text-muted-foreground">
            Planning insights for{" "}
            <span className="font-medium text-foreground">
              {eventData
                ? eventData.name
                : "your wedding"}
            </span>
          </p>
        </div>

        <BarChart3 className="h-7 w-7 text-emerald-600" />
      </div>

      {/* OVERALL PROGRESS */}

      <Card>
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
                Based on tasks, shopping and RSVP
                response progress.
              </p>
            </div>

            <div className="text-4xl font-bold text-emerald-600">
              {overallProgress}%
            </div>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* MAIN STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-5">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />

            <p className="mt-4 text-sm text-muted-foreground">
              Task Progress
            </p>

            <p className="mt-1 text-3xl font-bold">
              {taskCompletion}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {completedTasks}/{totalTasks} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Users className="h-6 w-6 text-blue-600" />

            <p className="mt-4 text-sm text-muted-foreground">
              Guests
            </p>

            <p className="mt-1 text-3xl font-bold">
              {totalGuests}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {acceptedGuests} accepted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Wallet className="h-6 w-6 text-emerald-600" />

            <p className="mt-4 text-sm text-muted-foreground">
              Budget Used
            </p>

            <p className="mt-1 text-3xl font-bold">
              {budgetProgress}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              ₹{actualBudget.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <ShoppingBag className="h-6 w-6 text-purple-600" />

            <p className="mt-4 text-sm text-muted-foreground">
              Shopping
            </p>

            <p className="mt-1 text-3xl font-bold">
              {shoppingProgress}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {purchasedItems}/{totalShoppingItems} purchased
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <Store className="h-6 w-6 text-orange-600" />

            <p className="mt-4 text-sm text-muted-foreground">
              Vendors
            </p>

            <p className="mt-1 text-3xl font-bold">
              {totalVendors}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {fullyPaidVendors} fully paid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TASK ANALYTICS + RSVP */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Task Status
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current task completion breakdown.
            </p>

            <div className="mt-6 space-y-5">
              <AnalyticsBar
                label="Completed"
                value={completedTasks}
                total={totalTasks}
                color="bg-emerald-600"
              />

              <AnalyticsBar
                label="In Progress"
                value={inProgressTasks}
                total={totalTasks}
                color="bg-blue-600"
              />

              <AnalyticsBar
                label="Not Started"
                value={notStartedTasks}
                total={totalTasks}
                color="bg-gray-400"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Guest RSVP
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Response status across your guest list.
            </p>

            <div className="mt-6 space-y-5">
              <AnalyticsBar
                label="Accepted"
                value={acceptedGuests}
                total={totalGuests}
                color="bg-emerald-600"
              />

              <AnalyticsBar
                label="Invited"
                value={invitedGuests}
                total={totalGuests}
                color="bg-blue-600"
              />

              <AnalyticsBar
                label="Pending"
                value={pendingGuests}
                total={totalGuests}
                color="bg-yellow-500"
              />

              <AnalyticsBar
                label="Declined"
                value={declinedGuests}
                total={totalGuests}
                color="bg-red-500"
              />
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                RSVP response rate
              </p>

              <p className="mt-1 text-2xl font-bold">
                {rsvpResponseRate}%
              </p>
            </div>

            {plusOneGuests > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                {plusOneGuests} guests have a plus-one.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* BUDGET + SHOPPING */}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Budget Overview
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Estimated vs actual wedding spending.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated
                </span>

                <span className="font-bold">
                  ₹
                  {estimatedBudget.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Actual
                </span>

                <span className="font-bold text-emerald-600">
                  ₹
                  {actualBudget.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${
                    actualBudget > estimatedBudget
                      ? "bg-red-500"
                      : "bg-emerald-600"
                  }`}
                  style={{
                    width: `${budgetProgress}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {remainingBudget >= 0
                    ? "Remaining"
                    : "Over budget"}
                </span>

                <span
                  className={`font-bold ${
                    remainingBudget < 0
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  ₹
                  {Math.abs(
                    remainingBudget
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {budgetCategoryEntries.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold">
                  Spending by Category
                </h3>

                <div className="mt-4 space-y-4">
                  {budgetCategoryEntries.map(
                    ([category, amount]) => {
                      const percentage =
                        actualBudget > 0
                          ? Math.round(
                              (Number(amount) /
                                actualBudget) *
                                100
                            )
                          : 0;

                      return (
                        <div key={category}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>{category}</span>

                            <span className="font-medium">
                              ₹
                              {Number(
                                amount
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-emerald-600"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Shopping Overview
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Track purchased and pending shopping items.
            </p>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Progress
                </span>

                <span className="font-bold">
                  {shoppingProgress}%
                </span>
              </div>

              <div className="mt-2 h-4 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-purple-600"
                  style={{
                    width: `${shoppingProgress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Purchased
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {purchasedItems}
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Pending
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {pendingShoppingItems}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Estimated
                </span>

                <span className="font-medium">
                  ₹
                  {shoppingEstimated.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Actual
                </span>

                <span className="font-medium">
                  ₹
                  {shoppingActual.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VENDORS */}

      <Card>
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold">
            Vendor Payments
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Vendor commitments and advance payments.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Vendors
              </p>

              <p className="mt-1 text-2xl font-bold">
                {totalVendors}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Cost
              </p>

              <p className="mt-1 text-2xl font-bold">
                ₹
                {totalVendorCost.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Advance Paid
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                ₹
                {totalVendorAdvance.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Remaining
              </p>

              <p className="mt-1 text-2xl font-bold">
                ₹
                {Math.max(
                  0,
                  remainingVendorPayment
                ).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Payment progress
              </span>

              <span className="font-bold">
                {vendorPaymentProgress}%
              </span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-orange-500"
                style={{
                  width: `${vendorPaymentProgress}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            {fullyPaidVendors} of{" "}
            {totalVendors} vendors fully paid
          </div>
        </CardContent>
      </Card>

      {/* ATTENTION */}

      {(pendingGuests > 0 ||
        pendingShoppingItems > 0 ||
        pendingBudgetItems > 0 ||
        remainingVendorPayment > 0) && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />

              <h2 className="text-2xl font-bold">
                Items Needing Attention
              </h2>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {pendingGuests > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="font-medium">
                    Guest RSVPs
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {pendingGuests} guests still pending.
                  </p>
                </div>
              )}

              {pendingShoppingItems > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="font-medium">
                    Shopping
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {pendingShoppingItems} items not purchased.
                  </p>
                </div>
              )}

              {pendingBudgetItems > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="font-medium">
                    Budget Payments
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {pendingBudgetItems} budget payments pending.
                  </p>
                </div>
              )}

              {remainingVendorPayment > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="font-medium">
                    Vendor Payments
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    ₹
                    {remainingVendorPayment.toLocaleString(
                      "en-IN"
                    )}{" "}
                    remaining.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalyticsBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span>{label}</span>

        <span className="font-medium">
          {value}{" "}
          <span className="text-muted-foreground">
            ({percentage}%)
          </span>
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}