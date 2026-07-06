import { ActivityLog } from "../types";

interface Props {
  logs: ActivityLog[];
  loading: boolean;
}

function timeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function ActivityFeed({ logs, loading }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-ink/10 bg-white shadow-sm">
      <div className="border-b border-ink/10 px-5 py-4">
        <h2 className="font-display text-base font-semibold text-ink">Live Activity Feed</h2>
        <p className="mt-0.5 text-xs text-ink/45">Newest changes appear at the top</p>
      </div>

      <div className="feed-scroll flex-1 overflow-y-auto px-5 py-4">
        {loading ? (
          <p className="text-sm text-ink/50">Loading activity…</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-ink/50">No activity yet. Toggle a task to generate a log.</p>
        ) : (
          <ol className="flex flex-col gap-3">
            {logs.map((log, index) => (
              <li key={log._id} className="relative pl-4">
                <span
                  className={`absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full ${
                    index === 0 ? "bg-accent-progress" : "bg-ink/20"
                  }`}
                />
                <p className="font-mono text-[13px] leading-snug text-ink/80">{log.activity}</p>
                <p className="mt-0.5 text-[11px] text-ink/40">{timeAgo(log.timestamp)}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
