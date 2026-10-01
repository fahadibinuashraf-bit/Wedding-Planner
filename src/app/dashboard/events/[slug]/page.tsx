import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarHeart,
  CheckCircle2,
  ShoppingBag,
  Users,
  Wallet,
  Store,
  ListTodo,
  TrendingUp,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  deleteEvent,
  updateEvent,
} from "../actions";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

type EventData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  event_type: string | null;
  color_gradient: string | null;
  completion_pct: number | null;
};

type CountResult = {
  count: number | null;
};

export default async function EventDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const supabase =
    (await createClient()) as any;

  /* ---------------- EVENT ---------------- */

  const eventResult = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (
    eventResult.error ||
    !eventResult.data
  ) {
    notFound();
  }

  const event =
    eventResult.data as EventData;

  /* ---------------- COUNTS ---------------- */

  const [
    tasksResult,
    guestsResult,
    vendorsResult,
    shoppingResult,
    budgetResult,
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("event_id", event.id),

    supabase
      .from("guests")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("event_id", event.id),

    supabase
      .from("vendors")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("event_id", event.id),

    supabase
      .from("shopping_items")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("event_id", event.id),

    supabase
      .from("budget_items")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("event_id", event.id),
  ]);

  const taskCount = Number(
    (tasksResult as CountResult)
      .count ?? 0
  );

  const guestCount = Number(
    (guestsResult as CountResult)
      .count ?? 0
  );

  const vendorCount = Number(
    (vendorsResult as CountResult)
      .count ?? 0
  );

  const shoppingCount = Number(
    (shoppingResult as CountResult)
      .count ?? 0
  );

  const budgetCount = Number(
    (budgetResult as CountResult)
      .count ?? 0
  );

  /* ---------------- PROGRESS ---------------- */

  const progress = Math.min(
    100,
    Math.max(
      0,
      Number(
        event.completion_pct ?? 0
      )
    )
  );

  /* ---------------- DATE ---------------- */

  let formattedDate =
    "Date not set";

  if (event.event_date) {
    const date = new Date(
      event.event_date
    );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      formattedDate =
        date.toLocaleDateString(
          "en-IN",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
    }
  }

  /* ---------------- EDIT DATE ---------------- */

  const editDate = event.event_date
    ? event.event_date.slice(0, 10)
    : "";

  /* ---------------- LINKS ---------------- */

  const eventQuery =
    `?event=${encodeURIComponent(
      event.id
    )}`;

  return (
    <div className="space-y-8">
      {/* BACK */}

      <Link
        href="/dashboard/events"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      {/* EVENT HEADER */}

      <Card className="overflow-hidden">
        <div className="bg-gradient-emerald-gold p-6 text-white md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-white/80">
                  <CalendarHeart className="h-5 w-5" />

                  <span className="text-sm font-medium">
                    Event Workspace
                  </span>
                </div>

                <h1 className="font-display text-4xl font-bold md:text-5xl">
                  {event.name}
                </h1>

                <p className="mt-3 text-white/90">
                  {formattedDate}
                </p>

                {event.description && (
                  <p className="mt-2 max-w-2xl text-sm text-white/80">
                    {event.description}
                  </p>
                )}
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-white/80">
                  Planning Progress
                </p>

                <p className="mt-1 text-5xl font-bold">
                  {progress}%
                </p>
              </div>
            </div>

            {/* EVENT ACTIONS */}

            <div className="flex flex-wrap gap-3 border-t border-white/20 pt-5">
              <a
                href="#edit-event"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-white/90"
              >
                <Pencil className="h-4 w-4" />
                Edit Event
              </a>

              <form
                action={deleteEvent.bind(
                  null,
                  event.id
                )}
              >
                <Button
                  type="submit"
                  variant="outline"
                  className="border-white/50 bg-white/10 text-white hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Event
                </Button>
              </form>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="h-4 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* EDIT EVENT */}

      <Card
        id="edit-event"
        className="scroll-mt-24"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-emerald-600" />

            <div>
              <h2 className="text-2xl font-bold">
                Edit Event
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the details of this event.
              </p>
            </div>
          </div>

          <form
            action={updateEvent}
            className="mt-6 space-y-5"
          >
            <input
              type="hidden"
              name="id"
              value={event.id}
            />

            <div className="grid gap-5 md:grid-cols-2">
              {/* EVENT NAME */}

              <div className="space-y-2">
                <label
                  htmlFor="event-name"
                  className="text-sm font-medium"
                >
                  Event Name
                </label>

                <input
                  id="event-name"
                  name="name"
                  defaultValue={event.name}
                  required
                  className="flex h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* EVENT TYPE */}

              <div className="space-y-2">
                <label
                  htmlFor="event-type"
                  className="text-sm font-medium"
                >
                  Event Type
                </label>

                <select
                  id="event-type"
                  name="event_type"
                  defaultValue={
                    event.event_type ||
                    "Wedding"
                  }
                  className="flex h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Wedding">
                    Wedding
                  </option>

                  <option value="Nikah">
                    Nikah
                  </option>

                  <option value="Reception">
                    Reception
                  </option>

                  <option value="Mehendi">
                    Mehendi
                  </option>

                  <option value="Haldi">
                    Haldi
                  </option>

                  <option value="Engagement">
                    Engagement
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {/* EVENT DATE */}

              <div className="space-y-2">
                <label
                  htmlFor="event-date"
                  className="text-sm font-medium"
                >
                  Event Date
                </label>

                <input
                  id="event-date"
                  type="date"
                  name="event_date"
                  defaultValue={editDate}
                  className="flex h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="event-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>

                <textarea
                  id="event-description"
                  name="description"
                  defaultValue={
                    event.description || ""
                  }
                  rows={4}
                  className="w-full rounded-lg border bg-background px-3 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Add a short description for this event..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* EVENT OVERVIEW */}

      <div>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />

          <h2 className="text-2xl font-bold">
            Event Overview
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <OverviewCard
            title="Tasks"
            value={taskCount}
            icon={
              <ListTodo className="h-6 w-6 text-emerald-600" />
            }
            href={`/dashboard/tasks${eventQuery}`}
          />

          <OverviewCard
            title="Guests"
            value={guestCount}
            icon={
              <Users className="h-6 w-6 text-blue-600" />
            }
            href={`/dashboard/guests${eventQuery}`}
          />

          <OverviewCard
            title="Budget"
            value={budgetCount}
            icon={
              <Wallet className="h-6 w-6 text-purple-600" />
            }
            href={`/dashboard/budget${eventQuery}`}
          />

          <OverviewCard
            title="Vendors"
            value={vendorCount}
            icon={
              <Store className="h-6 w-6 text-orange-600" />
            }
            href={`/dashboard/vendors${eventQuery}`}
          />

          <OverviewCard
            title="Shopping"
            value={shoppingCount}
            icon={
              <ShoppingBag className="h-6 w-6 text-pink-600" />
            }
            href={`/dashboard/shopping${eventQuery}`}
          />
        </div>
      </div>

      {/* QUICK ACCESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

            <h2 className="text-2xl font-bold">
              Manage This Event
            </h2>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Open any section to continue planning this event.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <QuickLink
              href={`/dashboard/tasks${eventQuery}`}
              icon={
                <ListTodo className="h-5 w-5" />
              }
              label="Tasks"
            />

            <QuickLink
              href={`/dashboard/guests${eventQuery}`}
              icon={
                <Users className="h-5 w-5" />
              }
              label="Guests"
            />

            <QuickLink
              href={`/dashboard/budget${eventQuery}`}
              icon={
                <Wallet className="h-5 w-5" />
              }
              label="Budget"
            />

            <QuickLink
              href={`/dashboard/vendors${eventQuery}`}
              icon={
                <Store className="h-5 w-5" />
              }
              label="Vendors"
            />

            <QuickLink
              href={`/dashboard/shopping${eventQuery}`}
              icon={
                <ShoppingBag className="h-5 w-5" />
              }
              label="Shopping"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- OVERVIEW CARD ---------------- */

function OverviewCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition hover:-translate-y-1 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            {icon}

            <span className="text-sm text-muted-foreground">
              View →
            </span>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold">
            {value}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ---------------- QUICK LINK ---------------- */

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border p-4 font-medium transition hover:border-emerald-500 hover:bg-emerald-50"
    >
      <span className="text-emerald-600">
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  );
}