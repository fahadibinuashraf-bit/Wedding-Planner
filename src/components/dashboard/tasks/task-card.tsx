import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    due_date: string | null;
    category: string | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{task.title}</h2>

          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {task.priority}
          </span>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {task.status}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {task.due_date}
          </div>
        )}

        {task.category && (
          <div>📂 {task.category}</div>
        )}
      </div>
    </div>
  );
}