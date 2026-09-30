import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  href: string;
  icon: LucideIcon;
}

export function EventDashboardCard({
  title,
  value,
  href,
  icon: Icon,
}: Props) {
  return (
    <Link href={href}>
      <Card className="transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {value}
            </h2>
          </div>

          <Icon className="h-10 w-10 text-emerald-600" />
        </CardContent>
      </Card>
    </Link>
  );
}