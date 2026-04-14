import { Inbox } from "lucide-react";

// ─── Spinner ──────────────────────────────────────────────────────────────────
export default function Spinner({ size = "md", className = "" }) {
  const s = { sm: "h-4 w-4 border-2", md: "h-8 w-8 border-2", lg: "h-12 w-12 border-[3px]" }[size];
  return (
    <div className={`animate-spin rounded-full border-brand-500 border-t-transparent ${s} ${className}`} />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700 ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text)] mb-1">{title}</h3>
      {message && <p className="text-sm text-[var(--text-muted)] max-w-sm mb-6">{message}</p>}
      {action}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  APPLIED:              "badge-blue",
  UNDER_REVIEW:         "badge-yellow",
  SHORTLISTED:          "badge-green",
  INTERVIEW_SCHEDULED:  "badge-purple",
  OFFERED:              "badge-green",
  REJECTED:             "badge-red",
  WITHDRAWN:            "badge-gray",
};

const STATUS_LABELS = {
  APPLIED:              "Applied",
  UNDER_REVIEW:         "Under Review",
  SHORTLISTED:          "Shortlisted",
  INTERVIEW_SCHEDULED:  "Interview",
  OFFERED:              "Offered 🎉",
  REJECTED:             "Not Selected",
  WITHDRAWN:            "Withdrawn",
};

export function StatusBadge({ status }) {
  return (
    <span className={STATUS_STYLES[status] || "badge-gray"}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ─── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = "brand" }) {
  const colors = {
    brand:   "bg-brand-50   text-brand-600   dark:bg-brand-900/30   dark:text-brand-400",
    green:   "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    purple:  "bg-purple-50  text-purple-600  dark:bg-purple-900/30  dark:text-purple-400",
    amber:   "bg-amber-50   text-amber-600   dark:bg-amber-900/30   dark:text-amber-400",
    red:     "bg-red-50     text-red-600     dark:bg-red-900/30     dark:text-red-400",
  };
  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-[var(--text-muted)]">{label}</p>
        <p className="text-2xl font-bold text-[var(--text)] mt-0.5">{value ?? "—"}</p>
      </div>
    </div>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button onClick={() => onChange(page - 1)} disabled={page === 0}
        className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">← Prev</button>
      <span className="text-sm text-[var(--text-muted)]">
        Page {page + 1} of {totalPages}
      </span>
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}
        className="btn-secondary py-1.5 px-3 text-xs disabled:opacity-40">Next →</button>
    </div>
  );
}
