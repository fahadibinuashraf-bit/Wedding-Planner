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
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

type EventData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_date: string | null;
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

  // Supabase's current generated types are incorrectly
  // inferring some tables as "never", so use a local
  // untyped client for this page.
  const supabase = (await createClient()) as any;

  /* ---------------- EVENT ---------------- */

  const eventResult = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (eventResult.error || !eventResult.data) {
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
    (tasksResult as CountResult).count ?? 0
  );

  const guestCount = Number(
    (guestsResult as CountResult).count ?? 0
  );

  const vendorCount = Number(
    (vendorsResult as CountResult).count ?? 0
  );

  const shoppingCount = Number(
    (shoppingResult as CountResult).count ?? 0
  );

  const budgetCount = Number(
    (budgetResult as CountResult).count ?? 0
  );

  /* ---------------- PROGRESS ---------------- */

  const progress = Math.min(
    100,
    Math.max(
      0,
      Number(event.completion_pct ?? 0)
    )
  );

  /* ---------------- DATE ---------------- */

  let formattedDate = "Date not set";

  if (event.event_date) {
    const date = new Date(event.event_date);

    if (!Number.isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString(
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

  /* ---------------- LINKS ---------------- */

  const eventQuery =
    `?event=${encodeURIComponent(event.id)}`;

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
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
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

            <div className="text-center md:text-right">
              <p className="text-sm text-white/80">
                Planning Progress
              </p>

              <p className="mt-1 text-5xl font-bold">
                {progress}%
              </p>
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
            Open any section to continue planning this
            event.
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