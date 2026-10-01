import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedEventId =
      searchParams.get("event") || "";

    const supabase =
      (await createClient()) as any;

    /* -----------------------------------------
       FIND EVENT
    ----------------------------------------- */

    const { data: events, error: eventsError } =
      await supabase
        .from("events")
        .select("id, event_date")
        .order("created_at", {
          ascending: false,
        });

    if (eventsError) {
      console.error(
        "Notification event query failed:",
        eventsError
      );

      return NextResponse.json(
        {
          count: 0,
          eventId: null,
        },
        { status: 200 }
      );
    }

    const selectedEvent =
      events?.find(
        (event: any) =>
          String(event.id) ===
          requestedEventId
      ) ||
      events?.[0] ||
      null;

    if (!selectedEvent) {
      return NextResponse.json({
        count: 0,
        eventId: null,
      });
    }

    const eventId = String(
      selectedEvent.id
    );

    /* -----------------------------------------
       LOAD PLANNING DATA
    ----------------------------------------- */

    const [
      tasksResult,
      guestsResult,
      shoppingResult,
      budgetResult,
      vendorsResult,
    ] = await Promise.all([
      supabase
        .from("tasks")
        .select(
          "id, status, due_date"
        )
        .eq("event_id", eventId),

      supabase
        .from("guests")
        .select(
          "id, rsvp_status"
        )
        .eq("event_id", eventId),

      supabase
        .from("shopping_items")
        .select(
          "id, price, paid, purchased"
        )
        .eq("event_id", eventId),

      supabase
        .from("budget_items")
        .select(
          "id, actual_amount, paid"
        )
        .eq("event_id", eventId),

      supabase
        .from("vendors")
        .select(
          "id, total_amount, advance_paid"
        )
        .eq("event_id", eventId),
    ]);

    if (tasksResult.error) {
      console.error(
        "Notification tasks query failed:",
        tasksResult.error
      );
    }

    if (guestsResult.error) {
      console.error(
        "Notification guests query failed:",
        guestsResult.error
      );
    }

    if (shoppingResult.error) {
      console.error(
        "Notification shopping query failed:",
        shoppingResult.error
      );
    }

    if (budgetResult.error) {
      console.error(
        "Notification budget query failed:",
        budgetResult.error
      );
    }

    if (vendorsResult.error) {
      console.error(
        "Notification vendors query failed:",
        vendorsResult.error
      );
    }

    const tasks =
      tasksResult.data ?? [];

    const guests =
      guestsResult.data ?? [];

    const shopping =
      shoppingResult.data ?? [];

    const budget =
      budgetResult.data ?? [];

    const vendors =
      vendorsResult.data ?? [];

    /* -----------------------------------------
       TASKS
    ----------------------------------------- */

    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const overdueTasks = tasks.filter(
      (task: any) => {
        if (
          task.status ===
            "completed" ||
          !task.due_date
        ) {
          return false;
        }

        return (
          new Date(task.due_date) <
          startOfToday
        );
      }
    );

    const upcomingTasks =
      tasks.filter(
        (task: any) => {
          if (
            task.status ===
              "completed" ||
            !task.due_date
          ) {
            return false;
          }

          const dueDate = new Date(
            task.due_date
          );

          const difference =
            dueDate.getTime() -
            startOfToday.getTime();

          const days =
            difference /
            (1000 * 60 * 60 * 24);

          return (
            days >= 0 &&
            days <= 7
          );
        }
      );

    /* -----------------------------------------
       GUESTS
    ----------------------------------------- */

    const pendingGuests =
      guests.filter(
        (guest: any) =>
          normalizeRsvp(
            guest.rsvp_status
          ) === "pending"
      );

    /* -----------------------------------------
       BUDGET
    ----------------------------------------- */

    const pendingBudgetItems =
      budget.filter(
        (item: any) =>
          !Boolean(item.paid)
      );

    /* -----------------------------------------
       VENDORS
    ----------------------------------------- */

    const unpaidVendors =
      vendors.filter(
        (vendor: any) => {
          const total =
            Number(
              vendor.total_amount || 0
            );

          const advance =
            Number(
              vendor.advance_paid || 0
            );

          return (
            Math.max(
              0,
              total - advance
            ) > 0
          );
        }
      );

    /* -----------------------------------------
       SHOPPING
    ----------------------------------------- */

    const unpaidShopping =
      shopping.filter(
        (item: any) => {
          const price =
            Number(
              item.price || 0
            );

          const paid =
            Number(
              item.paid || 0
            );

          return (
            Math.max(
              0,
              price - paid
            ) > 0
          );
        }
      );

    /* -----------------------------------------
       WEDDING COUNTDOWN
    ----------------------------------------- */

    let weddingApproaching =
      false;

    if (
      selectedEvent.event_date
    ) {
      const weddingDate =
        new Date(
          selectedEvent.event_date
        );

      const difference =
        weddingDate.getTime() -
        startOfToday.getTime();

      const daysUntilWedding =
        Math.ceil(
          difference /
            (1000 *
              60 *
              60 *
              24)
        );

      weddingApproaching =
        daysUntilWedding >= 0 &&
        daysUntilWedding <= 30;
    }

    /* -----------------------------------------
       COUNT NOTIFICATION CATEGORIES
    ----------------------------------------- */

    let count = 0;

    if (
      overdueTasks.length > 0
    ) {
      count++;
    }

    if (
      upcomingTasks.length > 0
    ) {
      count++;
    }

    if (
      pendingGuests.length > 0
    ) {
      count++;
    }

    if (
      pendingBudgetItems.length > 0
    ) {
      count++;
    }

    if (
      unpaidVendors.length > 0
    ) {
      count++;
    }

    if (
      unpaidShopping.length > 0
    ) {
      count++;
    }

    if (weddingApproaching) {
      count++;
    }

    return NextResponse.json({
      count,
      eventId,
    });
  } catch (error) {
    console.error(
      "Notification count failed:",
      error
    );

    return NextResponse.json(
      {
        count: 0,
        eventId: null,
      },
      { status: 200 }
    );
  }
}

/* -----------------------------------------
   RSVP NORMALIZER
----------------------------------------- */

function normalizeRsvp(
  status: string | null
) {
  const value = String(
    status || "pending"
  )
    .trim()
    .toLowerCase();

  if (
    value === "accepted" ||
    value === "accept" ||
    value === "yes" ||
    value === "confirmed"
  ) {
    return "accepted";
  }

  if (
    value === "declined" ||
    value === "decline" ||
    value === "no"
  ) {
    return "declined";
  }

  return "pending";
}