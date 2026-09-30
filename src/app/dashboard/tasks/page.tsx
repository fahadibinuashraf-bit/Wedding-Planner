import Link from "next/link";
import {
  CheckSquare,
  Plus,
  ArrowLeft,
  ListTodo,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AddTaskDialog } from "@/components/tasks/add-task-dialog";
import { TaskCard } from "@/components/tasks/task-card";

export const dynamic = "force-dynamic";

type Task = {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  completion_pct: number | null;
  due_date: string | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
};

type EventData = {
  id: string;
  name: string;
  slug: string | null;
  event_date: string | null;
};

type PageProps = {
  searchParams?: Promise<{
    event?: string;
  }>;
};

export default async function TasksPage({
  searchParams,
}: PageProps) {
  const supabase = (await createClient()) as any;

  const params = searchParams
    ? await searchParams
    : {};

  const eventId = params.event || "";

  /* =========================================================
     LOAD EVENTS
  ========================================================= */

  const {
    data: rawEvents,
    error: eventsError,
  } = await supabase
    .from("events")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (eventsError) {
    console.error(
      "Failed to load events:",
      eventsError
    );
  }

  const events: EventData[] = Array.isArray(
    rawEvents
  )
    ? rawEvents.map((item: any) => ({
        id: String(item.id),

        name: String(
          item.name || "Untitled Event"
        ),

        slug:
          item.slug != null
            ? String(item.slug)
            : null,

        event_date:
          item.event_date != null
            ? String(item.event_date)
            : null,
      }))
    : [];

  /* =========================================================
     SELECT EVENT
  ========================================================= */

  const selectedEvent =
    eventId
      ? events.find(
          (event) =>
            event.id === eventId
        )
      : events[0];

  const selectedEventId =
    selectedEvent?.id || "";

  /* =========================================================
     LOAD TASKS
  ========================================================= */

  let tasks: Task[] = [];

  if (selectedEventId) {
    const {
      data: rawTasks,
      error: tasksError,
    } = await supabase
      .from("tasks")
      .select("*")
      .eq(
        "event_id",
        selectedEventId
      )
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (tasksError) {
      console.error(
        "Failed to load tasks:",
        tasksError
      );
    }

    tasks = Array.isArray(rawTasks)
      ? rawTasks.map(
          (item: any): Task => ({
            id: String(item.id),

            event_id: String(
              item.event_id
            ),

            title: String(
              item.title ||
                "Untitled Task"
            ),

            description:
              item.description != null
                ? String(
                    item.description
                  )
                : null,

            category:
              item.category != null
                ? String(
                    item.category
                  )
                : null,

            priority:
              item.priority != null
                ? String(
                    item.priority
                  )
                : null,

            status:
              item.status != null
                ? String(
                    item.status
                  )
                : null,

            completion_pct:
              item.completion_pct == null
                ? 0
                : Number(
                    item.completion_pct
                  ),

            due_date:
              item.due_date != null
                ? String(
                    item.due_date
                  )
                : null,

            sort_order:
              item.sort_order == null
                ? 0
                : Number(
                    item.sort_order
                  ),

            /*
             * IMPORTANT:
             * These are NOT optional.
             * TaskCard expects string | null.
             */

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

  /* =========================================================
     TASK STATS
  ========================================================= */

  const totalTasks =
    tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
          "completed" ||
        Number(
          task.completion_pct || 0
        ) >= 100
    ).length;

  const pendingTasks =
    totalTasks -
    completedTasks;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          tasks.reduce(
            (
              total,
              task
            ) =>
              total +
              Number(
                task.completion_pct ||
                  0
              ),
            0
          ) / totalTasks
        );

  /* =========================================================
     EVENT URL
  ========================================================= */

  function eventUrl(
    id: string
  ) {
    return `/dashboard/tasks?event=${encodeURIComponent(
      id
    )}`;
  }

  /* =========================================================
     ADD TASK BUTTON
  ========================================================= */

  function AddTaskButton() {
    if (!selectedEventId) {
      return null;
    }

    return (
      <AddTaskDialog
        eventId={
          selectedEventId
        }
      >
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </AddTaskDialog>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-600" />

            <span className="text-sm font-medium text-emerald-600">
              Wedding Planning
            </span>
          </div>

          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Tasks
          </h1>

          <p className="mt-2 text-muted-foreground">
            Keep track of everything that
            needs to be completed.
          </p>
        </div>

        <AddTaskButton />
      </div>

      {/* =====================================================
          EVENT SELECTOR
      ===================================================== */}

      {events.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Current Event
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {selectedEvent?.name ||
                    "Select an event"}
                </h2>

                {selectedEvent?.event_date && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(
                      selectedEvent.event_date
                    )}
                  </p>
                )}
              </div>

              {events.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {events.map(
                    (event) => {
                      const active =
                        event.id ===
                        selectedEventId;

                      return (
                        <Link
                          key={event.id}
                          href={eventUrl(
                            event.id
                          )}
                        >
                          <Button
                            variant={
                              active
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                          >
                            {event.name}
                          </Button>
                        </Link>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* =====================================================
          NO EVENTS
      ===================================================== */}

      {events.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <ListTodo className="h-7 w-7 text-emerald-600" />
            </div>

            <h2 className="text-xl font-semibold">
              No events yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Create an event first, then you
              can start adding wedding tasks.
            </p>

            <Link
              href="/dashboard/events"
              className="mt-5"
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* =====================================================
          TASK CONTENT
      ===================================================== */}

      {selectedEventId && (
        <>
          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Tasks"
              value={totalTasks}
              icon={
                <ListTodo className="h-5 w-5" />
              }
            />

            <StatCard
              title="Completed"
              value={completedTasks}
              icon={
                <CheckSquare className="h-5 w-5" />
              }
            />

            <StatCard
              title="Pending"
              value={pendingTasks}
              icon={
                <ListTodo className="h-5 w-5" />
              }
            />
          </div>

          {/* =================================================
              PROGRESS
          ================================================= */}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Task Progress
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {completedTasks} of{" "}
                    {totalTasks} tasks completed
                  </p>
                </div>

                <span className="text-2xl font-bold text-emerald-600">
                  {progress}%
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        progress
                      )
                    )}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* =================================================
              TASK LIST
          ================================================= */}

          {tasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                  <CheckSquare className="h-7 w-7 text-emerald-600" />
                </div>

                <h2 className="text-xl font-semibold">
                  No tasks yet
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Start planning your wedding by
                  adding your first task.
                </p>

                <div className="mt-5">
                  <AddTaskDialog
                    eventId={
                      selectedEventId
                    }
                  >
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Task
                    </Button>
                  </AddTaskDialog>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tasks.map(
                (task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                  />
                )
              )}
            </div>
          )}
        </>
      )}

      {/* =====================================================
          BACK TO DASHBOARD
      ===================================================== */}

      {selectedEventId && (
        <div>
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   STAT CARD
=========================================================== */

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
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold">
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

/* ===========================================================
   DATE FORMATTER
=========================================================== */

function formatDate(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}