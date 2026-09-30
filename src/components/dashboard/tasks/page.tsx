import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CheckCircle2,
  Clock3,
  ListTodo,
  Plus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  eventId?: string;
}

interface EventData {
  id: string;
  name: string;
}

interface TaskData {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  status: string | null;
  completion_pct: number | null;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export default async function TasksPage({
  eventId,
}: Props) {
  const supabase = await createClient();

  /*
   * -------------------------------------------------------
   * LOAD EVENTS
   * -------------------------------------------------------
   */

  const { data: eventsData, error: eventsError } =
    await supabase
      .from("events")
      .select("id, name")
      .order("created_at", {
        ascending: false,
      });

  const allEvents: EventData[] =
    (eventsData as EventData[] | null) ?? [];

  if (eventsError) {
    console.error(
      "Failed to load events:",
      eventsError
    );
  }

  /*
   * -------------------------------------------------------
   * SELECT EVENT
   * -------------------------------------------------------
   */

  const selectedEvent: EventData | null =
    eventId
      ? allEvents.find(
          (item) => item.id === eventId
        ) ?? null
      : allEvents[0] ?? null;

  /*
   * -------------------------------------------------------
   * LOAD TASKS
   * -------------------------------------------------------
   */

  let tasks: TaskData[] = [];

  if (selectedEvent) {
    const {
      data: tasksData,
      error: tasksError,
    } = await supabase
      .from("tasks")
      .select("*")
      .eq("event_id", selectedEvent.id)
      .order("created_at", {
        ascending: false,
      });

    if (tasksError) {
      console.error(
        "Failed to load tasks:",
        tasksError
      );
    }

    tasks =
      (tasksData as TaskData[] | null) ?? [];
  }

  /*
   * -------------------------------------------------------
   * STATS
   * -------------------------------------------------------
   */

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "completed" ||
      Number(task.completion_pct ?? 0) >= 100
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "in_progress"
  ).length;

  const pendingTasks =
    totalTasks - completedTasks;

  const overallProgress =
    totalTasks > 0
      ? Math.round(
          tasks.reduce(
            (sum, task) =>
              sum +
              Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    task.completion_pct ?? 0
                  )
                )
              ),
            0
          ) / totalTasks
        )
      : 0;

  /*
   * -------------------------------------------------------
   * NO EVENT
   * -------------------------------------------------------
   */

  if (!selectedEvent) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Tasks
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage your wedding planning tasks.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <ListTodo className="mb-5 h-14 w-14 text-muted-foreground" />

            <h2 className="text-2xl font-bold">
              Select an event
            </h2>

            <p className="mt-2 max-w-md text-muted-foreground">
              Create an event first, then you can
              add and manage tasks for that event.
            </p>

            <Button asChild className="mt-6">
              <Link href="/dashboard/events">
                <Plus className="mr-2 h-4 w-4" />
                Go to Events
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * -------------------------------------------------------
   * MAIN PAGE
   * -------------------------------------------------------
   */

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ListTodo className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Tasks
              </h1>

              <p className="mt-1 text-muted-foreground">
                Manage tasks for{" "}
                <span className="font-medium text-foreground">
                  {selectedEvent.name}
                </span>
              </p>
            </div>
          </div>
        </div>

        <Button asChild>
          <Link
            href={`/dashboard/tasks?event=${encodeURIComponent(
              selectedEvent.id
            )}`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </div>

      {/* EVENT SWITCHER */}

      {allEvents.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {allEvents.map((event) => {
                const active =
                  event.id === selectedEvent.id;

                return (
                  <Link
                    key={event.id}
                    href={`/dashboard/tasks?event=${encodeURIComponent(
                      event.id
                    )}`}
                    className={[
                      "rounded-lg border px-4 py-2 text-sm font-medium transition",
                      active
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-border text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {event.name}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <CheckCircle2 className="h-5 w-5" />
          }
        />

        <StatCard
          title="In Progress"
          value={inProgressTasks}
          icon={
            <Clock3 className="h-5 w-5" />
          }
        />

        <StatCard
          title="Pending"
          value={pendingTasks}
          icon={
            <AlertCircle className="h-5 w-5" />
          }
        />
      </div>

      {/* OVERALL PROGRESS */}

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Overall Progress
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Task completion for{" "}
                {selectedEvent.name}
              </p>
            </div>

            <span className="text-2xl font-bold text-emerald-600">
              {overallProgress}%
            </span>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all"
              style={{
                width: `${overallProgress}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* TASK LIST */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              All Tasks
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {totalTasks}{" "}
              {totalTasks === 1
                ? "task"
                : "tasks"}{" "}
              for {selectedEvent.name}
            </p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <ListTodo className="h-8 w-8 text-emerald-600" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                No tasks yet
              </h3>

              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Start planning by adding your
                first task for{" "}
                {selectedEvent.name}.
              </p>

              <Button asChild className="mt-6">
                <Link
                  href={`/dashboard/tasks?event=${encodeURIComponent(
                    selectedEvent.id
                  )}`}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Task
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => {
              const progress = Math.min(
                100,
                Math.max(
                  0,
                  Number(
                    task.completion_pct ?? 0
                  )
                )
              );

              const completed =
                task.status ===
                  "completed" ||
                progress >= 100;

              return (
                <Card
                  key={task.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-3">
                          <div
                            className={[
                              "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              completed
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-muted text-muted-foreground",
                            ].join(" ")}
                          >
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <Clock3 className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold">
                              {task.title}
                            </h3>

                            {task.description && (
                              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              {task.category && (
                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                                  {task.category}
                                </span>
                              )}

                              {task.priority && (
                                <span
                                  className={[
                                    "rounded-full px-2.5 py-1 text-xs font-medium",
                                    task.priority ===
                                      "high" ||
                                    task.priority ===
                                      "urgent" ||
                                    task.priority ===
                                      "critical"
                                      ? "bg-red-50 text-red-600"
                                      : task.priority ===
                                          "medium"
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-emerald-50 text-emerald-600",
                                  ].join(" ")}
                                >
                                  {task.priority}
                                </span>
                              )}

                              {task.status && (
                                <span className="rounded-full border px-2.5 py-1 text-xs font-medium capitalize">
                                  {task.status.replace(
                                    "_",
                                    " "
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-48">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Progress
                          </span>

                          <span className="font-semibold">
                            {progress}%
                          </span>
                        </div>

                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>

                        {task.due_date && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Due:{" "}
                            {formatDate(
                              task.due_date
                            )}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/dashboard/tasks?event=${encodeURIComponent(
                          selectedEvent.id
                        )}`}
                        className="flex shrink-0 items-center justify-center rounded-lg border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        title="Open tasks"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * -------------------------------------------------------
 * STAT CARD
 * -------------------------------------------------------
 */

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
        </div>
      </CardContent>
    </Card>
  );
}

/*
 * -------------------------------------------------------
 * DATE FORMATTER
 * -------------------------------------------------------
 */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}