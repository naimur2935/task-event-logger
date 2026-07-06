import { Task } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  updatingId: string | null;
  loading: boolean;
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete, updatingId, loading }: Props) {
  if (loading) {
    return <p className="text-sm text-ink/50">Loading tasks…</p>;
  }

  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-ink/15 p-8 text-center text-sm text-ink/50">
        No tasks match the selected filter.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          isUpdating={updatingId === task._id}
        />
      ))}
    </ul>
  );
}
