import { Badge } from "@/components/ui/badge";

interface Props {
  status: string | null;
}

export function TaskStatusBadge({
  status,
}: Props) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-600">
          Completed
        </Badge>
      );

    case "in_progress":
      return (
        <Badge className="bg-blue-600">
          In Progress
        </Badge>
      );

    case "waiting":
      return (
        <Badge className="bg-yellow-500 text-black">
          Waiting
        </Badge>
      );

    case "blocked":
      return (
        <Badge variant="destructive">
          Blocked
        </Badge>
      );

    case "cancelled":
      return (
        <Badge variant="outline">
          Cancelled
        </Badge>
      );

    default:
      return (
        <Badge variant="secondary">
          Not Started
        </Badge>
      );
  }
}