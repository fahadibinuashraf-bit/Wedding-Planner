import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { AnimatedProgressBar } from "@/components/shared/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EVENT_GRADIENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EVENTS: Record<
  string,
  {
    name: string;
    description: string;
    event_date: string;
    color_gradient: string;
    completion_pct: number;
  }
> = {
  "destination-wedding": {
    name: "Destination Wedding",
    description: "Travel, venue booking, and guest logistics",
    event_date: "2026-11-06",
    color_gradient: "destination",
    completion_pct: 35,
  },
  nikah: {
    name: "Nikah",
    description: "Ceremony, imam, and religious preparations",
    event_date: "2026-11-08",
    color_gradient: "nikah",
    completion_pct: 42,
  },
  reception: {
    name: "Reception",
    description: "Venue, catering, decor, and entertainment",
    event_date: "2026-11-09",
    color_gradient: "reception",
    completion_pct: 28,
  },
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = EVENTS[slug];

  if (!event) {
    notFound();
  }

  const gradientClass =
    EVENT_GRADIENTS[event.color_gradient] || EVENT_GRADIENTS.default;

  return (
    <div className="space-y-6">
      <div className={cn("rounded-2xl p-6 text-white md:p-8", gradientClass)}>
        <PageHeader
          title={event.name}
          description={event.description}
          className="text-white [&_p]:text-white/80"
        />
        <div className="mt-4 flex items-center gap-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {new Date(event.event_date).toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Badge>
        </div>
      </div>

      <AnimatedProgressBar
        value={event.completion_pct}
        label="Event Completion"
        size="lg"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Tasks",
          "Budget",
          "Shopping",
          "Timeline",
          "Notes",
          "Files",
          "Checklist",
          "Members",
        ].map((section) => (
          <Card key={section} className="card-hover cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{section}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming in Phase 2
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
