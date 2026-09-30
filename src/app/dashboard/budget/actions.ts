"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBudgetItem(formData: FormData) {
  const supabase = await createClient();

  const eventId = String(
    formData.get("event_id") || ""
  );

  const name = String(
    formData.get("name") || ""
  ).trim();

  const category = String(
    formData.get("category") || "Other"
  );

  const estimatedAmount = Number(
    formData.get("estimated_amount") || 0
  );

  const actualAmount = Number(
    formData.get("actual_amount") || 0
  );

  const paymentStatus = String(
    formData.get("payment_status") || "Pending"
  );

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!eventId || !name) {
    throw new Error(
      "Event and expense name are required."
    );
  }

  /*
   * Supabase's generated TypeScript types are
   * currently inferring budget_items incorrectly.
   * The database table itself is valid, so we use
   * a local untyped reference for these operations.
   */
  const db = supabase as any;

  const { error } = await db
    .from("budget_items")
    .insert({
      event_id: eventId,
      name,
      category,
      estimated_amount: estimatedAmount,
      actual_amount: actualAmount,
      paid: paymentStatus === "Paid",
      notes: notes || null,
    });

  if (error) {
    console.error(
      "Failed to add budget item:",
      error
    );

    throw new Error(
      `Failed to add budget item: ${error.message}`
    );
  }

  revalidatePath("/dashboard/budget");
  revalidatePath(
    `/dashboard/budget?event=${eventId}`
  );
}

export async function updateBudgetItem(
  formData: FormData
) {
  const supabase = await createClient();

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

  const estimatedAmount = Number(
    formData.get("estimated_amount") || 0
  );

  const actualAmount = Number(
    formData.get("actual_amount") || 0
  );

  const paymentStatus = String(
    formData.get("payment_status") || "Pending"
  );

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!id || !eventId || !name) {
    throw new Error(
      "Missing required information."
    );
  }

  const db = supabase as any;

  const { error } = await db
    .from("budget_items")
    .update({
      name,
      category,
      estimated_amount: estimatedAmount,
      actual_amount: actualAmount,
      paid: paymentStatus === "Paid",
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to update budget item:",
      error
    );

    throw new Error(
      `Failed to update budget item: ${error.message}`
    );
  }

  revalidatePath("/dashboard/budget");
  revalidatePath(
    `/dashboard/budget?event=${eventId}`
  );
}

export async function deleteBudgetItem(
  id: string,
  eventId: string
) {
  const supabase = await createClient();

  if (!id || !eventId) {
    throw new Error(
      "Missing budget item information."
    );
  }

  const db = supabase as any;

  const { error } = await db
    .from("budget_items")
    .delete()
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to delete budget item:",
      error
    );

    throw new Error(
      `Failed to delete budget item: ${error.message}`
    );
  }

  revalidatePath("/dashboard/budget");
  revalidatePath(
    `/dashboard/budget?event=${eventId}`
  );
}