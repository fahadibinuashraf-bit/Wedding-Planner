"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* =========================================================
   ADD VENDOR
========================================================= */

export async function addVendor(
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
  ).trim();

  const phone = String(
    formData.get("phone") || ""
  ).trim();

  const email = String(
    formData.get("email") || ""
  ).trim();

  const totalAmount = Number(
    formData.get("total_amount") || 0
  );

  const advancePaid = Number(
    formData.get("advance_paid") || 0
  );

  const ratingValue = String(
    formData.get("rating") || ""
  ).trim();

  const rating =
    ratingValue === ""
      ? null
      : Number(ratingValue);

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  if (!name) {
    throw new Error(
      "Vendor name is required."
    );
  }

  const { error } =
    await supabase
      .from("vendors")
      .insert({
        event_id: eventId,
        name,
        category,
        phone: phone || null,
        email: email || null,
        total_amount: totalAmount,
        advance_paid: advancePaid,
        rating,
        notes: notes || null,
      });

  if (error) {
    console.error(
      "Failed to add vendor:",
      error
    );

    throw new Error(
      `Failed to add vendor: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/vendors"
  );

  revalidatePath(
    `/dashboard/vendors?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* =========================================================
   UPDATE VENDOR
========================================================= */

export async function updateVendor(
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
  ).trim();

  const phone = String(
    formData.get("phone") || ""
  ).trim();

  const email = String(
    formData.get("email") || ""
  ).trim();

  const totalAmount = Number(
    formData.get("total_amount") || 0
  );

  const advancePaid = Number(
    formData.get("advance_paid") || 0
  );

  const ratingValue = String(
    formData.get("rating") || ""
  ).trim();

  const rating =
    ratingValue === ""
      ? null
      : Number(ratingValue);

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!id) {
    throw new Error(
      "Vendor ID is required."
    );
  }

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  if (!name) {
    throw new Error(
      "Vendor name is required."
    );
  }

  const { error } =
    await supabase
      .from("vendors")
      .update({
        name,
        category,
        phone: phone || null,
        email: email || null,
        total_amount: totalAmount,
        advance_paid: advancePaid,
        rating,
        notes: notes || null,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .eq(
        "event_id",
        eventId
      );

  if (error) {
    console.error(
      "Failed to update vendor:",
      error
    );

    throw new Error(
      `Failed to update vendor: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/vendors"
  );

  revalidatePath(
    `/dashboard/vendors?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* =========================================================
   DELETE VENDOR
========================================================= */

export async function deleteVendor(
  id: string,
  eventId: string
) {
  const supabase = (await createClient()) as any;

  if (!id) {
    throw new Error(
      "Vendor ID is required."
    );
  }

  if (!eventId) {
    throw new Error(
      "Event ID is required."
    );
  }

  const { error } =
    await supabase
      .from("vendors")
      .delete()
      .eq("id", id)
      .eq(
        "event_id",
        eventId
      );

  if (error) {
    console.error(
      "Failed to delete vendor:",
      error
    );

    throw new Error(
      `Failed to delete vendor: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/vendors"
  );

  revalidatePath(
    `/dashboard/vendors?event=${eventId}`
  );

  revalidatePath("/dashboard");
}