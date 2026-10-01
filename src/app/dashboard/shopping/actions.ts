"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function getNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name) || 0);

  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

export async function addShoppingItem(
  formData: FormData
) {
  const supabase = (await createClient()) as any;

  const eventId = String(
    formData.get("event_id") || ""
  );

  const name = String(
    formData.get("name") || ""
  ).trim();

  const category = String(
    formData.get("category") || "Other"
  );

  const quantity = Math.max(
    1,
    Math.floor(
      getNumber(formData, "quantity") || 1
    )
  );

  const price = getNumber(
    formData,
    "price"
  );

  const paid = Math.min(
    getNumber(formData, "paid"),
    price
  );

  if (!eventId || !name) {
    throw new Error(
      "Event and item name are required."
    );
  }

  const { error } = await supabase
    .from("shopping_items")
    .insert({
      event_id: eventId,
      name,
      category,
      quantity,
      price,
      paid,
      purchased: false,
    });

  if (error) {
    console.error(
      "Failed to add shopping item:",
      error
    );

    throw new Error(
      `Failed to add shopping item: ${error.message}`
    );
  }

  revalidatePath("/dashboard/shopping");
  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
  revalidatePath(
    `/dashboard?event=${eventId}`
  );
}

export async function updateShoppingItem(
  formData: FormData
) {
  const supabase = (await createClient()) as any;

  const id = String(
    formData.get("id") || ""
  );

  const eventId = String(
    formData.get("event_id") || ""
  );

  const name = String(
    formData.get("name") || ""
  ).trim();

  const category = String(
    formData.get("category") || "Other"
  );

  const quantity = Math.max(
    1,
    Math.floor(
      getNumber(formData, "quantity") || 1
    )
  );

  const price = getNumber(
    formData,
    "price"
  );

  const paid = Math.min(
    getNumber(formData, "paid"),
    price
  );

  const purchased =
    String(
      formData.get("purchased") || "false"
    ) === "true";

  if (!id || !eventId || !name) {
    throw new Error(
      "Missing required shopping item information."
    );
  }

  const { error } = await supabase
    .from("shopping_items")
    .update({
      name,
      category,
      quantity,
      price,
      paid,
      purchased,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to update shopping item:",
      error
    );

    throw new Error(
      `Failed to update shopping item: ${error.message}`
    );
  }

  revalidatePath("/dashboard/shopping");
  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
  revalidatePath(
    `/dashboard?event=${eventId}`
  );
}

export async function deleteShoppingItem(
  id: string,
  eventId: string
) {
  const supabase = (await createClient()) as any;

  if (!id || !eventId) {
    throw new Error(
      "Missing shopping item information."
    );
  }

  const { error } = await supabase
    .from("shopping_items")
    .delete()
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to delete shopping item:",
      error
    );

    throw new Error(
      `Failed to delete shopping item: ${error.message}`
    );
  }

  revalidatePath("/dashboard/shopping");
  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
  revalidatePath(
    `/dashboard?event=${eventId}`
  );
}

export async function toggleShoppingItem(
  id: string,
  eventId: string,
  purchased: boolean
) {
  const supabase = (await createClient()) as any;

  if (!id || !eventId) {
    throw new Error(
      "Missing shopping item information."
    );
  }

  const { error } = await supabase
    .from("shopping_items")
    .update({
      purchased,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to update shopping status:",
      error
    );

    throw new Error(
      `Failed to update shopping status: ${error.message}`
    );
  }

  revalidatePath("/dashboard/shopping");
  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
  revalidatePath(
    `/dashboard?event=${eventId}`
  );
}