import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile and wedding configuration"
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wedding Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Groom</span>
              <span className="font-medium">Mohammed Ashhar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Wedding Date</span>
              <span className="font-medium">November 8, 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="emerald">Planning</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">App Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">Phase 1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stack</span>
              <span className="font-medium">Next.js + Supabase</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
