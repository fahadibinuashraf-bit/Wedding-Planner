"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedProgressBar } from "@/components/shared/progress-bar";
import { EVENT_GRADIENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
      <Link href={`/dashboard/events/${event.slug}`}>
        <Card className="group overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-gold/50">
          <div className={cn("h-2 w-full", gradientClass)} />
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg group-hover:text-emerald-dark dark:group-hover:text-emerald-light transition-colors">
                  {event.name}
                </CardTitle>
                {event.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
