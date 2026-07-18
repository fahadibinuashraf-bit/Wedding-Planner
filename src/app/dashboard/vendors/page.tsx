import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Vendors" description="Track vendors, payments, and ratings">
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Add Vendor
        </Button>
      </PageHeader>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            Vendor management coming in Phase 6
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
