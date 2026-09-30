import Link from "next/link";

import {
  Users,
  UserPlus,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  XCircle,
  HelpCircle,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  addGuest,
  deleteGuest,
  updateGuestRsvp,
} from "./actions";

export const dynamic = "force-dynamic";

type GuestData = {
  id: string;
  event_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  category: string | null;
  side: string | null;
  rsvp_status: string | null;
  plus_one: boolean | null;
  plus_one_name: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type EventData = {
  id: string;
  name: string;
  slug: string | null;
  event_date: string | null;
};

interface GuestsPageProps {
  searchParams: Promise<{
    event?: string;
  }>;
}

export default async function GuestsPage({
  searchParams,
}: GuestsPageProps) {
  const params = await searchParams;

  const eventId =
    params.event || "";

  const supabase =
    (await createClient()) as any;

  /* -------------------------------------------------
     EVENT
  ------------------------------------------------- */

  let eventData: EventData | null =
    null;

  if (eventId) {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (data) {
      eventData = {
        id: String(data.id),
        name: String(
          data.name || "Your Wedding"
        ),
        slug:
          data.slug ?? null,
        event_date:
          data.event_date ?? null,
      };
    }
  }

  /* -------------------------------------------------
     GUESTS
  ------------------------------------------------- */

  let guests: GuestData[] = [];

  if (eventId) {
    const { data, error } =
      await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "Failed to load guests:",
        error
      );
    }

    guests = (data ?? []).map(
      (guest: any) => ({
        id: String(guest.id),
        event_id: String(
          guest.event_id
        ),
        name: String(
          guest.name || "Unnamed Guest"
        ),
        phone:
          guest.phone ?? null,
        email:
          guest.email ?? null,
        category:
          guest.category ?? null,
        side:
          guest.side ?? null,
        rsvp_status:
          guest.rsvp_status ??
          "pending",
        plus_one:
          Boolean(
            guest.plus_one
          ),
        plus_one_name:
          guest.plus_one_name ??
          null,
        notes:
          guest.notes ?? null,
        created_at:
          guest.created_at ?? null,
        updated_at:
          guest.updated_at ?? null,
      })
    );
  }

  /* -------------------------------------------------
     STATS
  ------------------------------------------------- */

  const totalGuests =
    guests.length;

  const acceptedGuests =
    guests.filter(
      (guest) =>
        normalizeStatus(
          guest.rsvp_status
        ) === "accepted"
    ).length;

  const pendingGuests =
    guests.filter(
      (guest) =>
        normalizeStatus(
          guest.rsvp_status
        ) === "pending"
    ).length;

  const declinedGuests =
    guests.filter(
      (guest) =>
        normalizeStatus(
          guest.rsvp_status
        ) === "declined"
    ).length;

  /* -------------------------------------------------
     NO EVENT SELECTED
  ------------------------------------------------- */

  if (!eventId) {
    return (
      <div className="space-y-8">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Guests
          </h1>

          <p className="mt-2 text-muted-foreground">
            Select an event to manage your
            guest list.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Select an event
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Open an event from the Events page
              to manage its guests.
            </p>

            <Link
              href="/dashboard/events"
              className="mt-6"
            >
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go to Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------------------------------------------------
     PAGE
  ------------------------------------------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Link
            href={`/dashboard/events/${eventData?.slug || ""}`}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>

          <p className="text-sm font-medium text-emerald-600">
            Guest Management
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Guests
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage guests for{" "}
            <span className="font-medium text-foreground">
              {eventData?.name ||
                "your wedding"}
            </span>
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Guests"
          value={totalGuests}
          icon={
            <Users className="h-5 w-5 text-emerald-600" />
          }
        />

        <StatCard
          title="Accepted"
          value={acceptedGuests}
          icon={
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          }
        />

        <StatCard
          title="Pending"
          value={pendingGuests}
          icon={
            <Clock3 className="h-5 w-5 text-orange-500" />
          }
        />

        <StatCard
          title="Declined"
          value={declinedGuests}
          icon={
            <XCircle className="h-5 w-5 text-red-500" />
          }
        />
      </div>

      {/* ADD GUEST */}

      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <UserPlus className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Add Guest
              </h2>

              <p className="text-sm text-muted-foreground">
                Add a new guest to your wedding.
              </p>
            </div>
          </div>

          <form
            action={addGuest}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            <input
              type="hidden"
              name="event_id"
              value={eventId}
            />

            <FormField
              name="name"
              label="Guest Name"
              placeholder="Enter guest name"
              required
            />

            <FormField
              name="phone"
              label="Phone"
              placeholder="Phone number"
            />

            <FormField
              name="email"
              label="Email"
              placeholder="Email address"
              type="email"
            />

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <select
                name="category"
                defaultValue=""
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">
                  Select category
                </option>
                <option value="Family">
                  Family
                </option>
                <option value="Friends">
                  Friends
                </option>
                <option value="Colleagues">
                  Colleagues
                </option>
                <option value="Relatives">
                  Relatives
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Side
              </label>

              <select
                name="side"
                defaultValue=""
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="">
                  Select side
                </option>
                <option value="Bride">
                  Bride
                </option>
                <option value="Groom">
                  Groom
                </option>
                <option value="Both">
                  Both
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                RSVP Status
              </label>

              <select
                name="rsvp_status"
                defaultValue="pending"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="pending">
                  Pending
                </option>
                <option value="accepted">
                  Accepted
                </option>
                <option value="declined">
                  Declined
                </option>
                <option value="invited">
                  Invited
                </option>
              </select>
            </div>

            <FormField
              name="plus_one_name"
              label="Plus One Name"
              placeholder="Optional"
            />

            <div className="md:col-span-2 lg:col-span-3">
              <label className="mb-2 block text-sm font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                rows={3}
                placeholder="Optional notes..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="plus_one"
                  value="true"
                  className="h-4 w-4 rounded border"
                />

                <span>
                  Guest has a plus one
                </span>
              </label>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Guest
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* GUEST LIST */}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Guest List
            </h2>

            <p className="text-sm text-muted-foreground">
              {totalGuests}{" "}
              {totalGuests === 1
                ? "guest"
                : "guests"}
            </p>
          </div>
        </div>

        {guests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No guests yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Add your first guest using the form
                above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {guests.map(
              (guest: GuestData) => {
                const status =
                  normalizeStatus(
                    guest.rsvp_status
                  );

                const deleteAction =
                  deleteGuest.bind(
                    null,
                    guest.id,
                    eventId
                  );

                const acceptedAction =
                  updateGuestRsvp.bind(
                    null,
                    guest.id,
                    eventId,
                    "accepted"
                  );

                const pendingAction =
                  updateGuestRsvp.bind(
                    null,
                    guest.id,
                    eventId,
                    "pending"
                  );

                const declinedAction =
                  updateGuestRsvp.bind(
                    null,
                    guest.id,
                    eventId,
                    "declined"
                  );

                return (
                  <Card
                    key={guest.id}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-5">
                      {/* NAME */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold">
                            {guest.name}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-2">
                            {guest.category && (
                              <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                                {guest.category}
                              </span>
                            )}

                            {guest.side && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">
                                {guest.side}
                              </span>
                            )}
                          </div>
                        </div>

                        <RsvpBadge
                          status={status}
                        />
                      </div>

                      {/* DETAILS */}

                      <div className="mt-5 space-y-2 text-sm text-muted-foreground">
                        {guest.phone && (
                          <p>
                            <span className="font-medium text-foreground">
                              Phone:
                            </span>{" "}
                            {guest.phone}
                          </p>
                        )}

                        {guest.email && (
                          <p className="break-all">
                            <span className="font-medium text-foreground">
                              Email:
                            </span>{" "}
                            {guest.email}
                          </p>
                        )}

                        {guest.plus_one && (
                          <p>
                            <span className="font-medium text-foreground">
                              Plus One:
                            </span>{" "}
                            {guest.plus_one_name ||
                              "Yes"}
                          </p>
                        )}

                        {guest.notes && (
                          <p>
                            <span className="font-medium text-foreground">
                              Notes:
                            </span>{" "}
                            {guest.notes}
                          </p>
                        )}
                      </div>

                      {/* RSVP BUTTONS */}

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <form
                          action={
                            acceptedAction
                          }
                        >
                          <button
                            type="submit"
                            className={`w-full rounded-md border px-2 py-2 text-xs font-medium transition ${
                              status ===
                              "accepted"
                                ? "border-green-600 bg-green-600 text-white"
                                : "hover:bg-green-50"
                            }`}
                          >
                            Accept
                          </button>
                        </form>

                        <form
                          action={
                            pendingAction
                          }
                        >
                          <button
                            type="submit"
                            className={`w-full rounded-md border px-2 py-2 text-xs font-medium transition ${
                              status ===
                              "pending"
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "hover:bg-orange-50"
                            }`}
                          >
                            Pending
                          </button>
                        </form>

                        <form
                          action={
                            declinedAction
                          }
                        >
                          <button
                            type="submit"
                            className={`w-full rounded-md border px-2 py-2 text-xs font-medium transition ${
                              status ===
                              "declined"
                                ? "border-red-500 bg-red-500 text-white"
                                : "hover:bg-red-50"
                            }`}
                          >
                            Decline
                          </button>
                        </form>
                      </div>

                      {/* DELETE */}

                      <form
                        action={
                          deleteAction
                        }
                        className="mt-3"
                      >
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Guest
                        </button>
                      </form>
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

/* -------------------------------------------------
   STAT CARD
------------------------------------------------- */

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            {icon}
          </div>

          <span className="text-3xl font-bold">
            {value}
          </span>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {title}
        </p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------
   FORM FIELD
------------------------------------------------- */

function FormField({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-emerald-500"
      />
    </div>
  );
}

/* -------------------------------------------------
   RSVP BADGE
------------------------------------------------- */

function RsvpBadge({
  status,
}: {
  status: string;
}) {
  if (status === "accepted") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Accepted
      </span>
    );
  }

  if (status === "declined") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
        <XCircle className="h-3.5 w-3.5" />
        Declined
      </span>
    );
  }

  if (status === "invited") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
        <HelpCircle className="h-3.5 w-3.5" />
        Invited
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
      <Clock3 className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

/* -------------------------------------------------
   STATUS NORMALIZER
------------------------------------------------- */

function normalizeStatus(
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

  if (value === "invited") {
    return "invited";
  }

  return "pending";
}