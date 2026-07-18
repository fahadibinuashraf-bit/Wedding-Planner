"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Wallet,
  Activity,
  Plus,
  ListTodo,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CountdownRing } from "@/components/shared/countdown-ring";
import { AnimatedProgressBar } from "@/components/shared/progress-bar";
import { EventCard, type EventCardData } from "@/components/shared/event-card";
import {
  getPlanningProgress,
  getWeeksRemaining,
  GROOM_NAME,
  WEDDING_DATE,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

const PLACEHOLDER_EVENTS: EventCardData[] = [
  {
    id: "1",
    name: "Destination Wedding",
    slug: "destination-wedding",
    description: "Travel, venue booking, and guest logistics",
    event_date: "2026-11-06",
    color_gradient: "destination",
    completion_pct: 35,
  },
  {
    id: "2",
    name: "Nikah",
    slug: "nikah",
    description: "Ceremony, imam, and religious preparations",
    event_date: "2026-11-08",
    color_gradient: "nikah",
    completion_pct: 42,
  },
  {
    id: "3",
    name: "Reception",
    slug: "reception",
    description: "Venue, catering, decor, and entertainment",
    event_date: "2026-11-09",
    color_gradient: "reception",
    completion_pct: 28,
  },
];

const URGENT_TASKS = [
  { id: "1", title: "Confirm venue deposit", event: "Reception", due: "2 days", priority: "critical" },
  { id: "2", title: "Book photographer", event: "Nikah", due: "5 days", priority: "urgent" },
  { id: "3", title: "Send save-the-dates", event: "Destination", due: "1 week", priority: "upcoming" },
];

const RECENT_ACTIVITY = [
  { id: "1", action: "Task completed", detail: "Finalize guest list", time: "2h ago" },
  { id: "2", action: "Budget updated", detail: "Catering advance paid", time: "5h ago" },
  { id: "3", action: "New task assigned", detail: "Order wedding cards", time: "1d ago" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function DashboardContent() {
  const planningProgress = getPlanningProgress();
  const weeksRemaining = getWeeksRemaining();
  const overallCompletion = 35;

  const greeting = getGreeting();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Hero Section */}
      <motion.div variants={item} className="relative overflow-hidden rounded-2xl bg-gradient-emerald-gold p-6 text-white md:p-8">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">{greeting}</p>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              {GROOM_NAME}&apos;s Wedding
            </h1>
            <p className="mt-2 text-white/90">
              {weeksRemaining} weeks until your special day &middot;{" "}
              {WEDDING_DATE.toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <CountdownRing size={160} className="mx-auto md:mx-0" />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Overall Progress"
          value={`${overallCompletion}%`}
          icon={CheckCircle2}
          progress={overallCompletion}
        />
        <StatCard
          title="Planning Timeline"
          value={`${Math.round(planningProgress)}%`}
          subtitle="Time elapsed"
          icon={Clock}
          progress={planningProgress}
        />
        <StatCard
          title="Budget Used"
          value={formatCurrency(850000)}
          subtitle={`of ${formatCurrency(2500000)}`}
          icon={Wallet}
          progress={34}
        />
        <StatCard
          title="Tasks Done"
          value="12 / 34"
          subtitle="22 remaining"
          icon={ListTodo}
          progress={35}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link href="/dashboard/tasks">
                  <Plus className="h-4 w-4 mr-1" /> Add Task
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/shopping">
                  <ShoppingBag className="h-4 w-4 mr-1" /> Shopping Item
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/guests">
                  <Plus className="h-4 w-4 mr-1" /> Add Guest
                </Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link href="/dashboard/events">
                  <Calendar className="h-4 w-4 mr-1" /> New Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Events */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Events</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/events">View all</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {PLACEHOLDER_EVENTS.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Urgent Tasks */}
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Urgent Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {URGENT_TASKS.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.event}</p>
                  </div>
                  <Badge
                    variant={
                      task.priority === "critical"
                        ? "destructive"
                        : task.priority === "urgent"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {task.due}
                  </Badge>
                </div>
              ))}
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/dashboard/tasks">View all tasks</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-emerald" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.detail}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {activity.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShoppingBag className="h-5 w-5 text-gold" />
                Shopping Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatedProgressBar value={45} label="Items Purchased" />
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-2xl font-bold text-emerald">18</p>
                  <p className="text-xs text-muted-foreground">Purchased</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-2xl font-bold text-gold">22</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-emerald" />
                Booking Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Venue", status: "Confirmed", done: true },
                { name: "Photographer", status: "Pending", done: false },
                { name: "Catering", status: "Confirmed", done: true },
                { name: "Decorator", status: "In Progress", done: false },
              ].map((booking) => (
                <div
                  key={booking.name}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{booking.name}</span>
                  <Badge variant={booking.done ? "emerald" : "secondary"}>
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  progress,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  progress?: number;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{title}</p>
          <Icon className="h-5 w-5 text-emerald" />
        </div>
        <p className="mt-2 font-display text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <AnimatedProgressBar value={progress} showPercentage={false} size="sm" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
