"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { updateShoppingItem } from "./actions";

interface ShoppingItem {
  id: string;
  event_id: string;
  name: string;
  category: string | null;
  quantity: number;
  estimated_price: number;
  actual_price: number;
  purchased: boolean;
}

interface Props {
  item: ShoppingItem;
}

export function EditShoppingItem({ item }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Edit item"
        className="rounded-md p-2 transition hover:bg-gray-100"
      >
        <Pencil className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Edit Shopping Item
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the shopping item details.
              </p>
            </div>

            <form
              action={async (formData) => {
                await updateShoppingItem(formData);
                setOpen(false);
              }}
              className="space-y-5"
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

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Item Name *
                </label>

                <input
                  name="name"
                  required
                  defaultValue={item.name}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Category
                </label>

                <select
                  name="category"
                  defaultValue={item.category || "Other"}
                  className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Clothing">
                    Clothing
                  </option>
                  <option value="Jewelry">
                    Jewelry
                  </option>
                  <option value="Decoration">
                    Decoration
                  </option>
                  <option value="Gifts">
                    Gifts
                  </option>
                  <option value="Beauty">
                    Beauty
                  </option>
                  <option value="Food">
                    Food
                  </option>
                  <option value="Travel">
                    Travel
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Quantity
                  </label>

                  <input
                    name="quantity"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={item.quantity}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Status
                  </label>

                  <select
                    name="purchased"
                    defaultValue={
                      item.purchased ? "true" : "false"
                    }
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="false">
                      Pending
                    </option>
                    <option value="true">
                      Purchased
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Estimated Price
                  </label>

                  <input
                    name="estimated_price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={item.estimated_price}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Actual Price
                  </label>

                  <input
                    name="actual_price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={item.actual_price}
                    className="w-full rounded-lg border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
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