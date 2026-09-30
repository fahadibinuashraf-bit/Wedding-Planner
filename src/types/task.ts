export interface Task {
  id: string;
  event_id: string;

  title: string;
  description: string | null;

  category: string | null;

  priority: "critical" | "high" | "medium" | "low" | null;

  status:
    | "not_started"
    | "in_progress"
    | "waiting"
    | "blocked"
    | "completed"
    | "cancelled"
    | null;

  due_date: string | null;

  completion_pct: number | null;

  sort_order: number | null;

  created_by: string | null;

  created_at: string | null;

  updated_at: string | null;
}