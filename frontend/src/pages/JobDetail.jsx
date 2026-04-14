import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, DollarSign, Briefcase, Clock, Users, Globe, Bookmark, BookmarkCheck,
  Building, Calendar, ChevronLeft, CheckCircle, AlertCircle
} from "lucide-react";
import { jobsApi, appsApi, userApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner, { Skeleton, StatusBadge } from "../components/common/Spinner";
import toast from "react-hot-toast";

export default function JobDetail() {
  const { id }               = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate             = useNavigate();
  const [job,     setJob]    = useState(null);
  const [loading, setLoading]= useState(true);
  const [applying,setApplying]= useState(false);
  const [saved,   setSaved]  = useState(false);
  const [modal,   setModal]  = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    jobsApi.getById(id).then(r => {
      setJob(r.data.data);
      setSaved(r.data.data.isSaved ?? false);
    }).catch(() => navigate("/jobs")).finally(() => setLoading(false));
  }, [id, navigate]);

  const handleApply = async () => {
    if (!isAuthenticated) { toast.error("Sign in to apply"); navigate("/login"); return; }
    if (user?.role === "RECRUITER") { toast.error("Recruiters cannot apply to jobs"); return; }
    setModal(true);
  };

  const submitApply = async () => {
    setApplying(true);
    try {
      await appsApi.apply({ jobId: job.id, coverLetter, resumeUrl: user?.resumeUrl || "" });
      toast.success("Application submitted successfully!");
      setModal(false);
      setJob(j => ({ ...j, hasApplied: true, applicationCount: (j.applicationCount || 0) + 1 }));
    } catch { /* interceptor handles */ }
    finally { setApplying(false); }
  };

  const toggleSave = async () => {
    if (!isAuthenticated) { toast.error("Sign in to save jobs"); return; }
    try {
      const res = await userApi.toggleSave(job.id);
      setSaved(res.data.data);
      toast.success(res.data.data ? "Saved" : "Removed from saved");
    } catch {}
  };

  if (loading) return (
    <div className="page-container max-w-4xl">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="card p-8 space-y-5">
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <div className="flex gap-3"><Skeleton className="h-8 w-24 rounded-full" /><Skeleton className="h-8 w-20 rounded-full" /></div>
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );

  if (!job) return null;

  const salary = job.salaryMin && job.salaryMax
    ? `₹${(job.salaryMin/100000).toFixed(0)}–${(job.salaryMax/100000).toFixed(0)} LPA`
    : "Not disclosed";

  return (
    <div className="page-container max-w-4xl">
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors">
        <ChevronLeft size={16} />Back to jobs
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-8">
            {/* Title */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-[var(--text)] mb-1">{job.title}</h1>
                <p className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Building size={14} />{job.company}
                </p>
              </div>
              <button onClick={toggleSave}
                className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                  saved ? "bg-brand-50 border-brand-300 text-brand-600" : "border-[var(--border)] text-[var(--text-muted)] hover:border-brand-300 hover:text-brand-500"
                }`}>
                {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {job.jobType && <span className="badge-blue">{job.jobType.replace("_"," ")}</span>}
              {job.workMode && <span className="badge-green">{job.workMode.replace("_"," ")}</span>}
              {job.experienceLevel && <span className="badge-purple">{job.experienceLevel}</span>}
              {job.industry && <span className="badge-gray">{job.industry}</span>}
            </div>

            {/* Meta grid */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8 p-5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
              {[
                { icon: MapPin,     label: "Location",    value: job.location },
                { icon: DollarSign, label: "Salary",      value: salary },
                { icon: Users,      label: "Applicants",  value: `${job.applicationCount ?? 0} applied` },
                { icon: Briefcase,  label: "Openings",    value: `${job.openings ?? 1} position${(job.openings ?? 1) > 1 ? "s" : ""}` },
                { icon: Clock,      label: "Posted",       value: job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "" },
                ...(job.applicationDeadline ? [{ icon: Calendar, label: "Deadline", value: new Date(job.applicationDeadline).toLocaleDateString("en-IN", { day:"numeric", month:"long" }) }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={15} className="text-[var(--text-muted)] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-[var(--text-muted)]">{label}</p>
                    <p className="text-sm font-medium text-[var(--text)]">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-bold text-[var(--text)] mb-3">About this role</h2>
              <div className="prose prose-sm max-w-none text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Skills */}
            {job.skillsRequired && (
              <div className="mt-6">
                <h2 className="font-bold text-[var(--text)] mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.split(",").map(s => s.trim()).filter(Boolean).map(skill => (
                    <span key={skill} className="badge-gray">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="card p-6">
            {job.hasApplied ? (
              <div className="text-center py-2">
                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-2" />
                <p className="font-semibold text-[var(--text)]">Application Submitted</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Track it in your dashboard</p>
                <Link to="/dashboard" className="btn-secondary w-full justify-center mt-4 text-sm">View Dashboard</Link>
              </div>
            ) : !job.isActive ? (
              <div className="text-center py-2">
                <AlertCircle size={28} className="text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-[var(--text)]">This listing is closed</p>
              </div>
            ) : (
              <>
                <button onClick={handleApply} className="btn-primary w-full justify-center py-3 mb-3">
                  Apply Now
                </button>
                <button onClick={toggleSave} className="btn-secondary w-full justify-center py-2.5 text-sm">
                  {saved ? <><BookmarkCheck size={15}/>Saved</> : <><Bookmark size={15}/>Save Job</>}
                </button>
              </>
            )}
          </div>

          {/* Recruiter info */}
          {job.postedBy && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Posted by</h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 font-bold text-sm flex-shrink-0">
                  {job.postedBy.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text)]">{job.postedBy.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">Recruiter</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="card p-8 w-full max-w-lg animate-slide-up">
            <h2 className="text-xl font-bold text-[var(--text)] mb-1">Apply for {job.title}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">{job.company}</p>

            <label className="label">Cover Letter <span className="font-normal text-[var(--text-muted)]">(optional)</span></label>
            <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={5}
              className="input resize-none mb-6" placeholder="Why are you a great fit for this role?" />

            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={submitApply} disabled={applying} className="btn-primary">
                {applying ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Submitting…</span> : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
