"use client";

import { useRef } from "react";
import { addEvent } from "@/app/dashboard/events/actions";

export default function AddEventDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
      >
        + Add Event
      </button>

      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 w-full max-w-md backdrop:bg-black/50"
      >
        <form
          action={async (formData) => {
            await addEvent(formData);
            dialogRef.current?.close();
          }}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold">Add Event</h2>

          <div>
            <label className="block text-sm mb-1">Event Name</label>
            <input
              name="name"
              required
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Event Date</label>
            <input
              type="date"
              name="event_date"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Color</label>

            <select
              name="color_gradient"
              className="w-full border rounded-md p-2"
              defaultValue="default"
            >
              <option value="default">Default</option>
              <option value="nikah">Nikah</option>
              <option value="reception">Reception</option>
              <option value="destination">Destination</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="border rounded-md px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}