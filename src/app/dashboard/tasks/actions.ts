"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* -------------------------------------------------
   ADD TASK
------------------------------------------------- */

export async function addTask(
  formData: FormData
) {
  const supabase =
    (await createClient()) as any;

  const eventId = String(
    formData.get("event_id") || ""
  );

  const title = String(
    formData.get("title") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
  ).trim();

  const priority = String(
    formData.get("priority") ||
      "medium"
  );

  const dueDate = String(
    formData.get("due_date") || ""
  );

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  if (!title) {
    throw new Error(
      "Task title is required."
    );
  }

  const { error } =
    await supabase
      .from("tasks")
      .insert({
        event_id: eventId,
        title,
        description:
          description || null,
        category:
          category || null,
        priority,
        status: "not_started",
        completion_pct: 0,
        due_date:
          dueDate || null,
      });

  if (error) {
    console.error(
      "Failed to add task:",
      error
    );

    throw new Error(
      `Failed to add task: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/tasks"
  );

  revalidatePath(
    `/dashboard/tasks?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   DELETE TASK
------------------------------------------------- */

export async function deleteTask(
  id: string,
  eventId?: string
) {
  const supabase =
    (await createClient()) as any;

  if (!id) {
    throw new Error(
      "Task ID is required."
    );
  }

  let query =
    supabase
      .from("tasks")
      .delete()
      .eq("id", id);

  if (eventId) {
    query = query.eq(
      "event_id",
      eventId
    );
  }

  const { error } =
    await query;

  if (error) {
    console.error(
      "Failed to delete task:",
      error
    );

    throw new Error(
      `Failed to delete task: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/tasks"
  );

  if (eventId) {
    revalidatePath(
      `/dashboard/tasks?event=${eventId}`
    );
  }

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   TOGGLE TASK STATUS
------------------------------------------------- */

export async function toggleTaskStatus(
  id: string,
  completed: boolean,
  eventId?: string
) {
  const supabase =
    (await createClient()) as any;

  if (!id) {
    throw new Error(
      "Task ID is required."
    );
  }

  const { error } =
    await supabase
      .from("tasks")
      .update({
        status: completed
          ? "completed"
          : "not_started",

        completion_pct:
          completed ? 100 : 0,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    console.error(
      "Failed to update task status:",
      error
    );

    throw new Error(
      `Failed to update task status: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/tasks"
  );

  if (eventId) {
    revalidatePath(
      `/dashboard/tasks?event=${eventId}`
    );
  }

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   UPDATE TASK
------------------------------------------------- */

export async function updateTask(
  formData: FormData
) {
  const supabase =
    (await createClient()) as any;

  const id = String(
    formData.get("id") || ""
  );

  const eventId = String(
    formData.get("event_id") || ""
  );

  const title = String(
    formData.get("title") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const category = String(
    formData.get("category") || ""
  ).trim();

  const priority = String(
    formData.get("priority") ||
      "medium"
  );

  const status = String(
    formData.get("status") ||
      "not_started"
  );

  const dueDate = String(
    formData.get("due_date") || ""
  );

  const completionValue = String(
    formData.get(
      "completion_pct"
    ) || "0"
  );

  const completionPct = Math.min(
    100,
    Math.max(
      0,
      Number(completionValue) || 0
    )
  );

  if (!id) {
    throw new Error(
      "Task ID is required."
    );
  }

  if (!title) {
    throw new Error(
      "Task title is required."
    );
  }

  const { error } =
    await supabase
      .from("tasks")
      .update({
        title,

        description:
          description || null,

        category:
          category || null,

        priority:
          priority || "medium",

        status:
          status || "not_started",

        due_date:
          dueDate || null,

        completion_pct:
          completionPct,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    console.error(
      "Failed to update task:",
      error
    );

    throw new Error(
      `Failed to update task: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/tasks"
  );

  if (eventId) {
    revalidatePath(
      `/dashboard/tasks?event=${eventId}`
    );
  }

  revalidatePath("/dashboard");
}