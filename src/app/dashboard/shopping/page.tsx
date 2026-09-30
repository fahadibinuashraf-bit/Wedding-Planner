import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
  Trash2,
  Pencil,
  Plus,
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
  estimated_price: number;
  actual_price: number;
  purchased: boolean;
};

interface ShoppingPageProps {
  searchParams: Promise<{
    event?: string;
  }>;
}

export default async function ShoppingPage({
  searchParams,
}: ShoppingPageProps) {
  const params = await searchParams;

  const eventIdFromUrl =
    params.event || "";

  const supabase =
    (await createClient()) as any;

  /* -------------------------------------------------
     LOAD EVENTS
  ------------------------------------------------- */

  const { data: rawEvents } =
    await supabase
      .from("events")
      .select("*");

  const events: EventData[] = (
    rawEvents ?? []
  ).map((event: any) => ({
    id: String(event.id),

    name: String(
      event.name || "Your Wedding"
    ),

    event_date:
      event.event_date ?? null,
  }));

  /* -------------------------------------------------
     SELECT EVENT
  ------------------------------------------------- */

  const selectedEvent =
    events.find(
      (event) =>
        event.id ===
        eventIdFromUrl
    ) ||
    events[0] ||
    null;

  /* -------------------------------------------------
     NO EVENT
  ------------------------------------------------- */

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
            Manage everything you need to buy
            for your wedding.
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
              Create a wedding event first before
              adding shopping items.
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

  const eventId =
    selectedEvent.id;

  /* -------------------------------------------------
     LOAD SHOPPING ITEMS
  ------------------------------------------------- */

  const { data: rawItems } =
    await supabase
      .from("shopping_items")
      .select("*")
      .eq(
        "event_id",
        eventId
      )
      .order("created_at", {
        ascending: false,
      });

  const items: ShoppingItem[] = (
    rawItems ?? []
  ).map((item: any) => ({
    id: String(item.id),

    event_id: String(
      item.event_id
    ),

    name: String(
      item.name || "Shopping Item"
    ),

    category: String(
      item.category || "Other"
    ),

    quantity: Number(
      item.quantity || 1
    ),

    estimated_price: Number(
      item.estimated_price || 0
    ),

    actual_price: Number(
      item.actual_price || 0
    ),

    purchased: Boolean(
      item.purchased
    ),
  }));

  /* -------------------------------------------------
     CALCULATIONS
  ------------------------------------------------- */

  const totalItems =
    items.length;

  const purchasedItems =
    items.filter(
      (item) =>
        item.purchased
    ).length;

  const pendingItems =
    totalItems -
    purchasedItems;

  const estimatedTotal =
    items.reduce(
      (total, item) =>
        total +
        item.estimated_price *
          item.quantity,
      0
    );

  const actualTotal =
    items.reduce(
      (total, item) =>
        total +
        item.actual_price *
          item.quantity,
      0
    );

  const progress =
    totalItems > 0
      ? Math.round(
          (purchasedItems /
            totalItems) *
            100
        )
      : 0;

  /* -------------------------------------------------
     RENDER
  ------------------------------------------------- */

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
      </div>

      {/* EVENT SWITCHER */}

      {events.length > 1 && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 p-5">
            <span className="mr-2 text-sm font-medium">
              Event:
            </span>

            {events.map(
              (event) => (
                <Link
                  key={event.id}
                  href={`/dashboard/shopping?event=${event.id}`}
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
          </CardContent>
        </Card>
      )}

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Items"
          value={String(
            totalItems
          )}
          description="Shopping items"
        />

        <StatCard
          title="Purchased"
          value={String(
            purchasedItems
          )}
          description={`${progress}% completed`}
        />

        <StatCard
          title="Estimated"
          value={formatCurrency(
            estimatedTotal
          )}
          description="Estimated total"
        />

        <StatCard
          title="Actual"
          value={formatCurrency(
            actualTotal
          )}
          description={`${pendingItems} pending`}
        />
      </div>

      {/* PROGRESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Shopping Progress
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {purchasedItems} of{" "}
                {totalItems} items purchased
              </p>
            </div>

            <span className="text-3xl font-bold text-emerald-600">
              {progress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${progress}%`,
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

          <form
            action={addShoppingItem}
            className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <input
              type="hidden"
              name="event_id"
              value={eventId}
            />

            <div>
              <label className="mb-1 block text-sm font-medium">
                Item Name
              </label>

              <input
                name="name"
                required
                placeholder="e.g. Wedding Shoes"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Category
              </label>

              <select
                name="category"
                defaultValue="Other"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              >
                <option value="Clothing">
                  Clothing
                </option>

                <option value="Gifts">
                  Gifts
                </option>

                <option value="Decoration">
                  Decoration
                </option>

                <option value="Jewellery">
                  Jewellery
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Beauty">
                  Beauty
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Quantity
              </label>

              <input
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
                required
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Estimated Price
              </label>

              <input
                name="estimated_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Actual Price
              </label>

              <input
                name="actual_price"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>

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

      {/* ITEMS */}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Shopping List
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {totalItems} item
              {totalItems === 1
                ? ""
                : "s"} in your list
            </p>
          </div>
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
            {items.map(
              (item) => (
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
                              Quantity:{" "}
                              {item.quantity}
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

                      <div className="flex items-center gap-2">
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

                    {/* ITEM DETAILS */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <InfoBox
                        label="Quantity"
                        value={String(
                          item.quantity
                        )}
                      />

                      <InfoBox
                        label="Estimated"
                        value={formatCurrency(
                          item.estimated_price *
                            item.quantity
                        )}
                      />

                      <InfoBox
                        label="Actual"
                        value={formatCurrency(
                          item.actual_price *
                            item.quantity
                        )}
                      />
                    </div>

                    {/* INLINE EDIT */}

                    <details className="mt-5">
                      <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-emerald-600">
                        <Pencil className="h-4 w-4" />
                        Edit Item
                      </summary>

                      <form
                        action={
                          updateShoppingItem
                        }
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

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Item Name
                          </label>

                          <input
                            name="name"
                            defaultValue={
                              item.name
                            }
                            required
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Category
                          </label>

                          <select
                            name="category"
                            defaultValue={
                              item.category
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          >
                            <option value="Clothing">
                              Clothing
                            </option>

                            <option value="Gifts">
                              Gifts
                            </option>

                            <option value="Decoration">
                              Decoration
                            </option>

                            <option value="Jewellery">
                              Jewellery
                            </option>

                            <option value="Food">
                              Food
                            </option>

                            <option value="Beauty">
                              Beauty
                            </option>

                            <option value="Accessories">
                              Accessories
                            </option>

                            <option value="Other">
                              Other
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Quantity
                          </label>

                          <input
                            name="quantity"
                            type="number"
                            min="1"
                            defaultValue={
                              item.quantity
                            }
                            required
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Estimated Price
                          </label>

                          <input
                            name="estimated_price"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={
                              item.estimated_price
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Actual Price
                          </label>

                          <input
                            name="actual_price"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={
                              item.actual_price
                            }
                            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
                          />
                        </div>

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
              )
            )}
          </div>
        )}
      </div>

      {/* FOOTER LINK */}

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

/* -------------------------------------------------
   STAT CARD
------------------------------------------------- */

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground">
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
    <div className="rounded-lg bg-muted/50 p-3">
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