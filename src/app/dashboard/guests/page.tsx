import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function GuestsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Guests" description="Manage RSVPs, invitations, and guest lists">
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Add Guest
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            Guest management with RSVP tracking coming in Phase 6
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
