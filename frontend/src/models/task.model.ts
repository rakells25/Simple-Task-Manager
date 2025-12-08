export type TaskStatus = "toDo" | "inProgress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: string;
  priority: TaskPriority;
  createdAt?: string;
}
