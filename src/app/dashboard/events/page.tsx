import Link from "next/link";

import {
  CalendarHeart,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import AddEventDialog from "@/components/events/add-event-dialog";

export const dynamic = "force-dynamic";

type EventData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  event_type: string | null;
  completion_pct: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export default async function EventsPage() {
  const supabase = (await createClient()) as any;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load events:",
      error
    );
  }

  const events: EventData[] = (
    data ?? []
  ).map((event: any) => ({
    id: String(event.id),

    name: String(
      event.name || "Untitled Event"
    ),

    slug: String(
      event.slug || ""
    ),

    description:
      event.description ?? null,

    event_date:
      event.event_date ?? null,

    event_type:
      event.event_type ?? null,

    completion_pct: Number(
      event.completion_pct ?? 0
    ),

    created_at:
      event.created_at ?? null,

    updated_at:
      event.updated_at ?? null,
  }));

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Wedding Planner
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold">
            Events
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your wedding events and planning
            progress.
          </p>
        </div>

        <AddEventDialog />
      </div>

      {/* EVENT LIST */}

      {events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <CalendarHeart className="h-8 w-8 text-emerald-600" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No events yet
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Create your first wedding event to
              start managing tasks, guests, budget,
              vendors and shopping.
            </p>

            <div className="mt-6">
              <AddEventDialog />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* EVENT COUNT */}

          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-600" />

            <span className="text-sm text-muted-foreground">
              {events.length}{" "}
              {events.length === 1
                ? "event"
                : "events"}
            </span>
          </div>

          {/* EVENT CARDS */}

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map(
              (event: EventData) => {
                const progress = Math.min(
                  100,
                  Math.max(
                    0,
                    Number(
                      event.completion_pct ?? 0
                    )
                  )
                );

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
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      );
                  }
                }

                return (
                  <Card
                    key={event.id}
                    className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* TOP */}

                    <div className="bg-gradient-emerald-gold p-5 text-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                          <CalendarHeart className="h-6 w-6" />
                        </div>

                        <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                          {event.event_type ||
                            "Wedding"}
                        </div>
                      </div>

                      <h2 className="mt-5 line-clamp-1 font-display text-2xl font-bold">
                        {event.name}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm text-white/85">
                        <CalendarDays className="h-4 w-4" />

                        <span>
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* CONTENT */}

                    <CardContent className="space-y-5 p-5">
                      {event.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}

                      {/* PROGRESS */}

                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                            <span className="text-sm font-medium">
                              Planning Progress
                            </span>
                          </div>

                          <span className="text-sm font-semibold text-emerald-600">
                            {progress}%
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* DATE STATUS */}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-4 w-4" />

                        <span>
                          {event.event_date
                            ? "Event date scheduled"
                            : "Event date not set"}
                        </span>
                      </div>

                      {/* OPEN BUTTON */}

                      <Link
                        href={`/dashboard/events/${event.slug}`}
                        className="block"
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Open Event

                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        </>
      )}

      {/* QUICK TIP */}

      {events.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <CalendarHeart className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <h3 className="font-semibold">
                  Ready to add another event?
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add Haldi, Mehendi, Nikah,
                  Reception or any other event.
                </p>
              </div>
            </div>

            <AddEventDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}