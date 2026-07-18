import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="Manage all wedding tasks across events">
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Add Task
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            Kanban, Table, List, and Calendar views coming in Phase 3
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
