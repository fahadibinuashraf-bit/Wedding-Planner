export type UserRole = "admin" | "member" | "volunteer";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export type TaskStatus =
  | "not_started"
  | "in_progress"
  | "waiting"
  | "blocked"
  | "completed"
  | "cancelled";

export type RsvpStatus = "pending" | "confirmed" | "declined" | "maybe";

export type GuestSide = "bride" | "groom" | "both" | "neutral";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
}

export interface WeddingConfig {
  id: string;
  groom_name: string;
  bride_name: string | null;
  wedding_date: string;
  planning_start_date: string;
  venue: string | null;
  created_at: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  event_date: string | null;
  color_gradient: string;
  icon: string | null;
  sort_order: number;
  is_archived: boolean;
  completion_pct: number;
  created_at: string;
}

export interface Task {
  id: string;
  event_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string | null;
  completion_pct: number;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; full_name: string };
        Update: Partial<Profile>;
      };
      wedding_config: {
        Row: WeddingConfig;
        Insert: Partial<WeddingConfig>;
        Update: Partial<WeddingConfig>;
      };
      events: {
        Row: WeddingEvent;
        Insert: Partial<WeddingEvent> & { name: string; slug: string };
        Update: Partial<WeddingEvent>;
      };
      tasks: {
        Row: Task;
        Insert: Partial<Task> & { event_id: string; title: string };
        Update: Partial<Task>;
      };
    };
  };
}
