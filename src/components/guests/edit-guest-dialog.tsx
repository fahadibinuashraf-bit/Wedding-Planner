"use client";

import { useState } from "react";
import { updateGuest } from "@/app/dashboard/guests/actions";

interface Guest {
  id: string;
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

export function EditGuestDialog({ guest }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Edit Guest
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xl"
              >
                ×
              </button>
            </div>

            <form
              action={async (formData) => {
                await updateGuest(formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <input
                type="hidden"
                name="id"
                value={guest.id}
              />

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Name
                </label>

                <input
                  name="name"
                  defaultValue={guest.name}
                  required
                  className="w-full rounded-md border p-3"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Phone
                  </label>

                  <input
                    name="phone"
                    defaultValue={guest.phone || ""}
                    className="w-full rounded-md border p-3"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    defaultValue={guest.email || ""}
                    className="w-full rounded-md border p-3"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Category
                  </label>

                  <select
                    name="category"
                    defaultValue={guest.category || ""}
                    className="w-full rounded-md border p-3"
                  >
                    <option value="">Select category</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Side
                  </label>

                  <select
                    name="side"
                    defaultValue={guest.side || ""}
                    className="w-full rounded-md border p-3"
                  >
                    <option value="">Select side</option>
                    <option value="bride">Bride</option>
                    <option value="groom">Groom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  RSVP Status
                </label>

                <select
                  name="rsvp_status"
                  defaultValue={guest.rsvp_status || "pending"}
                  className="w-full rounded-md border p-3"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="plus_one"
                  defaultChecked={guest.plus_one}
                />
                Guest has a plus one
              </label>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Plus One Name
                </label>

                <input
                  name="plus_one_name"
                  defaultValue={guest.plus_one_name || ""}
                  className="w-full rounded-md border p-3"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  defaultValue={guest.notes || ""}
                  rows={4}
                  className="w-full rounded-md border p-3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-5 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-5 py-2 text-white"
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