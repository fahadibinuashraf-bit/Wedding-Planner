"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateGuest } from "./actions";

interface Guest {
  id: string;
  event_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  category: string | null;
  side: string | null;
  rsvp_status: string | null;
  plus_one: boolean;
  plus_one_name: string | null;
  notes: string | null;
}

interface Props {
  guest: Guest;
}

export function EditGuest({ guest }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Edit guest"
        className="rounded-md p-2 transition hover:bg-gray-100"
      >
        <Pencil className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Edit Guest
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update guest information and RSVP.
              </p>
            </div>

            <form
              action={async (formData) => {
                await updateGuest(formData);
                setOpen(false);
              }}
              className="space-y-5"
            >
              <input
                type="hidden"
                name="id"
                value={guest.id}
              />

              <input
                type="hidden"
                name="event_id"
                value={guest.event_id}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Guest Name *
                  </label>

                  <input
                    name="name"
                    required
                    defaultValue={guest.name}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Phone
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    defaultValue={guest.phone || ""}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    defaultValue={guest.email || ""}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Category
                  </label>

                  <select
                    name="category"
                    defaultValue={guest.category || "Family"}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="VIP">VIP</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Side
                  </label>

                  <select
                    name="side"
                    defaultValue={guest.side || "Bride"}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    RSVP Status
                  </label>

                  <select
                    name="rsvp_status"
                    defaultValue={guest.rsvp_status || "Pending"}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Invited">Invited</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Plus One
                  </label>

                  <select
                    name="plus_one"
                    defaultValue={
                      guest.plus_one ? "true" : "false"
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Plus One Name
                </label>

                <input
                  name="plus_one_name"
                  defaultValue={guest.plus_one_name || ""}
                  placeholder="Optional"
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={guest.notes || ""}
                  placeholder="Optional notes..."
                  className="w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-5 py-3 font-medium hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}