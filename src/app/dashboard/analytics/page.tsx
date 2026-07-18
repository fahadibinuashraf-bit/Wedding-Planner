import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Charts and insights for wedding planning progress"
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">
            Analytics charts with Recharts coming in Phase 7
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
