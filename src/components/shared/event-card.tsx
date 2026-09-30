"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgressBar } from "@/components/shared/progress-bar";
import { EVENT_GRADIENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DeleteEventButton } from "@/components/events/delete-event-button";

export interface EventCardData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  event_date?: string | null;
  color_gradient: string;
  completion_pct: number;
}

interface EventCardProps {
  event: EventCardData;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const gradientClass =
    EVENT_GRADIENTS[event.color_gradient] || EVENT_GRADIENTS.default;

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Date TBD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Card className="group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-gold/50">
        <div className={cn("h-2 w-full", gradientClass)} />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link href={`/dashboard/events/${event.slug}`}>
                <CardTitle className="cursor-pointer text-lg transition-colors group-hover:text-emerald-dark dark:group-hover:text-emerald-light">
                  {event.name}
                </CardTitle>
              </Link>

              {event.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {event.description}
                </p>
              )}
            </div>

            <div className="ml-2 flex items-center gap-2">
              <DeleteEventButton id={event.id} />

              <Link href={`/dashboard/events/${event.slug}`}>
                <ChevronRight className="h-5 w-5 cursor-pointer text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Link href={`/dashboard/events/${event.slug}`}>
            <div className="space-y-4 cursor-pointer">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>

              <AnimatedProgressBar
                value={event.completion_pct}
                label="Completion"
                size="sm"
              />

              {event.completion_pct >= 100 && (
                <Badge variant="gold">Complete!</Badge>
              )}
            </div>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}