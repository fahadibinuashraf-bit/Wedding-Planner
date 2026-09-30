"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";

import {
  deleteTask,
  toggleTaskStatus,
} from "@/app/dashboard/tasks/actions";

import { Button } from "@/components/ui/button";
import { EditTaskDialog } from "./edit-task-dialog";

export interface Task {
  id: string;
  event_id?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  due_date?: string | null;
  completion_pct?: number | null;
  sort_order?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [loading, setLoading] = useState(false);

  const completion = Math.min(
    100,
    Math.max(0, Number(task.completion_pct ?? 0))
  );

  const completed =
    task.status === "completed" || completion >= 100;

  async function handleToggle() {
    try {
      setLoading(true);

      await toggleTaskStatus(task.id, !completed);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to update task status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await deleteTask(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(value?: string | null) {
    if (!value) return null;

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

  function priorityClass(priority?: string | null) {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";

      case "urgent":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300";

      case "high":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300";

      case "low":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";

      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    }
  }

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${
        completed ? "bg-muted/30" : "bg-card"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* CHECKBOX */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          title={
            completed
              ? "Mark as incomplete"
              : "Mark as completed"
          }
          className="mt-0.5 shrink-0 disabled:opacity-50"
        >
          {completed ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          ) : (
            <Circle className="h-6 w-6 text-muted-foreground transition-colors hover:text-emerald-600" />
          )}
        </button>

        {/* TASK CONTENT */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`font-semibold ${
                  completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex shrink-0 items-center gap-1">
              <EditTaskDialog task={task} />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                title="Delete task"
                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* META */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {task.category && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                {task.category}
              </span>
            )}

            {task.priority && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${priorityClass(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}

            {task.status && (
              <span className="rounded-full border px-2.5 py-1 text-xs font-medium capitalize">
                {task.status.replace(/_/g, " ")}
              </span>
            )}

            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(task.due_date)}
              </span>
            )}
          </div>

          {/* PROGRESS */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Progress
              </span>

              <span className="font-medium">
                {completion}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}