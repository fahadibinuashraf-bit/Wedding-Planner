import { Badge } from "@/components/ui/badge";

interface Props {
  priority: string | null;
}

export function TaskPriorityBadge({
  priority,
}: Props) {
  switch (priority) {
    case "critical":
      return (
        <Badge variant="destructive">
          Critical
        </Badge>
      );

    case "high":
      return (
        <Badge className="bg-red-500 hover:bg-red-600">
          High
        </Badge>
      );

    case "medium":
      return (
        <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
          Medium
        </Badge>
      );

    case "low":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          Low
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Unknown
        </Badge>
      );
  }
}