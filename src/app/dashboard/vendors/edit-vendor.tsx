"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateVendor } from "./actions";

interface Vendor {
  id: string;
  event_id: string;
  name: string;
  category: string | null;
  phone: string | null;
  email: string | null;
  total_amount: number;
  advance_paid: number;
  rating: number | null;
  notes: string | null;
}

interface Props {
  vendor: Vendor;
}

export function EditVendor({ vendor }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Edit vendor"
        className="rounded-md p-2 transition hover:bg-gray-100"
      >
        <Pencil className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Edit Vendor
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update vendor details and payment information.
              </p>
            </div>

            <form
              action={async (formData) => {
                await updateVendor(formData);
                setOpen(false);
              }}
              className="space-y-5"
            >
              <input
                type="hidden"
                name="id"
                value={vendor.id}
              />

              <input
                type="hidden"
                name="event_id"
                value={vendor.event_id}
              />

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Vendor Name *
                  </label>

                  <input
                    name="name"
                    required
                    defaultValue={vendor.name}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Category
                  </label>

                  <select
                    name="category"
                    defaultValue={
                      vendor.category || "Other"
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Venue">
                      Venue
                    </option>

                    <option value="Catering">
                      Catering
                    </option>

                    <option value="Photography">
                      Photography
                    </option>

                    <option value="Decoration">
                      Decoration
                    </option>

                    <option value="Makeup">
                      Makeup
                    </option>

                    <option value="Music">
                      Music / DJ
                    </option>

                    <option value="Transportation">
                      Transportation
                    </option>

                    <option value="Invitation">
                      Invitation
                    </option>

                    <option value="Clothing">
                      Clothing
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Phone
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    defaultValue={
                      vendor.phone || ""
                    }
                    placeholder="Phone number"
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    defaultValue={
                      vendor.email || ""
                    }
                    placeholder="Email address"
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Total Amount
                  </label>

                  <input
                    name="total_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      vendor.total_amount
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Advance Paid
                  </label>

                  <input
                    name="advance_paid"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={
                      vendor.advance_paid
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Rating
                  </label>

                  <select
                    name="rating"
                    defaultValue={
                      vendor.rating ?? ""
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">
                      No rating
                    </option>
                    <option value="1">
                      1 / 5
                    </option>
                    <option value="2">
                      2 / 5
                    </option>
                    <option value="3">
                      3 / 5
                    </option>
                    <option value="4">
                      4 / 5
                    </option>
                    <option value="5">
                      5 / 5
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notes
                </label>

                <textarea
                  name="notes"
                  rows={4}
                  defaultValue={
                    vendor.notes || ""
                  }
                  placeholder="Add notes about this vendor..."
                  className="w-full resize-none rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-5 py-3 font-medium transition hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700"
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