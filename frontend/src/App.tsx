import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Task, ActivityLog, TaskStatus } from "./types";
import { fetchTasks, fetchLogs, toggleTask, createTask, updateTask, deleteTask } from "./api";
import TaskList from "./components/TaskList";
import ActivityFeed from "./components/ActivityFeed";

const filterOptions: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "To Do" },
  { label: "In Progress", value: "In Progress" },
  { label: "Done", value: "Done" },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<TaskStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const itemsPerPage = 5;

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

    // keep retrying until we successfully fetch data or the component unmounts
    while (!abortRef.current) {
      try {
        const [tasksData, logsData] = await Promise.all([fetchTasks(), fetchLogs()]);
        if (abortRef.current) return;
        setTasks(tasksData);
        setLogs(logsData);
        setError(null);
        break; // success
      } catch (err) {
        // show a transient message but keep retrying
        setError("Could not reach the backend. Retrying...");
        // wait a bit before retrying
        // eslint-disable-next-line no-await-in-loop
        await wait(1000);
      }
    }

    if (!abortRef.current) setLoading(false);
  }, []);

  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;
    loadData();
    return () => {
      abortRef.current = true;
    };
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchQuery]);

  const filteredTasks = useMemo(() => { 
    const normalizedQuery = searchQuery.trim().toLowerCase(); 
    const byStatus = selectedFilter === "all" ? tasks : tasks.filter((task) => task.status === selectedFilter); 
    if (!normalizedQuery) { 
      return byStatus; 
    } 
    return byStatus.filter((task) => { 
      const haystack = `${task.title} ${task.description} ${task.status}`.toLowerCase(); return haystack.includes(normalizedQuery); 
    }); 
  }, [searchQuery, selectedFilter, tasks]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = (filteredTasks ? filteredTasks : tasks).slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const refreshLogs = async () => {
    try {
      const freshLogs = await fetchLogs();
      setLogs(freshLogs);
    } catch (err) {
      console.warn(err);
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setTitle("");
    setDescription("");
  };

  const submitTask = async () => {
    if (!title.trim() || !description.trim()) {
      setError("Please provide both a title and description.");
      return;
    }

    setSaving(true);
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, { title: title.trim(), description: description.trim() });
        setTasks((prev) => prev.map((task) => (task._id === updated._id ? updated : task)));
      } else {
        const created = await createTask({ title: title.trim(), description: description.trim() });
        setTasks((prev) => [...prev, created]);
      }
      setError(null);
      closeModal();
      await refreshLogs();
    } catch (err) {
      setError("Failed to save task. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setUpdatingId(id);
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      setError(null);
      await refreshLogs();
    } catch (err) {
      setError("Failed to delete task.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggle = async (id: string) => {
    setUpdatingId(id);
    try {
      const { task } = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t._id === id ? task : t)));
      await refreshLogs();
      setError(null);
    } catch (err) {
      setError("Failed to update task status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8 lg:px-12">
      <header className="mx-auto mb-8 max-w-6xl">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
          Task Event Logger
        </p>
        <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              Every status change, logged automatically.
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Filter tasks by status and manage them from the task list.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            + Add task
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-auto mb-6 max-w-6xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="flex-1 text-sm text-ink/70">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, description, or status"
                className="w-full rounded-full border border-ink/10 bg-ink/5 px-4 py-2.5 text-sm outline-none transition focus:border-ink/20 focus:bg-white"
              />
            </label>
            <div className="text-sm text-ink/60 sm:text-right">
              <p className="font-medium text-ink">{filteredTasks.length} result{filteredTasks.length === 1 ? "" : "s"}</p>
              <p>Showing page {currentPage} of {totalPages}</p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedFilter(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedFilter === option.value
                  ? "bg-ink text-white"
                  : "border border-ink/10 bg-white text-ink hover:border-ink/20"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <h2 className="mb-3 font-display text-base font-semibold text-ink">Tasks</h2>
          <TaskList
            tasks={paginatedTasks}
            onToggle={handleToggle}
            onEdit={openEditModal}
            onDelete={handleDelete}
            updatingId={updatingId}
            loading={loading}
          />

          {filteredTasks.length > itemsPerPage && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white p-3 shadow-sm">
              <p className="text-sm text-ink/60">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTasks.length)} of {filteredTasks.length}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-full border border-ink/10 px-3 py-1.5 text-sm text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-full text-sm font-medium transition ${currentPage === page
                      ? "bg-ink text-white"
                      : "border border-ink/10 text-ink hover:bg-ink/5"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-full border border-ink/10 px-3 py-1.5 text-sm text-ink transition hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="lg:sticky lg:top-10 lg:h-[calc(100vh-8rem)]">
          <ActivityFeed logs={logs} loading={loading} />
        </section>
      </main>

      {isModalOpen && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8">
          <div onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  {editingTask ? "Edit task" : "Add new task"}
                </h2>
                <p className="mt-1 text-sm text-ink/60">
                  {editingTask
                    ? "Update the title or description using the shared modal."
                    : "Create a new task and it will appear in the list."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-ink/10 px-3 py-2 text-sm text-ink transition hover:bg-ink/5"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-ink">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-2xl border border-ink/10 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-ink/70 focus:bg-white"
                  placeholder="Task title"
                />
              </label>

              <label className="grid gap-2 text-sm font-medium text-ink">
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  className="w-full rounded-2xl border border-ink/10 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition focus:border-ink/70 focus:bg-white"
                  placeholder="Task details"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-ink/10 px-4 py-3 text-sm font-medium text-ink transition hover:bg-ink/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitTask}
                disabled={saving}
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/60"
              >
                {saving ? "Saving…" : editingTask ? "Update task" : "Create task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
