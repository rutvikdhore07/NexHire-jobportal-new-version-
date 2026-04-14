import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, Users, Plus, Eye, Trash2, Edit, ChevronRight, RefreshCw } from "lucide-react";
import { jobsApi, appsApi, userApi } from "../../services/api";
import { StatCard, EmptyState, Pagination, Skeleton } from "../../components/common/Spinner";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const STATUS_OPTS = ["UNDER_REVIEW","SHORTLISTED","INTERVIEW_SCHEDULED","OFFERED","REJECTED"];
const STATUS_STYLE = {
  APPLIED:             "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  UNDER_REVIEW:        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  SHORTLISTED:         "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  OFFERED:             "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  REJECTED:            "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  WITHDRAWN:           "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

export default function RecruiterDashboard() {
  const { user }             = useAuth();
  const [jobs,    setJobs]   = useState([]);
  const [stats,   setStats]  = useState({ activeJobs: 0, totalApplicationsReceived: 0 });
  const [page,    setPage]   = useState(0);
  const [meta,    setMeta]   = useState({ totalPages: 0 });
  const [loading, setLoading]= useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [apps,     setApps]  = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);

  const loadAll = async (p = page) => {
    setLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.allSettled([
        jobsApi.myPostings({ page: p, size: 8 }),
        userApi.recruiterStats(),
      ]);
      if (jobsRes.status === "fulfilled") {
        const d = jobsRes.value.data.data;
        setJobs(d.content || []);
        setMeta({ totalPages: d.totalPages || 0 });
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data.data || { activeJobs: 0, totalApplicationsReceived: 0 });
      }
    } catch (e) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [page]);

  const loadApplicants = async (job) => {
    setSelectedJob(job);
    setAppsLoading(true);
    setApps([]);
    try {
      const res = await appsApi.byJob(job.id, { page: 0, size: 50 });
      setApps(res.data.data?.content || []);
    } catch (e) {
      toast.error("Could not load applicants");
    } finally {
      setAppsLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await appsApi.updateStatus(appId, status);
      setApps(apps.map(a => a.id === appId ? { ...a, status } : a));
      toast.success("Status updated");
    } catch {}
  };

  const deleteJob = async (id) => {
    if (!confirm("Delete this job? All applications will also be removed.")) return;
    try {
      await jobsApi.delete(id);
      toast.success("Job deleted");
      if (selectedJob?.id === id) setSelectedJob(null);
      loadAll();
    } catch {}
  };

  const stagger = { show: { transition: { staggerChildren: 0.07 } } };
  const fade    = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text)]">Recruiter Dashboard</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Welcome back, {user?.name?.split(" ")[0]} 👋</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => loadAll()} className="btn-secondary text-sm"><RefreshCw size={14}/></button>
          <Link to="/post-job" className="btn-primary text-sm"><Plus size={15}/> Post a Job</Link>
        </div>
      </div>

      {/* Stats */}
      <motion.div initial="hidden" animate="show" variants={stagger} className="grid sm:grid-cols-2 gap-4 mb-8">
        {loading
          ? Array(2).fill(0).map((_,i) => <Skeleton key={i} className="h-24 rounded-2xl"/>)
          : <>
              <motion.div variants={fade}><StatCard label="Active Job Postings"    value={stats?.activeJobs ?? 0} icon={Briefcase} color="brand"/></motion.div>
              <motion.div variants={fade}><StatCard label="Total Applications Received" value={stats?.totalApplicationsReceived ?? 0} icon={Users} color="green"/></motion.div>
            </>
        }
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Job postings list */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-bold text-[var(--text)]">Your Job Postings</h2>
            <span className="text-xs text-[var(--text-muted)] badge-gray">{jobs.length} jobs</span>
          </div>

          {loading
            ? <div className="p-5 space-y-3">{Array(3).fill(0).map((_,i) => <Skeleton key={i} className="h-20 rounded-xl"/>)}</div>
            : jobs.length === 0
              ? <EmptyState icon={Briefcase} title="No job postings yet"
                  message="Post your first job and start receiving applications."
                  action={<Link to="/post-job" className="btn-primary text-sm"><Plus size={14}/>Post Job</Link>}/>
              : <ul className="divide-y divide-[var(--border)]">
                  {jobs.map(job => (
                    <li key={job.id}
                      onClick={() => loadApplicants(job)}
                      className={`p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors
                        ${selectedJob?.id === job.id
                          ? "bg-brand-50 dark:bg-brand-900/20"
                          : "hover:bg-[var(--surface-2)]"}`}>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[var(--text)] text-sm truncate">{job.title}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {job.applicationCount ?? 0} applicants · {job.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                        <Link to={`/jobs/${job.id}`}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">
                          <Eye size={14}/>
                        </Link>
                        <Link to={`/edit-job/${job.id}`}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors">
                          <Edit size={14}/>
                        </Link>
                        <button onClick={() => deleteJob(job.id)}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-red-100 hover:text-red-500 transition-colors">
                          <Trash2 size={14}/>
                        </button>
                        <ChevronRight size={14} className={`text-[var(--text-muted)] transition-transform ${selectedJob?.id === job.id ? "rotate-90" : ""}`}/>
                      </div>
                    </li>
                  ))}
                </ul>
          }
          {!loading && meta.totalPages > 1 && (
            <div className="p-3 border-t border-[var(--border)]">
              <Pagination page={page} totalPages={meta.totalPages} onChange={setPage}/>
            </div>
          )}
        </div>

        {/* Applicants panel */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <h2 className="font-bold text-[var(--text)] truncate">
              {selectedJob ? `Applicants — ${selectedJob.title}` : "Select a job to view applicants"}
            </h2>
            {selectedJob && <p className="text-xs text-[var(--text-muted)] mt-0.5">{apps.length} applicants</p>}
          </div>

          {!selectedJob
            ? <EmptyState icon={Users} title="No job selected" message="Click on any job listing to see its applicants."/>
            : appsLoading
              ? <div className="p-5 space-y-3">{Array(4).fill(0).map((_,i) => <Skeleton key={i} className="h-16 rounded-xl"/>)}</div>
              : apps.length === 0
                ? <EmptyState icon={Users} title="No applicants yet" message="Applications will appear here once candidates apply."/>
                : <ul className="divide-y divide-[var(--border)] max-h-[480px] overflow-y-auto">
                    {apps.map(app => (
                      <li key={app.id} className="p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                              {app.userName?.[0]?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[var(--text)] text-sm truncate">{app.userName}</p>
                              <p className="text-xs text-[var(--text-muted)] truncate">{app.userEmail}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[app.status] || STATUS_STYLE.APPLIED}`}>
                            {app.status?.replace(/_/g, " ")}
                          </span>
                        </div>
                        {app.coverLetter && (
                          <p className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] rounded-lg p-2 mb-2 line-clamp-2">
                            {app.coverLetter}
                          </p>
                        )}
                        <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                          className="input py-1.5 text-xs w-full">
                          <option value={app.status} disabled>Change status…</option>
                          {STATUS_OPTS.map(s => (
                            <option key={s} value={s}>{s.replace(/_/g," ")}</option>
                          ))}
                        </select>
                        <p className="text-xs text-[var(--text-subtle)] mt-1.5">
                          Applied {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
          }
        </div>
      </div>
    </div>
  );
}
