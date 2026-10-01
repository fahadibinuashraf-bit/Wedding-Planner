"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* -------------------------------------------------
   ADD EVENT
------------------------------------------------- */

export async function addEvent(formData: FormData) {
  const supabase = (await createClient()) as any;

  const name = String(
    formData.get("name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const eventDate = String(
    formData.get("event_date") || ""
  );

  const eventType = String(
    formData.get("event_type") || "Wedding"
  ).trim();

  if (!name) {
    throw new Error("Event name is required.");
  }

  const slug =
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now();

  const { error } = await supabase
    .from("events")
    .insert({
      name,
      slug,
      description: description || null,
      event_date: eventDate || null,
      event_type: eventType || "Wedding",
    });

  if (error) {
    console.error(
      "Failed to create event:",
      error
    );

    throw new Error(
      `Failed to create event: ${error.message}`
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
}

/* -------------------------------------------------
   DELETE ENTIRE EVENT
------------------------------------------------- */

export async function deleteEvent(
  id: string
) {
  const supabase = (await createClient()) as any;

  const eventId = String(id || "").trim();

  if (!eventId) {
    throw new Error(
      "Event ID is required."
    );
  }

  /*
    Delete all data belonging to this event
    before deleting the event itself.
  */

  const tables = [
    "tasks",
    "guests",
    "shopping_items",
    "budget_items",
    "vendors",
  ];

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("event_id", eventId);

    if (error) {
      console.error(
        `Failed to delete ${table}:`,
        error
      );

      throw new Error(
        `Failed to delete event data from ${table}: ${error.message}`
      );
    }
  }

  /*
    Delete the actual event.
  */

  const { error: eventError } =
    await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

  if (eventError) {
    console.error(
      "Failed to delete event:",
      eventError
    );

    throw new Error(
      `Failed to delete event: ${eventError.message}`
    );
  }

  /*
    Refresh pages that depend on events.
  */

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
  revalidatePath("/dashboard/tasks");
  revalidatePath("/dashboard/guests");
  revalidatePath("/dashboard/shopping");
  revalidatePath("/dashboard/budget");
  revalidatePath("/dashboard/vendors");
  revalidatePath("/dashboard/analytics");
  revalidatePath(
    "/dashboard/notifications"
  );

  /*
    IMPORTANT:
    Redirect after deletion so the deleted
    event workspace is never rendered again.
  */

  redirect("/dashboard/events");
}

/* -------------------------------------------------
   UPDATE EVENT
------------------------------------------------- */

export async function updateEvent(
  formData: FormData
) {
  const supabase = (await createClient()) as any;

  const id = String(
    formData.get("id") || ""
  );

  const name = String(
    formData.get("name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const eventDate = String(
    formData.get("event_date") || ""
  );

  const eventType = String(
    formData.get("event_type") || "Wedding"
  ).trim();

  if (!id || !name) {
    throw new Error(
      "Event ID and event name are required."
    );
  }

  const { error } = await supabase
    .from("events")
    .update({
      name,
      description:
        description || null,
      event_date:
        eventDate || null,
      event_type:
        eventType || "Wedding",
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Failed to update event:",
      error
    );

    throw new Error(
      `Failed to update event: ${error.message}`
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
}

/* -------------------------------------------------
   UPDATE EVENT PROGRESS
------------------------------------------------- */

export async function updateEventProgress(
  id: string,
  completionPct: number
) {
  const supabase = (await createClient()) as any;

  if (!id) {
    throw new Error(
      "Event ID is required."
    );
  }

  const completion =
    Math.min(
      100,
      Math.max(
        0,
        Number(completionPct) || 0
      )
    );

  const { error } = await supabase
    .from("events")
    .update({
      completion_pct: completion,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "Failed to update event progress:",
      error
    );

    throw new Error(
      `Failed to update event progress: ${error.message}`
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/events");
}