import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, MapPin, Clock, DollarSign, Users, Briefcase } from "lucide-react";
import { useState } from "react";
import { userApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const JOB_TYPE_COLORS = {
  FULL_TIME:  "badge-blue",
  PART_TIME:  "badge-yellow",
  CONTRACT:   "badge-purple",
  INTERNSHIP: "badge-green",
};

const WORK_MODE_COLORS = {
  REMOTE:  "badge-green",
  HYBRID:  "badge-yellow",
  ON_SITE: "badge-blue",
};

export default function JobCard({ job, onSaveToggle }) {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved]   = useState(job.isSaved ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Sign in to save jobs"); return; }
    setSaving(true);
    try {
      const res = await userApi.toggleSave(job.id);
      setSaved(res.data.data);
      toast.success(res.data.data ? "Job saved" : "Job removed");
      onSaveToggle?.();
    } catch { /* handled by interceptor */ }
    finally { setSaving(false); }
  };

  const salary = job.salaryMin && job.salaryMax
    ? `₹${(job.salaryMin / 100000).toFixed(0)}–${(job.salaryMax / 100000).toFixed(0)} LPA`
    : job.salaryMin ? `₹${(job.salaryMin / 100000).toFixed(0)}+ LPA` : null;

  return (
    <Link to={`/jobs/${job.id}`} className="card p-6 flex flex-col gap-4 group hover:-translate-y-1 transition-transform duration-200 block">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center flex-shrink-0">
              <Briefcase size={15} className="text-brand-600 dark:text-brand-400" />
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)] truncate">{job.company}</p>
          </div>
          <h3 className="font-semibold text-[var(--text)] text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">
            {job.title}
          </h3>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`p-2 rounded-xl flex-shrink-0 transition-all duration-200 ${
            saved
              ? "bg-brand-100 text-brand-600 dark:bg-brand-900/40"
              : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-500"
          }`}
          aria-label={saved ? "Remove saved job" : "Save job"}
        >
          {saved ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
        </button>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-y-1.5 gap-x-3 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
        {salary && <span className="flex items-center gap-1"><DollarSign size={12} />{salary}</span>}
        {job.applicationCount !== undefined && (
          <span className="flex items-center gap-1"><Users size={12} />{job.applicationCount} applicants</span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {job.jobType && (
          <span className={JOB_TYPE_COLORS[job.jobType] || "badge-gray"}>
            {job.jobType.replace("_", " ")}
          </span>
        )}
        {job.workMode && (
          <span className={WORK_MODE_COLORS[job.workMode] || "badge-gray"}>
            {job.workMode.replace("_", " ")}
          </span>
        )}
        {job.experienceLevel && (
          <span className="badge-gray">{job.experienceLevel.replace("_", " ")}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 mt-auto border-t border-[var(--border)]">
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <Clock size={11} />
          {job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""}
        </span>
        {job.hasApplied
          ? <span className="badge-green text-xs">Applied ✓</span>
          : <span className="text-xs text-brand-600 font-semibold group-hover:underline">View details →</span>
        }
      </div>
    </Link>
  );
}
