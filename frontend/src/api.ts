import { Task, ActivityLog } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function fetchLogs(): Promise<ActivityLog[]> {
  const res = await fetch(`${BASE_URL}/logs`);
  if (!res.ok) throw new Error("Failed to fetch activity logs");
  return res.json();
}

export async function createTask(payload: { title: string; description: string }): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(id: string, payload: { title: string; description: string }): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id: string): Promise<{ id: string }> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

export async function toggleTask(id: string): Promise<{ task: Task; log?: ActivityLog }> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/toggle`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to toggle task");
  return res.json();
}
