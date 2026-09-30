"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/* -------------------------------------------------
   ADD SHOPPING ITEM
------------------------------------------------- */

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
  ).trim();

  const quantity = Math.max(
    1,
    Number(
      formData.get("quantity") || 1
    )
  );

  const estimatedPrice = Math.max(
    0,
    Number(
      formData.get(
        "estimated_price"
      ) || 0
    )
  );

  const actualPrice = Math.max(
    0,
    Number(
      formData.get(
        "actual_price"
      ) || 0
    )
  );

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  if (!name) {
    throw new Error(
      "Shopping item name is required."
    );
  }

  const { error } =
    await supabase
      .from("shopping_items")
      .insert({
        event_id: eventId,
        name,
        category:
          category || "Other",
        quantity,
        estimated_price:
          estimatedPrice,
        actual_price:
          actualPrice,
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

  revalidatePath(
    "/dashboard/shopping"
  );

  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   UPDATE SHOPPING ITEM
------------------------------------------------- */

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
  ).trim();

  const quantity = Math.max(
    1,
    Number(
      formData.get("quantity") || 1
    )
  );

  const estimatedPrice = Math.max(
    0,
    Number(
      formData.get(
        "estimated_price"
      ) || 0
    )
  );

  const actualPrice = Math.max(
    0,
    Number(
      formData.get(
        "actual_price"
      ) || 0
    )
  );

  const purchasedValue =
    String(
      formData.get(
        "purchased"
      ) || "false"
    );

  const purchased =
    purchasedValue === "true";

  if (!id) {
    throw new Error(
      "Shopping item ID is required."
    );
  }

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  if (!name) {
    throw new Error(
      "Shopping item name is required."
    );
  }

  const { error } =
    await supabase
      .from("shopping_items")
      .update({
        name,
        category:
          category || "Other",
        quantity,
        estimated_price:
          estimatedPrice,
        actual_price:
          actualPrice,
        purchased,
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
      "Failed to update shopping item:",
      error
    );

    throw new Error(
      `Failed to update shopping item: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/shopping"
  );

  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   DELETE SHOPPING ITEM
------------------------------------------------- */

export async function deleteShoppingItem(
  id: string,
  eventId: string
) {
  const supabase = (await createClient()) as any;

  if (!id) {
    throw new Error(
      "Shopping item ID is required."
    );
  }

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  const { error } =
    await supabase
      .from("shopping_items")
      .delete()
      .eq("id", id)
      .eq(
        "event_id",
        eventId
      );

  if (error) {
    console.error(
      "Failed to delete shopping item:",
      error
    );

    throw new Error(
      `Failed to delete shopping item: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/shopping"
  );

  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
}

/* -------------------------------------------------
   TOGGLE PURCHASED STATUS
------------------------------------------------- */

export async function toggleShoppingItem(
  id: string,
  eventId: string,
  purchased: boolean
) {
  const supabase = (await createClient()) as any;

  if (!id) {
    throw new Error(
      "Shopping item ID is required."
    );
  }

  if (!eventId) {
    throw new Error(
      "Event is required."
    );
  }

  const { error } =
    await supabase
      .from("shopping_items")
      .update({
        purchased,
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
      "Failed to update shopping status:",
      error
    );

    throw new Error(
      `Failed to update shopping status: ${error.message}`
    );
  }

  revalidatePath(
    "/dashboard/shopping"
  );

  revalidatePath(
    `/dashboard/shopping?event=${eventId}`
  );

  revalidatePath("/dashboard");
}