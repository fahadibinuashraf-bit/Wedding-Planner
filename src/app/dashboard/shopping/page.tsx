import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ShoppingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Shopping" description="Track purchases and shopping lists">
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Add Item
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            Shopping planner with categories and receipt uploads coming in Phase 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
