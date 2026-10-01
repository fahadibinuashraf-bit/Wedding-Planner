import Link from "next/link";



import {

  AlertCircle,

  ArrowRight,

  CalendarDays,

  CalendarHeart,

  CheckCircle2,

  Clock3,

  Plus,

  ShoppingBag,

  Store,

  TrendingUp,

  Users,

  Wallet,

} from "lucide-react";



import { createClient } from "@/lib/supabase/server";



import {

  Card,

  CardContent,

} from "@/components/ui/card";



import { Button } from "@/components/ui/button";



export const dynamic = "force-dynamic";



/* =====================================================

   TYPES

\===================================================== */



type EventData = {

  id: string;

  name: string;

  slug: string | null;

  description: string | null;

  event_date: string | null;

  event_type: string | null;

  completion_pct: number;

};



type TaskData = {

  id: string;

  title: string;

  status: string | null;

  completion_pct: number | null;

  due_date: string | null;

};



type GuestData = {

  id: string;

  name: string;

  rsvp_status: string | null;

};



type ShoppingData = {

  id: string;

  name: string;

  category: string | null;

  price: number;

  paid: number;

  purchased: boolean;

};



type BudgetData = {

  id: string;

  name: string;

  category: string | null;

  estimated_amount: number;

  actual_amount: number;

  paid: boolean;

};



type VendorData = {

  id: string;

  name: string;

  category: string | null;

  total_amount: number;

  advance_paid: number;

};



type ExpenseSegment = {

  name: string;

  total: number;

  paid: number;

  balance: number;

  color: string;

};



type CategoryExpense = {

  name: string;

  total: number;

};



/* =====================================================

   PROPS

\===================================================== */



interface DashboardProps {

  searchParams: Promise<{

    event?: string;

  }>;

}



/* =====================================================

   PAGE

\===================================================== */



