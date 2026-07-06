import { useState } from "react";
import { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
}

const STATUS_STYLES: Record<Task["status"], string> = {
  "To Do": "bg-accent-todo/10 text-accent-todo border-accent-todo/30",
  "In Progress":
    "bg-accent-progress/10 text-accent-progress border-accent-progress/30",
  Done: "bg-accent-done/10 text-accent-done border-accent-done/30",
};

const NEXT_LABEL: Record<Task["status"], string> = {
  "To Do": "Start progress",
  "In Progress": "Mark done",
  Done: "Completed",
};

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  isUpdating,
}: Props) {
  const isDone = task.status === "Done";
  const [showWarning, setShowWarning] = useState(false);

  const handleRestrictedAction = () => {
    setShowWarning(true);

    setTimeout(() => {
      setShowWarning(false);
    }, 3000);
  };

  const handleEdit = () => {
    if (isDone) {
      handleRestrictedAction();
      return;
    }

    onEdit(task);
  };

  const handleDelete = () => {
    if (isDone) {
      handleRestrictedAction();
      return;
    }

    onDelete(task._id);
  };

  return (
    <li className="group flex items-start justify-between gap-4 rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ${STATUS_STYLES[task.status]}`}
          >
            {task.status}
          </span>
        </div>

        <h3 className="mt-2 truncate font-display text-lg font-semibold text-ink">
          {task.title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-ink/60">
          {task.description}
        </p>

        {showWarning && (
          <div
            role="alert"
            className="mt-3 flex items-center gap-2 text-xs font-medium text-red-600"
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs"
              aria-hidden="true"
            >
              ⚠
            </span>

            <span>Completed tasks cannot be modified.</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            aria-label={isDone ? "Completed task cannot be edited" : "Edit task"}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border px-0.5 transition ${
              isDone
                ? "cursor-not-allowed border-ink/10 bg-ink/5 text-ink/30"
                : "border-ink/10 bg-white text-ink hover:border-ink hover:bg-ink/5"
            }`}
          >
            ✏️
          </button>

          <button
            onClick={handleDelete}
            aria-label={
              isDone ? "Completed task cannot be deleted" : "Delete task"
            }
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border px-0.5 transition ${
              isDone
                ? "cursor-not-allowed border-rose-100 bg-rose-50 text-rose-300"
                : "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            🗑️
          </button>
        </div>

        <button
          onClick={() => onToggle(task._id)}
          disabled={isDone || isUpdating}
          className={`shrink-0 rounded-lg px-4 py-2 font-body text-sm font-medium transition-colors ${
            isDone
              ? "cursor-not-allowed bg-ink/5 text-ink/30"
              : "bg-ink text-white hover:bg-ink/80 active:bg-ink/90"
          }`}
        >
          {isUpdating ? "Updating…" : NEXT_LABEL[task.status]}
        </button>
      </div>
    </li>
  );
}