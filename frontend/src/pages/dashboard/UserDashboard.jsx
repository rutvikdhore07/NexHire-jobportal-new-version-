import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Gift, XCircle, Briefcase, Bookmark, Plus, RefreshCw, Target } from "lucide-react";
import { appsApi, userApi, jobsApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { StatCard, EmptyState, Pagination, Skeleton } from "../../components/common/Spinner";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";

const STATUS_STYLE = {
  APPLIED:             "badge-blue",
  UNDER_REVIEW:        "badge-yellow",
  SHORTLISTED:         "badge-green",
  INTERVIEW_SCHEDULED: "badge-purple",
  OFFERED:             "badge-green",
  REJECTED:            "badge-red",
  WITHDRAWN:           "badge-gray",
};

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fade    = { hidden: { opacity:0, y:16 }, show: { opacity:1, y:0 } };

export default function UserDashboard() {
  const { user }            = useAuth();
  const [apps,  setApps]    = useState([]);
  const [stats, setStats]   = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [page,  setPage]    = useState(0);
  const [meta,  setMeta]    = useState({ totalPages: 0 });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes, recRes] = await Promise.allSettled([
        appsApi.mine({ page, size: 8 }),
        userApi.stats(),
        jobsApi.search({ page: 0, size: 4 }),
      ]);
      if (appsRes.status === "fulfilled") {
        const d = appsRes.value.data.data;
        setApps(d.content || []);
        setMeta({ totalPages: d.totalPages || 0 });
      }
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data.data);
      }
      if (recRes.status === "fulfilled") {
        setRecommended(recRes.value.data.data?.content?.slice(0, 4) || []);
      }
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, [page]);

  const handleWithdraw = async (id) => {
    if (!confirm("Withdraw this application?")) return;
    try {
      await appsApi.withdraw(id);
      toast.success("Application withdrawn");
      setApps(apps.map(a => a.id === id ? { ...a, status: "WITHDRAWN" } : a));
    } catch {}
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text)]">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Here's your job search overview</p>
        </div>
        <button onClick={loadAll} className="btn-secondary text-sm"><RefreshCw size={14}/></button>
      </div>

      {/* Stats */}
      {loading
        ? <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-24 rounded-2xl"/>)}</div>
        : (
          <motion.div initial="hidden" animate="show" variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div variants={fade}><StatCard label="Applications"  value={stats?.totalApplications ?? 0} icon={FileText}    color="brand"/></motion.div>
            <motion.div variants={fade}><StatCard label="Shortlisted"   value={stats?.shortlisted      ?? 0} icon={CheckCircle} color="green"/></motion.div>
            <motion.div variants={fade}><StatCard label="Offers"        value={stats?.offered          ?? 0} icon={Gift}        color="purple"/></motion.div>
            <motion.div variants={fade}><StatCard label="Not Selected"  value={stats?.rejected         ?? 0} icon={XCircle}     color="red"/></motion.div>
          </motion.div>
        )
      }

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/jobs"     className="btn-primary  text-sm"><Plus size={14}/> Browse Jobs</Link>
        <Link to="/ai-resume" className="btn-secondary text-sm"><Target size={14}/> Analyze Resume</Link>
        <Link to="/profile"  className="btn-secondary text-sm"><FileText size={14}/> Edit Profile</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications - 2/3 width */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-bold text-[var(--text)]">My Applications</h2>
            <Link to="/jobs" className="text-xs text-brand-600 hover:underline font-medium">Browse more →</Link>
          </div>

          {loading
            ? <div className="p-5 space-y-3">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-16 rounded-xl"/>)}</div>
            : apps.length === 0
              ? <EmptyState icon={Briefcase} title="No applications yet"
                  message="Start applying to jobs to track them here."
                  action={<Link to="/jobs" className="btn-primary text-sm">Browse Jobs</Link>}/>
              : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)] uppercase tracking-wider">
                          <th className="text-left py-3 px-5 font-semibold">Position</th>
                          <th className="text-left py-3 px-4 font-semibold">Company</th>
                          <th className="text-left py-3 px-4 font-semibold">Date</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4"/>
                        </tr>
                      </thead>
                      <tbody>
                        {apps.map(app => (
                          <tr key={app.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors">
                            <td className="py-3.5 px-5">
                              <Link to={`/jobs/${app.jobId}`} className="font-semibold text-[var(--text)] hover:text-brand-600 transition-colors">
                                {app.jobTitle}
                              </Link>
                            </td>
                            <td className="py-3.5 px-4 text-[var(--text-muted)] text-xs">{app.company}</td>
                            <td className="py-3.5 px-4 text-[var(--text-muted)] text-xs">
                              {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : ""}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={STATUS_STYLE[app.status] || "badge-gray"}>{app.status?.replace(/_/g," ")}</span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {app.status === "APPLIED" && (
                                <button onClick={() => handleWithdraw(app.id)}
                                  className="text-xs text-[var(--text-muted)] hover:text-red-500 font-medium transition-colors">
                                  Withdraw
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden divide-y divide-[var(--border)]">
                    {apps.map(app => (
                      <div key={app.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <Link to={`/jobs/${app.jobId}`} className="font-semibold text-[var(--text)] text-sm hover:text-brand-600">{app.jobTitle}</Link>
                            <p className="text-xs text-[var(--text-muted)]">{app.company}</p>
                          </div>
                          <span className={`${STATUS_STYLE[app.status] || "badge-gray"} mt-0.5`}>{app.status?.replace(/_/g," ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {meta.totalPages > 1 && (
                    <div className="p-3 border-t border-[var(--border)]">
                      <Pagination page={page} totalPages={meta.totalPages} onChange={setPage}/>
                    </div>
                  )}
                </>
              )
          }
        </div>

        {/* Recommended jobs sidebar */}
        <div className="card overflow-hidden h-fit">
          <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="font-bold text-[var(--text)] text-sm">Recommended for You</h2>
            <Target size={14} className="text-[var(--text-muted)]"/>
          </div>
          {loading
            ? <div className="p-4 space-y-3">{Array(4).fill(0).map((_,i)=><Skeleton key={i} className="h-14 rounded-xl"/>)}</div>
            : recommended.length === 0
              ? <div className="p-5 text-center text-xs text-[var(--text-muted)]">
                  <p>Complete your profile to get personalized recommendations.</p>
                  <Link to="/profile" className="text-brand-600 font-semibold mt-2 inline-block">Update Profile →</Link>
                </div>
              : <div className="divide-y divide-[var(--border)]">
                  {recommended.map(job => (
                    <Link key={job.id} to={`/jobs/${job.id}`}
                      className="block p-4 hover:bg-[var(--surface-2)] transition-colors">
                      <p className="font-semibold text-[var(--text)] text-sm line-clamp-1">{job.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{job.company} · {job.location}</p>
                      <div className="flex gap-1.5 mt-2">
                        {job.workMode && <span className="badge-green text-xs">{job.workMode.replace("_"," ")}</span>}
                        {job.jobType  && <span className="badge-blue  text-xs">{job.jobType.replace("_"," ")}</span>}
                      </div>
                    </Link>
                  ))}
                  <div className="p-3">
                    <Link to="/jobs" className="text-xs text-brand-600 font-semibold hover:underline">View all jobs →</Link>
                  </div>
                </div>
          }
        </div>
      </div>
    </div>
  );
}