export default async function DashboardPage({

  searchParams,

}: DashboardProps) {

  const params = await searchParams;



  const selectedEventId = params.event || "";



  const supabase = (await createClient()) as any;



  /* =====================================================

     EVENTS

  ===================================================== */



  const { data: rawEvents } = await supabase

    .from("events")

    .select("*")

    .order("created_at", {

      ascending: false,

    });



  const allEvents: EventData[] = (

    rawEvents ?? []

  ).map((event: any) => ({

    id: String(event.id),



    name: String(

      event.name || "Your Wedding"

    ),



    slug: event.slug ?? null,



    description:

      event.description ?? null,



    event_date:

      event.event_date ?? null,



    event_type:

      event.event_type ?? null,



    completion_pct: Number(

      event.completion_pct ?? 0

    ),

  }));



  const selectedEvent =

    allEvents.find(

      (event) =>

        event.id === selectedEventId

    ) ||

    allEvents[0] ||

    null;



  const eventId =

    selectedEvent?.id || "";



  /* =====================================================

     EMPTY STATE

  ===================================================== */



  if (!selectedEvent) {

    return (

      <div className="space-y-8">

        <div>

          <p className="text-sm font-medium text-emerald-600">

            Wedding Planner

          </p>



          <h1 className="mt-1 font-display text-4xl font-bold">

            Dashboard

          </h1>



          <p className="mt-2 text-muted-foreground">

            Everything you need to keep your

            wedding planning on track.

          </p>

        </div>



        <Card>

          <CardContent className="flex flex-col items-center justify-center py-24 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">

              <CalendarHeart className="h-8 w-8 text-emerald-600" />

            </div>



            <h2 className="mt-6 text-2xl font-bold">

              Create your first event

            </h2>



            <p className="mt-2 max-w-md text-muted-foreground">

              Start by creating your wedding event.

              You can then manage tasks, guests,

              budget, vendors and shopping.

            </p>



            <Link

              href="/dashboard/events"

              className="mt-6"

            >

              <Button className="bg-emerald-600 hover:bg-emerald-700">

                <Plus className="mr-2 h-4 w-4" />

                Create Event

              </Button>

            </Link>

          </CardContent>

        </Card>

      </div>

    );

  }



  /* =====================================================

     LOAD DATA

  ===================================================== */



  const [

    tasksResult,

    guestsResult,

    shoppingResult,

    budgetResult,

    vendorsResult,

  ] = await Promise.all([

    supabase

      .from("tasks")

      .select("*")

      .eq("event_id", eventId),



    supabase

      .from("guests")

      .select("*")

      .eq("event_id", eventId),



    supabase

      .from("shopping_items")

      .select("*")

      .eq("event_id", eventId),



    supabase

      .from("budget_items")

      .select("*")

      .eq("event_id", eventId),



    supabase

      .from("vendors")

      .select("*")

      .eq("event_id", eventId),

  ]);



  /* =====================================================
     LOAD ALL-EVENT FINANCIAL DATA
     This stays separate from the selected-event queries
     so the dashboard can show expenses across every event.
  ===================================================== */

  const [
    allShoppingResult,
    allBudgetResult,
    allVendorsResult,
  ] = await Promise.all([
    supabase
      .from("shopping_items")
      .select("event_id, price, paid"),
    supabase
      .from("budget_items")
      .select("event_id, actual_amount, paid"),
    supabase
      .from("vendors")
      .select("event_id, total_amount, advance_paid"),
  ]);

  /* =====================================================

     NORMALIZE

  ===================================================== */



  const tasks: TaskData[] = (

    tasksResult.data ?? []

  ).map((task: any) => ({

    id: String(task.id),



    title: String(

      task.title || "Untitled Task"

    ),



    status:

      task.status ?? "not_started",



    completion_pct: Number(

      task.completion_pct ?? 0

    ),



    due_date:

      task.due_date ?? null,

  }));



  const guests: GuestData[] = (

    guestsResult.data ?? []

  ).map((guest: any) => ({

    id: String(guest.id),



    name: String(

      guest.name || "Guest"

    ),



    rsvp_status:

      guest.rsvp_status ?? "pending",

  }));



  const shopping: ShoppingData[] = (

    shoppingResult.data ?? []

  ).map((item: any) => ({

    id: String(item.id),



    name: String(

      item.name || "Shopping Item"

    ),



    category:

      item.category ?? "Other",



    price: Number(

      item.price ?? 0

    ),



    paid: Math.min(

      Number(item.paid ?? 0),

      Number(item.price ?? 0)

    ),



    purchased: Boolean(

      item.purchased

    ),

  }));



  const budget: BudgetData[] = (

    budgetResult.data ?? []

  ).map((item: any) => ({

    id: String(item.id),



    name: String(

      item.name || "Expense"

    ),



    category:

      item.category ?? "Other",



    estimated_amount: Number(

      item.estimated_amount ?? 0

    ),



    actual_amount: Number(

      item.actual_amount ?? 0

    ),



    paid: Boolean(item.paid),

  }));



  const vendors: VendorData[] = (

    vendorsResult.data ?? []

  ).map((vendor: any) => ({

    id: String(vendor.id),



    name: String(

      vendor.name || "Vendor"

    ),



    category:

      vendor.category ?? "Other",



    total_amount: Number(

      vendor.total_amount ?? 0

    ),



    advance_paid: Math.min(

      Number(vendor.advance_paid ?? 0),

      Number(vendor.total_amount ?? 0)

    ),

  }));



  /* =====================================================

     TASK CALCULATIONS

  ===================================================== */



  const completedTasks =

    tasks.filter(

      (task) =>

        task.status ===

          "completed" ||

        Number(

          task.completion_pct || 0

        ) >= 100

    ).length;



  const taskProgress =

    tasks.length > 0

      ? Math.round(

          tasks.reduce(

            (total, task) =>

              total +

              Number(

                task.completion_pct || 0

              ),

            0

          ) / tasks.length

        )

      : 0;



  /* =====================================================

     GUEST CALCULATIONS

  ===================================================== */



  const acceptedGuests =

    guests.filter(

      (guest) =>

        normalizeRsvp(

          guest.rsvp_status

        ) === "accepted"

    ).length;



  const pendingGuests =

    guests.filter(

      (guest) =>

        normalizeRsvp(

          guest.rsvp_status

        ) === "pending"

    ).length;



  const declinedGuests =

    guests.filter(

      (guest) =>

        normalizeRsvp(

          guest.rsvp_status

        ) === "declined"

    ).length;



  const guestProgress =

    guests.length > 0

      ? Math.round(

          (acceptedGuests /

            guests.length) *

            100

        )

      : 0;



  /* =====================================================

     SHOPPING CALCULATIONS

  ===================================================== */



  const purchasedItems =

    shopping.filter(

      (item) => item.purchased

    ).length;



  const pendingShoppingItems =

    shopping.length -

    purchasedItems;



  const shoppingProgress =

    shopping.length > 0

      ? Math.round(

          (purchasedItems /

            shopping.length) *

            100

        )

      : 0;



  const shoppingTotal =

    shopping.reduce(

      (total, item) =>

        total + item.price,

      0

    );



  const shoppingPaid =

    shopping.reduce(

      (total, item) =>

        total + item.paid,

      0

    );



  const shoppingBalance =

    Math.max(

      0,

      shoppingTotal -

        shoppingPaid

    );



  /* =====================================================

     BUDGET CALCULATIONS

  ===================================================== */



  const estimatedBudget =

    budget.reduce(

      (total, item) =>

        total +

        item.estimated_amount,

      0

    );



  const actualBudget =

    budget.reduce(

      (total, item) =>

        total +

        item.actual_amount,

      0

    );



  const paidBudget =

    budget

      .filter(

        (item) => item.paid

      )

      .reduce(

        (total, item) =>

          total +

          item.actual_amount,

        0

      );



  const budgetBalance =

    Math.max(

      0,

      actualBudget -

        paidBudget

    );



  const budgetProgress =

    estimatedBudget > 0

      ? Math.min(

          100,

          Math.round(

            (actualBudget /

              estimatedBudget) *

              100

          )

        )

      : 0;



  /* =====================================================

     VENDOR CALCULATIONS

  ===================================================== */



  const vendorTotal =

    vendors.reduce(

      (total, vendor) =>

        total +

        vendor.total_amount,

      0

    );



  const vendorAdvance =

    vendors.reduce(

      (total, vendor) =>

        total +

        vendor.advance_paid,

      0

    );



  const vendorRemaining =

    Math.max(

      0,

      vendorTotal -

        vendorAdvance

    );



  const vendorProgress =

    vendorTotal > 0

      ? Math.min(

          100,

          Math.round(

            (vendorAdvance /

              vendorTotal) *

              100

          )

        )

      : 0;



  /* =====================================================
     ALL-EVENT EXPENSE OVERVIEW
  ===================================================== */

  const allEventExpenseMap = new Map<
    string,
    {
      budgetTotal: number;
      budgetPaid: number;
      vendorTotal: number;
      vendorPaid: number;
      shoppingTotal: number;
      shoppingPaid: number;
    }
  >();

  for (const event of allEvents) {
    allEventExpenseMap.set(event.id, {
      budgetTotal: 0,
      budgetPaid: 0,
      vendorTotal: 0,
      vendorPaid: 0,
      shoppingTotal: 0,
      shoppingPaid: 0,
    });
  }

  for (const item of allBudgetResult.data ?? []) {
    const eventExpenses = allEventExpenseMap.get(String(item.event_id));
    if (!eventExpenses) continue;

    const amount = Number(item.actual_amount ?? 0);
    eventExpenses.budgetTotal += amount;
    if (Boolean(item.paid)) eventExpenses.budgetPaid += amount;
  }

  for (const vendor of allVendorsResult.data ?? []) {
    const eventExpenses = allEventExpenseMap.get(String(vendor.event_id));
    if (!eventExpenses) continue;

    const total = Number(vendor.total_amount ?? 0);
    const advance = Number(vendor.advance_paid ?? 0);

    eventExpenses.vendorTotal += total;
    eventExpenses.vendorPaid += advance;
  }

  for (const item of allShoppingResult.data ?? []) {
    const eventExpenses = allEventExpenseMap.get(String(item.event_id));
    if (!eventExpenses) continue;

    const price = Number(item.price ?? 0);
    const paid = Number(item.paid ?? 0);

    eventExpenses.shoppingTotal += price;
    eventExpenses.shoppingPaid += paid;
  }

  const allEventExpenseRows = allEvents.map((event) => {
    const expenses = allEventExpenseMap.get(event.id) ?? {
      budgetTotal: 0,
      budgetPaid: 0,
      vendorTotal: 0,
      vendorPaid: 0,
      shoppingTotal: 0,
      shoppingPaid: 0,
    };

    const total =
      expenses.budgetTotal +
      expenses.vendorTotal +
      expenses.shoppingTotal;

    const paid =
      expenses.budgetPaid +
      expenses.vendorPaid +
      expenses.shoppingPaid;

    return {
      event,
      ...expenses,
      total,
      paid,
      balance: Math.max(0, total - paid),
    };
  });

  const allEventsTotal = allEventExpenseRows.reduce(
    (sum, row) => sum + row.total,
    0
  );

  const allEventsPaid = allEventExpenseRows.reduce(
    (sum, row) => sum + row.paid,
    0
  );

  const allEventsBalance = Math.max(0, allEventsTotal - allEventsPaid);

  const allEventsPaymentProgress =
    allEventsTotal > 0
      ? Math.min(100, Math.round((allEventsPaid / allEventsTotal) * 100))
      : 0;

  const allEventsBudgetTotal = allEventExpenseRows.reduce((sum, row) => sum + row.budgetTotal, 0);
  const allEventsVendorTotal = allEventExpenseRows.reduce((sum, row) => sum + row.vendorTotal, 0);
  const allEventsShoppingTotal = allEventExpenseRows.reduce((sum, row) => sum + row.shoppingTotal, 0);
  const allEventsBudgetPaid = allEventExpenseRows.reduce((sum, row) => sum + row.budgetPaid, 0);
  const allEventsVendorPaid = allEventExpenseRows.reduce((sum, row) => sum + row.vendorPaid, 0);
  const allEventsShoppingPaid = allEventExpenseRows.reduce((sum, row) => sum + row.shoppingPaid, 0);

  const allEventSegments = [
    { label: "Budget", total: allEventsBudgetTotal, paid: allEventsBudgetPaid, color: "#059669" },
    { label: "Vendors", total: allEventsVendorTotal, paid: allEventsVendorPaid, color: "#2563eb" },
    { label: "Shopping", total: allEventsShoppingTotal, paid: allEventsShoppingPaid, color: "#f97316" },
  ];

  /* =====================================================

     MONEY CENTER

  ===================================================== */



  const totalWeddingCost =

    actualBudget +

    vendorTotal +

    shoppingTotal;



  const totalPaid =

    paidBudget +

    vendorAdvance +

    shoppingPaid;



  const totalBalance =

    Math.max(

      0,

      totalWeddingCost -

        totalPaid

    );



  const paymentProgress =

    totalWeddingCost > 0

      ? Math.min(

          100,

          Math.round(

            (totalPaid /

              totalWeddingCost) *

              100

          )

        )

      : 0;



  /* =====================================================

     OVERALL PROGRESS

  ===================================================== */



  const overallProgress =

    Math.round(

      (taskProgress +

        guestProgress +

        shoppingProgress) /

        3

    );



  /* =====================================================

     COUNTDOWN

  ===================================================== */



  const weddingDate =

    selectedEvent.event_date;



  const daysUntil =

    weddingDate

      ? Math.ceil(

          (new Date(

            weddingDate

          ).getTime() -

            new Date().getTime()) /

            (1000 *

              60 *

              60 *

              24)

        )

      : null;



  const formattedWeddingDate =

    weddingDate

      ? new Date(

          weddingDate

        ).toLocaleDateString(

          "en-IN",

          {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric",

          }

        )

      : "Date not set";



  /* =====================================================

     TASKS

  ===================================================== */



  const upcomingTasks =

    [...tasks]

      .filter(

        (task) =>

          task.status !==

            "completed" &&

          task.due_date

      )

      .sort(

        (a, b) =>

          new Date(

            a.due_date as string

          ).getTime() -

          new Date(

            b.due_date as string

          ).getTime()

      )

      .slice(0, 5);



  const now = new Date();



  const overdueTasks =

    tasks.filter(

      (task) =>

        task.status !==

          "completed" &&

        task.due_date &&

        new Date(

          task.due_date

        ) < now

    );



  /* =====================================================

     EXPENSE BREAKDOWN

  ===================================================== */



  const expenseSegments: ExpenseSegment[] =

    [

      {

        name: "Budget",

        total: actualBudget,

        paid: paidBudget,

        balance: budgetBalance,

        color: "bg-emerald-600",

      },

      {

        name: "Vendors",

        total: vendorTotal,

        paid: vendorAdvance,

        balance: vendorRemaining,

        color: "bg-blue-600",

      },

      {

        name: "Shopping",

        total: shoppingTotal,

        paid: shoppingPaid,

        balance: shoppingBalance,

        color: "bg-orange-500",

      },

    ];



  const maxSegmentTotal =

    Math.max(

      ...expenseSegments.map(

        (segment) =>

          segment.total

      ),

      1

    );



  /* =====================================================

     CATEGORY BREAKDOWN

  ===================================================== */



  const categoryTotals: Record<

    string,

    number

  > = {};



  budget.forEach((item) => {

    const category =

      item.category ||

      "Other";



    categoryTotals[category] =

      (categoryTotals[category] ||

        0) +

      item.actual_amount;

  });



  vendors.forEach((vendor) => {

    const category =

      vendor.category ||

      "Other";



    categoryTotals[category] =

      (categoryTotals[category] ||

        0) +

      vendor.total_amount;

  });



  shopping.forEach((item) => {

    const category =

      item.category ||

      "Other";



    categoryTotals[category] =

      (categoryTotals[category] ||

        0) +

      item.price;

  });



  const categoryExpenses: CategoryExpense[] =

    Object.entries(

      categoryTotals

    )

      .map(

        ([name, total]) => ({

          name,

          total,

        })

      )

      .sort(

        (a, b) =>

          b.total - a.total

      )

      .slice(0, 8);



  const maxCategoryTotal =

    Math.max(

      ...categoryExpenses.map(

        (item) => item.total

      ),

      1

    );



  /* =====================================================

     RENDER

  ===================================================== */



  return (

    <div className="space-y-8">



      {/* HEADER */}



      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

        <div>

          <p className="text-sm font-medium text-emerald-600">

            Wedding Planner

          </p>



          <h1 className="mt-1 font-display text-4xl font-bold">

            Dashboard

          </h1>



          <p className="mt-2 text-muted-foreground">

            Everything you need to keep your

            wedding planning on track.

          </p>

        </div>



        <div className="flex flex-wrap gap-3">

          <Link href="/dashboard/events">

            <Button variant="outline">

              Manage Events

            </Button>

          </Link>



          <Link

            href={`/dashboard/tasks?event=${eventId}`}

          >

            <Button className="bg-emerald-600 hover:bg-emerald-700">

              <Plus className="mr-2 h-4 w-4" />

              Add Task

            </Button>

          </Link>

        </div>

      </div>



      {/* EVENT SELECTOR */}



      <Card>

        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm text-muted-foreground">

              Current Event

            </p>



            <h2 className="mt-1 font-display text-2xl font-bold">

              {selectedEvent.name}

            </h2>



            <p className="mt-1 text-sm text-muted-foreground">

              {formattedWeddingDate}

            </p>

          </div>



          {allEvents.length > 1 && (

            <div className="flex flex-wrap gap-2">

              {allEvents.map(

                (event) => (

                  <Link

                    key={event.id}

                    href={`/dashboard?event=${event.id}`}

                  >

                    <Button

                      variant={

                        event.id === eventId

                          ? "default"

                          : "outline"

                      }

                      className={

                        event.id === eventId

                          ? "bg-emerald-600 hover:bg-emerald-700"

                          : ""

                      }

                    >

                      {event.name}

                    </Button>

                  </Link>

                )

              )}

            </div>

          )}

        </CardContent>

      </Card>



      {/* COUNTDOWN */}



      <Card>

        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">

              <CalendarHeart className="h-6 w-6 text-emerald-600" />

            </div>



            <div>

              <p className="text-sm text-muted-foreground">

                {formattedWeddingDate}

              </p>



              <h2 className="mt-1 text-xl font-semibold">

                {daysUntil === null

                  ? "Set your wedding date"

                  : daysUntil > 0

                  ? `${daysUntil} days until the celebration`

                  : daysUntil === 0

                  ? "Today is the celebration!"

                  : `${Math.abs(

                      daysUntil

                    )} days since the celebration`}

              </h2>

            </div>

          </div>



          <CalendarDays className="hidden h-10 w-10 text-emerald-600 md:block" />

        </CardContent>

      </Card>



      {/* OVERALL PROGRESS */}



      <Card>

        <CardContent className="p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <TrendingUp className="h-5 w-5 text-emerald-600" />



                <h2 className="font-display text-2xl font-bold">

                  Overall Planning Progress

                </h2>

              </div>



              <p className="mt-1 text-sm text-muted-foreground">

                Based on tasks, shopping and guest

                RSVP progress.

              </p>

            </div>



            <span className="text-4xl font-bold text-emerald-600">

              {overallProgress}%

            </span>

          </div>



          <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">

            <div

              className="h-full rounded-full bg-emerald-600 transition-all"

              style={{

                width: `${overallProgress}%`,

              }}

            />

          </div>

        </CardContent>

      </Card>



      {/* STAT CARDS */}



      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">



        <DashboardStat

          title="Tasks"

          value={`${completedTasks}/${tasks.length}`}

          description={`${taskProgress}% complete`}

          icon={

            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

          }

          href={`/dashboard/tasks?event=${eventId}`}

        />



        <DashboardStat

          title="Guests"

          value={guests.length}

          description={`${acceptedGuests} accepted`}

          icon={

            <Users className="h-5 w-5 text-emerald-600" />

          }

          href={`/dashboard/guests?event=${eventId}`}

        />



        <DashboardStat

          title="Budget"

          value={formatCurrency(

            estimatedBudget

          )}

          description={`${formatCurrency(

            actualBudget

          )} spent`}

          icon={

            <Wallet className="h-5 w-5 text-emerald-600" />

          }

          href={`/dashboard/budget?event=${eventId}`}

        />



        <DashboardStat

          title="Shopping"

          value={`${purchasedItems}/${shopping.length}`}

          description={`${shoppingProgress}% purchased`}

          icon={

            <ShoppingBag className="h-5 w-5 text-emerald-600" />

          }

          href={`/dashboard/shopping?event=${eventId}`}

        />



      </div>



      {/* ALL EVENTS EXPENSE OVERVIEW */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">All Events</p>
              <h2 className="font-display text-2xl font-bold">Overall Expense Details</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Combined expense information from every wedding event in your planner. This is separate from the selected event below.
              </p>
            </div>
            <div className="rounded-xl border bg-muted/30 px-4 py-3 text-left md:text-right">
              <p className="text-xs text-muted-foreground">Events included</p>
              <p className="text-xl font-bold">{allEvents.length}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MoneyCenterCard title="All Events Expenses" value={formatCurrency(allEventsTotal)} description="Combined cost across every event" icon={<Wallet className="h-5 w-5 text-emerald-600" />} />
            <MoneyCenterCard title="All Events Paid" value={formatCurrency(allEventsPaid)} description="Combined amount already paid" icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />} />
            <MoneyCenterCard title="All Events Balance" value={formatCurrency(allEventsBalance)} description="Combined amount still remaining" icon={<AlertCircle className="h-5 w-5 text-orange-500" />} />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">All events payment progress</span>
              <span className="font-semibold">{formatCurrency(allEventsPaid)} / {formatCurrency(allEventsTotal)}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${allEventsPaymentProgress}%` }} />
            </div>
            <p className="mt-2 text-right text-xs text-muted-foreground">{allEventsPaymentProgress}% paid</p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr] lg:items-center">
            <div className="flex justify-center">
              <div
                className="relative h-56 w-56 rounded-full"
                style={{
                  background: `conic-gradient(#059669 0deg ${allEventsTotal > 0 ? (allEventsBudgetTotal / allEventsTotal) * 360 : 0}deg, #2563eb ${allEventsTotal > 0 ? (allEventsBudgetTotal / allEventsTotal) * 360 : 0}deg ${allEventsTotal > 0 ? ((allEventsBudgetTotal + allEventsVendorTotal) / allEventsTotal) * 360 : 0}deg, #f97316 ${allEventsTotal > 0 ? ((allEventsBudgetTotal + allEventsVendorTotal) / allEventsTotal) * 360 : 0}deg 360deg)`,
                }}
              >
                <div className="absolute inset-7 flex flex-col items-center justify-center rounded-full bg-background text-center shadow-inner">
                  <p className="text-xs text-muted-foreground">All Events</p>
                  <p className="mt-1 text-2xl font-bold">{formatCurrency(allEventsTotal)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Total expenses</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {allEventSegments.map((segment) => {
                const percentage = allEventsTotal > 0 ? Math.round((segment.total / allEventsTotal) * 100) : 0;
                const balance = Math.max(0, segment.total - segment.paid);
                return (
                  <div key={segment.label} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span className="font-semibold">{segment.label}</span>
                      </div>
                      <span className="text-sm font-semibold">{percentage}%</span>
                    </div>
                    <p className="mt-3 text-lg font-bold">{formatCurrency(segment.total)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Paid: {formatCurrency(segment.paid)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Balance: {formatCurrency(balance)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Expense Details by Event</h3>
              <span className="text-sm text-muted-foreground">{allEventExpenseRows.length} event{allEventExpenseRows.length === 1 ? "" : "s"}</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-muted/40">
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Budget</th>
                    <th className="px-4 py-3 font-semibold">Vendors</th>
                    <th className="px-4 py-3 font-semibold">Shopping</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Paid</th>
                    <th className="px-4 py-3 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {allEventExpenseRows.map((row) => (
                    <tr key={row.event.id} className="border-b last:border-0">
                      <td className="px-4 py-4">
                        <Link href={`/dashboard?event=${row.event.id}`} className="font-semibold hover:text-emerald-600">
                          {row.event.name}
                        </Link>
                        {row.event.event_date ? <p className="mt-1 text-xs text-muted-foreground">{formatDate(row.event.event_date)}</p> : null}
                      </td>
                      <td className="px-4 py-4">{formatCurrency(row.budgetTotal)}</td>
                      <td className="px-4 py-4">{formatCurrency(row.vendorTotal)}</td>
                      <td className="px-4 py-4">{formatCurrency(row.shoppingTotal)}</td>
                      <td className="px-4 py-4 font-semibold">{formatCurrency(row.total)}</td>
                      <td className="px-4 py-4 text-emerald-600">{formatCurrency(row.paid)}</td>
                      <td className="px-4 py-4 text-orange-600">{formatCurrency(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* MONEY CENTER */}

      <Card className="overflow-hidden">

        <CardContent className="p-6">



          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="font-display text-2xl font-bold">

                Money Center

              </h2>



              <p className="mt-1 text-sm text-muted-foreground">

                Complete wedding payment overview

              </p>

            </div>



            <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">

              {paymentProgress}% paid

            </div>

          </div>



          <div className="mt-6 grid gap-4 md:grid-cols-3">



            <MoneyCenterCard

              title="Total Overall Expenses"

              value={formatCurrency(

                totalWeddingCost

              )}

              description="Tracked expenses"

              icon={

                <Wallet className="h-5 w-5 text-emerald-600" />

              }

            />



            <MoneyCenterCard

              title="Total Paid"

              value={formatCurrency(

                totalPaid

              )}

              description="Amount already paid"

              icon={

                <CheckCircle2 className="h-5 w-5 text-emerald-600" />

              }

            />



            <MoneyCenterCard

              title="Total Balance"

              value={formatCurrency(

                totalBalance

              )}

              description="Amount still remaining"

              icon={

                <AlertCircle className="h-5 w-5 text-orange-500" />

              }

            />



          </div>



          <div className="mt-6">

            <div className="flex items-center justify-between text-sm">

              <span className="text-muted-foreground">

                Overall payment progress

              </span>



              <span className="font-semibold">

                {formatCurrency(

                  totalPaid

                )}{" "}

                /{" "}

                {formatCurrency(

                  totalWeddingCost

                )}

              </span>

            </div>



            <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">

              <div

                className="h-full rounded-full bg-emerald-600 transition-all"

                style={{

                  width: `${paymentProgress}%`,

                }}

              />

            </div>

          </div>



          <div className="mt-6 grid gap-3 md:grid-cols-3">



            <Link

              href={`/dashboard/budget?event=${eventId}`}

            >

              <MoneySourceCard

                title="Budget"

                total={actualBudget}

                paid={paidBudget}

                balance={budgetBalance}

              />

            </Link>



            <Link

              href={`/dashboard/vendors?event=${eventId}`}

            >

              <MoneySourceCard

                title="Vendors"

                total={vendorTotal}

                paid={vendorAdvance}

                balance={vendorRemaining}

              />

            </Link>



            <Link

              href={`/dashboard/shopping?event=${eventId}`}

            >

              <MoneySourceCard

                title="Shopping"

                total={shoppingTotal}

                paid={shoppingPaid}

                balance={shoppingBalance}

              />

            </Link>



          </div>



        </CardContent>

      </Card>



      {/* EXPENSE BREAKDOWN */}



      <Card>

        <CardContent className="p-6">



          <div>

            <h2 className="font-display text-2xl font-bold">

              Overall Expense Chart

            </h2>

            <p className="mt-1 text-sm text-muted-foreground">

              See how your total wedding expenses are distributed across budget, vendors and shopping.

            </p>

          </div>



          {/* OVERALL EXPENSE DONUT CHART */}



          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,360px)_1fr] lg:items-center">

            <div className="flex justify-center">

              <div

                className="relative h-64 w-64 rounded-full"

                style={{

                  background: `conic-gradient(

                    #059669 0deg ${

                      totalWeddingCost > 0

                        ? (actualBudget / totalWeddingCost) * 360

                        : 0

                    }deg,

                    #2563eb ${

                      totalWeddingCost > 0

                        ? (actualBudget / totalWeddingCost) * 360

                        : 0

                    }deg ${

                      totalWeddingCost > 0

                        ? ((actualBudget + vendorTotal) / totalWeddingCost) * 360

                        : 0

                    }deg,

                    #f97316 ${

                      totalWeddingCost > 0

                        ? ((actualBudget + vendorTotal) / totalWeddingCost) * 360

                        : 0

                    }deg 360deg

                  )`,

                }}

              >

                <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-background text-center shadow-inner">

                  <p className="text-xs text-muted-foreground">

                    Overall Expenses

                  </p>

                  <p className="mt-1 text-2xl font-bold">

                    {formatCurrency(totalWeddingCost)}

                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">

                    {paymentProgress}% paid

                  </p>

                </div>

              </div>

            </div>



            <div className="space-y-4">

              {expenseSegments.map((segment) => {

                const percentage =

                  totalWeddingCost > 0

                    ? Math.round(

                        (segment.total / totalWeddingCost) * 100

                      )

                    : 0;



                return (

                  <div

                    key={segment.name}

                    className="rounded-xl border p-4"

                  >

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <span

                          className={`h-3 w-3 shrink-0 rounded-full ${segment.color}`}

                        />

                        <div className="min-w-0">

                          <p className="font-semibold">

                            {segment.name}

                          </p>

                          <p className="text-xs text-muted-foreground">

                            {percentage}% of overall expenses

                          </p>

                        </div>

                      </div>



                      <p className="shrink-0 text-lg font-bold">

                        {formatCurrency(segment.total)}

                      </p>

                    </div>



                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">

                      <div

                        className={`h-full rounded-full ${segment.color} transition-all`}

                        style={{

                          width: `${percentage}%`,

                        }}

                      />

                    </div>



                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">

                      <span>

                        Paid: {formatCurrency(segment.paid)}

                      </span>

                      <span>

                        Balance: {formatCurrency(segment.balance)}

                      </span>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>



          {/* SEGMENT BREAKDOWN */}



          <div className="mt-8 border-t pt-6">

            <h3 className="text-lg font-bold">

              Expense Details

            </h3>

            <p className="mt-1 text-sm text-muted-foreground">

              Detailed payment progress for each expense source.

            </p>

          </div>



          <div className="mt-6 space-y-5">




            {expenseSegments.map(

              (segment) => {

                const percentage =

                  totalWeddingCost > 0

                    ? Math.round(

                        (segment.total /

                          totalWeddingCost) *

                          100

                      )

                    : 0;



                const barWidth =

                  Math.round(

                    (segment.total /

                      maxSegmentTotal) *

                      100

                  );



                const paidPercentage =

                  segment.total > 0

                    ? Math.min(

                        100,

                        Math.round(

                          (segment.paid /

                            segment.total) *

                            100

                        )

                      )

                    : 0;



                return (

                  <div

                    key={segment.name}

                    className="rounded-xl border p-4"

                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">



                      <div>

                        <div className="flex items-center gap-2">

                          <span

                            className={`h-3 w-3 rounded-full ${segment.color}`}

                          />



                          <p className="font-semibold">

                            {segment.name}

                          </p>

                        </div>



                        <p className="mt-1 text-xs text-muted-foreground">

                          {percentage}% of total tracked expenses

                        </p>

                      </div>



                      <div className="text-left sm:text-right">

                        <p className="text-lg font-bold">

                          {formatCurrency(

                            segment.total

                          )}

                        </p>



                        <p className="text-xs text-muted-foreground">

                          {formatCurrency(

                            segment.balance

                          )} balance

                        </p>

                      </div>



                    </div>



                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">

                      <div

                        className={`h-full rounded-full ${segment.color} transition-all`}

                        style={{

                          width: `${barWidth}%`,

                        }}

                      />

                    </div>



                    <div className="mt-3 flex items-center justify-between text-xs">

                      <span className="text-muted-foreground">

                        Paid:{" "}

                        <span className="font-medium text-foreground">

                          {formatCurrency(

                            segment.paid

                          )}

                        </span>

                      </span>



                      <span className="font-medium">

                        {paidPercentage}% paid

                      </span>

                    </div>

                  </div>

                );

              }

            )}



          </div>



          {/* CATEGORY BREAKDOWN */}



          <div className="mt-8 border-t pt-6">



            <h3 className="text-lg font-bold">

              Top Expense Categories

            </h3>



            <p className="mt-1 text-sm text-muted-foreground">

              Combined spending from budget, vendors and shopping.

            </p>



            {categoryExpenses.length === 0 ? (

              <div className="mt-5 rounded-xl border border-dashed p-8 text-center">

                <Wallet className="mx-auto h-8 w-8 text-muted-foreground" />



                <p className="mt-2 text-sm font-medium">

                  No expense categories yet

                </p>



                <p className="mt-1 text-xs text-muted-foreground">

                  Add budget, vendor or shopping expenses to see the breakdown.

                </p>

              </div>

            ) : (

              <div className="mt-5 space-y-4">



                {categoryExpenses.map(

                  (category) => {

                    const width =

                      Math.round(

                        (category.total /

                          maxCategoryTotal) *

                          100

                      );



                    return (

                      <div

                        key={category.name}

                      >

                        <div className="flex items-center justify-between gap-4">

                          <span className="text-sm font-medium">

                            {category.name}

                          </span>



                          <span className="text-sm font-semibold">

                            {formatCurrency(

                              category.total

                            )}

                          </span>

                        </div>



                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">

                          <div

                            className="h-full rounded-full bg-emerald-600 transition-all"

                            style={{

                              width: `${width}%`,

                            }}

                          />

                        </div>

                      </div>

                    );

                  }

                )}



              </div>

            )}



          </div>



        </CardContent>

      </Card>



      {/* PROGRESS CARDS */}



      <div className="grid gap-6 lg:grid-cols-3">



        <ProgressCard

          title="Tasks"

          percentage={taskProgress}

          completed={completedTasks}

          total={tasks.length}

          href={`/dashboard/tasks?event=${eventId}`}

        />



        <ProgressCard

          title="Guest RSVPs"

          percentage={guestProgress}

          completed={acceptedGuests}

          total={guests.length}

          href={`/dashboard/guests?event=${eventId}`}

        />



        <ProgressCard

          title="Shopping"

          percentage={shoppingProgress}

          completed={purchasedItems}

          total={shopping.length}

          href={`/dashboard/shopping?event=${eventId}`}

        />



      </div>



      {/* BUDGET + VENDORS */}



      <div className="grid gap-6 lg:grid-cols-2">



        <Card>

          <CardContent className="p-6">



            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold">

                  Budget

                </h2>



                <p className="mt-1 text-sm text-muted-foreground">

                  Wedding expense overview

                </p>

              </div>



              <Wallet className="h-6 w-6 text-emerald-600" />

            </div>



            <div className="mt-6 grid grid-cols-2 gap-4">



              <InfoBox

                label="Estimated"

                value={formatCurrency(

                  estimatedBudget

                )}

              />



              <InfoBox

                label="Actual"

                value={formatCurrency(

                  actualBudget

                )}

              />



              <InfoBox

                label="Paid"

                value={formatCurrency(

                  paidBudget

                )}

              />



              <InfoBox

                label="Balance"

                value={formatCurrency(

                  budgetBalance

                )}

              />



            </div>



            <Link

              href={`/dashboard/budget?event=${eventId}`}

              className="mt-5 flex items-center justify-between text-sm font-medium text-emerald-600 hover:underline"

            >

              Manage Budget

              <ArrowRight className="h-4 w-4" />

            </Link>



          </CardContent>

        </Card>



        <Card>

          <CardContent className="p-6">



            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold">

                  Vendors

                </h2>



                <p className="mt-1 text-sm text-muted-foreground">

                  Vendor and payment overview

                </p>

              </div>



              <Store className="h-6 w-6 text-emerald-600" />

            </div>



            <div className="mt-6 grid grid-cols-2 gap-4">



              <InfoBox

                label="Vendors"

                value={String(

                  vendors.length

                )}

              />



              <InfoBox

                label="Total Cost"

                value={formatCurrency(

                  vendorTotal

                )}

              />



              <InfoBox

                label="Advance Paid"

                value={formatCurrency(

                  vendorAdvance

                )}

              />



              <InfoBox

                label="Balance"

                value={formatCurrency(

                  vendorRemaining

                )}

              />



            </div>



            <Link

              href={`/dashboard/vendors?event=${eventId}`}

              className="mt-5 flex items-center justify-between text-sm font-medium text-emerald-600 hover:underline"

            >

              Manage Vendors

              <ArrowRight className="h-4 w-4" />

            </Link>



          </CardContent>

        </Card>



      </div>



      {/* UPCOMING TASKS */}



      <Card>

        <CardContent className="p-6">



          <div className="flex items-start justify-between">

            <div>

              <h2 className="text-xl font-bold">

                Upcoming Tasks

              </h2>



              <p className="mt-1 text-sm text-muted-foreground">

                Tasks that need your attention

              </p>

            </div>



            <Link

              href={`/dashboard/tasks?event=${eventId}`}

            >

              <Button

                variant="ghost"

                size="sm"

              >

                View All

                <ArrowRight className="ml-2 h-4 w-4" />

              </Button>

            </Link>

          </div>



          <div className="mt-5 space-y-3">



            {upcomingTasks.length === 0 ? (

              <div className="rounded-lg border border-dashed p-6 text-center">

                <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-600" />



                <p className="mt-2 text-sm font-medium">

                  No upcoming tasks

                </p>



                <p className="mt-1 text-xs text-muted-foreground">

                  Your schedule is clear.

                </p>

              </div>

            ) : (

              upcomingTasks.map(

                (task) => (

                  <div

                    key={task.id}

                    className="flex items-center justify-between rounded-lg border p-4"

                  >

                    <div className="min-w-0">

                      <p className="truncate font-medium">

                        {task.title}

                      </p>



                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">

                        <Clock3 className="h-3.5 w-3.5" />

                        {formatDate(

                          task.due_date

                        )}

                      </p>

                    </div>



                    <span className="ml-4 text-sm font-medium text-emerald-600">

                      {Number(

                        task.completion_pct || 0

                      )}

                      %

                    </span>

                  </div>

                )

              )

            )}



          </div>

        </CardContent>

      </Card>



      {/* NEEDS ATTENTION */}



      {(overdueTasks.length > 0 ||

        pendingGuests > 0 ||

        shoppingBalance > 0 ||

        vendorRemaining > 0 ||

        budgetBalance > 0) && (

        <Card>

          <CardContent className="p-6">



            <div className="flex items-center gap-2">

              <AlertCircle className="h-5 w-5 text-orange-500" />



              <h2 className="text-xl font-bold">

                Needs Attention

              </h2>

            </div>



            <div className="mt-5 space-y-3">



              {overdueTasks.length > 0 && (

                <AttentionItem

                  title={`${overdueTasks.length} overdue ${

                    overdueTasks.length === 1

                      ? "task"

                      : "tasks"

                  }`}

                  description="Review and update your overdue tasks."

                  href={`/dashboard/tasks?event=${eventId}`}

                />

              )}



              {pendingGuests > 0 && (

                <AttentionItem

                  title={`${pendingGuests} guest${

                    pendingGuests === 1

                      ? ""

                      : "s"

                  } awaiting RSVP`}

                  description="Follow up with guests who haven't responded."

                  href={`/dashboard/guests?event=${eventId}`}

                />

              )}



              {shoppingBalance > 0 && (

                <AttentionItem

                  title={`${formatCurrency(

                    shoppingBalance

                  )} shopping balance`}

                  description="Some shopping payments are still pending."

                  href={`/dashboard/shopping?event=${eventId}`}

                />

              )}



              {vendorRemaining > 0 && (

                <AttentionItem

                  title={`${formatCurrency(

                    vendorRemaining

                  )} vendor balance`}

                  description="Vendor payments are still outstanding."

                  href={`/dashboard/vendors?event=${eventId}`}

                />

              )}



              {budgetBalance > 0 && (

                <AttentionItem

                  title={`${formatCurrency(

                    budgetBalance

                  )} pending budget payments`}

                  description="Some recorded budget expenses are not marked as paid."

                  href={`/dashboard/budget?event=${eventId}`}

                />

              )}



            </div>

          </CardContent>

        </Card>

      )}



      {/* QUICK ACTIONS */}



      <Card>

        <CardContent className="p-6">



          <h2 className="text-xl font-bold">

            Quick Actions

          </h2>



          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">



            <QuickAction

              label="Tasks"

              href={`/dashboard/tasks?event=${eventId}`}

              icon={

                <CheckCircle2 className="h-5 w-5" />

              }

            />



            <QuickAction

              label="Guests"

              href={`/dashboard/guests?event=${eventId}`}

              icon={

                <Users className="h-5 w-5" />

              }

            />



            <QuickAction

              label="Budget"

              href={`/dashboard/budget?event=${eventId}`}

              icon={

                <Wallet className="h-5 w-5" />

              }

            />



            <QuickAction

              label="Vendors"

              href={`/dashboard/vendors?event=${eventId}`}

              icon={

                <Store className="h-5 w-5" />

              }

            />



          </div>



        </CardContent>

      </Card>



    </div>

  );

}



/* =====================================================

   DASHBOARD STAT

\===================================================== */



function DashboardStat({

  title,

  value,

  description,

  icon,

  href,

}: {

  title: string;

  value: string | number;

  description: string;

  icon: React.ReactNode;

  href: string;

}) {

  return (

    <Link href={href}>

      <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">

        <CardContent className="p-5">



          <div className="flex items-start justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">

              {icon}

            </div>



            <ArrowRight className="h-4 w-4 text-muted-foreground" />

          </div>



          <p className="mt-5 text-sm text-muted-foreground">

            {title}

          </p>



          <p className="mt-1 text-2xl font-bold">

            {value}

          </p>



          <p className="mt-1 text-xs text-muted-foreground">

            {description}

          </p>



        </CardContent>

      </Card>

    </Link>

  );

}



/* =====================================================

   MONEY CENTER CARD

\===================================================== */



function MoneyCenterCard({

  title,

  value,

  description,

  icon,

}: {

  title: string;

  value: string;

  description: string;

  icon: React.ReactNode;

}) {

  return (

    <div className="rounded-xl border bg-background p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-muted-foreground">

            {title}

          </p>



          <p className="mt-2 text-2xl font-bold">

            {value}

          </p>



          <p className="mt-1 text-xs text-muted-foreground">

            {description}

          </p>

        </div>



        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">

          {icon}

        </div>

      </div>

    </div>

  );

}



/* =====================================================

   MONEY SOURCE CARD

\===================================================== */



function MoneySourceCard({

  title,

  total,

  paid,

  balance,

}: {

  title: string;

  total: number;

  paid: number;

  balance: number;

}) {

  const progress =

    total > 0

      ? Math.min(

          100,

          Math.round(

            (paid / total) * 100

          )

        )

      : 0;



  return (

    <div className="rounded-xl border p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30">



      <div className="flex items-center justify-between">

        <p className="font-semibold">

          {title}

        </p>



        <ArrowRight className="h-4 w-4 text-muted-foreground" />

      </div>



      <div className="mt-4 grid grid-cols-3 gap-2">

        <SmallMoney

          label="Total"

          value={formatCurrency(total)}

        />



        <SmallMoney

          label="Paid"

          value={formatCurrency(paid)}

        />



        <SmallMoney

          label="Balance"

          value={formatCurrency(balance)}

        />

      </div>



      <div className="mt-4">

        <div className="flex items-center justify-between text-xs">

          <span className="text-muted-foreground">

            Paid

          </span>



          <span className="font-semibold">

            {progress}%

          </span>

        </div>



        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">

          <div

            className="h-full rounded-full bg-emerald-600"

            style={{

              width: `${progress}%`,

            }}

          />

        </div>

      </div>



    </div>

  );

}



/* =====================================================

   SMALL MONEY

\===================================================== */



function SmallMoney({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div className="rounded-lg bg-muted/50 p-2">

      <p className="text-[10px] text-muted-foreground">

        {label}

      </p>



      <p className="mt-1 text-xs font-semibold">

        {value}

      </p>

    </div>

  );

}



/* =====================================================

   PROGRESS CARD

\===================================================== */



function ProgressCard({

  title,

  percentage,

  completed,

  total,

  href,

}: {

  title: string;

  percentage: number;

  completed: number;

  total: number;

  href: string;

}) {

  return (

    <Link href={href}>

      <Card className="h-full transition-all hover:shadow-md">

        <CardContent className="p-6">



          <div className="flex items-center justify-between">

            <h3 className="font-semibold">

              {title}

            </h3>



            <span className="text-lg font-bold text-emerald-600">

              {percentage}%

            </span>

          </div>



          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">

            <div

              className="h-full rounded-full bg-emerald-600"

              style={{

                width: `${Math.min(

                  100,

                  Math.max(

                    0,

                    percentage

                  )

                )}%`,

              }}

            />

          </div>



          <p className="mt-3 text-xs text-muted-foreground">

            {completed} of {total} completed

          </p>



        </CardContent>

      </Card>

    </Link>

  );

}



/* =====================================================

   INFO BOX

\===================================================== */



function InfoBox({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div className="rounded-lg bg-muted/50 p-4">

      <p className="text-xs text-muted-foreground">

        {label}

      </p>



      <p className="mt-1 font-semibold">

        {value}

      </p>

    </div>

  );

}



/* =====================================================

   ATTENTION ITEM

\===================================================== */



function AttentionItem({

  title,

  description,

  href,

}: {

  title: string;

  description: string;

  href: string;

}) {

  return (

    <Link

      href={href}

      className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50"

    >

      <div>

        <p className="font-medium">

          {title}

        </p>



        <p className="mt-1 text-sm text-muted-foreground">

          {description}

        </p>

      </div>



      <ArrowRight className="h-4 w-4 shrink-0" />

    </Link>

  );

}



/* =====================================================

   QUICK ACTION

\===================================================== */



function QuickAction({

  label,

  href,

  icon,

}: {

  label: string;

  href: string;

  icon: React.ReactNode;

}) {

  return (

    <Link

      href={href}

      className="flex items-center gap-3 rounded-xl border p-4 font-medium transition hover:border-emerald-300 hover:bg-emerald-50/50"

    >

      <span className="text-emerald-600">

        {icon}

      </span>



      <span>{label}</span>



      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />

    </Link>

  );

}



/* =====================================================

   RSVP NORMALIZER

\===================================================== */



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



/* =====================================================

   CURRENCY

\===================================================== */



function formatCurrency(

  amount: number

) {

  return new Intl.NumberFormat(

    "en-IN",

    {

      style: "currency",

      currency: "INR",

      maximumFractionDigits: 0,

    }

  ).format(amount || 0);

}



/* =====================================================

   DATE

\===================================================== */



function formatDate(

  date: string | null

) {

  if (!date) {

    return "No due date";

  }



  const parsed =

    new Date(date);



  if (

    Number.isNaN(

      parsed.getTime()

    )

  ) {

    return "No due date";

  }



  return parsed.toLocaleDateString(

    "en-IN",

    {

      day: "numeric",

      month: "short",

      year: "numeric",

    }

  );

}