import { PageHeader } from "@/components/shared/page-header";
import { EventCard, type EventCardData } from "@/components/shared/event-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const EVENTS: EventCardData[] = [
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

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="Manage all wedding events and their workspaces"
      >
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Add Event
        </Button>
      </PageHeader>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EVENTS.map((event, i) => (
          <EventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}
