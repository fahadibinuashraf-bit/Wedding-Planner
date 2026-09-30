"use client";

import { ReactNode, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { addTask } from "@/app/dashboard/tasks/actions";

interface AddTaskDialogProps {
  eventId: string;
  children?: ReactNode;
}

export function AddTaskDialog({
  eventId,
  children,
}: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children ?? <Button>Add Task</Button>}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>

          <DialogDescription>
            Create a new task for this wedding event.
          </DialogDescription>
        </DialogHeader>

        <form
          action={async (formData) => {
            await addTask(formData);
            setOpen(false);
          }}
          className="space-y-5"
        >
          <input
            type="hidden"
            name="event_id"
            value={eventId}
          />

          <div className="space-y-2">
            <Label htmlFor="task-title">
              Task title
            </Label>

            <Input
              id="task-title"
              name="title"
              placeholder="Example: Book wedding photographer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">
              Description
            </Label>

            <textarea
              id="task-description"
              name="description"
              placeholder="Add details about this task..."
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit">
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskDialog;