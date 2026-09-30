import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Phone,
  Plus,
  Store,
  Wallet,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { addVendor, deleteVendor } from "./actions";

export const dynamic = "force-dynamic";

/* =========================================================
   TYPES
========================================================= */

type EventData = {
  id: string;
  name: string;
};

type Vendor = {
  id: string;
  event_id: string;
  name: string;
  category: string | null;
  phone: string | null;
  email: string | null;
  total_amount: number | null;
  advance_paid: number | null;
  rating: number | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

interface VendorsPageProps {
  searchParams?: Promise<{
    event?: string;
  }>;
}

/* =========================================================
   PAGE
========================================================= */

export default async function VendorsPage({
  searchParams,
}: VendorsPageProps) {
  const params = searchParams
    ? await searchParams
    : {};

  const eventId =
    params.event || "";

  /*
   * Cast Supabase client to any.
   *
   * This avoids the "never" inference errors caused by
   * incomplete/generated Supabase database types.
   */
  const supabase = (await createClient()) as any;

  /* =======================================================
     EVENTS
  ======================================================= */

  const {
    data: rawEvents,
    error: eventsError,
  } = await supabase
    .from("events")
    .select("id, name")
    .order("created_at", {
      ascending: false,
    });

  if (eventsError) {
    console.error(
      "Failed to load events:",
      eventsError
    );
  }

  const events: EventData[] =
    Array.isArray(rawEvents)
      ? rawEvents.map(
          (item: any) => ({
            id: String(item.id),
            name: String(
              item.name ||
                "Untitled Event"
            ),
          })
        )
      : [];

  /* =======================================================
     SELECT EVENT
  ======================================================= */

  const selectedEvent: EventData | null =
    eventId
      ? events.find(
          (event) =>
            event.id === eventId
        ) || null
      : events[0] || null;

  const selectedEventId =
    selectedEvent?.id || "";

  /* =======================================================
     VENDORS
  ======================================================= */

  let vendors: Vendor[] = [];

  if (selectedEventId) {
    const {
      data: rawVendors,
      error: vendorsError,
    } = await supabase
      .from("vendors")
      .select("*")
      .eq(
        "event_id",
        selectedEventId
      )
      .order("created_at", {
        ascending: false,
      });

    if (vendorsError) {
      console.error(
        "Failed to load vendors:",
        vendorsError
      );
    }

    vendors = Array.isArray(
      rawVendors
    )
      ? rawVendors.map(
          (item: any): Vendor => ({
            id: String(item.id),

            event_id: String(
              item.event_id
            ),

            name: String(
              item.name ||
                "Unnamed Vendor"
            ),

            category:
              item.category != null
                ? String(
                    item.category
                  )
                : null,

            phone:
              item.phone != null
                ? String(
                    item.phone
                  )
                : null,

            email:
              item.email != null
                ? String(
                    item.email
                  )
                : null,

            total_amount:
              item.total_amount ==
              null
                ? 0
                : Number(
                    item.total_amount
                  ),

            advance_paid:
              item.advance_paid ==
              null
                ? 0
                : Number(
                    item.advance_paid
                  ),

            rating:
              item.rating == null
                ? null
                : Number(
                    item.rating
                  ),

            notes:
              item.notes != null
                ? String(
                    item.notes
                  )
                : null,

            created_at:
              item.created_at != null
                ? String(
                    item.created_at
                  )
                : null,

            updated_at:
              item.updated_at != null
                ? String(
                    item.updated_at
                  )
                : null,
          })
        )
      : [];
  }

  /* =======================================================
     STATS
  ======================================================= */

  const totalVendors =
    vendors.length;

  const totalCost =
    vendors.reduce(
      (sum, vendor) =>
        sum +
        Number(
          vendor.total_amount || 0
        ),
      0
    );

  const advancePaid =
    vendors.reduce(
      (sum, vendor) =>
        sum +
        Number(
          vendor.advance_paid || 0
        ),
      0
    );

  const remaining =
    Math.max(
      0,
      totalCost - advancePaid
    );

  const paymentProgress =
    totalCost > 0
      ? Math.round(
          (advancePaid /
            totalCost) *
            100
        )
      : 0;

  const fullyPaidVendors =
    vendors.filter(
      (vendor) =>
        Number(
          vendor.advance_paid || 0
        ) >=
        Number(
          vendor.total_amount || 0
        )
    ).length;

  /* =======================================================
     HELPERS
  ======================================================= */

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

  function formatDate(
    value: string | null
  ) {
    if (!value) {
      return "No date";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "No date";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  /* =======================================================
     NO EVENT
  ======================================================= */

  if (!selectedEventId) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-emerald-600" />

            <h1 className="text-4xl font-bold">
              Vendors
            </h1>
          </div>

          <p className="mt-2 text-muted-foreground">
            Manage wedding vendors,
            payments and contacts.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Store className="mb-4 h-14 w-14 text-emerald-600" />

            <h2 className="text-xl font-semibold">
              Select an event
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create an event or select
              an existing event before
              managing vendors.
            </p>

            <Link
              href="/dashboard/events"
              className="mt-6"
            >
              <Button>
                View Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Store className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Vendors
              </h1>

              <p className="mt-1 text-muted-foreground">
                Manage vendors for{" "}
                <span className="font-medium text-foreground">
                  {selectedEvent?.name ||
                    "this event"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/dashboard/vendors?event=${encodeURIComponent(
            selectedEventId
          )}`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Manage Vendors
          </Button>
        </Link>
      </div>

      {/* ===================================================
          EVENT SELECTOR
      =================================================== */}

      {events.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Current Event
                </p>

                <p className="text-sm text-muted-foreground">
                  {selectedEvent?.name ||
                    "Select an event"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {events.map(
                  (event) => (
                    <Link
                      key={event.id}
                      href={`/dashboard/vendors?event=${encodeURIComponent(
                        event.id
                      )}`}
                    >
                      <Button
                        size="sm"
                        variant={
                          event.id ===
                          selectedEventId
                            ? "default"
                            : "outline"
                        }
                      >
                        {event.name}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===================================================
          STATS
      =================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vendors"
          value={String(
            totalVendors
          )}
          icon={
            <Store className="h-5 w-5" />
          }
        />

        <StatCard
          title="Total Cost"
          value={formatCurrency(
            totalCost
          )}
          icon={
            <CircleDollarSign className="h-5 w-5" />
          }
        />

        <StatCard
          title="Advance Paid"
          value={formatCurrency(
            advancePaid
          )}
          icon={
            <Wallet className="h-5 w-5" />
          }
        />

        <StatCard
          title="Remaining"
          value={formatCurrency(
            remaining
          )}
          icon={
            <Building2 className="h-5 w-5" />
          }
        />
      </div>

      {/* ===================================================
          PAYMENT PROGRESS
      =================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Vendor Payment Progress
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Amount paid
              </p>

              <p className="mt-1 text-xl font-bold">
                {formatCurrency(
                  advancePaid
                )}{" "}
                /{" "}
                {formatCurrency(
                  totalCost
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-emerald-600">
                {paymentProgress}%
              </p>

              <p className="text-xs text-muted-foreground">
                paid
              </p>
            </div>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  paymentProgress
                )}%`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            <span>
              {fullyPaidVendors} of{" "}
              {totalVendors} vendors
              fully paid
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ===================================================
          ADD VENDOR
      =================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>
            Add Vendor
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action={addVendor}
            className="grid gap-4 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="event_id"
              value={selectedEventId}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Vendor Name
              </label>

              <input
                name="name"
                required
                placeholder="Photography Studio"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <input
                name="category"
                placeholder="Photography"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phone
              </label>

              <input
                name="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <input
                name="email"
                type="email"
                placeholder="vendor@example.com"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Total Amount
              </label>

              <input
                name="total_amount"
                type="number"
                min="0"
                step="1"
                placeholder="50000"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Advance Paid
              </label>

              <input
                name="advance_paid"
                type="number"
                min="0"
                step="1"
                placeholder="10000"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Rating
              </label>

              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="4.5"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notes
              </label>

              <input
                name="notes"
                placeholder="Additional details"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ===================================================
          VENDOR LIST
      =================================================== */}

      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Vendor List
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              All vendors connected to this
              event
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {totalVendors}{" "}
            {totalVendors === 1
              ? "vendor"
              : "vendors"}
          </span>
        </div>

        {vendors.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Store className="mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No vendors yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add photographers,
                caterers, decorators,
                venues and other
                wedding vendors above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {vendors.map(
              (vendor) => {
                const total =
                  Number(
                    vendor.total_amount ||
                      0
                  );

                const paid =
                  Number(
                    vendor.advance_paid ||
                      0
                  );

                const balance =
                  Math.max(
                    0,
                    total - paid
                  );

                const vendorProgress =
                  total > 0
                    ? Math.round(
                        Math.min(
                          100,
                          (paid /
                            total) *
                            100
                        )
                      )
                    : 0;

                const isPaid =
                  total > 0 &&
                  paid >= total;

                return (
                  <Card
                    key={vendor.id}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-6">
                      {/* TOP */}

                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-xl font-semibold">
                              {
                                vendor.name
                              }
                            </h3>

                            {isPaid && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                Paid
                              </span>
                            )}
                          </div>

                          {vendor.category && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {
                                vendor.category
                              }
                            </p>
                          )}
                        </div>

                        {vendor.rating !=
                          null && (
                          <div className="shrink-0 rounded-lg bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-700">
                            ★{" "}
                            {vendor.rating.toFixed(
                              1
                            )}
                          </div>
                        )}
                      </div>

                      {/* CONTACT */}

                      <div className="mt-5 space-y-2">
                        {vendor.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />

                            <span>
                              {
                                vendor.phone
                              }
                            </span>
                          </div>
                        )}

                        {vendor.email && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="text-base">
                              ✉
                            </span>

                            <span className="truncate">
                              {
                                vendor.email
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      {/* MONEY */}

                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <MoneyBox
                          label="Total"
                          value={formatCurrency(
                            total
                          )}
                        />

                        <MoneyBox
                          label="Paid"
                          value={formatCurrency(
                            paid
                          )}
                        />

                        <MoneyBox
                          label="Balance"
                          value={formatCurrency(
                            balance
                          )}
                        />
                      </div>

                      {/* PROGRESS */}

                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Payment progress
                          </span>

                          <span className="font-semibold">
                            {
                              vendorProgress
                            }
                            %
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-600"
                            style={{
                              width: `${vendorProgress}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* NOTES */}

                      {vendor.notes && (
                        <div className="mt-5 rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            Notes
                          </p>

                          <p className="mt-1 text-sm">
                            {
                              vendor.notes
                            }
                          </p>
                        </div>
                      )}

                      {/* FOOTER */}

                      <div className="mt-5 flex items-center justify-between border-t pt-4">
                        <p className="text-xs text-muted-foreground">
                          Added{" "}
                          {formatDate(
                            vendor.created_at
                          )}
                        </p>

                        <div className="flex items-center gap-2">
                          <form
                            action={
                              async () => {
                                "use server";

                                await deleteVendor(
                                  vendor.id,
                                  selectedEventId
                                );
                              }
                            }
                          >
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </form>

                          <Link
                            href={`/dashboard/vendors?event=${encodeURIComponent(
                              selectedEventId
                            )}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              View
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-2xl font-bold">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   MONEY BOX
========================================================= */

function MoneyBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}