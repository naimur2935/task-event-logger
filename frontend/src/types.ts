export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  task: string;
  activity: string;
  timestamp: string;
}
