"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";

import { updateBudgetItem } from "./actions";

interface BudgetItem {
  id: string;
  event_id: string;
  name: string;
  category: string | null;
  estimated_amount: number;
  actual_amount: number;
  paid: boolean;
  notes: string | null;
}

interface Props {
  item: BudgetItem;
}

export function EditBudgetItem({ item }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        title="Edit expense"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 text-muted-foreground transition hover:bg-gray-100 hover:text-foreground"
      >
        <Pencil className="h-5 w-5" />
      </button>
    );
  }

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={() => setOpen(false)}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-2xl rounded-2xl bg-background p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Edit Budget Item
              </h2>

              <p className="text-sm text-muted-foreground">
                Update expense details
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-2 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FORM */}
          <form
            action={async (formData) => {
              await updateBudgetItem(formData);
              setOpen(false);
            }}
            className="grid gap-5 md:grid-cols-2"
          >
            <input
              type="hidden"
              name="id"
              value={item.id}
            />

            <input
              type="hidden"
              name="event_id"
              value={item.event_id}
            />

            {/* NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Expense Name *
              </label>

              <input
                name="name"
                required
                defaultValue={item.name}
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>

              <select
                name="category"
                defaultValue={item.category || "Other"}
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Venue">Venue</option>
                <option value="Catering">Catering</option>
                <option value="Decoration">Decoration</option>
                <option value="Photography">Photography</option>
                <option value="Clothing">Clothing</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Travel">Travel</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* ESTIMATED AMOUNT */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Estimated Amount
              </label>

              <input
                name="estimated_amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={item.estimated_amount}
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* ACTUAL AMOUNT */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Actual Amount
              </label>

              <input
                name="actual_amount"
                type="number"
                min="0"
                step="0.01"
                defaultValue={item.actual_amount}
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* PAYMENT STATUS */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Payment Status
              </label>

              <select
                name="payment_status"
                defaultValue={item.paid ? "Paid" : "Pending"}
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Paid">
                  Paid
                </option>
              </select>
            </div>

            {/* NOTES */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Notes
              </label>

              <input
                name="notes"
                defaultValue={item.notes || ""}
                placeholder="Optional notes..."
                className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white hover:bg-emerald-700"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border px-5 py-3 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}