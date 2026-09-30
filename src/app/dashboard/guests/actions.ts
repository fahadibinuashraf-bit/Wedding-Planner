"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* -------------------------------------------------
   ADD GUEST
------------------------------------------------- */

export async function addGuest(formData: FormData) {
  const supabase = (await createClient()) as any;

  const eventId = String(
    formData.get("event_id") || ""
  ).trim();

  const name = String(
    formData.get("name") || ""
  ).trim();

  const phone = String(
    formData.get("phone") || ""
  ).trim();

  const email = String(
    formData.get("email") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
  ).trim();

  const side = String(
    formData.get("side") || ""
  ).trim();

  const rsvpStatus = String(
    formData.get("rsvp_status") || "pending"
  ).trim();

  const plusOne =
    formData.get("plus_one") === "true" ||
    formData.get("plus_one") === "on";

  const plusOneName = String(
    formData.get("plus_one_name") || ""
  ).trim();

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!eventId || !name) {
    throw new Error(
      "Event and guest name are required."
    );
  }

  const { error } = await supabase
    .from("guests")
    .insert({
      event_id: eventId,
      name,
      phone: phone || null,
      email: email || null,
      category: category || null,
      side: side || null,
      rsvp_status: rsvpStatus || "pending",
      plus_one: plusOne,
      plus_one_name:
        plusOneName || null,
      notes: notes || null,
    });

  if (error) {
    console.error(
      "Failed to add guest:",
      error
    );

    throw new Error(
      `Failed to add guest: ${error.message}`
    );
  }

  revalidatePath("/dashboard/guests");
  revalidatePath(
    `/dashboard/guests?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   UPDATE GUEST
------------------------------------------------- */

export async function updateGuest(
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

  const phone = String(
    formData.get("phone") || ""
  ).trim();

  const email = String(
    formData.get("email") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
  ).trim();

  const side = String(
    formData.get("side") || ""
  ).trim();

  const rsvpStatus = String(
    formData.get("rsvp_status") || "pending"
  ).trim();

  const plusOne =
    formData.get("plus_one") === "true" ||
    formData.get("plus_one") === "on";

  const plusOneName = String(
    formData.get("plus_one_name") || ""
  ).trim();

  const notes = String(
    formData.get("notes") || ""
  ).trim();

  if (!id || !eventId || !name) {
    throw new Error(
      "Guest ID, event and guest name are required."
    );
  }

  const { error } = await supabase
    .from("guests")
    .update({
      name,
      phone: phone || null,
      email: email || null,
      category: category || null,
      side: side || null,
      rsvp_status: rsvpStatus || "pending",
      plus_one: plusOne,
      plus_one_name:
        plusOneName || null,
      notes: notes || null,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to update guest:",
      error
    );

    throw new Error(
      `Failed to update guest: ${error.message}`
    );
  }

  revalidatePath("/dashboard/guests");
  revalidatePath(
    `/dashboard/guests?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   DELETE GUEST
------------------------------------------------- */

export async function deleteGuest(
  id: string,
  eventId: string
) {
  const supabase = (await createClient()) as any;

  if (!id || !eventId) {
    throw new Error(
      "Guest and event information are required."
    );
  }

  const { error } = await supabase
    .from("guests")
    .delete()
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to delete guest:",
      error
    );

    throw new Error(
      `Failed to delete guest: ${error.message}`
    );
  }

  revalidatePath("/dashboard/guests");
  revalidatePath(
    `/dashboard/guests?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   UPDATE RSVP STATUS
------------------------------------------------- */

export async function updateGuestRsvp(
  id: string,
  eventId: string,
  rsvpStatus: string
) {
  const supabase = (await createClient()) as any;

  if (!id || !eventId) {
    throw new Error(
      "Guest and event information are required."
    );
  }

  const status =
    String(rsvpStatus || "pending").trim();

  const { error } = await supabase
    .from("guests")
    .update({
      rsvp_status: status,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .eq("event_id", eventId);

  if (error) {
    console.error(
      "Failed to update RSVP:",
      error
    );

    throw new Error(
      `Failed to update RSVP: ${error.message}`
    );
  }

  revalidatePath("/dashboard/guests");
  revalidatePath(
    `/dashboard/guests?event=${eventId}`
  );

  revalidatePath("/dashboard");
}