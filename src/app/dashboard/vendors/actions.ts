"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* =========================================================
   ADD VENDOR
========================================================= */

export async function addVendor(formData: FormData) {
  const supabase = (await createClient()) as any;

  const eventId = String(
    formData.get("event_id") || ""
  ).trim();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
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

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!eventId || !name) {
    throw new Error(
      "Event and vendor name are required."
    );
  }

  const rating =
    ratingValue === ""
      ? null
      : Math.min(
          5,
          Math.max(
            0,
            Number(ratingValue) || 0
          )
        );

  const { error } = await supabase
    .from("vendors")
    .insert({
      event_id: eventId,
      name,
      category: category || null,
      phone: phone || null,
      email: email || null,
      total_amount: Math.max(
        0,
        totalAmount
      ),
      advance_paid: Math.max(
        0,
        advancePaid
      ),
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

  revalidatePath("/dashboard/vendors");
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
  ).trim();

  const eventId = String(
    formData.get("event_id") || ""
  ).trim();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
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

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!id || !eventId || !name) {
    throw new Error(
      "Vendor ID, event and vendor name are required."
    );
  }

  const rating =
    ratingValue === ""
      ? null
      : Math.min(
          5,
          Math.max(
            0,
            Number(ratingValue) || 0
          )
        );

  const { error } = await supabase
    .from("vendors")
    .update({
      name,
      category: category || null,
      phone: phone || null,
      email: email || null,
      total_amount: Math.max(
        0,
        totalAmount
      ),
      advance_paid: Math.max(
        0,
        advancePaid
      ),
      rating,
      notes: notes || null,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to update vendor:",
      error
    );

    throw new Error(
      `Failed to update vendor: ${error.message}`
    );
  }

  revalidatePath("/dashboard/vendors");
  revalidatePath(
    `/dashboard/vendors?event=${eventId}`
  );
  revalidatePath("/dashboard");
  revalidatePath(
    `/dashboard?event=${eventId}`
  );
}

/* =========================================================
   DELETE VENDOR
========================================================= */

export async function deleteVendor(
  id: string,
  eventId: string
) {
  const supabase = (await createClient()) as any;

  if (!id || !eventId) {
    throw new Error(
      "Vendor ID and event ID are required."
    );
  }

  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to delete vendor:",
      error
    );

    throw new Error(
      `Failed to delete vendor: ${error.message}`
    );
  }

  revalidatePath("/dashboard/vendors");
  revalidatePath(
    `/dashboard/vendors?event=${eventId}`
  );
  revalidatePath("/dashboard");
  revalidatePath(
    `/dashboard?event=${eventId}`
  );
}