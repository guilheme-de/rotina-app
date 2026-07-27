export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type GoalStatus = "active" | "completed" | "archived";
export type TransactionType = "income" | "expense";
export type HabitFrequency = "daily" | "weekly";

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  notifications_enabled: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  tags: string[];
  position: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  frequency: HabitFrequency;
  target_days: number;
  archived: boolean;
  created_by: string | null;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  log_date: string;
  completed: boolean;
  created_at: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  progress: number;
  status: GoalStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  all_day: boolean;
  color: string;
  created_by: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string | null;
  occurred_on: string;
  created_by: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile> & { id: string }; Update: Partial<Profile> };
      tasks: { Row: Task; Insert: Partial<Task>; Update: Partial<Task> };
      habits: { Row: Habit; Insert: Partial<Habit>; Update: Partial<Habit> };
      habit_logs: { Row: HabitLog; Insert: Partial<HabitLog>; Update: Partial<HabitLog> };
      goals: { Row: Goal; Insert: Partial<Goal>; Update: Partial<Goal> };
      events: { Row: CalendarEvent; Insert: Partial<CalendarEvent>; Update: Partial<CalendarEvent> };
      notes: { Row: Note; Insert: Partial<Note>; Update: Partial<Note> };
      transactions: { Row: Transaction; Insert: Partial<Transaction>; Update: Partial<Transaction> };
    };
  };
}
