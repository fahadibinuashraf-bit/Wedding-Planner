"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { updateTask } from "@/app/dashboard/tasks/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TaskForEdit {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  priority?: string | null;
  status?: string | null;
  due_date?: string | null;
  completion_pct?: number | null;
}

interface EditTaskDialogProps {
  task: TaskForEdit;
}

export function EditTaskDialog({
  task,
}: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true);

      await updateTask(formData);

      setOpen(false);
    } catch (error) {
      console.error("Failed to update task:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update task."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        title="Edit task"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!loading) {
            setOpen(value);
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              Edit Task
            </DialogTitle>
          </DialogHeader>

          <form
            action={handleSubmit}
            className="space-y-5"
          >
            <input
              type="hidden"
              name="id"
              value={task.id}
            />

            <div className="space-y-2">
              <Label htmlFor={`edit-title-${task.id}`}>
                Task Title
              </Label>

              <Input
                id={`edit-title-${task.id}`}
                name="title"
                defaultValue={task.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-description-${task.id}`}>
                Description
              </Label>

              <textarea
                id={`edit-description-${task.id}`}
                name="description"
                defaultValue={task.description ?? ""}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`edit-category-${task.id}`}>
                  Category
                </Label>

                <select
                  id={`edit-category-${task.id}`}
                  name="category"
                  defaultValue={task.category ?? ""}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">
                    Select category
                  </option>
                  <option value="Venue">
                    Venue
                  </option>
                  <option value="Catering">
                    Catering
                  </option>
                  <option value="Decoration">
                    Decoration
                  </option>
                  <option value="Photography">
                    Photography
                  </option>
                  <option value="Guest">
                    Guest
                  </option>
                  <option value="Shopping">
                    Shopping
                  </option>
                  <option value="Travel">
                    Travel
                  </option>
                  <option value="Invitation">
                    Invitation
                  </option>
                  <option value="Personal">
                    Personal
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-priority-${task.id}`}>
                  Priority
                </Label>

                <select
                  id={`edit-priority-${task.id}`}
                  name="priority"
                  defaultValue={task.priority ?? "medium"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="low">
                    Low
                  </option>
                  <option value="medium">
                    Medium
                  </option>
                  <option value="high">
                    High
                  </option>
                  <option value="urgent">
                    Urgent
                  </option>
                  <option value="critical">
                    Critical
                  </option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`edit-status-${task.id}`}>
                  Status
                </Label>

                <select
                  id={`edit-status-${task.id}`}
                  name="status"
                  defaultValue={
                    task.status ?? "not_started"
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="not_started">
                    Not Started
                  </option>
                  <option value="in_progress">
                    In Progress
                  </option>
                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-completion-${task.id}`}>
                  Completion %
                </Label>

                <Input
                  id={`edit-completion-${task.id}`}
                  name="completion_pct"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={
                    task.completion_pct ?? 0
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-due-date-${task.id}`}>
                Due Date
              </Label>

              <Input
                id={`edit-due-date-${task.id}`}
                name="due_date"
                type="date"
                defaultValue={
                  task.due_date
                    ? task.due_date.slice(0, 10)
                    : ""
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}