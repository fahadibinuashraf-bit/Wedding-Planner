import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget"
        description="Track spending, vendor payments, and remaining budget"
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            Budget charts and expense tracking coming in Phase 5
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
