"use client";

import { useState } from "react";
import { addEvent } from "@/app/dashboard/events/actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddEventButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Event
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[400px] rounded-xl bg-white p-6 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold">Add Event</h2>

            <form
              action={async (formData) => {
                await addEvent(formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <input
                name="name"
                placeholder="Event Name"
                className="w-full rounded border p-2"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                className="w-full rounded border p-2"
              />

              <input
                type="date"
                name="event_date"
                className="w-full rounded border p-2"
              />

              <select
                name="color_gradient"
                defaultValue="default"
                className="w-full rounded border p-2"
              >
                <option value="default">Default</option>
                <option value="nikah">Nikah</option>
                <option value="reception">Reception</option>
                <option value="destination">Destination</option>
              </select>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit">
                  Save Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}