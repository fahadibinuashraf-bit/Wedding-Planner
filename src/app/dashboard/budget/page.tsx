import { createClient } from "@/lib/supabase/server";

import {
  Wallet,
  Plus,
  TrendingUp,
  CreditCard,
  ArrowDownCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { addBudgetItem } from "./actions";
import { EditBudgetItem } from "./edit-budget-item";
import { DeleteBudgetItem } from "./delete-budget-item";

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

type BudgetItem = {
  id: string;
  event_id: string;
  name: string;
  category: string;
  estimated_amount: number;
  actual_amount: number;
  paid: boolean;
  notes: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export default async function BudgetPage({
  searchParams,
}: Props) {
  const { event } = await searchParams;

  const supabase = await createClient();

  /* ---------------- EVENT ---------------- */

  let eventData: EventData | null = null;

  if (event) {
    const eventResult = await supabase
      .from("events")
      .select("id, name")
      .eq("id", event)
      .single();

    const data =
      eventResult.data as unknown as EventData | null;

    if (data) {
      eventData = {
        id: String(data.id),
        name: String(data.name || "Your Wedding"),
      };
    }
  }

  /* ---------------- BUDGET ITEMS ---------------- */

  let budgetItems: BudgetItem[] = [];

  if (event) {
    const budgetResult = await supabase
      .from("budget_items")
      .select("*")
      .eq("event_id", event)
      .order("created_at", {
        ascending: false,
      });

    if (budgetResult.error) {
      console.error(
        "Failed to load budget items:",
        budgetResult.error
      );
    }

    const rawItems =
      (budgetResult.data ?? []) as unknown as Array<{
        id: string;
        event_id: string;
        name: string;
        category?: string | null;
        estimated_amount?: number | null;
        actual_amount?: number | null;
        paid?: boolean | null;
        notes?: string | null;
        created_at?: string | null;
        updated_at?: string | null;
      }>;

    budgetItems = rawItems.map((item) => ({
      id: String(item.id),
      event_id: String(item.event_id),
      name: String(item.name),
      category: String(item.category || "Other"),
      estimated_amount: Number(
        item.estimated_amount ?? 0
      ),
      actual_amount: Number(
        item.actual_amount ?? 0
      ),
      paid: Boolean(item.paid),
      notes: item.notes ?? null,
      created_at: item.created_at ?? null,
      updated_at: item.updated_at ?? null,
    }));
  }

  /* ---------------- TOTALS ---------------- */

  const estimatedTotal = budgetItems.reduce(
    (sum, item) =>
      sum + item.estimated_amount,
    0
  );

  const actualTotal = budgetItems.reduce(
    (sum, item) =>
      sum + item.actual_amount,
    0
  );

  const remainingTotal =
    estimatedTotal - actualTotal;

  const paidItems = budgetItems.filter(
    (item) => item.paid === true
  ).length;

  const pendingItems =
    budgetItems.length - paidItems;

  const progress =
    estimatedTotal > 0
      ? Math.min(
          Math.round(
            (actualTotal / estimatedTotal) * 100
          ),
          100
        )
      : 0;

  /* ---------------- NO EVENT ---------------- */

  if (!event) {
    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-600">
              Wedding Planner
            </p>

            <h1 className="mt-1 text-4xl font-bold">
              Budget
            </h1>

            <p className="mt-2 text-muted-foreground">
              Track your wedding expenses and payments.
            </p>
          </div>

          <Wallet className="h-8 w-8 text-emerald-600" />
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <Wallet className="mb-5 h-14 w-14 text-muted-foreground" />

            <h2 className="text-2xl font-bold">
              Select an event
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Open Budget from an event to manage
              wedding expenses, payments and spending.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 text-4xl font-bold">
            Budget
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage the budget for{" "}
            <span className="font-medium text-foreground">
              {eventData
                ? eventData.name
                : "your wedding"}
            </span>
          </p>
        </div>

        <Wallet className="h-7 w-7 text-emerald-600" />
      </div>

      {/* ADD EXPENSE */}

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Plus className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Add Expense
              </h2>

              <p className="text-sm text-muted-foreground">
                Add a new wedding expense to your budget.
              </p>
            </div>
          </div>

          <form
            action={addBudgetItem}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="event_id"
              value={event}
            />

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Expense Name
              </label>

              <input
                id="name"
                name="name"
                required
                placeholder="e.g. Wedding Hall"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                defaultValue="Other"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">
                  Decoration
                </option>
                <option value="Photography">
                  Photography
                </option>
                <option value="Clothing">
                  Clothing
                </option>
                <option value="Jewellery">
                  Jewellery
                </option>
                <option value="Transportation">
                  Transportation
                </option>
                <option value="Entertainment">
                  Entertainment
                </option>
                <option value="Gifts">Gifts</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="estimated_amount"
                className="text-sm font-medium"
              >
                Estimated Amount
              </label>

              <input
                id="estimated_amount"
                name="estimated_amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                placeholder="0"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="actual_amount"
                className="text-sm font-medium"
              >
                Actual Amount
              </label>

              <input
                id="actual_amount"
                name="actual_amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                placeholder="0"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="payment_status"
                className="text-sm font-medium"
              >
                Payment Status
              </label>

              <select
                id="payment_status"
                name="payment_status"
                defaultValue="Pending"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-medium"
              >
                Notes
              </label>

              <input
                id="notes"
                name="notes"
                placeholder="Optional notes"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* STAT CARDS */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹
                  {estimatedTotal.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Actual
                </p>

                <p className="mt-1 text-2xl font-bold">
                  ₹
                  {actualTotal.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {remainingTotal >= 0
                    ? "Remaining"
                    : "Over Budget"}
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    remainingTotal < 0
                      ? "text-red-600"
                      : "text-emerald-600"
                  }`}
                >
                  ₹
                  {Math.abs(
                    remainingTotal
                  ).toLocaleString("en-IN")}
                </p>
              </div>

              <ArrowDownCircle
                className={`h-6 w-6 ${
                  remainingTotal < 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Payments
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {paidItems}/{budgetItems.length}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {pendingItems} pending
                </p>
              </div>

              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PROGRESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Budget Progress
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Actual spending compared with your
                estimated budget.
              </p>
            </div>

            <span className="text-3xl font-bold text-emerald-600">
              {progress}%
            </span>
          </div>

          <div className="mt-5 h-4 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                actualTotal > estimatedTotal
                  ? "bg-red-500"
                  : "bg-emerald-600"
              }`}
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* EXPENSE LIST */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Expenses
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                All expenses for this event.
              </p>
            </div>

            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
              {budgetItems.length}{" "}
              {budgetItems.length === 1
                ? "expense"
                : "expenses"}
            </span>
          </div>

          {budgetItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Wallet className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No expenses yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first wedding expense above.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {budgetItems.map((item) => {
                const estimated =
                  item.estimated_amount;

                const actual =
                  item.actual_amount;

                const isPaid =
                  item.paid === true;

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border p-5 transition hover:bg-muted/20"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold">
                            {item.name}
                          </h3>

                          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                            {item.category}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {isPaid
                              ? "Paid"
                              : "Pending"}
                          </span>
                        </div>

                        {item.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <EditBudgetItem
                          item={{
                            id: item.id,
                            event_id: item.event_id,
                            name: item.name,
                            category: item.category,
                            estimated_amount:
                              estimated,
                            actual_amount:
                              actual,
                            paid: item.paid,
                            notes: item.notes,
                          }}
                        />

                        <DeleteBudgetItem
                          id={item.id}
                          eventId={event}
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 border-t pt-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Estimated
                        </p>

                        <p className="mt-1 font-semibold">
                          ₹
                          {estimated.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Actual
                        </p>

                        <p className="mt-1 font-semibold">
                          ₹
                          {actual.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Difference
                        </p>

                        <p
                          className={`mt-1 font-semibold ${
                            estimated - actual >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹
                          {Math.abs(
                            estimated - actual
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}