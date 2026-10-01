import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
  toggleShoppingItem,
} from "./actions";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type EventData = {
  id: string;
  name: string;
  event_date: string | null;
};

type ShoppingItem = {
  id: string;
  event_id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  paid: number;
  purchased: boolean;
};

interface ShoppingPageProps {
  searchParams: Promise<{
    event?: string;
  }>;
}

const categories = [
  "Clothing",
  "Gifts",
  "Decoration",
  "Jewellery",
  "Food",
  "Beauty",
  "Accessories",
  "Other",
];

function formatCurrency(amount: number) {
  return `₹${Math.max(0, amount).toLocaleString("en-IN")}`;
}

function getBalance(price: number, paid: number) {
  return Math.max(0, price - paid);
}

export default async function ShoppingPage({
  searchParams,
}: ShoppingPageProps) {
  const params = await searchParams;
  const eventIdFromUrl = params.event || "";

  const supabase = (await createClient()) as any;

  /* ---------------- EVENTS ---------------- */

  const { data: rawEvents } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  const events: EventData[] = (rawEvents ?? []).map(
    (event: any) => ({
      id: String(event.id),
      name: String(event.name || "Your Wedding"),
      event_date: event.event_date ?? null,
    })
  );

  const selectedEvent =
    events.find(
      (event) => event.id === eventIdFromUrl
    ) ||
    events[0] ||
    null;

  /* ---------------- NO EVENT ---------------- */

  if (!selectedEvent) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Shopping
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage everything you need to buy for your wedding.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <ShoppingBag className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Select or create an event
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create a wedding event first before adding shopping
              items.
            </p>

            <Link href="/dashboard/events" className="mt-6">
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

  /* ---------------- SHOPPING ITEMS ---------------- */

  const { data: rawItems, error } = await supabase
    .from("shopping_items")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Failed to load shopping items:", error);
  }

  const items: ShoppingItem[] = (rawItems ?? []).map(
    (item: any) => ({
      id: String(item.id),
      event_id: String(item.event_id),
      name: String(item.name || "Shopping Item"),
      category: String(item.category || "Other"),
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      paid: Number(item.paid || 0),
      purchased: Boolean(item.purchased),
    })
  );

  /* ---------------- CALCULATIONS ---------------- */

  const totalItems = items.length;

  const purchasedItems = items.filter(
    (item) => item.purchased
  ).length;

  const pendingItems = totalItems - purchasedItems;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const totalPaid = items.reduce(
    (sum, item) =>
      sum + Math.min(item.paid, item.price),
    0
  );

  const totalBalance = Math.max(
    0,
    totalPrice - totalPaid
  );

  const paymentProgress =
    totalPrice > 0
      ? Math.min(
          100,
          Math.round((totalPaid / totalPrice) * 100)
        )
      : 0;

  const shoppingProgress =
    totalItems > 0
      ? Math.round(
          (purchasedItems / totalItems) * 100
        )
      : 0;

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href={`/dashboard?event=${eventId}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Shopping
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage shopping items for{" "}
            <span className="font-medium text-foreground">
              {selectedEvent.name}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-sm font-semibold">
            {pendingItems} pending
          </span>
        </div>
      </div>

      {/* EVENT SWITCHER */}

      {events.length > 1 && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <span className="mr-2 text-sm font-medium">
              Event:
            </span>

            {events.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/shopping?event=${event.id}`}
              >
                <Button
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
          </CardContent>
        </Card>
      )}

      {/* MONEY SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <MoneyCard
          title="Total Price"
          value={formatCurrency(totalPrice)}
          description={`${totalItems} shopping item${
            totalItems === 1 ? "" : "s"
          }`}
          icon={
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
          }
        />

        <MoneyCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          description={`${paymentProgress}% of shopping cost paid`}
          icon={
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          }
        />

        <MoneyCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          description="Amount still to pay"
          icon={
            <Wallet className="h-5 w-5 text-orange-600" />
          }
        />

      </div>

      {/* PAYMENT PROGRESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Payment Progress
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {formatCurrency(totalPaid)} paid of{" "}
                {formatCurrency(totalPrice)}
              </p>
            </div>

            <span className="text-3xl font-bold text-emerald-600">
              {paymentProgress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${paymentProgress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* SHOPPING PROGRESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Shopping Progress
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {purchasedItems} of {totalItems} items purchased
              </p>
            </div>

            <span className="text-3xl font-bold text-emerald-600">
              {shoppingProgress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${shoppingProgress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ADD ITEM */}

      <Card>
        <CardContent className="p-6">

          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />

            <h2 className="text-xl font-bold">
              Add Shopping Item
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Add something you need to buy for this event.
          </p>

          <form
            action={addShoppingItem}
            className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <input
              type="hidden"
              name="event_id"
              value={eventId}
            />

            {/* NAME */}

            <FormField
              label="Item Name"
              name="name"
              placeholder="e.g. Wedding Shoes"
              required
            />

            {/* CATEGORY */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>

              <select
                name="category"
                defaultValue="Other"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* QUANTITY */}

            <NumberField
              label="Quantity"
              name="quantity"
              defaultValue="1"
              min="1"
              step="1"
            />

            {/* PRICE */}

            <NumberField
              label="Price"
              name="price"
              placeholder="5000"
              min="0"
              step="0.01"
            />

            {/* PAID */}

            <NumberField
              label="Paid"
              name="paid"
              placeholder="2000"
              min="0"
              step="0.01"
            />

            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* SHOPPING LIST */}

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            Shopping List
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {totalItems} item
            {totalItems === 1 ? "" : "s"} in your list
          </p>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />

              <h3 className="mt-4 text-lg font-semibold">
                No shopping items yet
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Add your first shopping item above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">

            {items.map((item) => {
              const balance = getBalance(
                item.price,
                item.paid
              );

              return (
                <Card
                  key={item.id}
                  className={
                    item.purchased
                      ? "border-emerald-200 bg-emerald-50/20"
                      : ""
                  }
                >
                  <CardContent className="p-5">

                    {/* ITEM HEADER */}

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                      <div className="flex items-start gap-4">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            item.purchased
                              ? "bg-emerald-100"
                              : "bg-muted"
                          }`}
                        >
                          {item.purchased ? (
                            <Check className="h-5 w-5 text-emerald-600" />
                          ) : (
                            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>

                        <div>
                          <h3
                            className={`text-lg font-semibold ${
                              item.purchased
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                          >
                            {item.name}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-muted px-2.5 py-1">
                              {item.category}
                            </span>

                            <span className="rounded-full bg-muted px-2.5 py-1">
                              Quantity: {item.quantity}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 ${
                                item.purchased
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {item.purchased
                                ? "Purchased"
                                : "Pending"}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        <form
                          action={toggleShoppingItem.bind(
                            null,
                            item.id,
                            eventId,
                            !item.purchased
                          )}
                        >
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                          >
                            {item.purchased
                              ? "Mark Pending"
                              : "Mark Purchased"}
                          </Button>
                        </form>

                        <form
                          action={deleteShoppingItem.bind(
                            null,
                            item.id,
                            eventId
                          )}
                        >
                          <Button
                            type="submit"
                            variant="outline"
                            size="icon"
                            title="Delete item"
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>

                      </div>
                    </div>

                    {/* MONEY DETAILS */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">

                      <InfoBox
                        label="Price"
                        value={formatCurrency(item.price)}
                      />

                      <InfoBox
                        label="Paid"
                        value={formatCurrency(item.paid)}
                        valueClassName="text-emerald-600"
                      />

                      <InfoBox
                        label="Balance"
                        value={formatCurrency(balance)}
                        valueClassName={
                          balance > 0
                            ? "text-orange-600"
                            : "text-emerald-600"
                        }
                      />

                    </div>

                    {/* EDIT */}

                    <details className="mt-5">
                      <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-600">
                        <Pencil className="h-4 w-4" />
                        Edit Item
                      </summary>

                      <form
                        action={updateShoppingItem}
                        className="mt-4 grid gap-4 rounded-xl border bg-muted/20 p-4 md:grid-cols-2 lg:grid-cols-3"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={item.id}
                        />

                        <input
                          type="hidden"
                          name="event_id"
                          value={eventId}
                        />

                        <FormField
                          label="Item Name"
                          name="name"
                          defaultValue={item.name}
                          required
                        />

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Category
                          </label>

                          <select
                            name="category"
                            defaultValue={item.category}
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          >
                            {categories.map((category) => (
                              <option
                                key={category}
                                value={category}
                              >
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <NumberField
                          label="Quantity"
                          name="quantity"
                          defaultValue={String(item.quantity)}
                          min="1"
                          step="1"
                        />

                        <NumberField
                          label="Price"
                          name="price"
                          defaultValue={String(item.price)}
                          min="0"
                          step="0.01"
                        />

                        <NumberField
                          label="Paid"
                          name="paid"
                          defaultValue={String(item.paid)}
                          min="0"
                          step="0.01"
                        />

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Status
                          </label>

                          <select
                            name="purchased"
                            defaultValue={
                              item.purchased
                                ? "true"
                                : "false"
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          >
                            <option value="false">
                              Pending
                            </option>

                            <option value="true">
                              Purchased
                            </option>
                          </select>
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                          <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </details>

                  </CardContent>
                </Card>
              );
            })}

          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="flex justify-end">
        <Link
          href={`/dashboard?event=${eventId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:underline"
        >
          Back to Dashboard
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}

/* ---------------- MONEY CARD ---------------- */

function MoneyCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <p className="mt-2 text-2xl font-bold">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- FORM FIELD ---------------- */

function FormField({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <input
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
      />
    </div>
  );
}

/* ---------------- NUMBER FIELD ---------------- */

function NumberField({
  label,
  name,
  placeholder,
  defaultValue,
  min,
  step,
}: {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  min?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label}
      </label>

      <input
        name={name}
        type="number"
        min={min}
        step={step}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
      />
    </div>
  );
}

/* ---------------- INFO BOX ---------------- */

function InfoBox({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p
        className={`mt-1 font-semibold ${valueClassName}`}
      >
        {value}
      </p>
    </div>
  );
}